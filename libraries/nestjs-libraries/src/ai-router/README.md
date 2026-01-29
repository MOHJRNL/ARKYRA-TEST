# AI Router System

Hybrid AI provider routing system that intelligently selects between OpenAI and GLM-4.7 based on task requirements, cost, and performance.

## Features

- **Intelligent Routing**: Automatically selects the best AI provider based on task type and accuracy requirements
- **Cost Optimization**: Routes cost-effective tasks to GLM-4.7, premium tasks to OpenAI
- **Quota Management**: Tracks and enforces usage limits per subscription tier
- **Automatic Fallback**: Seamlessly switches providers if primary fails
- **Usage Analytics**: Comprehensive tracking and reporting of AI usage
- **Health Monitoring**: Real-time provider health checks and metrics

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      AI Router Service                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Decision   │  │   Fallback   │  │    Quota     │      │
│  │   Service    │  │   Service    │  │  Management  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Usage     │  │   Provider   │  │   Provider   │      │
│  │   Tracking   │  │   Metrics    │  │    Health    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────┬─────────────┐
                              │             │             │
                      ┌───────▼────┐ ┌──────▼─────┐ ┌───▼────┐
                      │   OpenAI   │ │  GLM-4.7   │ │ Future │
                      │  Adapter   │ │  Adapter   │ │Providers│
                      └────────────┘ └────────────┘ └────────┘
```

## Routing Matrix

| Task Type | Accuracy | Primary Provider | Fallback | Reason |
|-----------|----------|-----------------|----------|---------|
| Autocomplete | Standard | GLM-4.7 | OpenAI | Cost-effective for high volume |
| Autocomplete | High | GLM-4.7 | OpenAI | Good quality, low cost |
| Autocomplete | Premium | OpenAI | GLM-4.7 | Best quality needed |
| Caption Rewrite | Standard | GLM-4.7 | OpenAI | Cost-effective |
| Caption Rewrite | High | OpenAI | GLM-4.7 | Better rewrites |
| Caption Rewrite | Premium | OpenAI | GLM-4.7 | Best quality |
| Post Generation | Standard | GLM-4.7 | OpenAI | Cost-effective |
| Post Generation | High | OpenAI | GLM-4.7 | Better content |
| Post Generation | Premium | OpenAI | GLM-4.7 | Best content (GPT-4.1) |
| Image Generation | All | OpenAI | OpenAI | DALL-E 3 only |

## Usage

### Basic Text Generation

```typescript
import { AIRouterService, AITaskType, AccuracyLevel } from '@arkyra/nestjs-libraries/ai-router';

// Inject the service
constructor(private readonly aiRouter: AIRouterService) {}

// Generate completion
const response = await this.aiRouter.generateCompletion({
  prompt: 'Write a social media post about AI innovation',
  taskType: AITaskType.POST_GENERATION,
  accuracyLevel: AccuracyLevel.HIGH,
  organizationId: 'org-123',
  userId: 'user-456',
  maxTokens: 500,
  temperature: 0.7,
});

console.log(response.content); // Generated text
console.log(response.provider); // Provider used (OPENAI or GLM_4_7)
console.log(response.usage); // Token usage and cost
```

### Image Generation

```typescript
const imageResponse = await this.aiRouter.generateImage({
  prompt: 'A futuristic AI assistant',
  organizationId: 'org-123',
  isUrl: true,
  isVertical: false,
});

console.log(imageResponse.image); // Image URL or base64
```

### Check Quota Status

```typescript
const quota = await this.aiRouter.getQuotaStatus('org-123');

console.log(quota.openai.remaining); // Remaining OpenAI tokens
console.log(quota.glm.remaining); // Remaining GLM tokens
console.log(quota.alerts.softLimitReached); // Alert status
```

### Get Usage Statistics

```typescript
const stats = await this.aiRouter.getUsageStatistics(
  'org-123',
  new Date('2025-01-01'),
  new Date('2025-01-31'),
);

console.log(stats.totalCost); // Total cost in USD
console.log(stats.byProvider); // Cost breakdown by provider
console.log(stats.byTaskType); // Cost breakdown by task type
```

## REST API Endpoints

### Generate Completion
```http
POST /ai-router/completion
Content-Type: application/json

