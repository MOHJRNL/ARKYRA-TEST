# Integrations Overview

ARKYRA offers extensive integration capabilities with AI providers, media generation services, automation tools, and analytics platforms. This guide provides an overview of all available integrations and how to configure them.

## Integration Categories

### AI & Content Generation

Leverage powerful AI models for content creation:

- **[OpenAI](/docs/integrations/openai)** - GPT-4, GPT-3.5, DALL-E 3 for text and image generation
- **[Google Gemini](/docs/integrations/gemini)** - Gemini Pro and Ultra for advanced reasoning
- **[Anthropic Claude](/docs/integrations/claude)** - Claude 3 Opus, Sonnet, and Haiku for intelligent content
- **[Mistral AI](/docs/integrations/mistral)** - Mistral Large and Medium for efficient generation
- **[GLM 4.7](/docs/integrations/glm)** - Chinese language AI model for multilingual content

### Video Generation

Create professional videos with AI:

- **[HeyGen](/docs/integrations/heygen)** - AI avatar videos with natural speech
- **[Synthesia](/docs/integrations/synthesia)** - Professional video generation with 120+ avatars
- **[D-ID](/docs/integrations/d-id)** - Transform photos into talking avatars
- **[Runway](/docs/integrations/runway)** - Advanced AI video editing and generation

### Audio Synthesis

Generate natural-sounding voiceovers:

- **[ElevenLabs](/docs/integrations/elevenlabs)** - Ultra-realistic voice synthesis
- **[Murf](/docs/integrations/murf)** - Studio-quality AI voices for content
- **[PlayHT](/docs/integrations/playht)** - High-fidelity text-to-speech

### Automation & Workflows

Connect ARKYRA to your automation tools:

- **[Webhooks](/docs/integrations/webhooks)** - Custom webhook integrations
- **[Zapier](/docs/integrations/zapier)** - Connect 5,000+ apps
- **[Make (Integromat)](/docs/integrations/make)** - Visual automation workflows
- **[n8n](/docs/integrations/n8n)** - Self-hosted workflow automation

### Content Sources

Import and sync content from:

- **[Notion](/docs/integrations/notion)** - Sync content from Notion databases
- **[Google Sheets](/docs/integrations/google-sheets)** - Import posts from spreadsheets
- **[Airtable](/docs/integrations/airtable)** - Connect Airtable bases

### Analytics & Tracking

Monitor performance with:

- **[Google Analytics 4](/docs/integrations/ga4)** - Track website conversions from social
- **[Looker Studio](/docs/integrations/looker-studio)** - Visualize social media data
- **[PostHog](/docs/integrations/posthog)** - Product analytics and feature flags
- **[Amplitude](/docs/integrations/amplitude)** - User behavior analytics

## Integration Architecture

### Admin-Level Configuration

Administrators configure integrations at the platform level:

```typescript
// Admin enables integrations
interface IntegrationConfig {
  provider: string;
  enabled: boolean;
  apiKey?: string;          // Admin-level API key
  allowUserKeys: boolean;   // Allow users to add their own keys
  quotaPerWorkspace?: number;
  defaultSettings: Record<string, any>;
}
```

### User-Level Configuration

Users add their own API keys within their workspace:

```typescript
// User adds personal API key
interface UserIntegrationConfig {
  provider: string;
  apiKey: string;           // User's personal API key
  enabled: boolean;
  quota?: number;           // User-specific quota
  settings: Record<string, any>;
}
```

### Hybrid AI Routing

ARKYRA uses intelligent routing to select the best AI provider:

```typescript
interface AIRoutingConfig {
  primary: string;          // Primary AI provider
  fallbacks: string[];      // Fallback providers in order
  strategy: 'cost' | 'quality' | 'speed' | 'balanced';
  healthCheck: boolean;     // Check provider health before routing
  retryAttempts: number;    // Retry count on failure
}
```

**Example routing flow:**

```
Request → Check Primary (OpenAI)
            ↓ (if fails)
          Check Fallback 1 (Gemini)
            ↓ (if fails)
          Check Fallback 2 (Claude)
            ↓ (if fails)
          Return Error
```

## Configuration Methods

### Environment Variables

Global configuration for all workspaces:

```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION_ID=org-...

# Google Gemini
GOOGLE_GEMINI_API_KEY=AIza...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# HeyGen
HEYGEN_API_KEY=...

# ElevenLabs
ELEVENLABS_API_KEY=...
```

### Admin Dashboard

Administrators can manage integrations via the dashboard:

