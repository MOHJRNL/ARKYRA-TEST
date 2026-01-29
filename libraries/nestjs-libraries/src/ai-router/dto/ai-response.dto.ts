import { AIProviderType } from '../enums/ai-provider.enum';
import { AITaskType } from '../enums/task-type.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';

/**
 * AI Response DTO
 * Standardized response from AI router
 */
export class AIResponseDto {
  /** Generated content */
  content: string;

  /** Provider that handled the request */
  provider: AIProviderType;

  /** Task type */
  taskType: AITaskType;

  /** Accuracy level used */
  accuracyLevel: AccuracyLevel;

  /** Usage metrics */
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedCost: number;
  };

  /** Performance metrics */
  performance: {
    latencyMs: number;
    model?: string;
    isFallback: boolean;
  };

  /** Request metadata */
  metadata?: {
    organizationId: string;
    userId?: string;
    requestId?: string;
    timestamp: Date;
  };

  /** Success status */
  success: boolean;

  /** Error details if failed */
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

/**
 * Image Generation Response DTO
 */
export class ImageGenerationResponseDto {
  /** Image URL or base64 data */
  image: string;

  /** Provider used */
  provider: AIProviderType;

  /** Format (url or base64) */
  format: 'url' | 'base64';

  /** Cost information */
  cost: {
    estimatedCost: number;
    currency: string;
  };

  /** Performance */
  performance: {
    latencyMs: number;
    model: string;
  };

  /** Success status */
  success: boolean;

  error?: string;
}

/**
 * Bulk Response DTO
 */
export class BulkAIResponseDto {
  /** All responses */
  responses: AIResponseDto[];

  /** Summary */
  summary: {
    total: number;
    successful: number;
    failed: number;
    totalTokens: number;
    totalCost: number;
    avgLatencyMs: number;
  };

  /** Errors encountered */
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

/**
 * Router Health Response DTO
 */
export class RouterHealthResponseDto {
  /** Overall health status */
  healthy: boolean;

  /** Provider statuses */
  providers: Array<{
    provider: AIProviderType;
    healthy: boolean;
    latencyMs: number;
    lastChecked: Date;
    errorMessage?: string;
  }>;

  /** System info */
  system: {
    uptime: number;
    version: string;
    timestamp: Date;
  };
}
