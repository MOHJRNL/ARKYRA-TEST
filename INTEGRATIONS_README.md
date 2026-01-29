# ARKYRA Integration System

## Overview

The ARKYRA Integration System is a comprehensive, plug-and-play integration layer that connects your SaaS platform with 20+ third-party services across video/media, audio, AI, automation, and content sources.

## Architecture

### Backend (NestJS)

The integration system follows a decorator-based pattern inspired by the existing HeyGen integration:

```
libraries/nestjs-libraries/src/3rdparties/
├── thirdparty.interface.ts      # Base abstract class & decorator
├── thirdparty.manager.ts         # Manager service for all integrations
├── thirdparty.module.ts          # NestJS module registration
├── heygen/                       # Example: Video generation
│   └── heygen.provider.ts
├── synthesia/                    # Video generation
│   └── synthesia.provider.ts
├── d-id/                        # Video generation
│   └── d-id.provider.ts
├── runway/                      # Video generation
│   └── runway.provider.ts
├── elevenlabs/                  # Audio generation
│   └── elevenlabs.provider.ts
├── murf/                        # Audio generation
│   └── murf.provider.ts
├── playht/                      # Audio generation
│   └── playht.provider.ts
├── webhooks/                    # Automation
│   └── webhooks.provider.ts
├── zapier/                      # Automation
│   └── zapier.provider.ts
├── make/                        # Automation
│   └── make.provider.ts
├── n8n/                         # Automation
│   └── n8n.provider.ts
├── notion/                      # Content source
│   └── notion.provider.ts
├── google-sheets/               # Content source
│   └── google-sheets.provider.ts
├── airtable/                    # Content source
│   └── airtable.provider.ts
├── ga4/                         # Analytics
│   └── ga4.provider.ts
├── looker-studio/               # Analytics
│   └── looker-studio.provider.ts
├── posthog/                     # Analytics
│   └── posthog.provider.ts
└── amplitude/                   # Analytics
    └── amplitude.provider.ts
```

### AI Router

AI integrations extend the existing AI Router system:

```
libraries/nestjs-libraries/src/ai-router/
├── providers/
│   ├── base-ai-provider.abstract.ts    # Base class for AI providers
│   ├── openai-provider.adapter.ts      # OpenAI (existing)
│   ├── glm-provider.adapter.ts         # GLM 4.7 (existing)
│   ├── claude-provider.adapter.ts      # NEW: Claude
│   └── mistral-provider.adapter.ts     # NEW: Mistral
└── enums/
    └── ai-provider.enum.ts             # Updated with new providers
```

### Frontend (Next.js + React)

```
apps/frontend/src/
├── components/
│   ├── integrations/
│   │   └── integrations-dashboard.component.tsx  # Main dashboard
│   └── third-parties/
│       ├── third-party.wrapper.tsx
│       ├── third-party.function.tsx
│       ├── third-party.list.component.tsx
│       └── providers/
│           └── heygen.provider.tsx               # Example provider UI
└── public/
    └── icons/
        └── third-party/                          # Integration logos
            ├── heygen.png
            ├── synthesia.png
            ├── d-id.png
            ├── runway.png
            ├── elevenlabs.png
            └── ... (all integration logos)
```

## Integration Categories

### 🎥 Video / Media
- **HeyGen**: AI-generated avatar videos
- **Synthesia**: Create AI videos with avatars and voiceovers
- **D-ID**: Talking avatars from photos
- **Runway**: AI video generation (text-to-video, image-to-video)

### 🔊 Audio
- **ElevenLabs**: Realistic AI voices with emotional control
- **Murf AI**: Studio-quality voiceovers
- **PlayHT**: Ultra-realistic AI voices

### 🤖 AI Models
- **OpenAI**: GPT-4, GPT-3.5, DALL-E 3
- **GLM 4.7**: Cost-effective Chinese AI model
- **Claude**: Anthropic's AI with strong reasoning
- **Mistral**: Open-weight AI models

### 🔁 Automation
- **Webhooks**: Custom HTTP endpoints
- **Zapier**: Connect 5000+ apps
- **Make**: Advanced automation platform
- **n8n**: Open-source workflow automation

