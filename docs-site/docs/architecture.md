# ARKYRA Architecture

This document provides an overview of ARKYRA's architecture, explaining how the different components interact and how the system is designed for scalability, reliability, and performance.

## System Overview

ARKYRA operates as an integrated platform consisting of four primary services and three external dependencies. The main services communicate via HTTP and message queues, while external services provide data persistence, caching, and workflow orchestration.

```
┌─────────────────────────────────────────────────────────────┐
│                         ARKYRA Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Frontend   │◄────►│   Backend    │                    │
│  │  (Next.js)   │      │   (NestJS)   │                    │
│  └──────────────┘      └───────┬──────┘                    │
│                                 │                            │
│                    ┌────────────┼────────────┐              │
│                    ▼            ▼            ▼              │
│          ┌──────────────┐ ┌──────────┐ ┌──────────┐        │
│          │     Cron     │ │  Worker  │ │  Worker  │        │
│          │   Service    │ │ Service  │ │ Service  │        │
│          └──────┬───────┘ └────┬─────┘ └────┬─────┘        │
│                 │              │            │               │
└─────────────────┼──────────────┼────────────┼───────────────┘
                  │              │            │
        ┌─────────┴──────┬───────┴────────┬───┴─────┐
        ▼                ▼                ▼         ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐ ┌──────────┐
  │PostgreSQL│    │  Redis   │    │ Temporal │ │ Storage  │
  │ Database │    │  Queue   │    │Workflows │ │  (R2/S3) │
  └──────────┘    └──────────┘    └──────────┘ └──────────┘
```

## Core Services

### Frontend Service

The user-facing web interface built with Next.js 15, React 19, and TailwindCSS 4.

**Responsibilities:**
- User authentication and session management
- Post scheduling interface
- Analytics dashboard
- Team collaboration UI
- Account management
- Real-time notifications

**Technology Stack:**
- Next.js 15 (App Router)
- React 19 with Server Components
- TailwindCSS 4 for styling
- TypeScript for type safety
- SWR for data fetching
- WebSocket for real-time updates

**Key Features:**
- Server-side rendering (SSR)
- Incremental static regeneration (ISR)
- Optimistic UI updates
- Progressive web app (PWA) support
- RTL (right-to-left) layout support
- Multi-language support (Arabic, English, French, Spanish, German)

### Backend Service

The "brain" of ARKYRA, orchestrating all operations and business logic.

**Responsibilities:**
- RESTful API endpoints
- Authentication and authorization
- Social media platform integration
- AI provider orchestration
- Database operations
- File upload handling
- Webhook processing
- Rate limiting

**Technology Stack:**
- NestJS 10 framework
- Node.js 22 runtime
- Prisma ORM for database access
- Passport.js for authentication
- Bull for queue management
- Winston for logging

**Architecture Patterns:**
- Layered architecture (Controllers → Services → Repositories)
- Dependency injection
- DTOs for data validation
- Guards for authorization
- Interceptors for logging and transformation
- Filters for exception handling

**Database Schema:**
The backend connects to PostgreSQL via Prisma, managing:
- Users and authentication
- Workspaces and teams
- Social media integrations
- Scheduled posts
- Analytics data
- Audit logs

### Cron Service

Handles scheduled and recurring background tasks.

**Responsibilities:**
- Refresh social media platform tokens (OAuth token renewal)
- Check for trending topics hourly
- Update repository star counts daily
- Clean up expired sessions
- Generate scheduled reports
- Prune old audit logs
- Monitor system health

**Technology Stack:**
- NestJS with @nestjs/schedule
- Node-cron for scheduling
- Shared backend libraries

**Schedule Types:**
- Fixed intervals (every hour, every day)
- Cron expressions for complex schedules
- Dynamic scheduling based on user settings

### Worker Service

Processes queued jobs from Redis, handling asynchronous tasks.

**Responsibilities:**
- Publishing posts to social media platforms
- Processing uploaded media (compression, optimization)
- Generating AI content (text, images, videos)
- Sending notifications
- Processing webhooks
- Executing workflow tasks
- Handling retry logic for failed operations

**Technology Stack:**
- NestJS with Bull queues
- Redis for queue storage
- Shared backend libraries

**Queue Types:**
- **Post Publishing Queue**: High priority, handles scheduled posts
- **Media Processing Queue**: Medium priority, processes uploads
- **AI Generation Queue**: Low priority, generates content
- **Webhook Queue**: Medium priority, processes webhooks
- **Notification Queue**: High priority, sends notifications

**Scaling:**
Multiple worker instances can be deployed to handle increased load:

```bash
docker compose up -d --scale worker=3
```

### Orchestrator Service

Manages complex workflows using Temporal.

**Responsibilities:**
- Campaign workflow orchestration
- Multi-step content generation
- Approval workflows
- Scheduled content sequences
- Retry and error handling
- Long-running processes

**Technology Stack:**
- Temporal workflows
- Temporal activities
- NestJS workers

