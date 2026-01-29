import { AIProviderType } from '../enums/ai-provider.enum';
import { AccuracyLevel } from '../enums/accuracy-level.enum';

/**
 * AI Provider Request
 * Unified request format for all AI providers
 */
export interface AIProviderRequest {
  /** User prompt or input text */
  prompt: string;

  /** Desired accuracy level */
  accuracyLevel: AccuracyLevel;

  /** Maximum tokens in response */
  maxTokens?: number;

  /** Temperature for response creativity (0.0 - 1.0) */
  temperature?: number;

  /** System message/instructions */
  systemMessage?: string;

  /** Additional provider-specific options */
  options?: Record<string, any>;

  /** User ID for tracking */
  userId?: string;

  /** Organization ID for quota tracking */
  organizationId: string;
}

/**
 * AI Provider Response
 * Unified response format from all AI providers
 */
export interface AIProviderResponse {
  /** Generated content */
  content: string;

  /** Provider that handled the request */
  provider: AIProviderType;

  /** Tokens used in input */
  inputTokens: number;

  /** Tokens generated in output */
  outputTokens: number;

  /** Total tokens used */
  totalTokens: number;

  /** Estimated cost in USD */
  estimatedCost: number;

  /** Response latency in milliseconds */
  latencyMs: number;

  /** Whether the request was successful */
  success: boolean;

  /** Error message if failed */
  error?: string;

  /** Additional metadata */
  metadata?: Record<string, any>;

  /** Whether this was a fallback response */
  isFallback?: boolean;

  /** Model used for generation */
  model?: string;
}

/**
 * AI Provider Interface
 * Contract that all provider adapters must implement
 */
export interface IAIProvider {
  /**
   * Get the provider type
   */
  getProviderType(): AIProviderType;

  /**
   * Check if provider is available and healthy
   */
  isHealthy(): Promise<boolean>;

  /**
   * Generate text completion
   */
  generateCompletion(request: AIProviderRequest): Promise<AIProviderResponse>;

  /**
   * Generate image (if supported)
   */
  generateImage?(prompt: string, options?: any): Promise<string>;

  /**
   * Estimate cost for a request before execution
   */
  estimateCost(inputTokens: number, outputTokens: number, accuracyLevel: AccuracyLevel): number;

  /**
   * Get current provider metrics
   */
  getMetrics(): ProviderMetrics;
}

/**
 * Provider Metrics
 * Performance and health metrics for a provider
 */
export interface ProviderMetrics {
  /** Provider identifier */
  provider: AIProviderType;

  /** Is provider currently healthy */
  isHealthy: boolean;

  /** Average latency in milliseconds */
  avgLatencyMs: number;

  /** Error rate (0.0 - 1.0) */
  errorRate: number;

  /** Total requests processed */
  totalRequests: number;

  /** Successful requests */
  successfulRequests: number;

  /** Failed requests */
  failedRequests: number;

  /** Last health check timestamp */
  lastHealthCheck: Date;

  /** Last error message */
  lastError?: string;
}

/**
 * Provider Health Status
 */
export interface ProviderHealthStatus {
  provider: AIProviderType;
  isHealthy: boolean;
  latencyMs: number;
  lastChecked: Date;
  errorMessage?: string;
}
