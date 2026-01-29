import { IsString, IsEnum, IsOptional, IsNumber, Min, Max, IsObject, IsBoolean } from 'class-validator';
import { AITaskType } from '../enums/task-type.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';
import { AIProviderType } from '../enums/ai-provider.enum';

/**
 * AI Request DTO
 * Validated input for AI router requests
 */
export class AIRequestDto {
  @IsString()
  prompt: string;

  @IsEnum(AITaskType)
  taskType: AITaskType;

  @IsEnum(AccuracyLevel)
  @IsOptional()
  accuracyLevel?: AccuracyLevel = AccuracyLevel.STANDARD;

  @IsString()
  organizationId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @Min(1)
  @Max(4000)
  @IsOptional()
  maxTokens?: number = 500;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  temperature?: number = 0.7;

  @IsString()
  @IsOptional()
  systemMessage?: string;

  @IsEnum(AIProviderType)
  @IsOptional()
  preferredProvider?: AIProviderType;

  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean = false;

  @IsNumber()
  @IsOptional()
  maxLatencyMs?: number;

  @IsBoolean()
  @IsOptional()
  preferLowCost?: boolean = false;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsObject()
  @IsOptional()
  options?: Record<string, any>;
}

/**
 * Image Generation Request DTO
 */
export class ImageGenerationRequestDto {
  @IsString()
  prompt: string;

  @IsString()
  organizationId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsBoolean()
  @IsOptional()
  isUrl?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isVertical?: boolean = false;

  @IsObject()
  @IsOptional()
  options?: Record<string, any>;
}

/**
 * Bulk Request DTO
 * For processing multiple requests in batch
 */
export class BulkAIRequestDto {
  @IsString()
  organizationId: string;

  requests: AIRequestDto[];

  @IsBoolean()
  @IsOptional()
  parallel?: boolean = false;

  @IsNumber()
  @IsOptional()
  maxConcurrent?: number = 5;
}
