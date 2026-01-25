# ARKYRA - Enterprise Social Media Management Platform

## Project Overview

**ARKYRA** is a custom-built, self-hosted enterprise social media management platform developed for Al Jazeera. It is based on the open-source Postiz platform, with extensive customization for Al Jazeera's brand identity, security requirements, and enterprise features.

### Key Characteristics

- **Brand**: ARKYRA (arkyra.pro) - SaaS product by "AJ ARKYRA" (Al Jazeera's internal platform)
- **Deployment**: Self-hosted via Docker Compose with easy migration path to Kubernetes
- **Scale**: Supports 190+ social media accounts with advanced API rate limiting
- **Security**: Enterprise-grade with WAF, SSO/OIDC, RBAC, and audit logging
- **Multi-tenancy**: Workspace-based architecture, SaaS-ready from day one
- **AI Integration**: Google Gemini API for content generation
- **Languages**: 5-language support (Arabic, English, French, Spanish, German) with full RTL support

## Project Structure

```
arkyra/
├── apps/
│   ├── backend/              # NestJS backend API
│   ├── frontend/             # Next.js web application
│   ├── orchestrator/         # Temporal workflow orchestration
│   ├── commands/             # CLI commands
│   ├── extension/            # Browser extension
│   └── sdk/                  # JavaScript SDK
├── libraries/
│   ├── nestjs-libraries/     # Shared NestJS utilities
│   ├── helpers/              # Shared helper functions
│   └── react-shared-libraries/ # Shared React components
├── var/docker/               # Docker configuration scripts
├── dynamicconfig/            # Dynamic configuration
├── docker-compose.yaml       # Production Docker Compose
├── docker-compose.dev.yaml   # Development Docker Compose
├── package.json              # Root package configuration
├── pnpm-workspace.yaml       # pnpm workspace configuration
└── tsconfig.base.json        # Base TypeScript configuration
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15+, React 19+, TailwindCSS 4+ |
| **Backend** | NestJS 10+, Node.js 22+ |
| **Database** | PostgreSQL 16+ (via Prisma ORM) |
| **Caching/Queue** | Redis 7+ |
| **Workflow** | Temporal (workflow orchestration) |
| **Package Manager** | pnpm 10.6.1+ |
| **Monorepo** | NX |
| **Containerization** | Docker & Docker Compose |
| **Email** | Resend |
| **Authentication** | OIDC/OAuth2 |
| **AI** | Google Gemini API |

## Development Environment Setup

### Prerequisites

- Node.js 22.12.0 or higher
- pnpm 10.6.1 or higher
- Docker & Docker Compose
- PostgreSQL 16+ (for local development)
- Redis 7+ (for local development)

### Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Generate Prisma client:**
   ```bash
   pnpm run prisma-generate
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server:**
   ```bash
   pnpm run dev
   ```

   This will start all services in parallel:
   - Frontend (http://localhost:3000)
   - Backend API (http://localhost:3000/api)
   - Orchestrator
   - Extension

### Docker Development

Start the entire stack with Docker Compose:

```bash
pnpm run dev:docker
```

This will start:
- PostgreSQL database
- Redis cache
- All ARKYRA services

## Key Features

### Core Functionality

- **Multi-Platform Scheduling**: Schedule posts across 10+ social media platforms
- **Team Collaboration**: Comment, approve, and manage posts with team members
- **Analytics**: Track performance metrics across platforms
- **AI-Powered Content**: Generate content using Google Gemini API
- **API-First Design**: Integrate with N8N, Make.com, Zapier, and custom workflows

### Enterprise Features

- **Multi-Tenancy**: Workspace-based isolation for multiple organizations
- **RBAC**: Role-based access control with granular permissions
- **SSO/OIDC**: Single Sign-On integration for enterprise authentication
- **Audit Logging**: Track all user actions and system events
- **WAF Integration**: Web Application Firewall protection

### Customization

- **Al Jazeera Branding**: Custom colors, fonts, and logos
- **RTL Support**: Full right-to-left layout for Arabic
- **Dark Mode**: Optional dark theme
- **Multi-Language**: 5-language support with Arabic as primary

## Supported Social Platforms

- X (Twitter)
- Facebook
- Instagram
- TikTok
- YouTube
- LinkedIn
- Bluesky
- Mastodon
- Discord
- Threads
- Pinterest
- Reddit
- Dribbble
- Twitch

## Deployment

### Docker Compose (Recommended)

```bash
docker-compose up -d
```

Access the application at `http://localhost:4007`

### Environment Configuration

Key environment variables in `.env`:

```env
MAIN_URL=http://localhost:4007
FRONTEND_URL=http://localhost:4007
DATABASE_URL=postgresql://user:password@postgres:5432/arkyra
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret-key
TEMPORAL_ADDRESS=temporal:7233
GOOGLE_GEMINI_API_KEY=your-api-key
```

## Project Phases

### Phase 1: Foundation & Rebranding (MVP)
- Rebranding with Al Jazeera colors and fonts
- RTL/Arabic support
- Dark theme
- 5-language support
- Basic multi-tenancy

### Phase 2: Core Features & AI Integration
- Google Gemini API integration
- API rate limiting system
- Advanced analytics
- Enhanced collaboration

### Phase 3: Enterprise Features
- WAF integration
- SSO/OIDC setup
- RBAC framework
- Audit logging

### Phase 4: SaaS Readiness
- Multi-tenant billing
- Subscription management
- Plugin system
- Public website (arkyra.pro)

## Contributing

Please refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the AGPL-3.0 license. See [LICENSE](./LICENSE) for details.

## Support

For technical support and questions, please contact the development team or refer to the project documentation.

## Project Metadata

- **Project Name**: ARKYRA
- **Organization**: Al Jazeera
- **Website**: arkyra.pro
- **Repository**: Private (GitHub)
- **Status**: In Development
- **Last Updated**: January 25, 2026
