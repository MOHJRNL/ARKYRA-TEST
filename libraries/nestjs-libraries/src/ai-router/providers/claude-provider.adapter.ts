import { Injectable } from '@nestjs/common';
import { BaseAIProvider } from './base-ai-provider.abstract';
import {
  AIProviderRequest,
  AIProviderResponse,
} from '../interfaces/ai-provider.interface';
import { AIProviderType, PROVIDER_CONFIG } from '../enums/ai-provider.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Claude Cost per 1M tokens (approximate, as of Jan 2025)
 */
const CLAUDE_PRICING = {
  'claude-opus-4-5': { input: 15.0, output: 75.0 }, // Opus (most capable)
  'claude-sonnet-4-5': { input: 3.0, output: 15.0 }, // Sonnet (balanced)
  'claude-haiku-3-5': { input: 0.25, output: 1.25 }, // Haiku (fast and efficient)
} as const;

/**
 * Claude (Anthropic) Provider Adapter
 * Provides Claude AI integration with unified interface
 */
@Injectable()
export class ClaudeProviderAdapter extends BaseAIProvider {
  private readonly client: Anthropic;

  constructor() {
    super(AIProviderType.CLAUDE);

    // Initialize Claude client
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });

    this.logger.log('Claude Provider initialized');
  }

  /**
   * Get provider type
   */
  getProviderType(): AIProviderType {
    return AIProviderType.CLAUDE;
  }

  /**
   * Check if Claude is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      const startTime = Date.now();

      // Simple health check - minimal completion request
      await this.client.messages.create({
        model: 'claude-haiku-3-5-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'ping' }],
      });

      const latencyMs = Date.now() - startTime;
      this.metrics.isHealthy = true;
      this.metrics.lastHealthCheck = new Date();
      this.metrics.avgLatencyMs = latencyMs;

      return true;
    } catch (error) {
      this.logger.error(`Claude health check failed: ${(error as any).message}`);
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

      messages.push({
        role: 'user',
        content: request.prompt,
      });

      // Call Claude API
      const response = await this.client.messages.create({
        model,
        max_tokens: request.maxTokens || 4096,
        temperature: request.temperature ?? 0.7,
        ...(request.systemMessage && { system: request.systemMessage }),
        messages,
        ...request.options,
      });

      const latencyMs = Date.now() - startTime;
      const content =
        response.content[0]?.type === 'text' ? response.content[0].text : '';

      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;
      const cost = this.estimateCost(
        inputTokens,
        outputTokens,
        request.accuracyLevel,
      );

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
        `Claude completion failed: ${(error as any).message}`,
        (error as any).stack,
      );

      return this.buildErrorResponse(error, latencyMs);
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
    const pricing = CLAUDE_PRICING[model];

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
    const config = PROVIDER_CONFIG[AIProviderType.CLAUDE];

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
   * Generate structured output with Claude
   */
  async generateStructuredOutput(
    prompt: string,
    schema: any,
    options?: { systemMessage?: string; temperature?: number },
  ): Promise<any> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 4096,
        temperature: options?.temperature ?? 0.3,
        ...(options?.systemMessage && { system: options.systemMessage }),
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content =
        response.content[0]?.type === 'text' ? response.content[0].text : '';

      // Try to parse JSON from content
      try {
        return JSON.parse(content);
      } catch {
        // If not JSON, return as is
        return content;
      }
    } catch (error) {
      this.logger.error(
        `Structured output generation failed: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }
}
