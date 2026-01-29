# Integration System Deployment Guide

## Quick Start

### 1. Install Dependencies

```bash
# Backend dependencies
cd apps/backend
npm install @anthropic-ai/sdk @notionhq/client

# If not already installed
npm install openai

cd ../..
```

### 2. Generate Placeholder Logos

```bash
chmod +x scripts/generate-integration-logos.sh
./scripts/generate-integration-logos.sh
```

### 3. Configure Environment Variables

Add to your `.env` file:

```bash
# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
MISTRAL_API_KEY=...
GLM_API_KEY=...

# Video/Media (Optional - user provides API keys)
# HEYGEN_API_KEY=
# SYNTHESIA_API_KEY=
# DID_API_KEY=
# RUNWAY_API_KEY=

# Audio (Optional - user provides API keys)
# ELEVENLABS_API_KEY=
# MURF_API_KEY=
# PLAYHT_API_KEY=

# Analytics (Optional - user provides API keys)
# NOTION_API_KEY=
# GOOGLE_SHEETS_API_KEY=
# AIRTABLE_API_KEY=
# GA4_API_KEY=
# POSTHOG_API_KEY=
# AMPLITUDE_API_KEY=
```

### 4. Build and Start

```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

## File Structure

```
/Users/MOH/MOH - DATA/Work/Growingify /arkyra/
├── libraries/nestjs-libraries/src/
│   ├── 3rdparties/                           # Third-party integrations
│   │   ├── thirdparty.interface.ts
│   │   ├── thirdparty.manager.ts
│   │   ├── thirdparty.module.ts
│   │   ├── heygen/
│   │   ├── synthesia/
│   │   ├── d-id/
│   │   ├── runway/
│   │   ├── elevenlabs/
│   │   ├── murf/
│   │   ├── playht/
│   │   ├── webhooks/
│   │   ├── zapier/
│   │   ├── make/
│   │   ├── n8n/
│   │   ├── notion/
│   │   ├── google-sheets/
│   │   ├── airtable/
│   │   ├── ga4/
│   │   ├── looker-studio/
│   │   ├── posthog/
│   │   └── amplitude/
│   └── ai-router/                            # AI Router (Hybrid AI)
│       ├── providers/
│       │   ├── base-ai-provider.abstract.ts
│       │   ├── openai-provider.adapter.ts
│       │   ├── glm-provider.adapter.ts
│       │   ├── claude-provider.adapter.ts    # NEW
│       │   └── mistral-provider.adapter.ts   # NEW
│       └── enums/
│           └── ai-provider.enum.ts           # UPDATED
├── apps/frontend/src/
│   ├── components/
│   │   ├── integrations/
│   │   │   └── integrations-dashboard.component.tsx  # NEW
│   │   └── third-parties/
│   │       ├── third-party.wrapper.tsx
│   │       ├── third-party.function.tsx
│   │       └── third-party.list.component.tsx
│   └── public/icons/third-party/             # Integration logos
│       ├── heygen.png
│       ├── synthesia.svg
│       ├── d-id.svg
│       └── ... (all integration logos)
├── scripts/
│   └── generate-integration-logos.sh         # NEW
├── INTEGRATIONS_README.md                     # NEW - Main documentation
└── INTEGRATION_DEPLOYMENT.md                  # NEW - This file
```

## Testing Integrations

### Test Backend Providers

```bash
# Start backend
cd apps/backend
npm run start:dev

# Test API endpoints
curl http://localhost:3000/third-party/list

# Test specific integration
curl -X POST http://localhost:3000/third-party/heygen \
  -H "Content-Type: application/json" \
  -d '{"api": "your-api-key"}'
```

### Test Frontend UI

1. Navigate to integrations page: `http://localhost:3000/integrations`
2. Click on any integration card
3. Enter API key in modal
4. Verify connection status

### Test AI Router

```typescript
// In your service
import { AIRouterService } from '@gitroom/nestjs-libraries/ai-router/services/ai-router.service';
import { AccuracyLevel } from '@gitroom/nestjs-libraries/ai-router/enums/accuracy-level.enum';
import { TaskType } from '@gitroom/nestjs-libraries/ai-router/enums/task-type.enum';

// Inject service
constructor(private readonly aiRouter: AIRouterService) {}

// Use hybrid AI routing
const response = await this.aiRouter.generateCompletion({
  prompt: 'Write a product description',
  organizationId: 'org_123',
  accuracyLevel: AccuracyLevel.HIGH,
  taskType: TaskType.CONTENT_GENERATION,
});

// Router automatically tries: GLM → OpenAI → Claude → Mistral
console.log(response.content);
console.log(`Used provider: ${response.provider}`);
console.log(`Cost: $${response.estimatedCost}`);
```