**Workflow Examples:**
- **Content Campaign**: Generate → Review → Schedule → Publish → Analyze
- **Approval Flow**: Create → Submit → Approve → Publish
- **Recurring Series**: Generate content series weekly
- **AI Fallback**: Try primary AI → Fallback to secondary → Alert if failed

## External Dependencies

### PostgreSQL Database

Primary data persistence layer.

**Configuration:**
- PostgreSQL 16
- Connection pooling via Prisma
- Read replicas supported
- Automated backups recommended

**Database Structure:**
- User and authentication tables
- Workspace and team tables
- Social media integration tables
- Post scheduling tables
- Analytics tables
- Audit log tables

**Performance Optimizations:**
- Indexed foreign keys
- Materialized views for analytics
- Partitioned tables for logs
- Connection pooling

### Redis Queue & Cache

Distributed task queue and caching layer.

**Use Cases:**
- Job queues (Bull)
- Session storage
- Rate limiting
- API response caching
- Real-time pub/sub

**Configuration:**
- Redis 7
- Persistence enabled (AOF + RDB)
- Maxmemory policy: allkeys-lru
- Cluster mode supported for scaling

**Queue Management:**
- Separate queues for different job types
- Priority-based processing
- Retry with exponential backoff
- Dead letter queue for failed jobs

### Temporal Workflows

Reliable workflow orchestration for long-running processes.

**Benefits:**
- Automatic retry logic
- State persistence
- Workflow versioning
- Activity timeouts
- Signal and query support

**Configuration:**
- Temporal Server
- Temporal UI for monitoring
- Worker registration
- Namespace isolation

### Storage (Cloudflare R2 / S3)

Object storage for user-uploaded media.

**Supported:**
- Cloudflare R2
- Amazon S3
- S3-compatible services
- Local filesystem (development only)

**Features:**
- Direct uploads from browser
- Signed URLs for secure access
- Automatic image optimization
- Video transcoding support
- CDN integration

## Data Flow

### Post Scheduling Flow

```
┌──────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│ Frontend │────►│ Backend │────►│PostgreSQL│     │  Redis  │
│   User   │     │   API   │     │ Database │◄───►│  Queue  │
└──────────┘     └─────────┘     └──────────┘     └────┬────┘
                                                         │
                                                         ▼
                                                   ┌─────────┐
                                                   │ Worker  │
                                                   │ Service │
                                                   └────┬────┘
                                                        │
                                                        ▼
                                               ┌────────────────┐
                                               │ Social Media   │
                                               │   Platforms    │
                                               └────────────────┘
```

1. User creates post via frontend
2. Frontend sends request to backend API
3. Backend validates and stores post in PostgreSQL
4. Backend adds job to Redis queue
5. Worker picks up job at scheduled time
6. Worker publishes to social media platform(s)
7. Worker updates status in database
8. Backend sends notification to frontend

### AI Content Generation Flow

```
┌──────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│ Frontend │────►│ Backend │────►│PostgreSQL│     │AI Router│
│   User   │     │   API   │     │ Database │     │ Service │
└──────────┘     └─────────┘     └──────────┘     └────┬────┘
                                                         │
                              ┌──────────────────────────┼────────────┐
                              ▼                          ▼            ▼
                        ┌──────────┐             ┌──────────┐  ┌──────────┐
                        │  OpenAI  │             │  Gemini  │  │  Claude  │
                        │    API   │             │   API    │  │   API    │
                        └──────────┘             └──────────┘  └──────────┘
```

1. User requests AI-generated content
2. Backend routes to AI Router service
3. AI Router selects provider based on:
   - User preferences
   - Quota availability
   - Provider health status
   - Content type requirements
4. AI Router calls selected provider
5. On failure, fallback to secondary provider
6. Response returned to user
7. Usage tracked in database

## Scalability & Performance

### Horizontal Scaling

ARKYRA is designed to scale horizontally:

**Frontend:**
- Multiple frontend instances behind load balancer
- Static asset CDN
- Edge caching with Next.js

**Backend:**
- Stateless API servers
- Load balancer for request distribution
- Shared Redis for session storage

**Workers:**
- Scale worker instances independently
- Queue-based work distribution
- Automatic load balancing

### Caching Strategy

**Application-Level Caching:**
- API response caching in Redis
- User session caching
- Social media profile caching
- Rate limit counters

**Database-Level Caching:**
- Prisma query caching
- Connection pooling
- Materialized views

**CDN Caching:**
- Static assets (JS, CSS, images)
- User-uploaded media
- API responses (where appropriate)

### Performance Optimization

**Frontend:**
- Code splitting and lazy loading
- Image optimization (Next.js Image)
- Server-side rendering for critical pages
- Client-side caching with SWR

**Backend:**
- Database query optimization
- Connection pooling
- Bulk operations for batch processing
- Asynchronous processing for heavy tasks

**Worker:**
- Batch processing where possible
- Parallel job execution
- Efficient retry strategies

## Security Architecture

### Authentication & Authorization

**Authentication:**
- JWT-based session tokens
- Refresh token rotation
- OAuth 2.0 for social platforms
- SSO/OIDC for enterprise

