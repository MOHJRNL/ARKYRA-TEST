# Integration System - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (1 min)

```bash
cd /Users/MOH/MOH\ -\ DATA/Work/Growingify\ /arkyra

# Install new dependencies
npm install @anthropic-ai/sdk @notionhq/client

# Verify installation
npm list @anthropic-ai/sdk @notionhq/client
```

### Step 2: Configure Environment (1 min)

Add to your `.env` file:

```bash
# Required for AI Router
ANTHROPIC_API_KEY=sk-ant-your-key-here
MISTRAL_API_KEY=your-mistral-key-here

# Already configured (keep existing)
OPENAI_API_KEY=sk-proj-your-key-here
```

### Step 3: Generate Placeholder Logos (30 seconds)

```bash
chmod +x scripts/generate-integration-logos.sh
./scripts/generate-integration-logos.sh
```

### Step 4: Build Project (2 min)

```bash
# Build everything
npm run build

# Or start in development mode
npm run dev
```

### Step 5: Verify Installation (30 seconds)

```bash
# Check backend logs for provider initialization
# You should see:
# - "HeyGen Provider initialized"
# - "Synthesia Provider initialized"
# - "Claude Provider initialized"
# - etc. (20+ providers)

# Check frontend
# Navigate to: http://localhost:3000/integrations
```

## ✅ Quick Test

### Test an Integration (Backend)

```typescript
// In any service
import { ThirdPartyManager } from '@gitroom/nestjs-libraries/3rdparties/thirdparty.manager';

// Inject the manager
constructor(private thirdPartyManager: ThirdPartyManager) {}

// Use any integration
async testIntegration() {
  const heygen = this.thirdPartyManager.getThirdPartyByName('heygen');

  // Test connection
  const isValid = await heygen.instance.checkConnection('test-api-key');
  console.log('Connection valid:', isValid);
}
```

### Test AI Router (Backend)

```typescript
import { AIRouterService } from '@gitroom/nestjs-libraries/ai-router/services/ai-router.service';
import { AccuracyLevel } from '@gitroom/nestjs-libraries/ai-router/enums/accuracy-level.enum';
import { TaskType } from '@gitroom/nestjs-libraries/ai-router/enums/task-type.enum';

constructor(private aiRouter: AIRouterService) {}

async testAI() {
  const response = await this.aiRouter.generateCompletion({
    prompt: 'Say hello!',
    organizationId: 'test_org',
    accuracyLevel: AccuracyLevel.STANDARD,
    taskType: TaskType.CONTENT_GENERATION,
  });

  console.log('Response:', response.content);
  console.log('Provider:', response.provider); // GLM, OpenAI, Claude, or Mistral
}
```

### Test Frontend Component

```typescript
// Import the dashboard
import { IntegrationsDashboard } from '@gitroom/frontend/components/integrations/integrations-dashboard.component';

// Use in your page
export default function IntegrationsPage() {
  return (
    <div>
      <h1>Integrations</h1>
      <IntegrationsDashboard reload={() => {}} />
    </div>
  );
}
```

## 📚 Available Integrations

### 🎥 Video & Media (4)
- HeyGen, Synthesia, D-ID, Runway

### 🔊 Audio (3)
- ElevenLabs, Murf, PlayHT

### 🤖 AI (4)
- OpenAI, GLM 4.7, Claude, Mistral

### 🔁 Automation (4)
- Webhooks, Zapier, Make, n8n

### 📄 Content Sources (7)
- Notion, Google Sheets, Airtable, GA4, Looker Studio, PostHog, Amplitude

## 🎯 Common Use Cases

### Generate AI Content
```typescript
const response = await aiRouter.generateCompletion({
  prompt: 'Write a blog post about AI',
  organizationId: 'org_123',
  accuracyLevel: AccuracyLevel.HIGH,
  taskType: TaskType.CONTENT_GENERATION,
});
```

### Create Avatar Video
```typescript
const heygen = thirdPartyManager.getThirdPartyByName('heygen');
const videoUrl = await heygen.instance.sendData(apiKey, {
  voice: 'Hello world!',
  avatar: 'josh_lite3_20230714',
  aspect_ratio: 'portrait',
  captions: 'yes',
  selectedVoice: 'en-US-JennyNeural',
  type: 'avatar',
});
```

### Generate Voice
```typescript
const elevenlabs = thirdPartyManager.getThirdPartyByName('elevenlabs');
const audio = await elevenlabs.instance.sendData(apiKey, {
  text: 'This is a test.',
  voice_id: '21m00Tcm4TlvDq8ikWAM',
});
```

### Send Webhook
```typescript
const zapier = thirdPartyManager.getThirdPartyByName('zapier');
await zapier.instance.sendData(webhookUrl, {
  trigger: 'test_event',
  data: { message: 'Hello from ARKYRA' },
});
```

### Query Notion
```typescript
const notion = thirdPartyManager.getThirdPartyByName('notion');
const data = await notion.instance.sendData(apiKey, {
  database_id: 'your_database_id',
  action: 'query',
});
```

## 🔧 Troubleshooting

### Integration Not Found
```bash
# Check if provider is registered
grep "YourProvider" libraries/nestjs-libraries/src/3rdparties/thirdparty.module.ts

# Rebuild
npm run build
```

### API Key Invalid
```bash
# Test API key manually
curl https://api.provider.com/endpoint \
  -H "Authorization: Bearer YOUR_KEY"
```

### Frontend Not Loading
```bash
# Check logo exists
ls -la apps/frontend/public/icons/third-party/

# Clear Next.js cache
rm -rf apps/frontend/.next
npm run dev
```

## 📖 Documentation

- **Main Docs**: `INTEGRATIONS_README.md`
- **Examples**: `INTEGRATION_EXAMPLES.md`
- **Deployment**: `INTEGRATION_DEPLOYMENT.md`
- **Summary**: `INTEGRATION_SUMMARY.md`

## 🎉 You're Ready!

Your integration system is now fully configured and ready to use. Check the documentation for detailed examples and API references.

### Next Steps:
1. ✅ Add your API keys to `.env`
2. ✅ Test integrations with real API keys
3. ✅ Replace placeholder logos with brand assets
4. ✅ Build your features using the integrations
5. ✅ Deploy to production

## 🆘 Need Help?

1. Check the documentation files
2. Review the examples in `INTEGRATION_EXAMPLES.md`
3. Search for similar patterns in existing code
4. Test with provider's official documentation

---

**Status**: Ready to use
**Total Setup Time**: ~5 minutes
**Integrations Available**: 20+
**AI Models**: 4 (with hybrid fallback)
