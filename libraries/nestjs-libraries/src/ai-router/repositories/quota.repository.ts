import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { QuotaStatus, SubscriptionTier, QUOTA_CONFIG, QUOTA_ALERT_THRESHOLDS } from '../interfaces/quota.interface';
import { AIProviderType } from '../enums/ai-provider.enum';

/**
 * Quota Repository
 * Handles all database operations for AI quota management
 */
@Injectable()
export class QuotaRepository {
  private readonly logger = new Logger(QuotaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create quota for an organization
   */
  async getOrCreateQuota(organizationId: string): Promise<QuotaStatus> {
    try {
      // First, try to get existing quota
      let quota = await this.prisma.aIQuota.findUnique({
        where: { organizationId },
        include: { organization: { include: { subscription: true } } },
      });

      // If no quota exists, create one
      if (!quota) {
        const subscription = await this.prisma.subscription.findUnique({
          where: { organizationId },
        });

        const tier = (subscription?.subscriptionTier as SubscriptionTier) || SubscriptionTier.FREE;
        const limits = QUOTA_CONFIG[tier];

        const nextResetAt = new Date();
        nextResetAt.setMonth(nextResetAt.getMonth() + 1);
        nextResetAt.setDate(1);
        nextResetAt.setHours(0, 0, 0, 0);

        quota = await this.prisma.aIQuota.create({
          data: {
            organizationId,
            planTier: tier,
            openaiMonthlyTokenLimit: limits.openaiTokens,
            openaiUsedTokens: 0,
            openaiRequestCount: 0,
            glmMonthlyTokenLimit: limits.glmTokens,
            glmUsedTokens: 0,
            glmRequestCount: 0,
            lastResetAt: new Date(),
            nextResetAt,
          },
          include: { organization: { include: { subscription: true } } },
        });
      }

      // Check if reset is needed
      if (new Date() >= quota.nextResetAt) {
        quota = await this.resetQuota(organizationId);
      }

      return this.formatQuotaStatus(quota);
    } catch (error) {
      this.logger.error(`Failed to get or create quota: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Update quota usage
   */
  async updateQuotaUsage(
    organizationId: string,
    provider: AIProviderType,
    tokensUsed: number,
  ): Promise<QuotaStatus> {
    try {
      const quota = await this.prisma.aIQuota.findUnique({
        where: { organizationId },
      });

      if (!quota) {
        throw new Error(`Quota not found for organization: ${organizationId}`);
      }

      const updateData: any = {};

      if (provider === AIProviderType.OPENAI) {
        updateData.openaiUsedTokens = quota.openaiUsedTokens + tokensUsed;
        updateData.openaiRequestCount = quota.openaiRequestCount + 1;

        // Check for alerts
        const usage = updateData.openaiUsedTokens / quota.openaiMonthlyTokenLimit;
        if (usage >= QUOTA_ALERT_THRESHOLDS.HARD_LIMIT) {
          updateData.hardLimitReached = true;
        } else if (usage >= QUOTA_ALERT_THRESHOLDS.SOFT_LIMIT) {
          updateData.softLimitReached = true;
        }
      } else if (provider === AIProviderType.GLM_4_7) {
        updateData.glmUsedTokens = quota.glmUsedTokens + tokensUsed;
        updateData.glmRequestCount = quota.glmRequestCount + 1;

        // Check for alerts
        const usage = updateData.glmUsedTokens / quota.glmMonthlyTokenLimit;
        if (usage >= QUOTA_ALERT_THRESHOLDS.HARD_LIMIT) {
          updateData.hardLimitReached = true;
        } else if (usage >= QUOTA_ALERT_THRESHOLDS.SOFT_LIMIT) {
          updateData.softLimitReached = true;
        }
      }

      const updated = await this.prisma.aIQuota.update({
        where: { organizationId },
        data: updateData,
        include: { organization: { include: { subscription: true } } },
      });

      return this.formatQuotaStatus(updated);
    } catch (error) {
      this.logger.error(`Failed to update quota usage: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Reset quota for a new billing period
   */
  async resetQuota(organizationId: string): Promise<any> {
    try {
      const nextResetAt = new Date();
      nextResetAt.setMonth(nextResetAt.getMonth() + 1);
      nextResetAt.setDate(1);
      nextResetAt.setHours(0, 0, 0, 0);

      const updated = await this.prisma.aIQuota.update({
        where: { organizationId },
        data: {
          openaiUsedTokens: 0,
          openaiRequestCount: 0,
          glmUsedTokens: 0,
          glmRequestCount: 0,
          lastResetAt: new Date(),
          nextResetAt,
          softLimitReached: false,
          hardLimitReached: false,
        },
        include: { organization: { include: { subscription: true } } },
      });

      this.logger.log(`Reset quota for organization: ${organizationId}`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to reset quota: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Update quota limits (e.g., after tier upgrade)
   */
  async updateQuotaLimits(
    organizationId: string,
    tier: SubscriptionTier,
  ): Promise<QuotaStatus> {
    try {
      const limits = QUOTA_CONFIG[tier];

      const updated = await this.prisma.aIQuota.update({
        where: { organizationId },
        data: {
          planTier: tier,
          openaiMonthlyTokenLimit: limits.openaiTokens,
          glmMonthlyTokenLimit: limits.glmTokens,
        },
        include: { organization: { include: { subscription: true } } },
      });

      this.logger.log(`Updated quota limits for organization: ${organizationId} to tier: ${tier}`);
      return this.formatQuotaStatus(updated);
    } catch (error) {
      this.logger.error(`Failed to update quota limits: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Check if organization has quota available
   */
  async hasQuotaAvailable(
    organizationId: string,
    provider: AIProviderType,
    tokensNeeded: number,
  ): Promise<boolean> {
    try {
      const quota = await this.prisma.aIQuota.findUnique({
        where: { organizationId },
      });

      if (!quota) return false;

      // Check if reset is needed
      if (new Date() >= quota.nextResetAt) {
        await this.resetQuota(organizationId);
        return true; // After reset, quota is available
      }

      if (provider === AIProviderType.OPENAI) {
        const remaining = quota.openaiMonthlyTokenLimit - quota.openaiUsedTokens;
        return remaining >= tokensNeeded;
      } else if (provider === AIProviderType.GLM_4_7) {
        const remaining = quota.glmMonthlyTokenLimit - quota.glmUsedTokens;
        return remaining >= tokensNeeded;
      }

      return false;
    } catch (error) {
      this.logger.error(`Failed to check quota availability: ${(error as any).message}`, (error as any).stack);
      return false;
    }
  }

  /**
   * Format quota data into QuotaStatus
   */
  private formatQuotaStatus(quota: any): QuotaStatus {
    const now = new Date();
    const msUntilReset = quota.nextResetAt.getTime() - now.getTime();
    const daysUntilReset = Math.ceil(msUntilReset / (1000 * 60 * 60 * 24));
    const hoursUntilReset = Math.ceil(msUntilReset / (1000 * 60 * 60));

    const openaiUsagePercentage = Math.round(
      (quota.openaiUsedTokens / quota.openaiMonthlyTokenLimit) * 100,
    );
    const glmUsagePercentage = Math.round(
      (quota.glmUsedTokens / quota.glmMonthlyTokenLimit) * 100,
    );

    let alertMessage: string | undefined;
    if (quota.hardLimitReached) {
      alertMessage = 'Hard limit reached. AI operations may be restricted.';
    } else if (quota.softLimitReached) {
      alertMessage = `Soft limit reached (${QUOTA_ALERT_THRESHOLDS.SOFT_LIMIT * 100}%). Consider upgrading your plan.`;
    }

    return {
      organizationId: quota.organizationId,
      tier: quota.planTier as SubscriptionTier,
      openai: {
        limit: quota.openaiMonthlyTokenLimit,
        used: quota.openaiUsedTokens,
        remaining: quota.openaiMonthlyTokenLimit - quota.openaiUsedTokens,
        percentage: openaiUsagePercentage,
        requestCount: quota.openaiRequestCount,
      },
      glm: {
        limit: quota.glmMonthlyTokenLimit,
        used: quota.glmUsedTokens,
        remaining: quota.glmMonthlyTokenLimit - quota.glmUsedTokens,
        percentage: glmUsagePercentage,
        requestCount: quota.glmRequestCount,
      },
      reset: {
        lastResetAt: quota.lastResetAt,
        nextResetAt: quota.nextResetAt,
        daysUntilReset,
        hoursUntilReset,
      },
      alerts: {
        softLimitReached: quota.softLimitReached,
        hardLimitReached: quota.hardLimitReached,
        message: alertMessage,
      },
    };
  }
}
