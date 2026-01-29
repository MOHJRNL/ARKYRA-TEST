import { Logger } from '@nestjs/common';
import {
  IAIProvider,
  AIProviderRequest,
  AIProviderResponse,
  ProviderMetrics,
} from '../interfaces/ai-provider.interface';
import { AIProviderType } from '../enums/ai-provider.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';

/**
 * Base AI Provider Abstract Class
 * Implements common functionality for all AI providers
 */
export abstract class BaseAIProvider implements IAIProvider {
  protected readonly logger: Logger;
  protected metrics: ProviderMetrics;

  constructor(providerType: AIProviderType) {
    this.logger = new Logger(`${providerType}Provider`);
    this.metrics = {
      provider: providerType,
      isHealthy: true,
      avgLatencyMs: 0,
      errorRate: 0,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      lastHealthCheck: new Date(),
    };
  }

  /**
   * Get provider type
   */
  abstract getProviderType(): AIProviderType;

  /**
   * Check provider health
   */
  abstract isHealthy(): Promise<boolean>;

  /**
   * Generate text completion
   */
  abstract generateCompletion(request: AIProviderRequest): Promise<AIProviderResponse>;

  /**
   * Estimate cost for request
   */
  abstract estimateCost(
    inputTokens: number,
    outputTokens: number,
    accuracyLevel: AccuracyLevel,
  ): number;

  /**
   * Get provider metrics
   */
  getMetrics(): ProviderMetrics {
    return { ...this.metrics };
  }

  /**
   * Update metrics after request
   */
  protected updateMetrics(success: boolean, latencyMs: number, error?: string): void {
    this.metrics.totalRequests++;

    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
      this.metrics.lastError = error;
    }

    // Update error rate
    this.metrics.errorRate = this.metrics.failedRequests / this.metrics.totalRequests;

    // Update average latency (exponential moving average)
    const alpha = 0.2; // Smoothing factor
    this.metrics.avgLatencyMs =
      alpha * latencyMs + (1 - alpha) * this.metrics.avgLatencyMs;
  }

  /**
   * Execute request with timing and error handling
   */
  protected async executeWithMetrics<T>(
    operation: () => Promise<T>,
    operationName: string,
  ): Promise<{ result: T; latencyMs: number }> {
    const startTime = Date.now();

    try {
      const result = await operation();
      const latencyMs = Date.now() - startTime;

      this.updateMetrics(true, latencyMs);
      this.logger.debug(`${operationName} completed in ${latencyMs}ms`);

      return { result, latencyMs };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      this.updateMetrics(false, latencyMs, (error as any).message);

      this.logger.error(
        `${operationName} failed after ${latencyMs}ms: ${(error as any).message}`,
        (error as any).stack,
      );

      throw error;
    }
  }

  /**
   * Count tokens (approximate)
   * Uses a simple heuristic: ~4 characters per token for English text
   */
  protected estimateTokens(text: string): number {
    // More accurate estimation based on common patterns
    const words = text.split(/\s+/).length;
    const characters = text.length;

    // Average tokens per word is about 1.3 for English
    // But we also consider special characters and punctuation
    return Math.ceil(words * 1.3 + characters * 0.05);
  }

  /**
   * Validate request
   */
  protected validateRequest(request: AIProviderRequest): void {
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt is required and cannot be empty');
    }

    if (!request.organizationId) {
      throw new Error('Organization ID is required');
    }

    if (request.maxTokens && request.maxTokens < 1) {
      throw new Error('Max tokens must be at least 1');
    }

    if (
      request.temperature !== undefined &&
      (request.temperature < 0 || request.temperature > 1)
    ) {
      throw new Error('Temperature must be between 0 and 1');
    }
  }

  /**
   * Build error response
   */
  protected buildErrorResponse(
    error: unknown,
    latencyMs: number,
    estimatedCost: number = 0,
  ): AIProviderResponse {
    return {
      content: '',
      provider: this.getProviderType(),
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      estimatedCost,
      latencyMs,
      success: false,
      error: (error as any).message,
      metadata: {
        errorType: (error as any).constructor?.name || 'Unknown',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Build success response
   */
  protected buildSuccessResponse(
    content: string,
    inputTokens: number,
    outputTokens: number,
    cost: number,
    latencyMs: number,
    model?: string,
  ): AIProviderResponse {
    return {
      content,
      provider: this.getProviderType(),
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      estimatedCost: cost,
      latencyMs,
      success: true,
      model,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Retry logic with exponential backoff
   */
  protected async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          const delay = baseDelayMs * Math.pow(2, attempt);
          this.logger.warn(
            `Attempt ${attempt + 1} failed, retrying in ${delay}ms: ${(error as any).message}`,
          );
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  /**
   * Sleep utility
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
