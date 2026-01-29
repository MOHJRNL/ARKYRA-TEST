import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UsageRecord, UsageStatistics, DailyUsageSummary } from '../interfaces/usage-tracking.interface';
import { AIProviderType } from '../enums/ai-provider.enum';
import { AITaskType } from '../enums/task-type.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';

/**
 * Usage Tracking Repository
 * Handles all database operations for AI usage tracking
 */
@Injectable()
export class UsageTrackingRepository {
  private readonly logger = new Logger(UsageTrackingRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new usage record
   */
  async createUsageRecord(record: UsageRecord): Promise<UsageRecord> {
    try {
      const created = await this.prisma.aIUsageTracking.create({
        data: {
          organizationId: record.organizationId,
          userId: record.userId,
          provider: record.provider,
          taskType: record.taskType,
          accuracyLevel: record.accuracyLevel,
          inputTokens: record.inputTokens,
          outputTokens: record.outputTokens,
          totalTokens: record.totalTokens,
          estimatedCost: record.estimatedCost,
          latencyMs: record.latencyMs,
          success: record.success,
          errorMessage: record.errorMessage,
          metadata: record.metadata as any,
        },
      });

      return {
        id: created.id,
        organizationId: created.organizationId,
        userId: created.userId || undefined,
        provider: created.provider as AIProviderType,
        taskType: created.taskType as AITaskType,
        accuracyLevel: created.accuracyLevel as AccuracyLevel,
        inputTokens: created.inputTokens,
        outputTokens: created.outputTokens,
        totalTokens: created.totalTokens,
        estimatedCost: created.estimatedCost,
        latencyMs: created.latencyMs,
        success: created.success,
        errorMessage: created.errorMessage || undefined,
        metadata: created.metadata,
        createdAt: created.createdAt,
      };
    } catch (error) {
      this.logger.error(`Failed to create usage record: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Get usage statistics for an organization
   */
  async getUsageStatistics(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<UsageStatistics> {
    try {
      const records = await this.prisma.aIUsageTracking.findMany({
        where: {
          organizationId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const totalRequests = records.length;
      const successfulRequests = records.filter((r) => r.success).length;
      const failedRequests = totalRequests - successfulRequests;
      const totalTokens = records.reduce((sum, r) => sum + r.totalTokens, 0);
      const totalCost = records.reduce((sum, r) => sum + r.estimatedCost, 0);

      // Breakdown by provider
      const byProvider = records.reduce((acc, record) => {
        const provider = record.provider;
        if (!acc[provider]) {
          acc[provider] = {
            requests: 0,
            tokens: 0,
            cost: 0,
            totalLatency: 0,
            errors: 0,
          };
        }
        acc[provider].requests++;
        acc[provider].tokens += record.totalTokens;
        acc[provider].cost += record.estimatedCost;
        acc[provider].totalLatency += record.latencyMs;
        if (!record.success) acc[provider].errors++;
        return acc;
      }, {} as any);

      // Calculate averages for providers
      Object.keys(byProvider).forEach((provider) => {
        const data = byProvider[provider];
        data.avgLatency = data.totalLatency / data.requests;
        data.errorRate = data.errors / data.requests;
        delete data.totalLatency;
        delete data.errors;
      });

      // Breakdown by task type
      const byTaskType = records.reduce((acc, record) => {
        const taskType = record.taskType;
        if (!acc[taskType]) {
          acc[taskType] = { requests: 0, tokens: 0, cost: 0 };
        }
        acc[taskType].requests++;
        acc[taskType].tokens += record.totalTokens;
        acc[taskType].cost += record.estimatedCost;
        return acc;
      }, {} as any);

      // Breakdown by accuracy
      const byAccuracy = records.reduce((acc, record) => {
        const accuracy = record.accuracyLevel;
        if (!acc[accuracy]) {
          acc[accuracy] = { requests: 0, tokens: 0, cost: 0 };
        }
        acc[accuracy].requests++;
        acc[accuracy].tokens += record.totalTokens;
        acc[accuracy].cost += record.estimatedCost;
        return acc;
      }, {} as any);

      // Top users (if userId is present)
      const userStats = records
        .filter((r) => r.userId)
        .reduce((acc, record) => {
          const userId = record.userId!;
          if (!acc[userId]) {
            acc[userId] = { userId, requests: 0, tokens: 0, cost: 0 };
          }
          acc[userId].requests++;
          acc[userId].tokens += record.totalTokens;
          acc[userId].cost += record.estimatedCost;
          return acc;
        }, {} as any);

      const topUsers = Object.values(userStats)
        .sort((a: any, b: any) => b.tokens - a.tokens)
        .slice(0, 10) as any[];

      return {
        organizationId,
        period: { start: startDate, end: endDate },
        totalRequests,
        successfulRequests,
        failedRequests,
        totalTokens,
        totalCost,
        byProvider,
        byTaskType,
        byAccuracy,
        topUsers: topUsers.length > 0 ? topUsers : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to get usage statistics: ${(error as any).message}`, (error as any).stack);
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
      success?: boolean;
    },
    limit: number = 100,
    offset: number = 0,
  ): Promise<UsageRecord[]> {
    try {
      const where: any = { organizationId };

      if (filters?.startDate || filters?.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
      }

      if (filters?.provider) where.provider = filters.provider;
      if (filters?.taskType) where.taskType = filters.taskType;
      if (filters?.userId) where.userId = filters.userId;
      if (filters?.success !== undefined) where.success = filters.success;

      const records = await this.prisma.aIUsageTracking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      return records.map((r) => ({
        id: r.id,
        organizationId: r.organizationId,
        userId: r.userId || undefined,
        provider: r.provider as AIProviderType,
        taskType: r.taskType as AITaskType,
        accuracyLevel: r.accuracyLevel as AccuracyLevel,
        inputTokens: r.inputTokens,
        outputTokens: r.outputTokens,
        totalTokens: r.totalTokens,
        estimatedCost: r.estimatedCost,
        latencyMs: r.latencyMs,
        success: r.success,
        errorMessage: r.errorMessage || undefined,
        metadata: r.metadata,
        createdAt: r.createdAt,
      }));
    } catch (error) {
      this.logger.error(`Failed to get usage records: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Get daily usage summary
   */
  async getDailyUsageSummary(
    organizationId: string,
    date: Date,
  ): Promise<DailyUsageSummary | null> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const records = await this.prisma.aIUsageTracking.findMany({
        where: {
          organizationId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (records.length === 0) return null;

      const totalRequests = records.length;
      const successfulRequests = records.filter((r) => r.success).length;
      const totalTokens = records.reduce((sum, r) => sum + r.totalTokens, 0);
      const totalCost = records.reduce((sum, r) => sum + r.estimatedCost, 0);
      const avgLatencyMs =
        records.reduce((sum, r) => sum + r.latencyMs, 0) / totalRequests;
      const successRate = successfulRequests / totalRequests;

      return {
        date: startOfDay,
        organizationId,
        totalRequests,
        totalTokens,
        totalCost,
        successRate,
        avgLatencyMs,
      };
    } catch (error) {
      this.logger.error(`Failed to get daily usage summary: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Delete old usage records (for data retention)
   */
  async deleteOldRecords(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this.prisma.aIUsageTracking.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log(`Deleted ${result.count} old usage records`);
      return result.count;
    } catch (error) {
      this.logger.error(`Failed to delete old records: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }
}