**Authorization:**
- Role-based access control (RBAC)
- Workspace-level isolation
- API key authentication for integrations
- Rate limiting per user/workspace

### Data Security

**At Rest:**
- Encrypted database connections
- Encrypted storage for sensitive data
- Secure credential management

**In Transit:**
- HTTPS/TLS for all connections
- Secure WebSocket connections
- API signature verification

### Compliance

**Audit Logging:**
- All user actions logged
- API access logged
- System events logged
- Configurable retention policies

**Data Privacy:**
- GDPR compliance ready
- Data export capabilities
- Right to deletion support
- Privacy controls

## Monitoring & Observability

### Logging

**Application Logs:**
- Structured JSON logging
- Log levels (error, warn, info, debug)
- Correlation IDs for request tracking
- Log aggregation (recommended: ELK, Loki)

### Metrics

**System Metrics:**
- CPU, memory, disk usage
- Request rate and latency
- Error rates
- Queue depths

**Business Metrics:**
- Posts scheduled/published
- Active users
- AI API usage
- Integration health

### Health Checks

**Endpoint Monitoring:**
- `/health` - Overall system health
- `/health/db` - Database connectivity
- `/health/redis` - Redis connectivity
- `/health/storage` - Storage availability

### Alerting

**Critical Alerts:**
- Service downtime
- Database connection failures
- Queue processing stopped
- High error rates

**Warning Alerts:**
- High resource usage
- Slow response times
- OAuth token expiration
- Quota approaching limits

## Deployment Architectures

### Development

```
┌────────────────────────────────────┐
│         Developer Machine          │
│  ┌──────────┐    ┌──────────┐     │
│  │ Frontend │    │ Backend  │     │
│  │  :3000   │    │  :3000   │     │
│  └──────────┘    └──────────┘     │
│  ┌──────────┐    ┌──────────┐     │
│  │PostgreSQL│    │  Redis   │     │
│  │  :5432   │    │  :6379   │     │
│  └──────────┘    └──────────┘     │
└────────────────────────────────────┘
```

### Single Server (Docker Compose)

```
┌────────────────────────────────────┐
│          Single Server             │
│  ┌──────────────────────────┐     │
│  │    Nginx Reverse Proxy    │     │
│  └────────────┬──────────────┘     │
│               ▼                     │
│  ┌──────────────────────────┐     │
│  │    ARKYRA Container       │     │
│  │  (Frontend + Backend)     │     │
│  └──────────────────────────┘     │
│  ┌──────────┐    ┌──────────┐     │
│  │PostgreSQL│    │  Redis   │     │
│  └──────────┘    └──────────┘     │
└────────────────────────────────────┘
```

### High Availability (Kubernetes)

```
┌──────────────────────────────────────────────┐
│           Kubernetes Cluster                  │
│                                               │
│  ┌────────────────────────────────────┐      │
│  │      Ingress Controller (Nginx)     │      │
│  └──────────────┬──────────────────────┘      │
│                 │                             │
│     ┌───────────┼──────────┐                 │
│     ▼           ▼          ▼                 │
│  ┌───────┐ ┌───────┐ ┌───────┐              │
│  │Frontend│ │Frontend│ │Frontend│             │
│  │  Pod   │ │  Pod   │ │  Pod   │             │
│  └───────┘ └───────┘ └───────┘              │
│                                               │
│  ┌───────┐ ┌───────┐ ┌───────┐              │
│  │Backend │ │Backend │ │Backend │             │
│  │  Pod   │ │  Pod   │ │  Pod   │             │
│  └───────┘ └───────┘ └───────┘              │
│                                               │
│  ┌───────┐ ┌───────┐ ┌───────┐              │
│  │Worker  │ │Worker  │ │Worker  │             │
│  │  Pod   │ │  Pod   │ │  Pod   │             │
│  └───────┘ └───────┘ └───────┘              │
│                                               │
│  ┌──────────────┐    ┌──────────────┐        │
│  │ PostgreSQL   │    │  Redis       │        │
│  │ StatefulSet  │    │ StatefulSet  │        │
│  └──────────────┘    └──────────────┘        │
└──────────────────────────────────────────────┘
```

## Technology Decisions

### Why Next.js?
- Server-side rendering for SEO
- Excellent developer experience
- Built-in optimization
- Strong ecosystem

### Why NestJS?
- Enterprise-ready framework
- Dependency injection
- Modular architecture
- TypeScript first

### Why PostgreSQL?
- Robust and reliable
- Rich feature set
- Excellent performance
- JSON support for flexible data

### Why Redis?
- Fast in-memory operations
- Reliable queue implementation
- Built-in pub/sub
- Persistence options

### Why Temporal?
- Reliable workflow execution
- Built-in retry logic
- State management
- Versioning support

## Next Steps

- [Installation Guide →](/docs/installation/docker-compose)
- [Configuration Reference →](/docs/configuration/reference)
- [API Documentation →](/docs/api/overview)
- [Contributing Guide →](/docs/contributing)
