# Hybrid AI Router

ARKYRA's Hybrid AI Router intelligently distributes AI requests across multiple providers, ensuring high availability, cost optimization, and the best possible content quality.

## Overview

The Hybrid AI Router is a sophisticated system that:

- **Automatically selects** the best AI provider for each request
- **Falls back** to alternative providers if primary fails
- **Balances load** across multiple providers
- **Monitors health** of all connected AI services
- **Optimizes costs** by routing to most cost-effective providers
- **Tracks usage** and respects quota limits

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   ARKYRA Frontend                       │
│                   (User Request)                        │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│                  Hybrid AI Router                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  1. Request Analysis                             │  │
│  │     - Content type                                │  │
│  │     - User preferences                            │  │
│  │     - Quota availability                          │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  2. Provider Selection                           │  │
│  │     - Health check                                │  │
│  │     - Cost analysis                               │  │
│  │     - Performance metrics                         │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  3. Fallback Strategy                            │  │
│  │     - Primary → Fallback 1 → Fallback 2          │  │
│  │     - Exponential backoff                         │  │
│  │     - Circuit breaker                             │  │
│  └──────────────────────────────────────────────────┘  │
└───────────┬────────────────┬───────────────┬───────────┘
            │                │               │
            ▼                ▼               ▼
     ┌───────────┐    ┌──────────┐   ┌───────────┐
     │  OpenAI   │    │  Gemini  │   │  Claude   │
     │    API    │    │   API    │   │    API    │
     └───────────┘    └──────────┘   └───────────┘
```

## Configuration

### Environment Variables

Configure AI providers and routing strategy:

```env
# Enable Hybrid AI Router
AI_ROUTER_ENABLED=true
AI_ROUTER_STRATEGY=balanced  # Options: cost, quality, speed, balanced

# Primary Provider
AI_PRIMARY_PROVIDER=gemini

# Fallback Providers (in order)
AI_FALLBACK_PROVIDERS=openai,claude,mistral

# Provider API Keys
GOOGLE_GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-claude-key
MISTRAL_API_KEY=your-mistral-key

# Health Check Settings
AI_HEALTH_CHECK_INTERVAL=60000  # milliseconds
AI_HEALTH_CHECK_TIMEOUT=5000    # milliseconds

# Circuit Breaker Settings
AI_CIRCUIT_BREAKER_THRESHOLD=5  # failures before opening circuit
AI_CIRCUIT_BREAKER_TIMEOUT=60000  # milliseconds before retry

# Retry Settings
AI_MAX_RETRIES=3
AI_RETRY_DELAY=1000  # milliseconds
AI_RETRY_BACKOFF=2   # exponential backoff multiplier
```

### Admin Configuration

Configure routing via the admin dashboard:

```typescript
// POST /api/admin/ai-router/config
{
  "enabled": true,
  "strategy": "balanced",
  "providers": {
    "gemini": {
      "enabled": true,
      "priority": 1,
      "weight": 40,
      "costPerRequest": 0.0001,
      "quotaLimit": 100000
    },
    "openai": {
      "enabled": true,
      "priority": 2,
      "weight": 30,
      "costPerRequest": 0.0002,
      "quotaLimit": 50000
    },
    "claude": {
      "enabled": true,
      "priority": 3,
      "weight": 20,
      "costPerRequest": 0.00015,
      "quotaLimit": 50000
    },
    "mistral": {
      "enabled": true,
      "priority": 4,
      "weight": 10,
      "costPerRequest": 0.00008,
      "quotaLimit": 100000
    }
  },
  "fallbackChain": ["gemini", "openai", "claude", "mistral"],
  "healthCheck": {
    "enabled": true,
    "interval": 60000,
    "timeout": 5000
  },
  "circuitBreaker": {
    "enabled": true,
    "threshold": 5,
    "timeout": 60000
  }
}
```

## Routing Strategies

### Balanced (Recommended)

Balances cost, quality, and speed:

```typescript
strategy: 'balanced'
// Weights: Cost 30%, Quality 40%, Speed 30%
```

**Best for:** Most use cases, provides good quality at reasonable cost

**Example routing:**
1. Gemini (balanced cost and quality)
2. OpenAI (high quality)
3. Claude (high quality, premium)
4. Mistral (cost-effective)

### Cost-Optimized

Prioritizes lowest cost providers:

```typescript
strategy: 'cost'
// Weights: Cost 70%, Quality 20%, Speed 10%
```

**Best for:** High-volume content generation, budget-conscious deployments

**Example routing:**
1. Mistral (lowest cost)
2. Gemini (balanced)
3. OpenAI (higher cost)
4. Claude (premium)

### Quality-First

Prioritizes highest quality AI models:

```typescript
strategy: 'quality'
// Weights: Quality 70%, Speed 20%, Cost 10%
```

**Best for:** Premium content, marketing campaigns, professional content

**Example routing:**
1. Claude (highest quality)
2. OpenAI GPT-4 (high quality)
3. Gemini Pro (balanced)
4. Mistral (fallback)

### Speed-Optimized

Prioritizes fastest response times:

```typescript
strategy: 'speed'
// Weights: Speed 70%, Cost 20%, Quality 10%
```

**Best for:** Real-time content generation, user-facing features

**Example routing:**
1. Gemini (fast)
2. Mistral (fast, cost-effective)
3. OpenAI (balanced)
4. Claude (slower, premium)

## Fallback Logic

### Automatic Failover

When primary provider fails:

```typescript
async function routeRequest(request: AIRequest): Promise<AIResponse> {
  const providers = getFallbackChain();

  for (const provider of providers) {
    try {
      // Check provider health
      if (!await isHealthy(provider)) {
        logger.warn(`Provider ${provider} is unhealthy, skipping`);
        continue;
      }

      // Check quota
      if (!await hasQuota(provider)) {
        logger.warn(`Provider ${provider} quota exceeded, skipping`);
        continue;
      }

      // Attempt request
      const response = await callProvider(provider, request);

      // Track success
      await trackSuccess(provider);

      return response;
    } catch (error) {
      // Track failure
      await trackFailure(provider, error);

      // Log and continue to next provider
      logger.error(`Provider ${provider} failed:`, error);
      continue;
    }
  }

  // All providers failed
  throw new Error('All AI providers failed');
}
```

### Circuit Breaker

Prevents cascading failures:

```typescript
class CircuitBreaker {
  private failures: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private lastFailureTime: Date;

