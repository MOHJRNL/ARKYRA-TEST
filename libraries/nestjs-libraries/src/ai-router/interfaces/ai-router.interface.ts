import { AIProviderType } from '../enums/ai-provider.enum';
import { AITaskType } from '../enums/task-type.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';

/**
 * Router Decision
 * Contains the routing decision made by the decision service
 */
export interface RouterDecision {
  /** Selected provider for this request */
  provider: AIProviderType;

  /** Fallback provider if primary fails */
  fallbackProvider: AIProviderType;

  /** Reason for the routing decision */
  reason: string;

  /** Confidence score (0.0 - 1.0) */
  confidence: number;

  /** Estimated cost for this request */
  estimatedCost: number;

  /** Expected latency in milliseconds */
  expectedLatencyMs: number;

  /** Whether quota allows this request */
  quotaAvailable: boolean;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Routing Context
 * Information used to make routing decisions
 */
export interface RoutingContext {
  /** Type of task being performed */
  taskType: AITaskType;

  /** Required accuracy level */
  accuracyLevel: AccuracyLevel;

  /** Organization ID for quota checking */
  organizationId: string;

  /** User ID for tracking */
  userId?: string;

  /** Whether this request is time-sensitive */
  isUrgent?: boolean;

  /** Maximum acceptable latency in milliseconds */
  maxLatencyMs?: number;

  /** Whether to prefer cost optimization */
  preferLowCost?: boolean;

  /** Provider preference (if any) */
  preferredProvider?: AIProviderType;
}

/**
 * Routing Strategy
 */
export enum RoutingStrategy {
  /** Cost-optimized: Prefer cheaper providers */
  COST_OPTIMIZED = 'COST_OPTIMIZED',

  /** Performance-optimized: Prefer faster providers */
  PERFORMANCE_OPTIMIZED = 'PERFORMANCE_OPTIMIZED',

  /** Quality-optimized: Prefer more accurate providers */
  QUALITY_OPTIMIZED = 'QUALITY_OPTIMIZED',

  /** Balanced: Balance all factors */
  BALANCED = 'BALANCED',

  /** Load-balanced: Distribute load across providers */
  LOAD_BALANCED = 'LOAD_BALANCED',
}

/**
 * Routing Matrix
 * Defines which provider to use for each task type and accuracy level
 */
export interface RoutingMatrix {
  [taskType: string]: {
    [accuracyLevel: string]: {
      primary: AIProviderType;
      fallback: AIProviderType;
      conditions?: RoutingCondition[];
    };
  };
}

/**
 * Routing Condition
 * Conditions that affect routing decisions
 */
export interface RoutingCondition {
  /** Condition type */
  type: 'quota' | 'health' | 'latency' | 'cost' | 'custom';

  /** Condition check function */
  check: (context: RoutingContext) => boolean | Promise<boolean>;

  /** Action if condition is true */
  action: 'use_fallback' | 'reject' | 'wait' | 'custom';

  /** Optional custom action handler */
  handler?: (context: RoutingContext) => any;
}

/**
 * Fallback Strategy
 */
export interface FallbackStrategy {
  /** Maximum number of fallback attempts */
  maxAttempts: number;

  /** Delay between attempts in milliseconds */
  retryDelayMs: number;

  /** Whether to use exponential backoff */
  useExponentialBackoff: boolean;

  /** List of providers to try in order */
  providerOrder: AIProviderType[];

  /** Whether to degrade accuracy if needed */
  allowAccuracyDegradation: boolean;
}
