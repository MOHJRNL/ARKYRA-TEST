import { AIProviderType } from '../enums/ai-provider.enum';
import { AITaskType } from '../enums/task-type.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';

/**
 * Usage Record
 * Single usage tracking record
 */
export interface UsageRecord {
  /** Unique ID */
  id?: string;

  /** Organization ID */
  organizationId: string;

  /** User ID (optional) */
  userId?: string;

  /** Provider used */
  provider: AIProviderType;

  /** Task type */
  taskType: AITaskType;

  /** Accuracy level */
  accuracyLevel: AccuracyLevel;

  /** Input tokens */
  inputTokens: number;

  /** Output tokens */
  outputTokens: number;

  /** Total tokens */
  totalTokens: number;

  /** Estimated cost in USD */
  estimatedCost: number;

  /** Latency in milliseconds */
  latencyMs: number;

  /** Success status */
  success: boolean;

  /** Error message if failed */
  errorMessage?: string;

  /** Additional metadata */
  metadata?: any;

  /** Timestamp */
  createdAt?: Date;
}

/**
 * Usage Statistics
 * Aggregated usage statistics
 */
export interface UsageStatistics {
  /** Organization ID */
  organizationId: string;

  /** Time period */
  period: {
    start: Date;
    end: Date;
  };

  /** Total requests */
  totalRequests: number;

  /** Successful requests */
  successfulRequests: number;

  /** Failed requests */
  failedRequests: number;

  /** Total tokens used */
  totalTokens: number;

  /** Total cost in USD */
  totalCost: number;

  /** Breakdown by provider */
  byProvider: {
    [provider: string]: {
      requests: number;
      tokens: number;
      cost: number;
      avgLatency: number;
      errorRate: number;
    };
  };

  /** Breakdown by task type */
  byTaskType: {
    [taskType: string]: {
      requests: number;
      tokens: number;
      cost: number;
    };
  };

  /** Breakdown by accuracy level */
  byAccuracy: {
    [accuracy: string]: {
      requests: number;
      tokens: number;
      cost: number;
    };
  };

  /** Top users by usage */
  topUsers?: Array<{
    userId: string;
    requests: number;
    tokens: number;
    cost: number;
  }>;
}

/**
 * Daily Usage Summary
 */
export interface DailyUsageSummary {
  date: Date;
  organizationId: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  successRate: number;
  avgLatencyMs: number;
}

/**
 * Cost Breakdown
 */
export interface CostBreakdown {
  /** Total cost */
  total: number;

  /** Cost by provider */
  byProvider: {
    [provider: string]: number;
  };

  /** Cost by task type */
  byTaskType: {
    [taskType: string]: number;
  };

  /** Cost by user (if available) */
  byUser?: {
    [userId: string]: number;
  };

  /** Projected monthly cost */
  projectedMonthlyCost: number;

  /** Cost trend (compared to previous period) */
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}
