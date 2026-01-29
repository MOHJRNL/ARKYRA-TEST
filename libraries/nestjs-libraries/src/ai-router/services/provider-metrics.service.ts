import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProviderMetricsRepository } from '../repositories/provider-metrics.repository';
import { UsageTrackingRepository } from '../repositories/usage-tracking.repository';
import { AIProviderType } from '../enums/ai-provider.enum';

/**
 * Provider Metrics Service
 * Aggregates and tracks performance metrics for AI providers
 */
@Injectable()
export class ProviderMetricsService {
  private readonly logger = new Logger(ProviderMetricsService.name);

  constructor(
    private readonly metricsRepository: ProviderMetricsRepository,
    private readonly usageRepository: UsageTrackingRepository,
  ) {}

  /**
   * Calculate and store daily metrics
   * Runs daily at midnight
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateDailyMetrics(): Promise<void> {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      this.logger.log(`Calculating daily metrics for ${yesterday.toISOString()}`);

      // Calculate metrics for each provider
      await Promise.all([
        this.calculateProviderDailyMetrics(AIProviderType.OPENAI, yesterday),
        this.calculateProviderDailyMetrics(AIProviderType.GLM_4_7, yesterday),
      ]);

      this.logger.log('Daily metrics calculation completed');
    } catch (error) {
      this.logger.error(
        `Failed to calculate daily metrics: ${(error as any).message}`,
        (error as any).stack,
      );
    }
  }

  /**
   * Calculate metrics for a specific provider and date
   */
  private async calculateProviderDailyMetrics(
    provider: AIProviderType,
    date: Date,
  ): Promise<void> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get all usage records for this provider on this date
      const records = await this.usageRepository.getUsageRecords(
        'system', // We want all organizations
        {
          startDate: startOfDay,
          endDate: endOfDay,
          provider,
        },
        10000, // High limit to get all records
      );

      if (records.length === 0) {
        this.logger.debug(`No records found for ${provider} on ${date.toISOString()}`);
        return;
      }

      // Calculate metrics
      const totalRequests = records.length;
      const successfulRequests = records.filter((r) => r.success).length;
      const failedRequests = totalRequests - successfulRequests;

      const latencies = records.map((r) => r.latencyMs);
      const avgLatencyMs =
        latencies.reduce((sum, l) => sum + l, 0) / latencies.length;

      // Calculate percentiles
      const sortedLatencies = [...latencies].sort((a, b) => a - b);
      const p95Index = Math.floor(sortedLatencies.length * 0.95);
      const p99Index = Math.floor(sortedLatencies.length * 0.99);
      const p95LatencyMs = sortedLatencies[p95Index] || avgLatencyMs;
      const p99LatencyMs = sortedLatencies[p99Index] || avgLatencyMs;

      const totalTokensUsed = records.reduce((sum, r) => sum + r.totalTokens, 0);
      const totalCost = records.reduce((sum, r) => sum + r.estimatedCost, 0);

      const errorRate = failedRequests / totalRequests;
      const availabilityRate = successfulRequests / totalRequests;

      // Store metrics
      await this.metricsRepository.updateDailyMetrics(provider, date, {
        totalRequests,
        successfulRequests,
        failedRequests,
        avgLatencyMs,
        p95LatencyMs,
        p99LatencyMs,
        totalTokensUsed,
        totalCost,
        errorRate,
        availabilityRate,
      });

      this.logger.debug(
        `Stored metrics for ${provider}: ${totalRequests} requests, ${avgLatencyMs.toFixed(2)}ms avg latency`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to calculate metrics for ${provider}: ${(error as any).message}`,
        (error as any).stack,
      );
    }
  }

  /**
   * Get provider metrics for date range
   */
  async getProviderMetrics(
    provider: AIProviderType,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    try {
      return await this.metricsRepository.getMetrics(
        provider,
        startDate,
        endDate,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get provider metrics: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Get latest metrics for all providers
   */
  async getLatestMetrics(): Promise<Record<string, any>> {
    try {
      const [openaiMetrics, glmMetrics] = await Promise.all([
        this.metricsRepository.getLatestMetrics(AIProviderType.OPENAI),
        this.metricsRepository.getLatestMetrics(AIProviderType.GLM_4_7),
      ]);

      return {
        [AIProviderType.OPENAI]: openaiMetrics,
        [AIProviderType.GLM_4_7]: glmMetrics,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get latest metrics: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Get comparative metrics for all providers
   */
  async getComparativeMetrics(
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    try {
      return await this.metricsRepository.getAggregatedMetrics(
        startDate,
        endDate,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get comparative metrics: ${(error as any).message}`,
        (error as any).stack,
      );
      throw error;
    }
  }

  /**
   * Cleanup old metrics
   * Runs weekly
   */
  @Cron(CronExpression.EVERY_WEEK)
  async cleanupOldMetrics(): Promise<void> {
    try {
      this.logger.log('Cleaning up old metrics...');

      const deleted = await this.metricsRepository.deleteOldMetrics(90);

      this.logger.log(`Cleaned up ${deleted} old metric records`);
    } catch (error) {
      this.logger.error(
        `Failed to cleanup old metrics: ${(error as any).message}`,
        (error as any).stack,
      );
    }
  }
}
