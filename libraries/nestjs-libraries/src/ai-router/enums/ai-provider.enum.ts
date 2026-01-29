/**
 * AI Provider Type Enum
 *
 * Defines the available AI providers in the hybrid system.
 * Each provider has different capabilities, pricing, and performance characteristics.
 */
export enum AIProviderType {
  /**
   * OpenAI (GPT-4.1, GPT-4o-mini, DALL-E 3)
   * - Strengths: Best accuracy, proven reliability
   * - Weaknesses: Higher cost, rate limits
   * - Use cases: Premium tasks, fallback for critical operations
   */
  OPENAI = 'OPENAI',

  /**
   * GLM-4.7 (Zhipu AI)
   * - Strengths: Cost-effective, good performance
   * - Weaknesses: Less proven, potential localization
   * - Use cases: Standard tasks, high-volume operations
   */
  GLM_4_7 = 'GLM_4_7',

  /**
   * Claude (Anthropic)
   * - Strengths: Strong reasoning, long context, safe outputs
   * - Weaknesses: Higher cost than GLM, API rate limits
   * - Use cases: Complex reasoning, content analysis, long documents
   */
  CLAUDE = 'CLAUDE',

  /**
   * Mistral AI
   * - Strengths: Good balance of quality and cost, fast inference
   * - Weaknesses: Newer provider, less proven
   * - Use cases: General purpose, multilingual tasks
   */
  MISTRAL = 'MISTRAL',
}

/**
 * Provider Configuration
 * Base settings and capabilities for each provider
 */
export const PROVIDER_CONFIG = {
  [AIProviderType.OPENAI]: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: {
      premium: 'gpt-4.1',
      high: 'gpt-4o-mini',
      standard: 'gpt-3.5-turbo',
      image: 'dall-e-3',
    },
    maxRetries: 3,
    timeout: 30000,
    supportsStreaming: true,
    supportsImageGeneration: true,
    supportsVision: true,
  },
  [AIProviderType.GLM_4_7]: {
    name: 'GLM-4.7',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: {
      premium: 'glm-4-flash',
      high: 'glm-4-flash',
      standard: 'glm-4-flash',
    },
    maxRetries: 2,
    timeout: 20000,
    supportsStreaming: true,
    supportsImageGeneration: false,
    supportsVision: false,
  },
  [AIProviderType.CLAUDE]: {
    name: 'Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    models: {
      premium: 'claude-opus-4-5-20250514',
      high: 'claude-sonnet-4-5-20250514',
      standard: 'claude-haiku-3-5-20241022',
    },
    maxRetries: 3,
    timeout: 45000,
    supportsStreaming: true,
    supportsImageGeneration: false,
    supportsVision: true,
  },
  [AIProviderType.MISTRAL]: {
    name: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    models: {
      premium: 'mistral-large-latest',
      high: 'mistral-medium-latest',
      standard: 'mistral-small-latest',
    },
    maxRetries: 2,
    timeout: 30000,
    supportsStreaming: true,
    supportsImageGeneration: false,
    supportsVision: false,
  },
} as const;

/**
 * Provider Health Check Intervals
 */
export const HEALTH_CHECK_INTERVAL_MS = 60000; // 1 minute
export const HEALTH_CHECK_TIMEOUT_MS = 5000; // 5 seconds
