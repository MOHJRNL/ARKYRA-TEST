# ARKYRA Demo Mode Documentation

## Overview

ARKYRA now supports **Demo Mode**, allowing the platform to run fully functional without requiring any API keys. This enables developers, testers, and evaluators to explore the entire platform interface and workflows without incurring API costs.

## What is Demo Mode?

Demo Mode is automatically activated when no OpenAI API key is configured. In this mode:

- ✅ The platform starts without errors
- ✅ All pages and UI components are accessible
- ✅ AI features return mock/sample responses
- ✅ No API costs are incurred
- ✅ All workflows can be tested
- ✅ Database and core features work normally

## How Demo Mode Works

### Automatic Detection

Demo mode is enabled when:
```bash
# No OPENAI_API_KEY in .env
# OR
OPENAI_API_KEY=sk-demo-key
```

The system automatically detects missing API keys and switches to demo mode without throwing errors.

### What Works in Demo Mode

#### ✅ Fully Functional Features
- User authentication and authorization
- Dashboard and navigation
- Post scheduling and calendar
- Media library and uploads
- Third-party integrations setup
- Analytics and reporting UI
- Settings and configuration
- All visual components and layouts

#### 🎭 Mock Data Features
- AI post generation (returns demo posts)
- Image generation (returns placeholder images)
- Content analysis (returns sample analysis)
- Voice generation (returns demo text)
- Slide generation (returns sample slides)
- Thread creation (returns demo threads)

## Demo Mode Indicators

### Backend Startup Message
When the backend starts in demo mode, you'll see:
```
🚀 Backend is running on: http://localhost:3000
═══════════════════════════════════════════════════════════
🔧 DEMO MODE ACTIVE - AI features will return mock data
To enable real AI features, add to your .env file:
   OPENAI_API_KEY=your-openai-api-key
Platform is fully functional in demo mode for testing!
═══════════════════════════════════════════════════════════
```

### AI Router Logs
```
[AIRouterService] AI Router Service initialized
[AIRouterService] 🔧 AI Router running in DEMO MODE (no API keys configured)
[OpenAIProviderAdapter] OpenAI Provider initialized in DEMO MODE - API calls will return mock data
```

### Operation Warnings
When AI operations are executed in demo mode:
```
[OpenaiService] generateImage executed in DEMO MODE - returning mock data
[OpenaiService] generatePosts executed in DEMO MODE - returning mock data
```

## Demo Response Examples

### Post Generation
```json
{
  "content": "🚀 Welcome to ARKYRA!\n\nThis is a demo AI response...",
  "provider": "demo-mode",
  "success": true,
  "usage": {
    "estimatedCost": 0,
    "totalTokens": 0
  }
}
```

### Image Generation
```
https://via.placeholder.com/1024x1024/4F46E5/ffffff?text=ARKYRA+Demo+Image
```

### Slide Generation
```json
[
  {
    "imagePrompt": "Professional business presentation background...",
    "voiceText": "Welcome to this presentation..."
  }
]
```

## Enabling Production Mode

To enable real AI features, add your API keys to the `.env` file:

### OpenAI (Primary)
```bash
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### Optional Additional Providers
```bash
# Google Gemini (Recommended for cost-effectiveness)
GOOGLE_API_KEY=your-google-api-key

# Anthropic Claude (Best for long-form content)
ANTHROPIC_API_KEY=your-anthropic-api-key

# Groq (Fastest inference)
GROQ_API_KEY=your-groq-api-key

# Mistral AI
MISTRAL_API_KEY=your-mistral-api-key
```

After adding keys, restart the backend:
```bash
pnpm run dev
```

You should see:
```
✅ AI features enabled with configured API keys
```

## Development Workflow

### Testing Without API Keys
```bash
# 1. Clone repository
git clone https://github.com/your-org/arkyra.git

# 2. Install dependencies
pnpm install

# 3. Setup .env (without API keys)
cp .env.example .env
# Configure only: DATABASE_URL, REDIS_URL, JWT_SECRET, URLs

# 4. Start in demo mode
pnpm run dev
```

The platform will start fully functional with demo data!

### Adding API Keys Later
```bash
# 1. Get your OpenAI API key from https://platform.openai.com/

# 2. Add to .env
echo "OPENAI_API_KEY=sk-proj-your-key" >> .env

