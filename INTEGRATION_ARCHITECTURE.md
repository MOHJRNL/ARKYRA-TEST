# Integration System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARKYRA Platform                          │
│                                                                   │
│  ┌──────────────────┐           ┌──────────────────┐            │
│  │   Frontend UI    │           │  Backend APIs    │            │
│  │   (Next.js)      │◄─────────►│   (NestJS)       │            │
│  │                  │           │                  │            │
│  │ - Integrations   │           │ - ThirdParty     │            │
│  │   Dashboard      │           │   Manager        │            │
│  │ - API Key Modal  │           │ - AI Router      │            │
│  │ - Status Cards   │           │ - Providers      │            │
│  └──────────────────┘           └──────────────────┘            │
│           │                              │                       │
│           │                              │                       │
│           └──────────┬───────────────────┘                       │
│                      │                                           │
│              ┌───────▼────────┐                                  │
│              │   PostgreSQL    │                                  │
│              │   (API Keys)    │                                  │
│              └────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌───────────┐   ┌───────────┐   ┌───────────┐
│  Video/   │   │   Audio   │   │    AI     │
│   Media   │   │ Providers │   │  Models   │
│           │   │           │   │           │
│ HeyGen    │   │ElevenLabs │   │  OpenAI   │
│Synthesia  │   │   Murf    │   │   GLM     │
│   D-ID    │   │  PlayHT   │   │  Claude   │
│  Runway   │   │           │   │  Mistral  │
└───────────┘   └───────────┘   └───────────┘

┌───────────┐   ┌───────────────────────────┐
│Automation │   │    Content Sources        │
│           │   │                           │
│ Webhooks  │   │ Notion    GA4    PostHog  │
│  Zapier   │   │ Sheets  Looker  Amplitude │
│   Make    │   │ Airtable                  │
│    n8n    │   │                           │
└───────────┘   └───────────────────────────┘
```

## Component Architecture

### 1. Backend Layer

```
ThirdPartyModule
├── ThirdPartyManager (orchestrator)
├── Video Providers
│   ├── HeygenProvider
│   ├── SynthesiaProvider
│   ├── DIDProvider
│   └── RunwayProvider
├── Audio Providers
│   ├── ElevenLabsProvider
│   ├── MurfProvider
│   └── PlayHTProvider
├── Automation Providers
│   ├── WebhooksProvider
│   ├── ZapierProvider
│   ├── MakeProvider
│   └── N8nProvider
└── Content Providers
    ├── NotionProvider
    ├── GoogleSheetsProvider
    ├── AirtableProvider
    ├── GA4Provider
    ├── LookerStudioProvider
    ├── PostHogProvider
    └── AmplitudeProvider
```

### 2. AI Router Layer

```
AIRouterModule
├── AIRouterService (orchestrator)
├── Decision Service (provider selection)
├── Fallback Service (error recovery)
├── Quota Management Service
├── Usage Tracking Service
└── Providers
    ├── OpenAIProvider (existing)
    ├── GLMProvider (existing)
    ├── ClaudeProvider (NEW)
    └── MistralProvider (NEW)
```

### 3. Frontend Layer

```
IntegrationsUI
├── IntegrationsDashboard
│   ├── Category Filters
│   ├── Integration Cards
│   │   ├── Logo
│   │   ├── Title & Description
│   │   ├── Status Indicator
│   │   └── Connect Button
│   └── API Key Modal
│       ├── Form Input
│       └── Validation
└── Third-Party Components
    └── Provider-specific UIs
```

## Data Flow

### 1. User Connects Integration

```
┌──────┐    1. Click     ┌──────────┐    2. Show     ┌─────────┐
│ User │─────Connect────►│Dashboard │────Modal──────►│API Modal│
└──────┘                 └──────────┘                └─────────┘
                                                           │
                                                      3. Enter Key
                                                           │
                                                           ▼
┌──────────┐  5. Success  ┌──────────┐  4. Validate ┌──────────┐
│ Database │◄────Store────│  Backend │◄───Check─────│  API Key │
└──────────┘              └──────────┘              └──────────┘
                               │
                               │ 6. Test Connection
                               ▼
                        ┌──────────────┐
                        │Third-Party API│
                        └──────────────┘
```

### 2. User Makes API Call

```
┌──────┐    1. Request   ┌──────────┐   2. Get Key   ┌──────────┐
│ User │─────Action─────►│  Backend │────Retrieve───►│ Database │
└──────┘                 └──────────┘                └──────────┘
                               │
                          3. Get Provider
                               │
                               ▼
                        ┌──────────────┐
                        │ThirdPartyMgr │
                        └──────────────┘
                               │
                          4. Call API
                               │
                               ▼
                        ┌──────────────┐
                        │Provider.      │
                        │sendData()     │
                        └──────────────┘
                               │
                          5. External Call
                               │
                               ▼
                        ┌──────────────┐
                        │External API  │
                        └──────────────┘
                               │
                          6. Return Result
                               │
                               ▼