  async call(provider: string, request: AIRequest): Promise<AIResponse> {
    // Circuit is open (provider is failing)
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime.getTime();

      // Timeout not reached, fail fast
      if (timeSinceLastFailure < this.timeout) {
        throw new Error(`Circuit breaker open for ${provider}`);
      }

      // Timeout reached, try half-open
      this.state = 'half-open';
    }

    try {
      const response = await callProvider(provider, request);

      // Success in half-open state, close circuit
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }

      return response;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = new Date();

      // Too many failures, open circuit
      if (this.failures >= this.threshold) {
        this.state = 'open';
        logger.warn(`Circuit breaker opened for ${provider}`);
      }

      throw error;
    }
  }
}
```

### Retry Logic

Exponential backoff for transient failures:

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(backoffMultiplier, attempt);

      logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`);

      await sleep(delay);
    }
  }

  throw lastError;
}
```

## Health Monitoring

### Provider Health Checks

Continuously monitor provider availability:

```typescript
interface ProviderHealth {
  provider: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;           // Average latency in ms
  successRate: number;       // Success rate percentage
  errorRate: number;         // Error rate percentage
  lastChecked: Date;
  uptime: number;            // Uptime percentage (24h)
  consecutiveFailures: number;
}

async function checkProviderHealth(provider: string): Promise<ProviderHealth> {
  const startTime = Date.now();

  try {
    // Simple health check request
    await callProvider(provider, {
      type: 'health-check',
      content: 'ping'
    });

    const latency = Date.now() - startTime;

    return {
      provider,
      status: latency < 2000 ? 'healthy' : 'degraded',
      latency,
      successRate: await getSuccessRate(provider),
      errorRate: await getErrorRate(provider),
      lastChecked: new Date(),
      uptime: await getUptime(provider),
      consecutiveFailures: 0
    };
  } catch (error) {
    return {
      provider,
      status: 'down',
      latency: -1,
      successRate: await getSuccessRate(provider),
      errorRate: await getErrorRate(provider),
      lastChecked: new Date(),
      uptime: await getUptime(provider),
      consecutiveFailures: await getConsecutiveFailures(provider) + 1
    };
  }
}
```

### Health Dashboard Component

```tsx
import { useProviderHealth } from '@arkyra/hooks';