1. Navigate to **Settings** → **Integrations**
2. Click on an integration to configure
3. Add API keys or enable/disable
4. Set quota limits per workspace
5. Save configuration

### API Configuration

Configure integrations programmatically:

```typescript
// POST /api/admin/integrations
{
  "provider": "openai",
  "enabled": true,
  "apiKey": "sk-...",
  "allowUserKeys": true,
  "quotaPerWorkspace": 10000,
  "settings": {
    "model": "gpt-4-turbo-preview",
    "temperature": 0.7
  }
}
```

### User Self-Service

Users add their own API keys:

```typescript
// POST /api/integrations/user
{
  "provider": "openai",
  "apiKey": "sk-...",
  "enabled": true,
  "settings": {
    "preferredModel": "gpt-4"
  }
}
```

## Usage Tracking

ARKYRA tracks integration usage at both workspace and user levels:

### Workspace Quotas

```typescript
interface WorkspaceQuota {
  provider: string;
  limit: number;              // Monthly limit
  used: number;               // Usage this month
  remaining: number;          // Remaining quota
  resetDate: Date;            // When quota resets
}
```

### User Quotas

```typescript
interface UserQuota {
  provider: string;
  limit: number;
  used: number;
  remaining: number;
  resetDate: Date;
}
```

### Quota Display Component

```tsx
// React component for displaying quota
import { useIntegrationQuota } from '@arkyra/hooks';

export function QuotaDisplay({ provider }: { provider: string }) {
  const { quota, loading } = useIntegrationQuota(provider);

  if (loading) return <Spinner />;

  return (
    <div className="quota-card">
      <h3>{provider}</h3>
      <div className="quota-bar">
        <div
          className="quota-used"
          style={{ width: `${(quota.used / quota.limit) * 100}%` }}
        />
      </div>
      <p>{quota.remaining.toLocaleString()} of {quota.limit.toLocaleString()} remaining</p>
      <p className="text-sm text-gray-500">
        Resets on {new Date(quota.resetDate).toLocaleDateString()}
      </p>
    </div>
  );
}
```

## Integration Status

### Health Checking

ARKYRA monitors integration health:

```typescript
interface IntegrationHealth {
  provider: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;           // Average latency in ms
  errorRate: number;         // Error rate percentage
  lastChecked: Date;
  uptime: number;            // Uptime percentage
}
```

### Status Indicator Component

```tsx
// React component for integration status
import { useIntegrationHealth } from '@arkyra/hooks';

export function IntegrationStatus({ provider }: { provider: string }) {
  const { health, loading } = useIntegrationHealth(provider);

  if (loading) return <Spinner />;

  const statusColor = {
    healthy: '#048FCC',      // Al Jazeera Blue
    degraded: '#F8AB0C',     // Al Jazeera Gold
    down: '#E74C3C'          // Red
  };

  return (
    <div className="integration-status">
      <div
        className="status-indicator"
        style={{ backgroundColor: statusColor[health.status] }}
      />
      <span>{health.status}</span>
      <span className="latency">{health.latency}ms</span>
      <span className="uptime">{health.uptime}% uptime</span>
    </div>
  );
}
```

## Integration Connect Flow

### Frontend Implementation

```tsx
// Integration connection component
import { useState } from 'react';
import { Button } from '@arkyra/ui';

export function IntegrationConnectButton({
  provider,
  onConnect
}: {
  provider: string;
  onConnect: () => void;
}) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/integrations/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey,
          enabled: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect integration');
      }

      onConnect();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="integration-connect">
      <input
        type="password"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="api-key-input"
      />
      <Button
        onClick={handleConnect}
        loading={loading}
        disabled={!apiKey}
        style={{ backgroundColor: '#048FCC' }}
      >
        Connect {provider}
      </Button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Integration List Component

```tsx
// List of integrations with status
import { useIntegrations } from '@arkyra/hooks';

