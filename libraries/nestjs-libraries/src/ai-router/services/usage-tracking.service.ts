import { Injectable, Logger } from '@nestjs/common';
import { UsageTrackingRepository } from '../repositories/usage-tracking.repository';
import {
  UsageRecord,
  UsageStatistics,
  CostBreakdown,
} from '../interfaces/usage-tracking.interface';
import { AIProviderType } from '../enums/ai-provider.enum';
import { AITaskType } from '../enums/task-type.enum';

/**
 * Usage Tracking Service
 * Tracks and analyzes AI usage across the organization
 */
@Injectable()
export class UsageTrackingService {
  private readonly logger = new Logger(UsageTrackingService.name);

  constructor(
    private readonly usageRepository: UsageTrackingRepository,
  ) {}

  /**
   * Track a single usage record
   */
  async trackUsage(record: UsageRecord): Promise<void> {
    try {
      await this.usageRepository.createUsageRecord(record);

      this.logger.debug(
        `Tracked usage: ${record.provider} - ${record.taskType} - ${record.totalTokens} tokens`,
      );
    } catch (error) {
      this.logger.error(`Failed to track usage: ${(error as any).message}`, (error as any).stack);
      // Don't throw - tracking failures shouldn't break the main flow
    }
  }

  /**
   * Get usage statistics for an organization
   */
  async getUsageStatistics(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<UsageStatistics> {
    try {
      const start = startDate || this.getStartOfMonth();
      const end = endDate || new Date();

      return await this.usageRepository.getUsageStatistics(
        organizationId,
        start,
        end,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get usage statistics: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Get cost breakdown for an organization
   */
  async getCostBreakdown(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<CostBreakdown> {
    try {
      const stats = await this.getUsageStatistics(
        organizationId,
        startDate,
        endDate,
      );

      // Calculate projected monthly cost
      const daysInPeriod = this.getDaysBetween(
        stats.period.start,
        stats.period.end,
      );
      const dailyAverage = stats.totalCost / daysInPeriod;
      const daysInMonth = 30;
      const projectedMonthlyCost = dailyAverage * daysInMonth;

      // Get previous period for trend analysis
      const previousStart = new Date(stats.period.start);
      previousStart.setDate(previousStart.getDate() - daysInPeriod);
      const previousEnd = stats.period.start;

      const previousStats = await this.usageRepository.getUsageStatistics(
        organizationId,
        previousStart,
        previousEnd,
      );

      // Calculate trend
      const costChange = stats.totalCost - previousStats.totalCost;
      const costChangePercent =
        previousStats.totalCost > 0
          ? (costChange / previousStats.totalCost) * 100
          : 0;

      let direction: 'up' | 'down' | 'stable' = 'stable';
      if (Math.abs(costChangePercent) > 5) {
        direction = costChangePercent > 0 ? 'up' : 'down';
      }

      return {
        total: stats.totalCost,
        byProvider: Object.entries(stats.byProvider).reduce(
          (acc, [provider, data]) => {
            acc[provider] = data.cost;
            return acc;
          },
          {} as Record<string, number>,
        ),
        byTaskType: Object.entries(stats.byTaskType).reduce(
          (acc, [taskType, data]) => {
            acc[taskType] = data.cost;
            return acc;
          },
          {} as Record<string, number>,
        ),
        projectedMonthlyCost,
        trend: {
          direction,
          percentage: Math.abs(costChangePercent),
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get cost breakdown: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Get usage records with filtering
   */
  async getUsageRecords(
    organizationId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      provider?: AIProviderType;
      taskType?: AITaskType;
      userId?: string;
    },
    limit?: number,
    offset?: number,
  ): Promise<UsageRecord[]> {
    try {
      return await this.usageRepository.getUsageRecords(
        organizationId,
        filters,
        limit,
        offset,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get usage records: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Get daily usage summary
   */
  async getDailyUsageSummary(organizationId: string, date: Date) {
    try {
      return await this.usageRepository.getDailyUsageSummary(
        organizationId,
        date,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get daily summary: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Get usage trends over time
   */
  async getUsageTrends(
    organizationId: string,
    days: number = 30,
  ): Promise<
    Array<{
      date: Date;
      requests: number;
      tokens: number;
      cost: number;
    }>
  > {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const trends: Array<{
        date: Date;
        requests: number;
        tokens: number;
        cost: number;
      }> = [];

      // Get daily summaries
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        const summary = await this.usageRepository.getDailyUsageSummary(
          organizationId,
          date,
        );

        trends.push({
          date,
          requests: summary?.totalRequests || 0,
          tokens: summary?.totalTokens || 0,
          cost: summary?.totalCost || 0,
        });
      }

      return trends;
    } catch (error) {
      this.logger.error(
        `Failed to get usage trends: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Get top users by usage
   */
  async getTopUsers(
    organizationId: string,
    limit: number = 10,
    startDate?: Date,
    endDate?: Date,
  ): Promise<
    Array<{
      userId: string;
      requests: number;
      tokens: number;
      cost: number;
    }>
  > {
    try {
      const stats = await this.getUsageStatistics(
        organizationId,
        startDate,
        endDate,
      );

      return stats.topUsers?.slice(0, limit) || [];
    } catch (error) {
      this.logger.error(
        `Failed to get top users: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Helper: Get start of current month
   */
  private getStartOfMonth(): Date {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  /**
   * Helper: Get days between two dates
   */
  private getDaysBetween(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Avoid division by zero
  }
}