export function AIHealthDashboard() {
  const { providers, loading } = useProviderHealth();

  if (loading) return <Spinner />;

  return (
    <div className="ai-health-dashboard">
      <h2>AI Provider Health</h2>

      <div className="providers-grid">
        {providers.map((provider) => (
          <div
            key={provider.provider}
            className={`provider-card status-${provider.status}`}
          >
            <div className="provider-header">
              <img
                src={`/icons/ai/${provider.provider}.svg`}
                alt={provider.provider}
              />
              <h3>{provider.provider}</h3>
              <span className={`status-badge ${provider.status}`}>
                {provider.status}
              </span>
            </div>

            <div className="provider-metrics">
              <div className="metric">
                <span className="label">Latency</span>
                <span className="value">{provider.latency}ms</span>
              </div>
              <div className="metric">
                <span className="label">Success Rate</span>
                <span className="value">{provider.successRate}%</span>
              </div>
              <div className="metric">
                <span className="label">Uptime (24h)</span>
                <span className="value">{provider.uptime}%</span>
              </div>
              <div className="metric">
                <span className="label">Error Rate</span>
                <span className="value">{provider.errorRate}%</span>
              </div>
            </div>

            <div className="provider-status">
              <span className="last-checked">
                Last checked: {formatRelativeTime(provider.lastChecked)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Usage Tracking

### Request Tracking

Track all AI requests for analytics and billing:

```typescript
interface AIRequest {
  id: string;
  provider: string;
  type: 'text' | 'image' | 'audio' | 'video';
  model: string;
  prompt: string;
  tokens?: number;
  cost: number;
  latency: number;
  status: 'success' | 'failed';
  error?: string;
  userId: string;
  workspaceId: string;
  timestamp: Date;
}

async function trackAIRequest(request: AIRequest): Promise<void> {
  // Save to database
  await db.aiRequests.create({ data: request });

  // Update provider metrics
  await updateProviderMetrics(request.provider, {
    totalRequests: { increment: 1 },
    totalCost: { increment: request.cost },
    totalLatency: { increment: request.latency },
    successCount: request.status === 'success' ? { increment: 1 } : undefined,
    failureCount: request.status === 'failed' ? { increment: 1 } : undefined
  });

  // Update workspace quota
  await updateWorkspaceQuota(request.workspaceId, request.provider, {
    used: { increment: 1 },
    cost: { increment: request.cost }
  });

  // Check quota limits
  await checkQuotaLimits(request.workspaceId, request.provider);
}
```

### Usage Analytics Component

```tsx
import { useAIUsageAnalytics } from '@arkyra/hooks';

export function AIUsageAnalytics({ workspaceId }: { workspaceId: string }) {
  const { analytics, loading } = useAIUsageAnalytics(workspaceId);

  if (loading) return <Spinner />;

  return (
    <div className="ai-usage-analytics">
      <h2>AI Usage Analytics</h2>

      <div className="stats-grid">
        <StatCard
          title="Total Requests"
          value={analytics.totalRequests}
          trend={analytics.requestsTrend}
          color="#048FCC"
        />
        <StatCard
          title="Total Cost"
          value={`$${analytics.totalCost.toFixed(2)}`}
          trend={analytics.costTrend}
          color="#F8AB0C"
        />
        <StatCard
          title="Avg Latency"
          value={`${analytics.avgLatency}ms`}
          color="#001969"
        />
        <StatCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          trend={analytics.successRateTrend}
          color="#048FCC"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Requests by Provider</h3>
          <PieChart data={analytics.requestsByProvider} />
        </div>

        <div className="chart-container">
          <h3>Cost by Provider</h3>
          <BarChart data={analytics.costByProvider} />
        </div>

        <div className="chart-container">
          <h3>Requests Over Time</h3>
          <LineChart data={analytics.requestsOverTime} />
        </div>

        <div className="chart-container">
          <h3>Latency by Provider</h3>
          <BarChart data={analytics.latencyByProvider} />
        </div>
      </div>

      <div className="provider-breakdown">
        <h3>Provider Breakdown</h3>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Requests</th>
              <th>Cost</th>
              <th>Avg Latency</th>
              <th>Success Rate</th>
            </tr>
          </thead>
          <tbody>
            {analytics.providerBreakdown.map((provider) => (
              <tr key={provider.name}>
                <td>{provider.name}</td>
                <td>{provider.requests.toLocaleString()}</td>
                <td>${provider.cost.toFixed(2)}</td>
                <td>{provider.avgLatency}ms</td>
                <td>{provider.successRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## Best Practices

### Provider Configuration

1. **Set realistic quotas**: Configure appropriate monthly limits
2. **Monitor costs**: Track spending per provider
3. **Test fallbacks**: Verify fallback chain works correctly
4. **Update regularly**: Keep API keys and configurations current

### Performance Optimization

1. **Cache responses**: Cache common AI requests
2. **Batch requests**: Combine multiple requests when possible
3. **Use appropriate models**: Don't use premium models for simple tasks
4. **Monitor latency**: Optimize based on response times

### Error Handling

1. **Log all failures**: Track why providers fail
2. **Alert on issues**: Set up alerts for high failure rates
3. **Graceful degradation**: Provide fallback content when all providers fail
4. **User feedback**: Show clear error messages

### Security

1. **Secure API keys**: Store in environment variables or secrets manager
2. **Rotate keys**: Regularly rotate API keys
3. **Monitor usage**: Watch for suspicious activity
4. **Rate limiting**: Implement rate limits per user/workspace

## Troubleshooting

### All Providers Failing

Check:
1. API keys are valid
2. Quotas not exceeded
3. Network connectivity
4. Provider status pages

### High Latency

Optimize:
1. Use faster providers for primary
2. Implement request caching
3. Use appropriate models
4. Check network issues

### Quota Exceeded

Solutions:
1. Increase quota limits
2. Implement better rate limiting
3. Cache more aggressively
4. Use cost-optimized strategy

### Uneven Distribution

Adjust:
1. Provider weights
2. Routing strategy
3. Health check thresholds
4. Circuit breaker settings

## Next Steps

- [OpenAI Integration →](/docs/integrations/openai)
- [Google Gemini Integration →](/docs/integrations/gemini)
- [Claude Integration →](/docs/integrations/claude)
- [Quota Management →](/docs/admin/quotas)
- [Monitoring Guide →](/docs/admin/monitoring)