{
  "prompt": "Write a tweet about AI",
  "taskType": "POST_GENERATION",
  "accuracyLevel": "HIGH",
  "organizationId": "org-123",
  "maxTokens": 280
}
```

### Get Quota Status
```http
GET /ai-router/quota/org-123
```

### Get Usage Statistics
```http
GET /ai-router/usage/org-123?startDate=2025-01-01&endDate=2025-01-31
```

### Get System Health
```http
GET /ai-router/health
```

### Get Recommendations
```http
GET /ai-router/recommendations/org-123
```

## Subscription Tiers & Quotas

| Tier | OpenAI Tokens/Month | GLM Tokens/Month | Monthly Cost (Est.) |
|------|---------------------|------------------|---------------------|
| FREE | 50,000 | 100,000 | $0.85 |
| STANDARD | 500,000 | 2,000,000 | $9.50 |
| PRO | 2,000,000 | 10,000,000 | $40.00 |
| TEAM | 5,000,000 | 25,000,000 | $100.00 |
| ULTIMATE | 20,000,000 | 100,000,000 | $400.00 |

## Cost Optimization Tips

1. **Use GLM-4.7 for standard tasks**: Autocomplete, simple rewrites - 100x cheaper than OpenAI
2. **Reserve OpenAI for premium tasks**: Content generation, complex rewrites
3. **Monitor usage regularly**: Check quota status to avoid hitting limits
4. **Set up alerts**: Configure alerts at 80% usage
5. **Use batch operations**: Process multiple requests efficiently

## Provider Comparison

### OpenAI (GPT-4.1, GPT-4o-mini)
- ✅ Best accuracy and quality
- ✅ Proven reliability
- ✅ Image generation (DALL-E 3)
- ❌ Higher cost
- ❌ Stricter rate limits

### GLM-4.7 (Zhipu AI)
- ✅ Very cost-effective (100x cheaper)
- ✅ Good performance for standard tasks
- ✅ Fast response times
- ❌ Not yet implemented (stub)
- ❌ No image generation

## Implementation Status

### ✅ Completed
- [x] Core routing infrastructure
- [x] OpenAI provider adapter (fully integrated)
- [x] Quota management system
- [x] Usage tracking and analytics
- [x] Fallback handling
- [x] Health monitoring
- [x] REST API endpoints
- [x] Database schema

### 🚧 In Progress
- [ ] GLM-4.7 provider adapter (stub with TODOs)
- [ ] Payment integration (marked with TODOs)

### 📋 Future Enhancements
- [ ] Caching layer for repeated queries
- [ ] A/B testing between providers
- [ ] Custom routing rules per organization
- [ ] Real-time cost alerts
- [ ] Advanced analytics dashboard

## Development Mode

Currently runs in development mode with:
- ✅ Routing and fallback logic
- ✅ Quota tracking (without payment enforcement)
- ✅ Usage analytics
- ❌ Payment integration (placeholder)
- ❌ GLM-4.7 integration (placeholder)

## Environment Variables

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...

# GLM-4.7 Configuration (TODO: Implement)
# GLM_API_KEY=...
# GLM_API_BASE_URL=https://open.bigmodel.cn/api/paas/v4

# Database
DATABASE_URL=postgresql://...
```

## Database Models

The system uses three Prisma models:

1. **AIUsageTracking**: Records every AI request with tokens, cost, latency
2. **AIQuota**: Manages monthly token limits per organization
3. **AIProviderMetrics**: Aggregates daily performance metrics

## Contributing

When adding new providers:

1. Create adapter in `providers/` extending `BaseAIProvider`
2. Implement `generateCompletion()` and `isHealthy()`
3. Add pricing constants
4. Update routing matrix in `AIRouterDecisionService`
5. Add health checks in `ProviderHealthService`
6. Update documentation

## Support

For issues or questions:
1. Check the routing matrix for expected behavior
2. Review quota status for limit issues
3. Check provider health status
4. Review usage logs for debugging

## License

Proprietary - ARKYRA Platform
