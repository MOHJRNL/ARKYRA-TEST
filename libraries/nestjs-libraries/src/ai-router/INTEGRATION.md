# AI Router Integration Guide

Step-by-step guide to integrate the Hybrid AI Router into your ARKYRA application.

## Prerequisites

1. ✅ Database schema migrated (AIUsageTracking, AIQuota, AIProviderMetrics models)
2. ✅ OpenAI API key configured in environment
3. ✅ PrismaModule available
4. ✅ NestJS application setup

## Step 1: Install Dependencies

The AI Router uses `@nestjs/schedule` for cron jobs:

```bash
npm install @nestjs/schedule
```

## Step 2: Import AIRouterModule

In your main application module (e.g., `apps/backend/src/app.module.ts`):

```typescript
import { Module } from '@nestjs/common';
import { AIRouterModule } from '@arkyra/nestjs-libraries/ai-router';

@Module({
  imports: [
    // ... other imports
    AIRouterModule,
  ],
  // ... rest of your module
})
export class AppModule {}
```

## Step 3: Register the Controller

In your backend routes (e.g., `apps/backend/src/api/api.module.ts`):

```typescript
import { Module } from '@nestjs/common';
import { AIRouterController } from './routes/ai-router.controller';
import { AIRouterModule } from '@arkyra/nestjs-libraries/ai-router';

@Module({
  imports: [AIRouterModule],
  controllers: [AIRouterController],
})
export class ApiModule {}
```

## Step 4: Run Database Migration

Generate and apply the Prisma migration:

```bash
cd libraries/nestjs-libraries/src/database/prisma
npx prisma generate
npx prisma db push
```

## Step 5: Initialize Quotas

For existing organizations, initialize their AI quotas:

```typescript
import { QuotaManagementService } from '@arkyra/nestjs-libraries/ai-router';

// In a setup script or admin endpoint
constructor(private readonly quotaService: QuotaManagementService) {}

async initializeQuotas() {
  const organizations = await this.prisma.organization.findMany();

  for (const org of organizations) {
    await this.quotaService.getQuotaStatus(org.id); // Auto-creates if not exists
  }
}
```

## Step 6: Replace Existing OpenAI Calls

### Before (Direct OpenAI Service):
```typescript
import { OpenaiService } from '@arkyra/nestjs-libraries/openai';

constructor(private readonly openai: OpenaiService) {}

async generatePost() {
  const posts = await this.openai.generatePosts(content);
  return posts;
}
```

### After (AI Router):
```typescript
import { AIRouterService, AITaskType, AccuracyLevel } from '@arkyra/nestjs-libraries/ai-router';

constructor(private readonly aiRouter: AIRouterService) {}

async generatePost() {
  // Option 1: Use new router API
  const response = await this.aiRouter.generateCompletion({
    prompt: `Generate social media posts from: ${content}`,
    taskType: AITaskType.POST_GENERATION,
    accuracyLevel: AccuracyLevel.HIGH,
    organizationId: 'org-123',
  });

  // Option 2: Use legacy compatibility method
  const posts = await this.aiRouter.generatePosts(content, 'org-123');
  return posts;
}
```

## Step 7: Add Quota Checks (Optional)

For user-facing features, check quota before expensive operations:

```typescript
async generateContent(organizationId: string, prompt: string) {
  // Check quota status
  const quota = await this.aiRouter.getQuotaStatus(organizationId);

  if (quota.alerts.hardLimitReached) {
    throw new Error('AI quota exceeded. Please upgrade your plan.');
  }

  if (quota.alerts.softLimitReached) {
    // Show warning to user
    console.warn(`Approaching AI quota limit: ${quota.openai.percentage}% used`);
  }

  // Proceed with generation
  return await this.aiRouter.generateCompletion({
    prompt,
    taskType: AITaskType.POST_GENERATION,
    accuracyLevel: AccuracyLevel.HIGH,
    organizationId,
  });
}
```

## Step 8: Add Usage Dashboard (Optional)

Create an admin dashboard to monitor AI usage:

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { AIRouterService } from '@arkyra/nestjs-libraries/ai-router';

@Controller('admin/ai-usage')
export class AIUsageDashboardController {
  constructor(private readonly aiRouter: AIRouterService) {}

  @Get(':organizationId/stats')
  async getStats(@Param('organizationId') orgId: string) {
    const [quota, stats, cost] = await Promise.all([
      this.aiRouter.getQuotaStatus(orgId),
      this.aiRouter.getUsageStatistics(orgId),
      this.aiRouter.getUsageStatistics(orgId).then(s => ({
        totalCost: s.totalCost,
        byProvider: s.byProvider,
      })),
    ]);

    return {
      quota,
      stats,
      cost,
    };
  }
}
```

## Step 9: Configure Environment

Update your `.env` file:

```bash
# Required
OPENAI_API_KEY=sk-proj-your-key-here
DATABASE_URL=postgresql://...

# Optional (for GLM-4.7 when implemented)
# GLM_API_KEY=your-glm-key
# GLM_API_BASE_URL=https://open.bigmodel.cn/api/paas/v4
```

## Step 10: Test the Integration

Create a test endpoint:

```typescript
@Controller('test')
export class TestController {
  constructor(private readonly aiRouter: AIRouterService) {}

