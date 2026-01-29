/**
 * AI Task Type Enum
 *
 * Defines the different types of AI tasks that can be processed through the router.
 * Each task type has different accuracy requirements and cost implications.
 */
export enum AITaskType {
  /**
   * Real-time text autocomplete/suggestions
   * - Low latency required
   * - High frequency
   * - Standard accuracy acceptable
   */
  AUTOCOMPLETE = 'AUTOCOMPLETE',

  /**
   * Caption refinement and rewriting
   * - Moderate latency acceptable
   * - Medium frequency
   * - High accuracy preferred
   */
  CAPTION_REWRITE = 'CAPTION_REWRITE',

  /**
   * Full social media post generation
   * - Higher latency acceptable
   * - Medium frequency
   * - Premium accuracy required
   */
  POST_GENERATION = 'POST_GENERATION',

  /**
   * Image generation (DALL-E 3, etc.)
   * - High latency acceptable
   * - Lower frequency
   * - Premium quality required
   */
  IMAGE_GENERATION = 'IMAGE_GENERATION',

  /**
   * Video generation from text/images
   * - Very high latency acceptable
   * - Lowest frequency
   * - Premium quality required
   */
  VIDEO_GENERATION = 'VIDEO_GENERATION',

  /**
   * Generic AI tasks not covered by specific types
   * - Variable requirements
   */
  GENERIC = 'GENERIC',
}

/**
 * Task Type Metadata - Configuration for each task type
 */
export const TASK_TYPE_CONFIG = {
  [AITaskType.AUTOCOMPLETE]: {
    maxLatencyMs: 1000,
    defaultAccuracy: 'STANDARD',
    cacheable: true,
    priority: 'high',
  },
  [AITaskType.CAPTION_REWRITE]: {
    maxLatencyMs: 3000,
    defaultAccuracy: 'HIGH',
    cacheable: true,
    priority: 'medium',
  },
  [AITaskType.POST_GENERATION]: {
    maxLatencyMs: 10000,
    defaultAccuracy: 'PREMIUM',
    cacheable: false,
    priority: 'medium',
  },
  [AITaskType.IMAGE_GENERATION]: {
    maxLatencyMs: 30000,
    defaultAccuracy: 'PREMIUM',
    cacheable: true,
    priority: 'low',
  },
  [AITaskType.VIDEO_GENERATION]: {
    maxLatencyMs: 120000,
    defaultAccuracy: 'PREMIUM',
    cacheable: false,
    priority: 'low',
  },
  [AITaskType.GENERIC]: {
    maxLatencyMs: 5000,
    defaultAccuracy: 'STANDARD',
    cacheable: false,
    priority: 'medium',
  },
} as const;