## Integration Status

### ✅ Fully Implemented
- HeyGen (Video) - Existing
- Synthesia (Video) - NEW
- D-ID (Video) - NEW
- Runway (Video) - NEW
- ElevenLabs (Audio) - NEW
- Murf (Audio) - NEW
- PlayHT (Audio) - NEW
- Webhooks (Automation) - NEW
- Zapier (Automation) - NEW
- Make (Automation) - NEW
- n8n (Automation) - NEW
- Notion (Content) - NEW
- Google Sheets (Content) - NEW
- Airtable (Content) - NEW
- GA4 (Analytics) - NEW
- Looker Studio (Analytics) - NEW
- PostHog (Analytics) - NEW
- Amplitude (Analytics) - NEW

### 🤖 AI Integrations (Router)
- OpenAI - Existing
- GLM 4.7 - Existing
- Claude - NEW
- Mistral - NEW

## API Key Management

### User-Provided API Keys
Most integrations use user-provided API keys stored per workspace:
- Video/Media integrations
- Audio integrations
- Automation webhooks
- Content sources

### Platform API Keys (Optional)
Some providers can use platform-wide keys:
- AI providers (OpenAI, Claude, Mistral)
- Can still be overridden per workspace

## Database Schema

Ensure your database has the `ThirdParty` table:

```prisma
model ThirdParty {
  id             String   @id @default(cuid())
  identifier     String
  name           String
  apiKey         String   @db.Text
  internalId     String
  organizationId String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  deletedAt      DateTime?

  organization Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId])
  @@index([identifier])
}
```

## Quota Tracking

Quota tracking is automatically handled for AI integrations:

```typescript
// Tracked automatically
- Request count per provider
- Token usage
- Cost calculation
- Rate limiting
- Error tracking
```

View quota status:
```typescript
const quotaStatus = await quotaManagementService.getQuotaStatus(organizationId);
```

## Monitoring

### Health Checks

All AI providers have built-in health checks:

```typescript
const health = await aiProvider.isHealthy();
console.log(`Provider healthy: ${health}`);
```

### Metrics

Access provider metrics:

```typescript
const metrics = await aiProvider.getMetrics();
console.log(`Total requests: ${metrics.totalRequests}`);
console.log(`Error rate: ${metrics.errorRate * 100}%`);
console.log(`Avg latency: ${metrics.avgLatencyMs}ms`);
```

## Production Checklist

- [ ] Replace placeholder logos with official brand assets
- [ ] Configure all required environment variables
- [ ] Test each integration with valid API keys
- [ ] Set up quota limits per workspace
- [ ] Configure rate limiting
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Document API key requirements for users
- [ ] Create user documentation
- [ ] Test failover logic for AI router
- [ ] Configure backup providers
- [ ] Set up cost alerts
- [ ] Test webhook endpoints
- [ ] Verify database migrations
- [ ] Set up logging
- [ ] Configure CORS for webhook callbacks

## Troubleshooting

### Integration Not Loading
```bash
# Check provider is registered
grep "YourProvider" libraries/nestjs-libraries/src/3rdparties/thirdparty.module.ts

# Rebuild
npm run build

# Check logs
npm run start:dev | grep "Provider initialized"
```

### API Connection Failed
```bash
# Test API key manually
curl https://api.provider.com/test \
  -H "Authorization: Bearer YOUR_KEY"

# Check rate limits
# Check API status page
```

### Frontend Not Showing Integration
```bash
# Check logo exists
ls -la apps/frontend/public/icons/third-party/your-integration.png

# Check frontend build
cd apps/frontend
npm run build

# Clear browser cache
```

## Support

For integration issues:
- Check logs: `npm run start:dev`
- Review API documentation for each provider
- Test API keys with provider's official tools
- Check rate limits and quotas
- Verify environment variables

## Next Steps

1. Replace placeholder logos with official brand assets
2. Obtain API keys for services you want to use
3. Configure workspace-level API key management
4. Set up usage tracking and billing
5. Create user documentation
6. Test all integrations end-to-end
7. Deploy to production

## License

Part of the ARKYRA platform.