  @Get('ai-router')
  async testAIRouter() {
    const response = await this.aiRouter.generateCompletion({
      prompt: 'Say hello!',
      taskType: 'GENERIC' as any,
      accuracyLevel: 'STANDARD' as any,
      organizationId: 'test-org',
      maxTokens: 50,
    });

    return {
      success: response.success,
      content: response.content,
      provider: response.provider,
      cost: response.usage.estimatedCost,
    };
  }
}
```

Test it:
```bash
curl http://localhost:3000/test/ai-router
```

## Common Integration Patterns

### Pattern 1: Background Job Processing

```typescript
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AIRouterService, AITaskType, AccuracyLevel } from '@arkyra/nestjs-libraries/ai-router';

@Injectable()
export class ContentGenerationService {
  constructor(private readonly aiRouter: AIRouterService) {}

  @Cron('0 */6 * * *') // Every 6 hours
  async generateScheduledContent() {
    const organizations = await this.getOrganizationsNeedingContent();

    for (const org of organizations) {
      const response = await this.aiRouter.generateCompletion({
        prompt: org.contentPrompt,
        taskType: AITaskType.POST_GENERATION,
        accuracyLevel: AccuracyLevel.HIGH,
        organizationId: org.id,
      });

      await this.saveGeneratedContent(org.id, response.content);
    }
  }
}
```

### Pattern 2: User Input Enhancement

```typescript
@Post('posts/enhance')
async enhanceUserInput(
  @Body() body: { content: string; organizationId: string },
) {
  // Use low-cost provider for simple enhancement
  const enhanced = await this.aiRouter.generateCompletion({
    prompt: `Improve this social media post: ${body.content}`,
    taskType: AITaskType.CAPTION_REWRITE,
    accuracyLevel: AccuracyLevel.STANDARD, // Use cost-effective GLM-4.7
    organizationId: body.organizationId,
    maxTokens: 300,
  });

  return { enhanced: enhanced.content };
}
```

### Pattern 3: Quota-Aware Feature Access

```typescript
async canUseAIFeature(organizationId: string): Promise<boolean> {
  const quota = await this.aiRouter.getQuotaStatus(organizationId);

  // Disable AI features if hard limit reached
  if (quota.alerts.hardLimitReached) {
    return false;
  }

  // Show upgrade prompt if soft limit reached
  if (quota.alerts.softLimitReached) {
    await this.notifyUser(organizationId, 'Approaching AI quota limit');
  }

  return true;
}
```

## Monitoring & Observability

### Health Check Endpoint

The system automatically monitors provider health. Access via:

```bash
curl http://localhost:3000/ai-router/health
```

Response:
```json
{
  "healthy": true,
  "availableProviders": 1,
  "totalProviders": 2,
  "providers": [
    {
      "provider": "OPENAI",
      "healthy": true,
      "latencyMs": 245,
      "lastChecked": "2025-01-28T..."
    },
    {
      "provider": "GLM_4_7",
      "healthy": false,
      "latencyMs": 0,
      "lastChecked": "2025-01-28T...",
      "errorMessage": "Not yet implemented"
    }
  ]
}
```

### Usage Metrics

Track usage over time:

```typescript
// Get last 30 days of usage
const trends = await this.usageService.getUsageTrends(organizationId, 30);

// Get top users by usage
const topUsers = await this.usageService.getTopUsers(organizationId, 10);

// Get cost projections
const costBreakdown = await this.usageService.getCostBreakdown(organizationId);
```

## Troubleshooting

### Issue: "Quota exceeded" errors

**Solution**: Check quota status and upgrade tier if needed

```typescript
const quota = await this.aiRouter.getQuotaStatus(orgId);
console.log('OpenAI remaining:', quota.openai.remaining);
console.log('GLM remaining:', quota.glm.remaining);
```

### Issue: High costs

**Solution**: Review routing and optimize task types

```typescript
// Use STANDARD accuracy for non-critical tasks
accuracyLevel: AccuracyLevel.STANDARD, // Uses cheaper GLM-4.7

// Use HIGH/PREMIUM only when needed
accuracyLevel: AccuracyLevel.PREMIUM, // Uses expensive GPT-4.1
```

### Issue: Provider health failures

**Solution**: Check API keys and network connectivity

```bash
# Verify OpenAI key
echo $OPENAI_API_KEY

# Test direct OpenAI access
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Migration Checklist

- [ ] Install @nestjs/schedule dependency
- [ ] Import AIRouterModule in AppModule
- [ ] Add AIRouterController to API routes
- [ ] Run Prisma migration
- [ ] Initialize quotas for existing organizations
- [ ] Update environment variables
- [ ] Replace direct OpenAI calls with AIRouter
- [ ] Add quota checks to user-facing features
- [ ] Test with sample requests
- [ ] Set up monitoring/alerts
- [ ] Document for your team

## Next Steps

1. **Implement GLM-4.7**: Follow TODOs in `glm-provider.adapter.ts`
2. **Add Payment Integration**: Implement quota enforcement with billing
3. **Create Admin Dashboard**: Build UI for usage monitoring
4. **Set Up Alerts**: Configure alerts for quota limits
5. **Optimize Costs**: Review usage patterns and adjust routing

## Support

If you encounter issues:
1. Check the logs for detailed error messages
2. Verify database migrations are applied
3. Ensure API keys are configured
4. Review the routing matrix for expected behavior
5. Check provider health status

For further assistance, refer to the main README.md or contact the development team.
