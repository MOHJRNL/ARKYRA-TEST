import { Injectable } from '@nestjs/common';
import { BaseAIProvider } from './base-ai-provider.abstract';
import { OpenaiService } from '../../openai/openai.service';
import {
  AIProviderRequest,
  AIProviderResponse,
} from '../interfaces/ai-provider.interface';
import { AIProviderType, PROVIDER_CONFIG } from '../enums/ai-provider.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';
import OpenAI from 'openai';

/**
 * OpenAI Cost per 1M tokens (approximate, as of Jan 2025)
 */
const OPENAI_PRICING = {
  'gpt-4.1': { input: 10.0, output: 30.0 }, // GPT-4 Turbo
  'gpt-4o-mini': { input: 0.15, output: 0.6 }, // GPT-4o-mini
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 }, // GPT-3.5 Turbo
  'dall-e-3': { perImage: 0.04 }, // Standard quality
} as const;

/**
 * OpenAI Provider Adapter
 * Wraps the existing OpenAI service and provides unified interface
 */
@Injectable()
export class OpenAIProviderAdapter extends BaseAIProvider {
  private readonly client: OpenAI;

  constructor(private readonly openaiService: OpenaiService) {
    super(AIProviderType.OPENAI);

    // Initialize OpenAI client
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'sk-proj-',
    });

    this.logger.log('OpenAI Provider initialized');
  }

  /**
   * Get provider type
   */
  getProviderType(): AIProviderType {
    return AIProviderType.OPENAI;
  }

  /**
   * Check if OpenAI is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      const startTime = Date.now();

      // Simple health check - list models
      await this.client.models.list();

      const latencyMs = Date.now() - startTime;
      this.metrics.isHealthy = true;
      this.metrics.lastHealthCheck = new Date();
      this.metrics.avgLatencyMs = latencyMs;

      return true;
    } catch (error) {
      this.logger.error(`OpenAI health check failed: ${(error as any).message}`);
      this.metrics.isHealthy = false;
      this.metrics.lastError = (error as any).message;
      return false;
    }
  }

  /**
   * Generate text completion
   */
  async generateCompletion(
    request: AIProviderRequest,
  ): Promise<AIProviderResponse> {
    this.validateRequest(request);

    const model = this.selectModel(request.accuracyLevel);
    const startTime = Date.now();

    try {
      // Build messages
      const messages: any[] = [];

      if (request.systemMessage) {
        messages.push({
          role: 'system',
          content: request.systemMessage,
        });
      }

      messages.push({
        role: 'user',
        content: request.prompt,
      });

      // Call OpenAI API
      const response = await this.client.chat.completions.create({
        model,
        messages,
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature ?? 0.7,
        ...request.options,
      });

      const latencyMs = Date.now() - startTime;
      const content = response.choices[0]?.message?.content || '';
      const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

      const inputTokens = usage.prompt_tokens;
      const outputTokens = usage.completion_tokens;
      const cost = this.estimateCost(inputTokens, outputTokens, request.accuracyLevel);

      this.updateMetrics(true, latencyMs);

      return this.buildSuccessResponse(
        content,
        inputTokens,
        outputTokens,
        cost,
        latencyMs,
        model,
      );
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      this.updateMetrics(false, latencyMs, (error as any).message);

      this.logger.error(
        `OpenAI completion failed: ${(error as any).message}`,
        (error as any).stack,
      );

      return this.buildErrorResponse(error, latencyMs);
    }
  }

  /**
   * Generate image using DALL-E 3
   */
  async generateImage(
    prompt: string,
    options?: { isUrl?: boolean; isVertical?: boolean },
  ): Promise<string> {
    try {
      const result = await this.openaiService.generateImage(
        prompt,
        options?.isUrl ?? true,
        options?.isVertical ?? false,
      );

      return result || '';
    } catch (error) {
      this.logger.error(`Image generation failed: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Estimate cost for request
   */
  estimateCost(
    inputTokens: number,
    outputTokens: number,
    accuracyLevel: AccuracyLevel,
  ): number {
    const model = this.selectModel(accuracyLevel);
    const pricing = OPENAI_PRICING[model];

    if (!pricing) {
      this.logger.warn(`No pricing found for model: ${model}`);
      return 0;
    }

    // Calculate cost in USD
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return inputCost + outputCost;
  }

  /**
   * Select appropriate model based on accuracy level
   */
  private selectModel(accuracyLevel: AccuracyLevel): string {
    const config = PROVIDER_CONFIG[AIProviderType.OPENAI];

    switch (accuracyLevel) {
      case AccuracyLevel.PREMIUM:
        return config.models.premium;
      case AccuracyLevel.HIGH:
        return config.models.high;
      case AccuracyLevel.STANDARD:
      default:
        return config.models.standard;
    }
  }

  /**
   * Reuse existing OpenAI service methods
   */
  async generatePosts(content: string): Promise<any[]> {
    return this.openaiService.generatePosts(content);
  }

  async extractWebsiteText(content: string): Promise<any[]> {
    return this.openaiService.extractWebsiteText(content);
  }

  async separatePosts(content: string, length: number): Promise<any> {
    return this.openaiService.separatePosts(content, length);
  }

  async generateSlidesFromText(text: string): Promise<any[]> {
    return this.openaiService.generateSlidesFromText(text);
  }

  async generatePromptForPicture(prompt: string): Promise<string> {
    return this.openaiService.generatePromptForPicture(prompt);
  }

  async generateVoiceFromText(prompt: string): Promise<string> {
    return this.openaiService.generateVoiceFromText(prompt);
  }
}