# 3. Restart
pnpm run dev
```

## Architecture

### Demo Mode Configuration
Located at: `libraries/nestjs-libraries/src/ai-router/config/demo-mode.config.ts`

```typescript
export const DEMO_MODE_ENABLED = !process.env.OPENAI_API_KEY;

export const DEMO_RESPONSES = {
  completion: { /* mock responses */ },
  imageUrl: 'placeholder-url',
  slides: [/* sample slides */],
  // ...
};
```

### Service Implementation
Each AI service checks for demo mode:

```typescript
async generateImage(prompt: string) {
  if (DEMO_MODE) {
    logDemoModeWarning(this.logger, 'generateImage');
    return DEMO_RESPONSES.imageUrl;
  }

  // Real API call
  return await openai.images.generate({...});
}
```

### Zero-Cost Operations
In demo mode:
- All operations have `estimatedCost: 0`
- No quota is consumed
- Usage tracking still works (with zero costs)
- Metrics are collected normally

## Benefits

### For Developers
- ✅ Start coding immediately without API keys
- ✅ Test UI and workflows without costs
- ✅ Debug integration issues
- ✅ Develop new features safely

### For Testers/QA
- ✅ Test complete user flows
- ✅ Verify UI/UX without API dependencies
- ✅ Reproduce bugs consistently
- ✅ Automated testing without API costs

### For Evaluators
- ✅ Explore platform capabilities
- ✅ Understand interface and workflows
- ✅ Assess features before committing
- ✅ Demo to stakeholders risk-free

### For Contributors
- ✅ Contribute to UI/Frontend without API keys
- ✅ Test integrations with mock data
- ✅ Submit PRs that work in demo mode
- ✅ Lower barrier to entry for open-source contributions

## Limitations in Demo Mode

### What's Different
1. **AI Responses**: Mock data instead of real AI-generated content
2. **Image Quality**: Placeholder images instead of DALL-E generated
3. **Content Variety**: Limited demo templates vs. infinite AI possibilities
4. **Response Time**: Simulated latency vs. real API latency

### What's NOT Affected
- Database operations
- User authentication
- File uploads and media handling
- Third-party integrations (with their own keys)
- Scheduling and automation
- Analytics and reporting
- All visual components

## FAQ

### Q: Can I deploy in demo mode?
**A:** Demo mode is for development/testing only. Production deployments should have API keys configured for full functionality.

### Q: Will demo mode break any features?
**A:** No. All features work; AI features just return sample data instead of real AI responses.

### Q: Can I mix demo mode with some API keys?
**A:** Yes! If you add some provider keys (e.g., Google Gemini), those will work while others use demo mode.

### Q: Is demo mode secure?
**A:** Yes. Demo mode is just as secure as production mode. It's only the AI responses that are mocked.

### Q: How do I test real API integration?
**A:** Add your API keys to `.env` and restart. The system automatically detects keys and switches to production mode.

### Q: Does demo mode affect database?
**A:** No. Database operations work normally. Only external AI API calls are mocked.

### Q: Can I customize demo responses?
**A:** Yes! Edit `libraries/nestjs-libraries/src/ai-router/config/demo-mode.config.ts` to customize mock responses.

## Troubleshooting

### Backend won't start
```bash
# Check required env vars (not API keys)
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret
MAIN_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4200
```

### Demo mode not activating
```bash
# Make sure OPENAI_API_KEY is not set or is 'sk-demo-key'
grep OPENAI_API_KEY .env

# Remove or comment out
# OPENAI_API_KEY=sk-proj-...
```

### Want to force demo mode even with keys
```bash
# Set to demo key
OPENAI_API_KEY=sk-demo-key
```

## Contributing

When contributing to ARKYRA:

1. ✅ Ensure code works in demo mode
2. ✅ Test without API keys before submitting PR
3. ✅ Document any new API dependencies
4. ✅ Add demo responses for new AI features

## Support

For issues or questions:
- 📖 Check this documentation
- 🐛 Open an issue on GitHub
- 💬 Join our community Discord
- 📧 Email: support@arkyra.com

## License

Demo mode is part of ARKYRA and follows the same license as the main project.

---

**Last Updated:** January 2026
**Version:** 1.0.0
**Status:** Stable ✅
