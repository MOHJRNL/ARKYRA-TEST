import { Injectable, Logger } from '@nestjs/common';
import {
  RouterDecision,
  RoutingContext,
  RoutingMatrix,
} from '../interfaces/ai-router.interface';
import { AIProviderType } from '../enums/ai-provider.enum';
import { AITaskType } from '../enums/task-type.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';
import { ProviderHealthService } from '../providers/provider-health.service';
import { QuotaManagementService } from './quota-management.service';

/**
 * AI Router Decision Service
 * Implements the routing matrix logic to select the best provider
 * for each request based on task type, accuracy level, and system state
 */
@Injectable()
export class AIRouterDecisionService {
  private readonly logger = new Logger(AIRouterDecisionService.name);

  /**
   * Routing Matrix
   * Defines primary and fallback providers for each task/accuracy combination
   */
  private readonly routingMatrix: RoutingMatrix = {
    // AUTOCOMPLETE - Fast, frequent, standard quality
    [AITaskType.AUTOCOMPLETE]: {
      [AccuracyLevel.STANDARD]: {
        primary: AIProviderType.GLM_4_7, // Cost-effective for high volume
        fallback: AIProviderType.OPENAI,
      },
      [AccuracyLevel.HIGH]: {
        primary: AIProviderType.GLM_4_7,
        fallback: AIProviderType.OPENAI,
      },
      [AccuracyLevel.PREMIUM]: {
        primary: AIProviderType.OPENAI, // Better quality for premium
        fallback: AIProviderType.GLM_4_7,
      },
    },

    // CAPTION_REWRITE - Medium frequency, good quality needed
    [AITaskType.CAPTION_REWRITE]: {
      [AccuracyLevel.STANDARD]: {
        primary: AIProviderType.GLM_4_7,
        fallback: AIProviderType.OPENAI,
      },
      [AccuracyLevel.HIGH]: {
        primary: AIProviderType.OPENAI, // GPT-4o-mini for better rewrites
        fallback: AIProviderType.GLM_4_7,
      },
      [AccuracyLevel.PREMIUM]: {
        primary: AIProviderType.OPENAI, // GPT-4.1 for best results
        fallback: AIProviderType.GLM_4_7,
      },
    },

    // POST_GENERATION - Lower frequency, premium quality required
    [AITaskType.POST_GENERATION]: {
      [AccuracyLevel.STANDARD]: {
        primary: AIProviderType.GLM_4_7,
        fallback: AIProviderType.OPENAI,
      },
      [AccuracyLevel.HIGH]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.GLM_4_7,
      },
      [AccuracyLevel.PREMIUM]: {
        primary: AIProviderType.OPENAI, // Always GPT-4.1 for content creation
        fallback: AIProviderType.GLM_4_7,
      },
    },

