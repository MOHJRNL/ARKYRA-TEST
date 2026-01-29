import { Injectable, Logger } from '@nestjs/common';
import { QuotaRepository } from '../repositories/quota.repository';
import {
  QuotaStatus,
  QuotaCheckResult,
  SubscriptionTier,
  QUOTA_CONFIG,
} from '../interfaces/quota.interface';
import { AIProviderType } from '../enums/ai-provider.enum';

/**
 * Quota Management Service
 * Manages AI usage quotas and limits for organizations
 */
@Injectable()
export class QuotaManagementService {
  private readonly logger = new Logger(QuotaManagementService.name);

  constructor(private readonly quotaRepository: QuotaRepository) {}

  /**
   * Get quota status for an organization
   */
  async getQuotaStatus(organizationId: string): Promise<QuotaStatus> {
    try {
      return await this.quotaRepository.getOrCreateQuota(organizationId);
    } catch (error) {
      this.logger.error(
        `Failed to get quota status: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Check if organization can make a request
   */
  async checkQuota(
    organizationId: string,
    provider: AIProviderType,
    estimatedTokens: number,
  ): Promise<QuotaCheckResult> {
    try {
      const quota = await this.quotaRepository.getOrCreateQuota(organizationId);

      // Determine which quota to check
      let available = false;
      let remaining = 0;
      let alternativeProvider: AIProviderType | undefined;

      if (provider === AIProviderType.OPENAI) {
        remaining = quota.openai.remaining;
        available = remaining >= estimatedTokens;

        // If OpenAI quota is exhausted, suggest GLM as alternative
        if (!available && quota.glm.remaining >= estimatedTokens) {
          alternativeProvider = AIProviderType.GLM_4_7;
        }
      } else if (provider === AIProviderType.GLM_4_7) {
        remaining = quota.glm.remaining;
        available = remaining >= estimatedTokens;

        // If GLM quota is exhausted, suggest OpenAI as alternative
        if (!available && quota.openai.remaining >= estimatedTokens) {
          alternativeProvider = AIProviderType.OPENAI;
        }
      }

      // Check if this would trigger alerts
      const wouldTriggerAlert = this.wouldTriggerAlert(
        provider,
        quota,
        estimatedTokens,
      );

      if (!available) {
        return {
          allowed: false,
          reason: `Insufficient ${provider} quota. ${remaining} tokens remaining, ${estimatedTokens} needed.`,
          remainingTokens: remaining,
          alternativeProvider,
          wouldTriggerAlert,
        };
      }

      return {
        allowed: true,
        provider,
        remainingTokens: remaining,
        wouldTriggerAlert,
      };
    } catch (error) {
      this.logger.error(`Failed to check quota: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Update quota after usage
   */
  async updateQuotaUsage(
    organizationId: string,
    provider: AIProviderType,
    tokensUsed: number,
  ): Promise<void> {
    try {
      await this.quotaRepository.updateQuotaUsage(
        organizationId,
        provider,
        tokensUsed,
      );

      this.logger.debug(
        `Updated quota for ${organizationId}: ${provider} -${tokensUsed} tokens`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update quota: ${(error as any).message}`,
        (error as any).stack,
      );
      // Don't throw - quota tracking failures shouldn't break the main flow
    }
  }

  /**
   * Upgrade organization quota (after tier change)
   */
  async upgradeQuota(
    organizationId: string,
    newTier: SubscriptionTier,
  ): Promise<QuotaStatus> {
    try {
      this.logger.log(`Upgrading quota for ${organizationId} to ${newTier}`);

      return await this.quotaRepository.updateQuotaLimits(
        organizationId,
        newTier,
      );
    } catch (error) {
      this.logger.error(`Failed to upgrade quota: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Reset quota (for new billing period)
   */
  async resetQuota(organizationId: string): Promise<void> {
    try {
      await this.quotaRepository.resetQuota(organizationId);
      this.logger.log(`Reset quota for organization: ${organizationId}`);
    } catch (error) {
      this.logger.error(`Failed to reset quota: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Get quota recommendations
   */
  async getQuotaRecommendations(
    organizationId: string,
  ): Promise<string[]> {
    try {
      const quota = await this.quotaRepository.getOrCreateQuota(organizationId);
      const recommendations: string[] = [];

      // Check OpenAI usage
      if (quota.openai.percentage > 80) {
        recommendations.push(
          `OpenAI quota is ${quota.openai.percentage}% used. Consider upgrading your plan or using GLM-4.7 for cost-effective operations.`,
        );
      }

      // Check GLM usage
      if (quota.glm.percentage > 80) {
        recommendations.push(
          `GLM-4.7 quota is ${quota.glm.percentage}% used. Consider upgrading your plan.`,
        );
      }

      // Suggest cost optimization
      const openaiUsage = quota.openai.used;
      const glmUsage = quota.glm.used;

      if (openaiUsage > glmUsage * 2) {
        recommendations.push(
          'You are using OpenAI significantly more than GLM-4.7. Consider routing standard accuracy tasks to GLM-4.7 to reduce costs.',
        );
      }

      // Suggest tier upgrade
      const nextTier = this.getNextTier(quota.tier);
      if (
        nextTier &&
        (quota.openai.percentage > 70 || quota.glm.percentage > 70)
      ) {
        const nextLimits = QUOTA_CONFIG[nextTier];
        recommendations.push(
          `Consider upgrading to ${nextTier} tier for ${nextLimits.openaiTokens.toLocaleString()} OpenAI tokens and ${nextLimits.glmTokens.toLocaleString()} GLM tokens per month.`,
        );
      }

      return recommendations;
    } catch (error) {
      this.logger.error(
        `Failed to get recommendations: ${(error as any).message}`,
        (error as any).stack,
      );
      return [];
    }
  }

  /**
   * Check if usage would trigger alert
   */
  private wouldTriggerAlert(
    provider: AIProviderType,
    quota: QuotaStatus,
    additionalTokens: number,
  ): boolean {
    const current =
      provider === AIProviderType.OPENAI
        ? quota.openai.used
        : quota.glm.used;
    const limit =
      provider === AIProviderType.OPENAI
        ? quota.openai.limit
        : quota.glm.limit;

    const newUsage = current + additionalTokens;
    const newPercentage = (newUsage / limit) * 100;

    return newPercentage >= 80; // Soft limit threshold
  }

  /**
   * Get next tier for upgrade suggestions
   */
  private getNextTier(
    currentTier: SubscriptionTier,
  ): SubscriptionTier | null {
    const tierOrder = [
      SubscriptionTier.FREE,
      SubscriptionTier.STANDARD,
      SubscriptionTier.PRO,
      SubscriptionTier.TEAM,
      SubscriptionTier.ULTIMATE,
    ];

    const currentIndex = tierOrder.indexOf(currentTier);
    if (currentIndex < tierOrder.length - 1) {
      return tierOrder[currentIndex + 1];
    }

    return null; // Already at highest tier
  }

  /**
   * Check if organization is within quota for any provider
   */
  async hasAnyQuotaAvailable(
    organizationId: string,
    estimatedTokens: number,
  ): Promise<{
    available: boolean;
    providers: AIProviderType[];
  }> {
    try {
      const providers: AIProviderType[] = [];

      // Check OpenAI
      const hasOpenAI = await this.quotaRepository.hasQuotaAvailable(
        organizationId,
        AIProviderType.OPENAI,
        estimatedTokens,
      );
      if (hasOpenAI) providers.push(AIProviderType.OPENAI);

      // Check GLM
      const hasGLM = await this.quotaRepository.hasQuotaAvailable(
        organizationId,
        AIProviderType.GLM_4_7,
        estimatedTokens,
      );
      if (hasGLM) providers.push(AIProviderType.GLM_4_7);

      return {
        available: providers.length > 0,
        providers,
      };
    } catch (error) {
      this.logger.error(
        `Failed to check available quota: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }
}
