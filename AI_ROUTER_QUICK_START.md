# AI Router Quick Start Guide

## Installation (2 minutes)

```bash
# 1. Install dependencies
npm install @nestjs/schedule

# 2. Run database migration
cd libraries/nestjs-libraries/src/database/prisma
npx prisma generate
npx prisma db push

# 3. Set environment variable
echo "OPENAI_API_KEY=sk-proj-your-key" >> .env
```

## Basic Usage (5 minutes)

### Import Module
```typescript
// apps/backend/src/app.module.ts
import { AIRouterModule } from '@arkyra/nestjs-libraries/ai-router';

@Module({
  imports: [AIRouterModule],
})
export class AppModule {}
```

### Use Service
```typescript
import { AIRouterService, AITaskType, AccuracyLevel } from '@arkyra/nestjs-libraries/ai-router';

constructor(private readonly aiRouter: AIRouterService) {}

async generate() {
  const response = await this.aiRouter.generateCompletion({
    prompt: 'Write a tweet about AI',
    taskType: AITaskType.POST_GENERATION,
    accuracyLevel: AccuracyLevel.HIGH,
    organizationId: 'org-123',
  });

  return response.content;
}
```

## REST API Endpoints

```bash
# Generate text
POST /ai-router/completion
{
  "prompt": "Your prompt here",
  "taskType": "POST_GENERATION",
  "accuracyLevel": "HIGH",
  "organizationId": "org-123"
}

# Check quota
GET /ai-router/quota/:organizationId

# Usage stats
GET /ai-router/usage/:organizationId

# System health
GET /ai-router/health
```

## Task Types & Accuracy Levels

### Task Types
- `AUTOCOMPLETE` - Real-time suggestions
- `CAPTION_REWRITE` - Text refinement
- `POST_GENERATION` - Content creation
- `IMAGE_GENERATION` - DALL-E 3
- `GENERIC` - General purpose

### Accuracy Levels
- `STANDARD` - Fast & cheap (uses GLM-4.7)
- `HIGH` - Balanced quality
- `PREMIUM` - Best quality (uses GPT-4.1)

## Routing Logic

| Task | Accuracy | Provider | Cost/1M tokens |
|------|----------|----------|----------------|
| Autocomplete | Standard | GLM-4.7 | $0.001 |
| Caption Rewrite | High | OpenAI | $0.80 |
| Post Generation | Premium | OpenAI | $40 |

## Quota Tiers

| Tier | OpenAI Tokens | GLM Tokens | Cost/Month |
|------|---------------|------------|------------|
| FREE | 50K | 100K | $0.85 |
| STANDARD | 500K | 2M | $9.50 |
| PRO | 2M | 10M | $40 |

## Common Patterns

### Check Quota Before Generation
```typescript
const quota = await this.aiRouter.getQuotaStatus(orgId);

if (quota.alerts.hardLimitReached) {
  throw new Error('Quota exceeded');
}

const response = await this.aiRouter.generateCompletion({...});
```

### Cost-Optimized Generation
```typescript
// Use STANDARD for non-critical tasks (100x cheaper)
const response = await this.aiRouter.generateCompletion({
  prompt: 'Enhance this text',
  taskType: AITaskType.CAPTION_REWRITE,
  accuracyLevel: AccuracyLevel.STANDARD, // Uses GLM-4.7
  organizationId: orgId,
});
```

### Legacy Compatibility
```typescript
// Old way (still works)
const posts = await this.openai.generatePosts(content);

// New way (with tracking and quotas)
const posts = await this.aiRouter.generatePosts(content, orgId);
```

## Monitoring

```bash
# Check system health
curl http://localhost:3000/ai-router/health

# Get usage stats
curl http://localhost:3000/ai-router/usage/org-123

# Get recommendations
curl http://localhost:3000/ai-router/recommendations/org-123
```

## Troubleshooting

### "Quota exceeded" error
```typescript
// Check quota status
const quota = await this.aiRouter.getQuotaStatus(orgId);
console.log('OpenAI remaining:', quota.openai.remaining);
console.log('GLM remaining:', quota.glm.remaining);
```

### High costs
```typescript
// Switch to STANDARD accuracy for cost savings
accuracyLevel: AccuracyLevel.STANDARD // Uses 100x cheaper GLM-4.7
```

### Provider failures
```bash
# Check health
curl http://localhost:3000/ai-router/health

# Verify API key
echo $OPENAI_API_KEY
```

## Next Steps

1. ✅ Import `AIRouterModule` in your app
2. ✅ Run database migrations
3. ✅ Set `OPENAI_API_KEY` in `.env`
4. ✅ Replace direct OpenAI calls with AI Router
5. 🚧 Implement GLM-4.7 for cost savings (optional)
6. 📋 Add payment integration (optional)

## Full Documentation

- **README.md** - Complete feature guide
- **INTEGRATION.md** - Detailed integration steps
- **AI_ROUTER_IMPLEMENTATION_SUMMARY.md** - Technical overview

## Support

File location: `/libraries/nestjs-libraries/src/ai-router/`

For issues:
1. Check logs for detailed errors
2. Verify database migrations applied
3. Ensure API keys configured
4. Review quota status
5. Check provider health

---

**Quick Start Complete!** You're ready to use the AI Router system.
