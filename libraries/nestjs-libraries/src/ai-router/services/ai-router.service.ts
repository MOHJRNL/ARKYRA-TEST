import { Injectable, Logger } from '@nestjs/common';
import { AIRouterDecisionService } from './ai-router-decision.service';
import { AIRouterFallbackService } from './ai-router-fallback.service';
import { UsageTrackingService } from './usage-tracking.service';
import { QuotaManagementService } from './quota-management.service';
import { AIRequestDto, ImageGenerationRequestDto } from '../dto/ai-request.dto';
import { AIResponseDto, ImageGenerationResponseDto } from '../dto/ai-response.dto';
import { AIProviderRequest, AIProviderResponse } from '../interfaces/ai-provider.interface';
import { RoutingContext } from '../interfaces/ai-router.interface';
import { OpenAIProviderAdapter } from '../providers/openai-provider.adapter';
import { AccuracyLevel } from '../enums/accuracy-level.enum';
import { AITaskType } from '../enums/task-type.enum';

/**
 * AI Router Service
 * Main orchestration service for the Hybrid AI Router system
 *
 * This service:
 * 1. Routes requests to the best provider based on task type and accuracy
 * 2. Handles fallback when providers fail
 * 3. Tracks usage and enforces quotas
 * 4. Provides unified interface for all AI operations
 *
 * @example
 * ```typescript
 * const response = await aiRouter.generateCompletion({
 *   prompt: 'Write a social media post about AI',
 *   taskType: AITaskType.POST_GENERATION,
 *   accuracyLevel: AccuracyLevel.HIGH,
 *   organizationId: 'org-123',
 * });
 * ```
 */
@Injectable()
export class AIRouterService {
  private readonly logger = new Logger(AIRouterService.name);

  constructor(
    private readonly decisionService: AIRouterDecisionService,
    private readonly fallbackService: AIRouterFallbackService,
    private readonly usageService: UsageTrackingService,
    private readonly quotaService: QuotaManagementService,
    private readonly openaiProvider: OpenAIProviderAdapter,
  ) {
    this.logger.log('AI Router Service initialized');
  }

  /**
   * Generate text completion with automatic provider selection
   */
  async generateCompletion(request: AIRequestDto): Promise<AIResponseDto> {
    const startTime = Date.now();

    try {
      this.logger.debug(
        `Generating completion: ${request.taskType} at ${request.accuracyLevel}`,
      );

      // Build routing context
      const context: RoutingContext = {
        taskType: request.taskType,
        accuracyLevel: request.accuracyLevel || AccuracyLevel.STANDARD,
        organizationId: request.organizationId,
        userId: request.userId,
        isUrgent: request.isUrgent,
        maxLatencyMs: request.maxLatencyMs,
        preferLowCost: request.preferLowCost,
        preferredProvider: request.preferredProvider,
      };

      // Estimate tokens for quota check
      const estimatedTokens = this.estimateTokens(request.prompt, request.maxTokens);

      // Make routing decision
      const decision = await this.decisionService.makeDecision(
        context,
        estimatedTokens,
      );

      // Check if quota is available
      if (!decision.quotaAvailable) {
        return this.buildErrorResponse(
          request,
          new Error(decision.reason),
          Date.now() - startTime,
        );
      }

      // Build provider request
      const providerRequest: AIProviderRequest = {
        prompt: request.prompt,
        accuracyLevel: context.accuracyLevel,
        maxTokens: request.maxTokens,
        temperature: request.temperature,
        systemMessage: request.systemMessage,
        options: request.options,
        userId: request.userId,
        organizationId: request.organizationId,
      };

      // Execute with fallback
      const response = await this.fallbackService.executeWithFallback(
        providerRequest,
        decision.provider,
        decision.fallbackProvider,
      );

      // Track usage
      await this.trackUsage(request, response);

      // Update quota
      await this.quotaService.updateQuotaUsage(
        request.organizationId,
        response.provider,
        response.totalTokens,
      );

      // Build response DTO
      return this.buildSuccessResponse(request, response);
    } catch (error) {
      this.logger.error(
        `Failed to generate completion: ${(error as any).message}`,
        (error as any).stack,
      );

      const latencyMs = Date.now() - startTime;
      return this.buildErrorResponse(request, error, latencyMs);
    }
  }

  /**
   * Generate image (always uses OpenAI/DALL-E 3)
   */
  async generateImage(
    request: ImageGenerationRequestDto,
  ): Promise<ImageGenerationResponseDto> {
    const startTime = Date.now();

    try {
      this.logger.debug(`Generating image for organization: ${request.organizationId}`);

      // Check quota (images use OpenAI)
      const quotaCheck = await this.quotaService.checkQuota(
        request.organizationId,
        'OPENAI' as any,
        1000, // Approximate token equivalent for image
      );

      if (!quotaCheck.allowed) {
        throw new Error(`Image generation quota exceeded: ${quotaCheck.reason}`);
      }

      // Generate image using OpenAI provider
      const imageUrl = await this.openaiProvider.generateImage(
        request.prompt,
        {
          isUrl: request.isUrl,
          isVertical: request.isVertical,
        },
      );

      const latencyMs = Date.now() - startTime;

      // Track usage (approximate cost for DALL-E 3)
      await this.usageService.trackUsage({
        organizationId: request.organizationId,
        userId: request.userId,
        provider: 'OPENAI' as any,
        taskType: AITaskType.IMAGE_GENERATION,
        accuracyLevel: AccuracyLevel.PREMIUM,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 1000, // Equivalent
        estimatedCost: 0.04, // DALL-E 3 standard quality
        latencyMs,
        success: true,
      });

      // Update quota
      await this.quotaService.updateQuotaUsage(
        request.organizationId,
        'OPENAI' as any,
        1000,
      );

      return {
        image: imageUrl,
        provider: 'OPENAI' as any,
        format: request.isUrl ? 'url' : 'base64',
        cost: {
          estimatedCost: 0.04,
          currency: 'USD',
        },
        performance: {
          latencyMs,
          model: 'dall-e-3',
        },
        success: true,
      };
    } catch (error) {
      this.logger.error(`Failed to generate image: ${(error as any).message}`, (error as any).stack);

      return {
        image: '',
        provider: 'OPENAI' as any,
        format: 'url',
        cost: { estimatedCost: 0, currency: 'USD' },
        performance: { latencyMs: Date.now() - startTime, model: 'dall-e-3' },
        success: false,
        error: (error as any).message,
      };
    }
  }

