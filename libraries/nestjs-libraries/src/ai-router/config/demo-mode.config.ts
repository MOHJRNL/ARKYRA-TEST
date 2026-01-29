/**
 * Demo Mode Configuration
 *
 * Enables ARKYRA to run without API keys by providing mock responses
 * for all AI features. This allows developers to test and explore the
 * platform without requiring paid API accounts.
 */

export const DEMO_MODE_ENABLED = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-proj-';

/**
 * Demo response templates for different AI operations
 */
export const DEMO_RESPONSES = {
  // Text completion responses
  completion: {
    postGeneration: `🚀 Welcome to ARKYRA!

This is a demo AI response. ARKYRA is running in demo mode because no OpenAI API key is configured.

To enable real AI features, add your API key to the .env file:
OPENAI_API_KEY=your-key-here

Demo mode allows you to explore the full platform interface without any API costs!`,

    contentAnalysis: `Demo Analysis:
- This is sample content analysis
- All features are functional in demo mode
- Real AI responses will be more detailed and accurate
- Configure API keys to unlock full AI capabilities`,

    social_media_post: `🎉 Exciting news! Just launched our new feature!

Check it out and let us know what you think.

#Demo #ARKYRA #SocialMedia`,

    thread: [
      "1/ This is a demo thread response from ARKYRA's AI system",
      "2/ In demo mode, we provide sample content to help you explore the platform",
      "3/ Add your OpenAI API key to unlock real AI-powered content generation"
    ],
  },

  // Image generation responses
  imageUrl: 'https://via.placeholder.com/1024x1024/4F46E5/ffffff?text=ARKYRA+Demo+Image',
  imageUrlVertical: 'https://via.placeholder.com/1024x1792/4F46E5/ffffff?text=ARKYRA+Demo',

  // Voice/Audio responses
  voice: "This is a demo voice transcription. In production mode with configured API keys, this would be an actual AI-generated voice.",

  // Image prompt generation
  imagePrompt: "A stunning professional photograph of a modern workspace, with soft natural lighting from large windows, minimalist design, clean lines, captured with a high-end DSLR camera, shallow depth of field, photorealistic, 8k quality",

  // Slide generation
  slides: [
    {
      imagePrompt: "Professional business presentation background with dark gradient overlay, modern corporate aesthetic, high quality",
      voiceText: "Welcome to this presentation. Today we'll explore exciting new possibilities."
    },
    {
      imagePrompt: "Technology and innovation concept image with futuristic elements and dark gradient, professional quality",
      voiceText: "Our platform offers powerful features designed to enhance your workflow."
    },
    {
      imagePrompt: "Success and growth visualization with upward trending elements, dark gradient overlay, business professional",
      voiceText: "Join thousands of users who are already experiencing the benefits."
    }
  ],

  // Post separation/thread creation
  posts: [
    { post: "Breaking a long post into digestible chunks is an art. Here's the first part." },
    { post: "We ensure each segment maintains context and flow while staying within character limits." },
    { post: "This demo shows how your content would be intelligently split. Add API keys for real AI processing!" }
  ],
};

/**
 * Demo mode pricing (zero cost)
 */
export const DEMO_PRICING = {
  inputCost: 0,
  outputCost: 0,
  perImage: 0,
  currency: 'USD',
};

/**
 * Demo mode performance metrics
 */
export const DEMO_PERFORMANCE = {
  latencyMs: 150, // Simulate realistic latency
  model: 'demo-mode',
  isFallback: false,
};

/**
 * Check if demo mode is active
 */
export function isDemoMode(): boolean {
  return DEMO_MODE_ENABLED;
}

/**
 * Get demo mode status message
 */
export function getDemoModeMessage(): string {
  return isDemoMode()
    ? '🔧 AI Router running in DEMO MODE (no API keys configured). All AI responses are simulated.'
    : '✅ AI Router running in PRODUCTION MODE with configured API keys.';
}

/**
 * Log demo mode warning
 */
export function logDemoModeWarning(logger: any, operation: string): void {
  if (isDemoMode()) {
    logger.warn(`${operation} executed in DEMO MODE - returning mock data. Configure OPENAI_API_KEY for real AI responses.`);
  }
}
