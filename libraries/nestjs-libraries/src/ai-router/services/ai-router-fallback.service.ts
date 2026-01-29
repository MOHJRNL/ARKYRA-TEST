import { Injectable, Logger } from '@nestjs/common';
import { AIProviderType } from '../enums/ai-provider.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';
import {
  AIProviderRequest,
  AIProviderResponse,
} from '../interfaces/ai-provider.interface';
import { OpenAIProviderAdapter } from '../providers/openai-provider.adapter';
import { GLMProviderAdapter } from '../providers/glm-provider.adapter';
import { ProviderHealthService } from '../providers/provider-health.service';

/**
 * AI Router Fallback Service
 * Handles fallback logic when primary provider fails
 */
@Injectable()
export class AIRouterFallbackService {
  private readonly logger = new Logger(AIRouterFallbackService.name);

  constructor(
    private readonly openaiProvider: OpenAIProviderAdapter,
    private readonly glmProvider: GLMProviderAdapter,
    private readonly healthService: ProviderHealthService,
  ) {}

  /**
   * Execute request with automatic fallback
   */
  async executeWithFallback(
    request: AIProviderRequest,
    primaryProvider: AIProviderType,
    fallbackProvider: AIProviderType,
    maxAttempts: number = 2,
  ): Promise<AIProviderResponse> {
    const providers = [primaryProvider, fallbackProvider];
    let lastError: unknown;

    for (let attempt = 0; attempt < maxAttempts && attempt < providers.length; attempt++) {
      const provider = providers[attempt];

      try {
        this.logger.debug(
          `Attempt ${attempt + 1}: Trying provider ${provider}`,
        );

        const response = await this.executeOnProvider(provider, request);

        // Mark as fallback if not the primary provider
        if (attempt > 0) {
          response.isFallback = true;
          response.metadata = {
            ...response.metadata,
            fallbackReason: (lastError as any)?.message,
            originalProvider: primaryProvider,
          };
        }

        return response;
      } catch (error) {
        lastError = error;
        this.logger.warn(
          `Provider ${provider} failed (attempt ${attempt + 1}): ${(error as any).message}`,
        );

        // If this was the last attempt, throw
        if (attempt === maxAttempts - 1 || attempt === providers.length - 1) {
          break;
        }

        // Otherwise, continue to next provider
        continue;
      }
    }

    // All attempts failed
    const errorMessage = `All providers failed. Last error: ${(lastError as any)?.message}`;
    this.logger.error(errorMessage);

    return {
      content: '',
      provider: primaryProvider,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
      latencyMs: 0,
      success: false,
      error: errorMessage,
      metadata: {
        attempts: maxAttempts,
        providers: providers.join(', '),
      },
    };
  }

  /**
   * Execute request on a specific provider
   */
  private async executeOnProvider(
    provider: AIProviderType,
    request: AIProviderRequest,
  ): Promise<AIProviderResponse> {
    // Check if provider is healthy before attempting
    if (!this.healthService.isProviderHealthy(provider)) {
      throw new Error(`Provider ${provider} is not healthy`);
    }

    switch (provider) {
      case AIProviderType.OPENAI:
        return await this.openaiProvider.generateCompletion(request);

      case AIProviderType.GLM_4_7:
        return await this.glmProvider.generateCompletion(request);

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * Try multiple providers in order until one succeeds
   */
  async tryProvidersInOrder(
    request: AIProviderRequest,
    providers: AIProviderType[],
  ): Promise<AIProviderResponse> {
    for (const provider of providers) {
      try {
        this.logger.debug(`Trying provider: ${provider}`);
        const response = await this.executeOnProvider(provider, request);

        if (response.success) {
          return response;
        }
      } catch (error) {
        this.logger.warn(`Provider ${provider} failed: ${(error as any).message}`);
        continue;
      }
    }

    throw new Error('All providers failed');
  }

  /**
   * Get fallback chain for a provider
   * Returns ordered list of providers to try
   */
  getFallbackChain(
    primaryProvider: AIProviderType,
    fallbackProvider: AIProviderType,
  ): AIProviderType[] {
    const chain: AIProviderType[] = [primaryProvider];

    // Add fallback if different and healthy
    if (
      fallbackProvider !== primaryProvider &&
      this.healthService.isProviderHealthy(fallbackProvider)
    ) {
      chain.push(fallbackProvider);
    }

    // Add any other healthy providers as last resort
    const healthyProviders = this.healthService.getHealthyProviders();
    for (const provider of healthyProviders) {
      if (!chain.includes(provider)) {
        chain.push(provider);
      }
    }

    return chain;
  }

  /**
   * Determine if accuracy degradation is acceptable
   */
  canDegradeAccuracy(
    currentAccuracy: AccuracyLevel,
    context: { isUrgent?: boolean; allowDegradation?: boolean },
  ): { canDegrade: boolean; nextLevel?: AccuracyLevel } {
    if (context.allowDegradation === false) {
      return { canDegrade: false };
    }

    // If urgent, allow degradation
    if (context.isUrgent) {
      switch (currentAccuracy) {
        case AccuracyLevel.PREMIUM:
          return { canDegrade: true, nextLevel: AccuracyLevel.HIGH };
        case AccuracyLevel.HIGH:
          return { canDegrade: true, nextLevel: AccuracyLevel.STANDARD };
        case AccuracyLevel.STANDARD:
          return { canDegrade: false };
      }
    }

    return { canDegrade: false };
  }

  /**
   * Retry with exponential backoff
   */
  async retryWithBackoff<T>(
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
          this.logger.debug(
            `Retry attempt ${attempt + 1} failed, waiting ${delay}ms`,
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
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