  /**
   * Proxy to existing OpenAI service methods for backward compatibility
   */
  async generatePosts(content: string, organizationId: string): Promise<any[]> {
    // Track as POST_GENERATION task
    const startTime = Date.now();

    try {
      const posts = await this.openaiProvider.generatePosts(content);

      // Track usage
      await this.usageService.trackUsage({
        organizationId,
        provider: 'OPENAI' as any,
        taskType: AITaskType.POST_GENERATION,
        accuracyLevel: AccuracyLevel.PREMIUM,
        inputTokens: this.estimateTokens(content, 0),
        outputTokens: 2000, // Approximate
        totalTokens: this.estimateTokens(content, 0) + 2000,
        estimatedCost: 0.1,
        latencyMs: Date.now() - startTime,
        success: true,
      });

      return posts;
    } catch (error) {
      this.logger.error(`Failed to generate posts: ${(error as any).message}`);
      throw error;
    }
  }

  async extractWebsiteText(content: string, organizationId: string): Promise<any[]> {
    return this.openaiProvider.extractWebsiteText(content);
  }

  async separatePosts(
    content: string,
    length: number,
    organizationId: string,
  ): Promise<any> {
    return this.openaiProvider.separatePosts(content, length);
  }

  async generateSlidesFromText(text: string, organizationId: string): Promise<any[]> {
    return this.openaiProvider.generateSlidesFromText(text);
  }

  async generatePromptForPicture(
    prompt: string,
    organizationId: string,
  ): Promise<string> {
    return this.openaiProvider.generatePromptForPicture(prompt);
  }

  async generateVoiceFromText(prompt: string, organizationId: string): Promise<string> {
    return this.openaiProvider.generateVoiceFromText(prompt);
  }

  /**
   * Get quota status
   */
  async getQuotaStatus(organizationId: string) {
    return this.quotaService.getQuotaStatus(organizationId);
  }

  /**
   * Get usage statistics
   */
  async getUsageStatistics(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.usageService.getUsageStatistics(
      organizationId,
      startDate,
      endDate,
    );
  }

  /**
   * Helper: Track usage
   */
  private async trackUsage(
    request: AIRequestDto,
    response: AIProviderResponse,
  ): Promise<void> {
    try {
      await this.usageService.trackUsage({
        organizationId: request.organizationId,
        userId: request.userId,
        provider: response.provider,
        taskType: request.taskType,
        accuracyLevel: request.accuracyLevel || AccuracyLevel.STANDARD,
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        totalTokens: response.totalTokens,
        estimatedCost: response.estimatedCost,
        latencyMs: response.latencyMs,
        success: response.success,
        errorMessage: response.error,
        metadata: {
          isFallback: response.isFallback,
          model: response.model,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to track usage: ${(error as any).message}`);
      // Don't throw - tracking failures shouldn't break the flow
    }
  }

  /**
   * Helper: Estimate tokens
   */
  private estimateTokens(text: string, maxTokens?: number): number {
    // Simple estimation: ~4 characters per token
    const estimatedInput = Math.ceil(text.length / 4);
    const estimatedOutput = maxTokens || 500;
    return estimatedInput + estimatedOutput;
  }

  /**
   * Helper: Build success response
   */
  private buildSuccessResponse(
    request: AIRequestDto,
    response: AIProviderResponse,
  ): AIResponseDto {
    return {
      content: response.content,
      provider: response.provider,
      taskType: request.taskType,
      accuracyLevel: request.accuracyLevel || AccuracyLevel.STANDARD,
      usage: {
        inputTokens: response.inputTokens,
        outputTokens: response.outputTokens,
        totalTokens: response.totalTokens,
        estimatedCost: response.estimatedCost,
      },
      performance: {
        latencyMs: response.latencyMs,
        model: response.model,
        isFallback: response.isFallback || false,
      },
      metadata: {
        organizationId: request.organizationId,
        userId: request.userId,
        timestamp: new Date(),
      },
      success: true,
    };
  }

  /**
   * Helper: Build error response
   */
  private buildErrorResponse(
    request: AIRequestDto,
    error: unknown,
    latencyMs: number,
  ): AIResponseDto {
    return {
      content: '',
      provider: 'OPENAI' as any, // Default
      taskType: request.taskType,
      accuracyLevel: request.accuracyLevel || AccuracyLevel.STANDARD,
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        estimatedCost: 0,
      },
      performance: {
        latencyMs,
        isFallback: false,
      },
      metadata: {
        organizationId: request.organizationId,
        userId: request.userId,
        timestamp: new Date(),
      },
      success: false,
      error: {
        message: (error as any).message,
        code: 'AI_ROUTER_ERROR',
      },
    };
  }
}
