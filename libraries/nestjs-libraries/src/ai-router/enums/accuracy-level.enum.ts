/**
 * AI Accuracy Level Enum
 *
 * Defines the quality/accuracy level for AI responses.
 * Higher accuracy levels use more capable (and expensive) models.
 */
export enum AccuracyLevel {
  /**
   * Standard quality - Fast and cost-effective
   * - Use for: autocomplete, simple rewrites
   * - Provider preference: GLM-4.7 > OpenAI GPT-3.5
   */
  STANDARD = 'STANDARD',

  /**
   * High quality - Balanced performance and accuracy
   * - Use for: caption rewrites, content refinement
   * - Provider preference: OpenAI GPT-4o-mini > GLM-4.7
   */
  HIGH = 'HIGH',

  /**
   * Premium quality - Best available models
   * - Use for: post generation, creative content
   * - Provider preference: OpenAI GPT-4.1 (always)
   */
  PREMIUM = 'PREMIUM',
}

/**
 * Accuracy Level Cost Multipliers
 * Used for cost estimation and quota tracking
 */
export const ACCURACY_COST_MULTIPLIER = {
  [AccuracyLevel.STANDARD]: 1.0,
  [AccuracyLevel.HIGH]: 2.5,
  [AccuracyLevel.PREMIUM]: 10.0,
} as const;
