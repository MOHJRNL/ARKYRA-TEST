import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { AIProviderType } from '../enums/ai-provider.enum';
import { AITaskType } from '../enums/task-type.enum';

/**
 * Usage Query DTO
 * Parameters for querying usage statistics
 */
export class UsageQueryDto {
  @IsString()
  organizationId: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(AIProviderType)
  @IsOptional()
  provider?: AIProviderType;

  @IsEnum(AITaskType)
  @IsOptional()
  taskType?: AITaskType;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsOptional()
  groupBy?: 'day' | 'week' | 'month' | 'provider' | 'task' | 'user';
}

/**
 * Usage Statistics Response DTO
 */
export class UsageStatsResponseDto {
  organizationId: string;

  period: {
    start: Date;
    end: Date;
  };

  summary: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    successRate: number;
    totalTokens: number;
    totalCost: number;
    avgLatencyMs: number;
  };

  byProvider: Record<
    string,
    {
      requests: number;
      tokens: number;
      cost: number;
      avgLatency: number;
      errorRate: number;
    }
  >;

  byTaskType: Record<
    string,
    {
      requests: number;
      tokens: number;
      cost: number;
    }
  >;

  byAccuracy: Record<
    string,
    {
      requests: number;
      tokens: number;
      cost: number;
    }
  >;

  trends?: {
    requestsChange: number;
    costChange: number;
    direction: 'up' | 'down' | 'stable';
  };

  topUsers?: Array<{
    userId: string;
    requests: number;
    tokens: number;
    cost: number;
  }>;

  timeline?: Array<{
    date: Date;
    requests: number;
    tokens: number;
    cost: number;
  }>;
}

/**
 * Cost Report DTO
 */
export class CostReportDto {
  organizationId: string;

  period: {
    start: Date;
    end: Date;
  };

  totalCost: number;

  breakdown: {
    byProvider: Record<string, number>;
    byTaskType: Record<string, number>;
    byUser?: Record<string, number>;
  };

  projections: {
    dailyAverage: number;
    monthlyProjected: number;
    yearlyProjected: number;
  };

  comparison: {
    previousPeriod: number;
    change: number;
    changePercent: number;
  };

  recommendations?: string[];
}

/**
 * Export Usage Request DTO
 */
export class ExportUsageDto {
  @IsString()
  organizationId: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(['csv', 'json', 'xlsx'])
  @IsOptional()
  format?: 'csv' | 'json' | 'xlsx' = 'csv';

  @IsOptional()
  includeDetails?: boolean = false;
}