┌──────┐  7. Response   ┌──────────┐
│ User │◄───Result──────│  Backend │
└──────┘                └──────────┘
```

### 3. AI Router Flow (Hybrid Fallback)

```
┌──────┐    Request     ┌──────────┐
│ User │────────────────►│AIRouter  │
└──────┘                └──────────┘
                               │
                        ┌──────▼──────┐
                        │  Decision   │
                        │  Service    │
                        └──────┬──────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         Try GLM          If Fails         If Fails
              │                │                │
              ▼                ▼                ▼
        ┌─────────┐      ┌─────────┐     ┌─────────┐     ┌─────────┐
        │   GLM   │─────►│ OpenAI  │────►│ Claude  │────►│ Mistral │
        └─────────┘      └─────────┘     └─────────┘     └─────────┘
              │                │                │                │
         If Success       If Success       If Success      Last Resort
              │                │                │                │
              └────────────────┴────────────────┴────────────────┘
                                       │
                                  Track Usage
                                       │
                                       ▼
                               ┌──────────────┐
                               │Quota Manager │
                               └──────────────┘
                                       │
                                  Return Result
                                       │
                                       ▼
                                   ┌──────┐
                                   │ User │
                                   └──────┘
```

## Class Hierarchy

### Provider Inheritance

```
ThirdPartyAbstract (base class)
├── checkConnection(): Promise<UserInfo | false>
├── sendData(apiKey, data): Promise<string>
└── [custom methods]
    │
    ├─► VideoProviders
    │   ├── HeygenProvider
    │   │   ├── avatars()
    │   │   ├── voices()
    │   │   └── generateVoice()
    │   ├── SynthesiaProvider
    │   │   ├── avatars()
    │   │   └── voices()
    │   └── ...
    │
    ├─► AudioProviders
    │   ├── ElevenLabsProvider
    │   │   ├── voices()
    │   │   └── models()
    │   └── ...
    │
    ├─► AutomationProviders
    │   ├── WebhooksProvider
    │   │   └── testWebhook()
    │   └── ...
    │
    └─► ContentProviders
        ├── NotionProvider
        │   ├── queryDatabase()
        │   ├── getPage()
        │   └── getBlocks()
        └── ...
```

### AI Provider Inheritance

```
BaseAIProvider (abstract)
├── getProviderType(): AIProviderType
├── isHealthy(): Promise<boolean>
├── generateCompletion(): Promise<Response>
├── estimateCost(): number
└── getMetrics(): ProviderMetrics
    │
    ├─► OpenAIProvider
    │   ├── generateImage()
    │   └── [existing methods]
    │
    ├─► GLMProvider
    │   └── [existing methods]
    │
    ├─► ClaudeProvider (NEW)
    │   └── generateStructuredOutput()
    │
    └─► MistralProvider (NEW)
        └── generateJsonOutput()
```

## Integration Pattern

### Standard Integration Flow

```typescript
// 1. Define interface
interface ServiceData {
  field1: string;
  field2?: number;
}

// 2. Decorate class
@ThirdParty({
  identifier: 'service',
  title: 'Service Name',
  description: 'Description',
  position: 'media',
  fields: [],
})

// 3. Extend base
export class ServiceProvider extends ThirdPartyAbstract<ServiceData> {
  // 4. Implement required
  async checkConnection(apiKey: string) { /* ... */ }
  async sendData(apiKey: string, data: ServiceData) { /* ... */ }

  // 5. Add custom methods
  async customMethod() { /* ... */ }
}