    // IMAGE_GENERATION - Always OpenAI (DALL-E 3)
    [AITaskType.IMAGE_GENERATION]: {
      [AccuracyLevel.STANDARD]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.OPENAI, // No alternative for images yet
      },
      [AccuracyLevel.HIGH]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.OPENAI,
      },
      [AccuracyLevel.PREMIUM]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.OPENAI,
      },
    },

    // VIDEO_GENERATION - Future feature, TBD
    [AITaskType.VIDEO_GENERATION]: {
      [AccuracyLevel.STANDARD]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.OPENAI,
      },
      [AccuracyLevel.HIGH]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.OPENAI,
      },
      [AccuracyLevel.PREMIUM]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.OPENAI,
      },
    },

    // GENERIC - Balanced approach
    [AITaskType.GENERIC]: {
      [AccuracyLevel.STANDARD]: {
        primary: AIProviderType.GLM_4_7,
        fallback: AIProviderType.OPENAI,
      },
      [AccuracyLevel.HIGH]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.GLM_4_7,
      },
      [AccuracyLevel.PREMIUM]: {
        primary: AIProviderType.OPENAI,
        fallback: AIProviderType.GLM_4_7,
      },
    },
  };

  constructor(
    private readonly healthService: ProviderHealthService,
    private readonly quotaService: QuotaManagementService,
  ) {}

  /**
   * Make routing decision based on context
   */
  async makeDecision(
    context: RoutingContext,
    estimatedTokens: number = 500,
  ): Promise<RouterDecision> {
    try {
      // Get base routing from matrix
      const matrixDecision = this.getMatrixDecision(
        context.taskType,
        context.accuracyLevel,
      );

      let selectedProvider = matrixDecision.primary;
      let fallbackProvider = matrixDecision.fallback;
      let reason = `Matrix routing: ${context.taskType} at ${context.accuracyLevel}`;
      let confidence = 1.0;

      // Apply preference override if specified
      if (context.preferredProvider) {
        selectedProvider = context.preferredProvider;
        reason = `User preference: ${context.preferredProvider}`;
        confidence = 0.9;
      }

      // Check provider health
      const isPrimaryHealthy = this.healthService.isProviderHealthy(
        selectedProvider,
      );

      if (!isPrimaryHealthy) {
        this.logger.warn(
          `Primary provider ${selectedProvider} is unhealthy, using fallback`,
        );
        selectedProvider = fallbackProvider;
        reason = `Fallback due to unhealthy primary provider`;
        confidence = 0.7;
      }

      // Check quota availability
      const quotaCheck = await this.quotaService.checkQuota(
        context.organizationId,
        selectedProvider,
        estimatedTokens,
      );

      if (!quotaCheck.allowed) {
        // Try alternative provider suggested by quota service
        if (quotaCheck.alternativeProvider) {
          selectedProvider = quotaCheck.alternativeProvider;
          reason = `Quota exhausted for primary, using alternative: ${quotaCheck.alternativeProvider}`;
          confidence = 0.6;
        } else {
          // No quota available anywhere
          return {
            provider: selectedProvider,
            fallbackProvider,
            reason: `No quota available: ${quotaCheck.reason}`,
            confidence: 0,
            estimatedCost: 0,
            expectedLatencyMs: 0,
            quotaAvailable: false,
          };
        }
      }

      // Estimate cost and latency
      const estimatedCost = this.estimateCost(
        selectedProvider,
        estimatedTokens,
        context.accuracyLevel,
      );

      const expectedLatencyMs = this.estimateLatency(
        selectedProvider,
        context.taskType,
      );

      return {
        provider: selectedProvider,
        fallbackProvider,
        reason,
        confidence,
        estimatedCost,
        expectedLatencyMs,
        quotaAvailable: true,
        metadata: {
          taskType: context.taskType,
          accuracyLevel: context.accuracyLevel,
          estimatedTokens,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to make routing decision: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Get routing decision from matrix
   */
  private getMatrixDecision(
    taskType: AITaskType,
    accuracyLevel: AccuracyLevel,
  ): { primary: AIProviderType; fallback: AIProviderType } {
    const taskRouting = this.routingMatrix[taskType];
    if (!taskRouting) {
      this.logger.warn(`No routing found for task type: ${taskType}, using GENERIC`);
      return this.routingMatrix[AITaskType.GENERIC][accuracyLevel];
    }

    const accuracyRouting = taskRouting[accuracyLevel];
    if (!accuracyRouting) {
      this.logger.warn(
        `No routing found for accuracy level: ${accuracyLevel}, using STANDARD`,
      );
      return taskRouting[AccuracyLevel.STANDARD];
    }

    return accuracyRouting;
  }

  /**
   * Estimate cost for request
   * Simplified estimation based on provider and accuracy
   */
  private estimateCost(
    provider: AIProviderType,
    tokens: number,
    accuracy: AccuracyLevel,
  ): number {
    // Base cost per 1K tokens
    const baseCosts = {
      [AIProviderType.OPENAI]: {
        [AccuracyLevel.STANDARD]: 0.002, // GPT-3.5
        [AccuracyLevel.HIGH]: 0.0008, // GPT-4o-mini
        [AccuracyLevel.PREMIUM]: 0.04, // GPT-4.1
      },
      [AIProviderType.GLM_4_7]: {
        [AccuracyLevel.STANDARD]: 0.000001,
        [AccuracyLevel.HIGH]: 0.000001,
        [AccuracyLevel.PREMIUM]: 0.00001,
      },
    };

    const costPer1K = baseCosts[provider]?.[accuracy] || 0.001;
    return (tokens / 1000) * costPer1K;
  }

  /**
   * Estimate latency for request
   */
  private estimateLatency(
    provider: AIProviderType,
    taskType: AITaskType,
  ): number {
    // Get provider health metrics
    const health = this.healthService.getProviderHealth(provider);
    const baseLatency = health?.latencyMs || 1000;

    // Task type multipliers
    const taskMultipliers = {
      [AITaskType.AUTOCOMPLETE]: 0.5,
      [AITaskType.CAPTION_REWRITE]: 1.0,
      [AITaskType.POST_GENERATION]: 1.5,
      [AITaskType.IMAGE_GENERATION]: 10.0,
      [AITaskType.VIDEO_GENERATION]: 50.0,
      [AITaskType.GENERIC]: 1.0,
    };

    const multiplier = taskMultipliers[taskType] || 1.0;
    return baseLatency * multiplier;
  }

  /**
   * Get routing matrix (for debugging/monitoring)
   */
  getRoutingMatrix(): RoutingMatrix {
    return this.routingMatrix;
  }

  /**
   * Get recommended provider for a task
   */
  getRecommendedProvider(
    taskType: AITaskType,
    accuracyLevel: AccuracyLevel,
  ): AIProviderType {
    const decision = this.getMatrixDecision(taskType, accuracyLevel);
    return decision.primary;
  }
}
