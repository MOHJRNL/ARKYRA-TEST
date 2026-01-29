# Welcome to ARKYRA

<p align="center">
  <img src="./assets/arkyra-logo.svg" alt="ARKYRA Logo" width="280" />
</p>

ARKYRA is an enterprise-grade social media management platform built for Al Jazeera and ready for the world. Schedule posts across 14+ social media platforms, leverage AI-powered content generation, and manage your entire social media presence from a single, powerful dashboard.

## What is ARKYRA?

ARKYRA is a self-hosted, open-source social media scheduling and management platform designed for enterprises, media organizations, and businesses of all sizes. Built on a foundation of modern technologies and enterprise-ready features, ARKYRA offers:

- **Multi-Platform Scheduling**: Schedule and publish content across Instagram, YouTube, LinkedIn, TikTok, Facebook, X (Twitter), Pinterest, Threads, Discord, Mastodon, Bluesky, Reddit, Dribbble, and more.

- **AI-Powered Content Creation**: Generate high-quality social media content using advanced AI models from OpenAI, Anthropic Claude, Google Gemini, GLM 4.7, and Mistral.

- **Enterprise Features**: Multi-tenancy, role-based access control (RBAC), SSO/OIDC authentication, audit logging, and comprehensive team collaboration tools.

- **Advanced Integrations**: Connect with video generation (HeyGen, Synthesia, D-ID, Runway), audio synthesis (ElevenLabs, Murf, PlayHT), automation tools (Zapier, Make, n8n), and analytics platforms (GA4, Looker Studio, PostHog, Amplitude).

## Key Features

### Content Management
- Schedule posts with precision timing across all platforms
- Bulk upload and schedule hundreds of posts
- Media library for organizing images, videos, and assets
- Draft management and approval workflows
- Post templates for consistent branding

### AI-Powered Intelligence
- Generate engaging post content with AI
- Create stunning images with DALL-E and Midjourney
- Produce professional videos with HeyGen and Synthesia
- Voice synthesis for audio content with ElevenLabs
- Smart content optimization and suggestions
- Hybrid AI routing with automatic fallback

### Analytics & Insights
- Real-time performance tracking
- Cross-platform analytics dashboard
- Audience engagement metrics
- Growth trends and insights
- Custom reports and exports
- Integration with GA4, Looker Studio, PostHog, and Amplitude

### Team Collaboration
- Workspace-based multi-tenancy
- Role-based permissions (Admin, Editor, Viewer)
- Comment and approval workflows
- Activity audit logs
- Team notifications

### Enterprise Security
- Self-hosted data sovereignty
- SSO/OIDC integration
- Two-factor authentication
- API rate limiting
- WAF-ready architecture
- Comprehensive audit trails

## Who Should Use ARKYRA?

ARKYRA is perfect for:

- **Media Organizations**: Like Al Jazeera, managing multiple brands and hundreds of social accounts
- **Marketing Teams**: Coordinating campaigns across multiple platforms
- **Agencies**: Managing social media for multiple clients
- **Enterprises**: Requiring security, compliance, and scalability
- **Content Creators**: Looking for a powerful, self-hosted solution
- **Developers**: Building custom integrations and workflows

## Getting Started

Ready to get started with ARKYRA? Here are your next steps:

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

### Quick Start
The fastest way to get ARKYRA up and running.

[Get Started →](/docs/quickstart)

### Installation Options
Choose the installation method that fits your needs.

[View Options →](/docs/installation/docker-compose)

### Configuration
Configure ARKYRA for your environment.

[Configure →](/docs/configuration/reference)

### Integrations
Connect AI providers, social platforms, and automation tools.

[Explore Integrations →](/docs/integrations/overview)

</div>

## Architecture

ARKYRA is built on a modern, scalable architecture:

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS 4
- **Backend**: NestJS 10, Node.js 22
- **Database**: PostgreSQL 16 with Prisma ORM
- **Cache/Queue**: Redis 7
- **Workflows**: Temporal for reliable orchestration
- **Containers**: Docker & Docker Compose
- **AI Integration**: Multi-provider support with hybrid routing

Learn more about [ARKYRA's architecture →](/docs/architecture)

## Supported Platforms

ARKYRA supports content publishing to:

<div class="platform-grid">

- Instagram (Posts, Stories, Reels)
- YouTube (Videos, Shorts, Community Posts)
- LinkedIn (Posts, Articles, Company Pages)
- TikTok (Videos)
- Facebook (Posts, Pages, Groups)
- X / Twitter (Posts, Threads)
- Pinterest (Pins, Boards)
- Threads (Posts)
- Discord (Messages, Webhooks)
- Mastodon (Posts)
- Bluesky (Posts)
- Reddit (Posts, Comments)
- Dribbble (Shots)
- Google My Business (Posts)

</div>

[View all provider guides →](/docs/providers/overview)

## Community & Support

- **Documentation**: https://docs.arkyra.pro
- **GitHub Repository**: https://github.com/MOHJRNL/ARKYRA
- **Issues & Bug Reports**: https://github.com/MOHJRNL/ARKYRA/issues
- **Website**: https://arkyra.pro

## License

ARKYRA is licensed under the AGPL-3.0 license. You are free to use, modify, and distribute ARKYRA for personal and commercial use, provided you comply with the license terms.

[Read the full license →](https://github.com/MOHJRNL/ARKYRA/blob/main/LICENSE)

## Acknowledgments

ARKYRA is built on the foundation of [Postiz](https://github.com/gitroomhq/postiz-app), an excellent open-source social media scheduling tool. We extend our gratitude to the Postiz team for their pioneering work.

---

<p align="center">
  Built with ❤️ for Al Jazeera and the world
</p>