export function IntegrationsList() {
  const { integrations, loading } = useIntegrations();

  if (loading) return <Spinner />;

  return (
    <div className="integrations-grid">
      {integrations.map((integration) => (
        <div key={integration.provider} className="integration-card">
          <img
            src={`/icons/integrations/${integration.provider}.svg`}
            alt={integration.provider}
            className="integration-logo"
          />
          <h3>{integration.name}</h3>
          <p>{integration.description}</p>

          {integration.connected ? (
            <div className="connected-state">
              <span className="connected-badge">Connected</span>
              <QuotaDisplay provider={integration.provider} />
              <IntegrationStatus provider={integration.provider} />
              <Button variant="outline" onClick={() => disconnect(integration)}>
                Disconnect
              </Button>
            </div>
          ) : (
            <IntegrationConnectButton
              provider={integration.provider}
              onConnect={() => refetch()}
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

## Admin Management

### Workspace Integration Settings

```tsx
// Admin component for managing workspace integrations
export function WorkspaceIntegrations({ workspaceId }: { workspaceId: string }) {
  const { settings, updateSettings } = useWorkspaceIntegrations(workspaceId);

  return (
    <div className="workspace-integrations">
      <h2>Integration Settings</h2>

      {settings.map((integration) => (
        <div key={integration.provider} className="integration-setting">
          <h3>{integration.provider}</h3>

          <label>
            <input
              type="checkbox"
              checked={integration.enabled}
              onChange={(e) => updateSettings(integration.provider, {
                enabled: e.target.checked
              })}
            />
            Enable for this workspace
          </label>

          <label>
            Monthly Quota:
            <input
              type="number"
              value={integration.quota}
              onChange={(e) => updateSettings(integration.provider, {
                quota: parseInt(e.target.value)
              })}
            />
          </label>

          <QuotaDisplay provider={integration.provider} />

          <Button onClick={() => resetQuota(integration.provider)}>
            Reset Quota
          </Button>
        </div>
      ))}
    </div>
  );
}
```

### Usage Analytics Dashboard

```tsx
// Admin dashboard for monitoring integration usage
export function IntegrationAnalytics() {
  const { analytics, loading } = useIntegrationAnalytics();

  if (loading) return <Spinner />;

  return (
    <div className="integration-analytics">
      <h2>Integration Usage Analytics</h2>

      <div className="stats-grid">
        <StatCard
          title="Total API Calls"
          value={analytics.totalCalls}
          trend={analytics.callsTrend}
        />
        <StatCard
          title="Active Integrations"
          value={analytics.activeCount}
          color="#048FCC"
        />
        <StatCard
          title="Total Cost"
          value={`$${analytics.totalCost.toFixed(2)}`}
          trend={analytics.costTrend}
        />
        <StatCard
          title="Avg Response Time"
          value={`${analytics.avgLatency}ms`}
        />
      </div>

      <div className="usage-charts">
        <UsageChart data={analytics.usageByProvider} />
        <CostChart data={analytics.costByProvider} />
      </div>

      <div className="top-users">
        <h3>Top Users by Usage</h3>
        <UsersTable users={analytics.topUsers} />
      </div>
    </div>
  );
}
```

## Webhook Integration

### Configuring Webhooks

```typescript
// POST /api/webhooks
{
  "name": "Post Published Webhook",
  "url": "https://your-app.com/webhook/post-published",
  "events": ["post.published", "post.failed"],
  "headers": {
    "Authorization": "Bearer your-token"
  },
  "enabled": true
}
```

### Webhook Payload

```typescript
interface WebhookPayload {
  event: string;
  timestamp: string;
  workspace: {
    id: string;
    name: string;
  };
  data: {
    postId: string;
    platforms: string[];
    status: 'success' | 'failed';
    error?: string;
  };
}
```

### Webhook Event Types

- `post.created` - New post created
- `post.published` - Post successfully published
- `post.failed` - Post publishing failed
- `post.deleted` - Post deleted
- `integration.connected` - Integration connected
- `integration.disconnected` - Integration disconnected
- `quota.warning` - Quota at 80%
- `quota.exceeded` - Quota exceeded

## Best Practices

### API Key Security

- Store API keys securely in environment variables
- Use different keys for development and production
- Rotate keys regularly
- Monitor key usage for suspicious activity
- Use read-only keys where possible

### Quota Management

- Set reasonable quotas per workspace
- Monitor usage trends
- Send alerts at 80% and 100% quota
- Implement grace periods for over-quota
- Track cost per integration

### Error Handling

- Implement exponential backoff for retries
- Use circuit breakers for failing integrations
- Log all integration errors
- Provide clear error messages to users
- Monitor error rates and alert on spikes

### Performance Optimization

- Cache integration responses where appropriate
- Use connection pooling
- Implement request queuing
- Monitor latency and optimize slow integrations
- Use CDN for integration assets

## Next Steps

Explore specific integration guides:

- [AI Integrations →](/docs/integrations/ai/overview)
- [Video Generation →](/docs/integrations/video/overview)
- [Audio Synthesis →](/docs/integrations/audio/overview)
- [Automation Tools →](/docs/integrations/automation/overview)
- [Analytics Platforms →](/docs/integrations/analytics/overview)