### 📄 Content Sources
- **Notion**: Workspace and notes
- **Google Sheets**: Spreadsheet data
- **Airtable**: Database and spreadsheets
- **Google Analytics 4**: Analytics data
- **Looker Studio**: Data visualization
- **PostHog**: Product analytics
- **Amplitude**: Digital analytics

## How to Add a New Integration

### Step 1: Create Provider Class

Create a new file in `libraries/nestjs-libraries/src/3rdparties/your-integration/your-integration.provider.ts`:

```typescript
import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

interface YourIntegrationData {
  // Define your data structure
  prompt: string;
  options?: any;
}

@ThirdParty({
  identifier: 'your-integration',
  title: 'Your Integration',
  description: 'Description of your integration',
  position: 'media', // or 'webhook'
  fields: [], // Optional form fields
})
export class YourIntegrationProvider extends ThirdPartyAbstract<YourIntegrationData> {
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      // Test API connection
      const response = await fetch('https://api.your-service.com/me', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });

      if (!response.ok) return false;

      const data = await response.json();
      return {
        name: data.name,
        username: data.username,
        id: data.id,
      };
    } catch (error) {
      return false;
    }
  }

  async sendData(apiKey: string, data: YourIntegrationData): Promise<string> {
    try {
      // Implement your API call
      const response = await fetch('https://api.your-service.com/endpoint', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const result = await response.json();
      return result.url || JSON.stringify(result);
    } catch (error) {
      throw new Error(`Failed to execute: ${error.message}`);
    }
  }

  // Add custom methods as needed
  async customMethod(apiKey: string, params: any) {
    // Implementation
  }
}
```

### Step 2: Register Provider

Add your provider to `thirdparty.module.ts`:

```typescript
import { YourIntegrationProvider } from '@gitroom/nestjs-libraries/3rdparties/your-integration/your-integration.provider';

@Module({
  providers: [
    // ... existing providers
    YourIntegrationProvider,
  ],
  // ...
})
```

### Step 3: Add Logo

Place a logo file at:
```
apps/frontend/public/icons/third-party/your-integration.png
```

Recommended size: 512x512px, transparent background

### Step 4: Update Frontend Dashboard

Add integration to `integrations-dashboard.component.tsx`:

```typescript
const INTEGRATIONS_MAP: Record<string, Integration> = {
  // ... existing integrations
  'your-integration': {
    identifier: 'your-integration',
    title: 'Your Integration',
    description: 'Brief description',
    category: 'video', // or 'audio', 'ai', 'automation', 'content'
    connected: false,
    logo: '/icons/third-party/your-integration.png',
  },
};
```

### Step 5: Create Frontend Provider Component (Optional)

If you need custom UI for your integration, create:
```
apps/frontend/src/components/third-parties/providers/your-integration.provider.tsx
```

Follow the pattern in `heygen.provider.tsx`.

## AI Integration

For AI providers, extend the AI Router system instead:

1. Create adapter in `libraries/nestjs-libraries/src/ai-router/providers/`
2. Extend `BaseAIProvider` class
3. Implement required methods: `getProviderType()`, `isHealthy()`, `generateCompletion()`, `estimateCost()`
4. Update `ai-provider.enum.ts` with provider config
5. Register in AI Router module

## API Endpoints

### List All Integrations
```http
GET /third-party/list
```

### Add Integration
```http
POST /third-party/:identifier
Content-Type: application/json

{
  "api": "your-api-key"
}
```

### Call Integration Function
```http
POST /third-party/function/:id/:functionName
Content-Type: application/json

{
  "param1": "value1",
  "param2": "value2"
}
```

### Submit Integration Data
```http
POST /third-party/:id/submit
Content-Type: application/json

{
  "field1": "value1",
  "field2": "value2"
}
```

## Environment Variables

Add to `.env`:

```bash
# Video/Media
HEYGEN_API_KEY=
SYNTHESIA_API_KEY=
DID_API_KEY=
RUNWAY_API_KEY=

# Audio
ELEVENLABS_API_KEY=
MURF_API_KEY=
PLAYHT_API_KEY=

# AI
OPENAI_API_KEY=
GLM_API_KEY=
ANTHROPIC_API_KEY=
MISTRAL_API_KEY=

# Automation (usually webhook URLs, user-provided)
# ZAPIER_WEBHOOK_URL=
# MAKE_WEBHOOK_URL=
# N8N_WEBHOOK_URL=

# Content Sources
NOTION_API_KEY=
GOOGLE_SHEETS_API_KEY=
AIRTABLE_API_KEY=
GA4_API_KEY=
POSTHOG_API_KEY=
AMPLITUDE_API_KEY=
```

## Usage Examples

### Using Video Integration (HeyGen)

```typescript
// Backend
const thirdPartyManager = this.moduleRef.get(ThirdPartyManager);
const heygen = thirdPartyManager.getThirdPartyByName('heygen');

const videoUrl = await heygen.instance.sendData(apiKey, {
  voice: 'Hello world',
  avatar: 'avatar_id',
  aspect_ratio: 'portrait',
  captions: 'yes',
  selectedVoice: 'voice_id',
  type: 'avatar',
});
```

### Using AI Router with Hybrid Fallback

```typescript
// Backend
const aiRouter = this.moduleRef.get(AIRouterService);

const response = await aiRouter.generateCompletion({
  prompt: 'Write a blog post about AI',
  organizationId: 'org_123',
  accuracyLevel: AccuracyLevel.HIGH,
  taskType: TaskType.CONTENT_GENERATION,
  // Router automatically tries: GLM → OpenAI → Claude → Mistral
});
```

### Using Automation (Zapier)

```typescript
// Backend
const zapier = thirdPartyManager.getThirdPartyByName('zapier');

await zapier.instance.sendData(webhookUrl, {
  trigger: 'new_content',
  data: {
    title: 'New Post',
    content: 'Post content...',
  },
});
```

## Quota Management

Each integration call is tracked for quota management:

```typescript
// Usage tracking happens automatically in AI Router
const quotaStatus = await quotaManagementService.checkQuota(
  organizationId,
  AIProviderType.CLAUDE,
  estimatedTokens
);

if (!quotaStatus.allowed) {
  throw new Error('Quota exceeded');
}
```

## Error Handling

All providers implement standardized error handling:

```typescript
try {
  const result = await provider.sendData(apiKey, data);
} catch (error) {
  // Error is properly formatted with provider context
  console.error(`Integration failed: ${error.message}`);
}
```

## Testing

### Test Connection
```typescript
const isValid = await provider.checkConnection(apiKey);
if (isValid) {
  console.log(`Connected as ${isValid.name}`);
}
```

### Test Integration
```typescript
const result = await provider.sendData(apiKey, testData);
```

## Logo Requirements

All integration logos must:
- Be 512x512px (or proportional)
- Have transparent background (PNG)
- Be placed in `/apps/frontend/public/icons/third-party/`
- Follow naming convention: `{identifier}.png`

## Security Considerations

1. **API Keys**: Stored encrypted in database
2. **User Isolation**: Each workspace has separate integrations
3. **Validation**: All API keys validated on connection
4. **Rate Limiting**: Built-in rate limiting per provider
5. **Error Messages**: Generic errors to prevent information leakage

## Best Practices

1. Always implement `checkConnection()` for API key validation
2. Use polling with timeouts for async operations
3. Implement retry logic with exponential backoff
4. Include clear error messages
5. Document all custom methods
6. Add TypeScript interfaces for all data structures
7. Include pricing information in comments

## Troubleshooting

### Integration Not Showing Up
- Check provider is imported in `thirdparty.module.ts`
- Verify `@ThirdParty` decorator is applied
- Check logo exists in `/public/icons/third-party/`

### API Connection Failed
- Verify API key format
- Check network connectivity
- Review provider documentation for API changes
- Check rate limits

### Provider Not Executing
- Check `sendData()` implementation
- Verify required parameters
- Review error logs
- Test with provider's official tools

## License

This integration system is part of the ARKYRA platform.

## Support

For integration support:
- Documentation: `/docs/integrations`
- Issues: Create GitHub issue
- Email: support@arkyra.com