// 6. Register in module
@Module({
  providers: [ServiceProvider, ...],
})
```

## Database Schema

```sql
-- ThirdParty table stores API keys per organization
CREATE TABLE third_party (
  id              VARCHAR PRIMARY KEY,
  identifier      VARCHAR NOT NULL,      -- e.g., 'heygen', 'synthesia'
  name            VARCHAR NOT NULL,      -- Display name
  api_key         TEXT NOT NULL,         -- Encrypted API key
  internal_id     VARCHAR NOT NULL,      -- Provider's user ID
  organization_id VARCHAR NOT NULL,      -- Workspace isolation
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  deleted_at      TIMESTAMP NULL,

  INDEX idx_org_id (organization_id),
  INDEX idx_identifier (identifier),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Usage tracking (for AI Router)
CREATE TABLE ai_usage (
  id              VARCHAR PRIMARY KEY,
  organization_id VARCHAR NOT NULL,
  provider        VARCHAR NOT NULL,      -- 'OPENAI', 'CLAUDE', etc.
  task_type       VARCHAR NOT NULL,
  input_tokens    INTEGER NOT NULL,
  output_tokens   INTEGER NOT NULL,
  cost            DECIMAL(10,6) NOT NULL,
  latency_ms      INTEGER NOT NULL,
  success         BOOLEAN NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW(),

  INDEX idx_org_provider (organization_id, provider),
  INDEX idx_created (created_at)
);
```

## API Endpoints

```
POST   /third-party/:identifier           # Add integration
GET    /third-party/list                  # List all available
DELETE /third-party/:id                   # Remove integration
POST   /third-party/function/:id/:name    # Call provider method
POST   /third-party/:id/submit            # Submit data

# AI Router
POST   /ai/completion                     # Generate AI content
GET    /ai/providers                      # List AI providers
GET    /ai/quota/:orgId                   # Check quota status
GET    /ai/usage/:orgId                   # Usage statistics
```

## Security Architecture

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ HTTPS
     ▼
┌──────────────┐
│   Next.js    │
│   Frontend   │
└────┬─────────┘
     │ API Call + JWT
     ▼
┌──────────────┐
│   NestJS     │
│   Backend    │◄────── JWT Validation
└────┬─────────┘
     │
     ├─► Check Organization
     │
     ├─► Get Encrypted API Key
     │
     ├─► Decrypt API Key
     │
     └─► Call External API
          │
          ▼
     ┌──────────────┐
     │ External API │
     └──────────────┘
```

## Performance Considerations

### Caching Strategy

```
Request
  │
  ├─► Check Cache
  │     │
  │     ├─► Hit? Return
  │     │
  │     └─► Miss? Continue
  │
  ├─► Call Provider
  │
  └─► Cache Result (TTL: 1h)
```

### Rate Limiting

```
Request
  │
  ├─► Check Rate Limit (Redis)
  │     │
  │     ├─► Exceeded? Error 429
  │     │
  │     └─► OK? Continue
  │
  └─► Process Request
```

### Queue Processing (Optional)

```
Request
  │
  ├─► Async Job?
  │     │
  │     ├─► Yes: Add to Queue
  │     │        │
  │     │        └─► Process Later
  │     │
  │     └─► No: Process Now
  │
  └─► Return Result/JobID
```

## Monitoring & Observability

```
Every Request
  │
  ├─► Log Request
  │
  ├─► Track Metrics
  │     ├── Latency
  │     ├── Success Rate
  │     ├── Error Rate
  │     └── Cost
  │
  ├─► Update Health Status
  │
  └─► Alert on Errors
```

## Scalability

### Horizontal Scaling

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Backend 1  │     │  Backend 2  │     │  Backend 3  │
│  (NestJS)   │     │  (NestJS)   │     │  (NestJS)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────▼──────┐
                    │Load Balancer│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │   (Master)  │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        ┌─────▼─────┐             ┌────▼──────┐
        │PostgreSQL │             │PostgreSQL │
        │(Replica 1)│             │(Replica 2)│
        └───────────┘             └───────────┘
```

## Deployment Architecture

```
Production Environment
├── Frontend (Vercel/Cloudflare)
│   └── Static Assets + SSR
├── Backend (AWS/GCP/Hetzner)
│   ├── API Servers (Auto-scaling)
│   ├── Database (PostgreSQL)
│   ├── Redis (Caching/Rate Limiting)
│   └── Queue (Optional: BullMQ)
├── Monitoring
│   ├── Logging (Winston/Pino)
│   ├── Metrics (Prometheus)
│   └── Alerts (PagerDuty)
└── External Services
    ├── Video APIs
    ├── Audio APIs
    ├── AI APIs
    └── Content APIs
```

## Summary

This integration architecture provides:
- ✅ Unified interface for all providers
- ✅ Type-safe TypeScript implementation
- ✅ Scalable, horizontally-scalable design
- ✅ Secure API key management
- ✅ Comprehensive error handling
- ✅ Real-time monitoring and metrics
- ✅ Hybrid AI routing with fallback
- ✅ Extensible plugin system
- ✅ Production-ready infrastructure

---

**Architecture Style**: Microservices-ready Monolith
**Scalability**: Horizontal
**Security**: Multi-layer with encryption
**Monitoring**: Built-in metrics and logging
**Maintainability**: High (consistent patterns)
