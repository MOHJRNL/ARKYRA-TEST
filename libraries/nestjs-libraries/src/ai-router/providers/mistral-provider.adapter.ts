import { Injectable } from '@nestjs/common';
import { BaseAIProvider } from './base-ai-provider.abstract';
import {
  AIProviderRequest,
  AIProviderResponse,
} from '../interfaces/ai-provider.interface';
import { AIProviderType, PROVIDER_CONFIG } from '../enums/ai-provider.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';

/**
 * Mistral Cost per 1M tokens (approximate, as of Jan 2025)
 */
const MISTRAL_PRICING = {
  'mistral-large-latest': { input: 4.0, output: 12.0 },
  'mistral-medium-latest': { input: 2.5, output: 7.5 },
  'mistral-small-latest': { input: 0.2, output: 0.6 },
} as const;

/**
 * Mistral AI Provider Adapter
 * Provides Mistral AI integration with unified interface
 */
@Injectable()
export class MistralProviderAdapter extends BaseAIProvider {
  private readonly baseUrl = 'https://api.mistral.ai/v1';

  constructor() {
    super(AIProviderType.MISTRAL);
    this.logger.log('Mistral Provider initialized');
  }

  /**
   * Get provider type
   */
  getProviderType(): AIProviderType {
    return AIProviderType.MISTRAL;
  }

  /**
   * Check if Mistral is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      const startTime = Date.now();

      // Simple health check - list models
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Mistral API is not responding');
      }

      const latencyMs = Date.now() - startTime;
      this.metrics.isHealthy = true;
      this.metrics.lastHealthCheck = new Date();
      this.metrics.avgLatencyMs = latencyMs;

      return true;
    } catch (error) {
      this.logger.error(`Mistral health check failed: ${(error as any).message}`);
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

      // Call Mistral API
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: request.maxTokens || 4096,
          temperature: request.temperature ?? 0.7,
          ...request.options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Mistral API request failed');
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      const content = data.choices[0]?.message?.content || '';
      const usage = data.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      };

      const inputTokens = usage.prompt_tokens;
      const outputTokens = usage.completion_tokens;
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
        `Mistral completion failed: ${(error as any).message}`,
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
    const pricing = MISTRAL_PRICING[model];

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
    const config = PROVIDER_CONFIG[AIProviderType.MISTRAL];

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
   * Generate JSON output with Mistral
   */
  async generateJsonOutput(
    prompt: string,
    schema?: any,
    options?: { systemMessage?: string; temperature?: number },
  ): Promise<any> {
    try {
      const messages: any[] = [];

      if (options?.systemMessage) {
        messages.push({
          role: 'system',
          content: options.systemMessage,
        });
      }

      messages.push({
        role: 'user',
        content: prompt,
      });

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages,
          temperature: options?.temperature ?? 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate JSON output');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '{}';

      return JSON.parse(content);
    } catch (error) {
      this.logger.error(
        `JSON output generation failed: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }
}
