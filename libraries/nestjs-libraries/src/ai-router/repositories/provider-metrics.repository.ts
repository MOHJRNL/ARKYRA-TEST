import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AIProviderType } from '../enums/ai-provider.enum';

/**
 * Provider Metrics Repository
 * Handles storage and retrieval of provider performance metrics
 */
@Injectable()
export class ProviderMetricsRepository {
  private readonly logger = new Logger(ProviderMetricsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Update daily provider metrics
   */
  async updateDailyMetrics(
    provider: AIProviderType,
    date: Date,
    metrics: {
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      avgLatencyMs: number;
      p95LatencyMs: number;
      p99LatencyMs: number;
      totalTokensUsed: number;
      totalCost: number;
      errorRate: number;
      availabilityRate: number;
    },
  ): Promise<void> {
    try {
      // Normalize date to start of day
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);

      await this.prisma.aIProviderMetrics.upsert({
        where: {
          provider_date: {
            provider,
            date: normalizedDate,
          },
        },
        update: {
          totalRequests: metrics.totalRequests,
          successfulRequests: metrics.successfulRequests,
          failedRequests: metrics.failedRequests,
          avgLatencyMs: metrics.avgLatencyMs,
          p95LatencyMs: metrics.p95LatencyMs,
          p99LatencyMs: metrics.p99LatencyMs,
          totalTokensUsed: metrics.totalTokensUsed,
          totalCost: metrics.totalCost,
          errorRate: metrics.errorRate,
          availabilityRate: metrics.availabilityRate,
          updatedAt: new Date(),
        },
        create: {
          provider,
          date: normalizedDate,
          totalRequests: metrics.totalRequests,
          successfulRequests: metrics.successfulRequests,
          failedRequests: metrics.failedRequests,
          avgLatencyMs: metrics.avgLatencyMs,
          p95LatencyMs: metrics.p95LatencyMs,
          p99LatencyMs: metrics.p99LatencyMs,
          totalTokensUsed: metrics.totalTokensUsed,
          totalCost: metrics.totalCost,
          errorRate: metrics.errorRate,
          availabilityRate: metrics.availabilityRate,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update daily metrics: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Get provider metrics for a date range
   */
  async getMetrics(
    provider: AIProviderType,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    try {
      const metrics = await this.prisma.aIProviderMetrics.findMany({
        where: {
          provider,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      return metrics;
    } catch (error) {
      this.logger.error(`Failed to get metrics: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Get latest metrics for a provider
   */
  async getLatestMetrics(provider: AIProviderType): Promise<any | null> {
    try {
      const metrics = await this.prisma.aIProviderMetrics.findFirst({
        where: { provider },
        orderBy: { date: 'desc' },
      });

      return metrics;
    } catch (error) {
      this.logger.error(`Failed to get latest metrics: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Get aggregated metrics for all providers
   */
  async getAggregatedMetrics(startDate: Date, endDate: Date): Promise<any> {
    try {
      const metrics = await this.prisma.aIProviderMetrics.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const aggregated = metrics.reduce(
        (acc, metric) => {
          const provider = metric.provider;
          if (!acc[provider]) {
            acc[provider] = {
              provider,
              totalRequests: 0,
              successfulRequests: 0,
              failedRequests: 0,
              totalTokensUsed: 0,
              totalCost: 0,
              latencies: [],
            };
          }

          acc[provider].totalRequests += metric.totalRequests;
          acc[provider].successfulRequests += metric.successfulRequests;
          acc[provider].failedRequests += metric.failedRequests;
          acc[provider].totalTokensUsed += metric.totalTokensUsed;
          acc[provider].totalCost += metric.totalCost;
          acc[provider].latencies.push(metric.avgLatencyMs);

          return acc;
        },
        {} as any,
      );

      // Calculate averages
      Object.keys(aggregated).forEach((provider) => {
        const data = aggregated[provider];
        data.avgLatencyMs =
          data.latencies.reduce((sum: number, val: number) => sum + val, 0) /
          data.latencies.length;
        data.errorRate = data.failedRequests / data.totalRequests;
        data.availabilityRate = data.successfulRequests / data.totalRequests;
        delete data.latencies;
      });

      return aggregated;
    } catch (error) {
      this.logger.error(`Failed to get aggregated metrics: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }

  /**
   * Delete old metrics (for data retention)
   */
  async deleteOldMetrics(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await this.prisma.aIProviderMetrics.deleteMany({
        where: {
          date: {
            lt: cutoffDate,
          },
        },
      });

      this.logger.log(`Deleted ${result.count} old metric records`);
      return result.count;
    } catch (error) {
      this.logger.error(`Failed to delete old metrics: ${(error as any).message}`, (error as any).stack);
      throw error;
    }
  }
}
