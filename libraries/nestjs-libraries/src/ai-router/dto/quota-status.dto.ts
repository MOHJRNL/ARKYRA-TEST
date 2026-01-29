import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SubscriptionTier } from '../interfaces/quota.interface';

/**
 * Quota Status Response DTO
 */
export class QuotaStatusDto {
  organizationId: string;

  tier: SubscriptionTier;

  openai: {
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
    requestCount: number;
  };

  glm: {
    limit: number;
    used: number;
    remaining: number;
    percentage: number;
    requestCount: number;
  };

  reset: {
    lastResetAt: Date;
    nextResetAt: Date;
    daysUntilReset: number;
    hoursUntilReset: number;
  };

  alerts: {
    softLimitReached: boolean;
    hardLimitReached: boolean;
    message?: string;
    recommendations?: string[];
  };

  metadata?: {
    isTrialing?: boolean;
    trialEndsAt?: Date;
    canUpgrade?: boolean;
    nextTier?: SubscriptionTier;
  };
}

/**
 * Update Quota Request DTO
 */
export class UpdateQuotaDto {
  @IsString()
  organizationId: string;

  @IsEnum(SubscriptionTier)
  @IsOptional()
  newTier?: SubscriptionTier;

  @IsNumber()
  @IsOptional()
  openaiTokenLimit?: number;

  @IsNumber()
  @IsOptional()
  glmTokenLimit?: number;

  @IsOptional()
  resetQuota?: boolean;
}

/**
 * Quota Alert DTO
 */
export class QuotaAlertDto {
  organizationId: string;

  alertType: 'soft_limit' | 'hard_limit' | 'reset' | 'upgrade';

  message: string;

  details: {
    provider?: string;
    usagePercentage?: number;
    remainingTokens?: number;
    nextResetAt?: Date;
  };

  timestamp: Date;

  recommendations?: string[];
}

/**
 * Quota Upgrade Request DTO
 */
export class QuotaUpgradeRequestDto {
  @IsString()
  organizationId: string;

  @IsEnum(SubscriptionTier)
  targetTier: SubscriptionTier;

  @IsOptional()
  reason?: string;

  @IsOptional()
  requestedBy?: string;
}

/**
 * Quota Check Response DTO
 */
export class QuotaCheckResponseDto {
  allowed: boolean;

  provider?: string;

  reason?: string;

  remainingTokens?: number;

  alternativeProvider?: string;

  wouldTriggerAlert?: boolean;

  estimatedCost?: number;

  quotaStatus?: {
    usage: number;
    limit: number;
    percentage: number;
  };
}
