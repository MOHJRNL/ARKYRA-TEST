import { AIProviderType } from '../enums/ai-provider.enum';

/**
 * Subscription Tier Type
 * Matches the SubscriptionTier enum from Prisma
 */
export enum SubscriptionTier {
  FREE = 'FREE',
  STANDARD = 'STANDARD',
  PRO = 'PRO',
  TEAM = 'TEAM',
  ULTIMATE = 'ULTIMATE',
}

/**
 * Quota Limits
 * Monthly limits for each subscription tier
 */
export interface QuotaLimits {
  tier: SubscriptionTier;
  openaiTokens: number;
  glmTokens: number;
  maxRequestsPerHour?: number;
  maxRequestsPerDay?: number;
}

/**
 * Quota Status
 * Current quota usage and availability
 */
export interface QuotaStatus {
  /** Organization ID */
  organizationId: string;

  /** Current subscription tier */
  tier: SubscriptionTier;

  /** OpenAI quota */
  openai: {
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
    requestCount: number;
  };

  /** GLM-4.7 quota */
  glm: {
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
    requestCount: number;
  };

  /** Reset information */
  reset: {
    lastResetAt: Date;
    nextResetAt: Date;
    daysUntilReset: number;
    hoursUntilReset: number;
  };

  /** Alerts */
  alerts: {
    softLimitReached: boolean;
    hardLimitReached: boolean;
    message?: string;
  };

  /** Additional info */
  metadata?: {
    isTrialing?: boolean;
    trialEndsAt?: Date;
  };
}

/**
 * Quota Check Result
 * Result of checking if quota allows a request
 */
export interface QuotaCheckResult {
  /** Whether quota is available */
  allowed: boolean;

  /** Provider that has quota available */
  provider?: AIProviderType;

  /** Reason if not allowed */
  reason?: string;

  /** Remaining tokens */
  remainingTokens?: number;

  /** Suggested alternative provider */
  alternativeProvider?: AIProviderType;

  /** Whether this would trigger soft/hard limit */
  wouldTriggerAlert?: boolean;
}

/**
 * Quota Update Request
 */
export interface QuotaUpdateRequest {
  organizationId: string;
  provider: AIProviderType;
  tokensUsed: number;
  requestCount?: number;
}

/**
 * Quota Configuration
 * System-wide quota configuration
 */
export const QUOTA_CONFIG: Record<SubscriptionTier, QuotaLimits> = {
  [SubscriptionTier.FREE]: {
    tier: SubscriptionTier.FREE,
    openaiTokens: 50000, // 50K tokens/month (~$0.75 with GPT-4o-mini)
    glmTokens: 100000, // 100K tokens/month (~$0.10 with GLM-4.7)
    maxRequestsPerHour: 50,
    maxRequestsPerDay: 500,
  },
  [SubscriptionTier.STANDARD]: {
    tier: SubscriptionTier.STANDARD,
    openaiTokens: 500000, // 500K tokens/month (~$7.50)
    glmTokens: 2000000, // 2M tokens/month (~$2.00)
    maxRequestsPerHour: 200,
    maxRequestsPerDay: 3000,
  },
  [SubscriptionTier.PRO]: {
    tier: SubscriptionTier.PRO,
    openaiTokens: 2000000, // 2M tokens/month (~$30)
    glmTokens: 10000000, // 10M tokens/month (~$10)
    maxRequestsPerHour: 1000,
    maxRequestsPerDay: 15000,
  },
  [SubscriptionTier.TEAM]: {
    tier: SubscriptionTier.TEAM,
    openaiTokens: 5000000, // 5M tokens/month (~$75)
    glmTokens: 25000000, // 25M tokens/month (~$25)
    maxRequestsPerHour: 3000,
    maxRequestsPerDay: 50000,
  },
  [SubscriptionTier.ULTIMATE]: {
    tier: SubscriptionTier.ULTIMATE,
    openaiTokens: 20000000, // 20M tokens/month (~$300)
    glmTokens: 100000000, // 100M tokens/month (~$100)
    maxRequestsPerHour: 10000,
    maxRequestsPerDay: 200000,
  },
};

/**
 * Quota Alert Thresholds
 */
export const QUOTA_ALERT_THRESHOLDS = {
  SOFT_LIMIT: 0.8, // 80% usage
  HARD_LIMIT: 0.95, // 95% usage
};
