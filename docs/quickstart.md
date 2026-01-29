# Quick Start Guide

Get ARKYRA up and running in minutes with our quick start guide. This guide will walk you through the fastest way to deploy ARKYRA using Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** 20.10 or higher
- **Docker Compose** 2.0 or higher
- **2GB RAM** minimum (4GB recommended)
- **2 vCPU** minimum (4 vCPU recommended)

## Installation Methods

ARKYRA offers several installation options depending on your needs:

<div class="installation-grid">

### Docker Compose
**Recommended for users**

The easiest way to deploy ARKYRA with all services configured and ready to go.

[Start with Docker Compose →](/docs/installation/docker-compose)

### Local Development
**Recommended for developers**

Set up a local development environment to contribute to ARKYRA or customize the codebase.

[Set up Development Environment →](/docs/installation/development)

### Docker (Standalone)
**For advanced users**

Deploy ARKYRA using standalone Docker containers with manual configuration.

[Deploy with Docker →](/docs/installation/docker)

### Kubernetes + Helm
**For production at scale**

Deploy ARKYRA on Kubernetes using Helm charts for orchestration and scalability.

[Deploy on Kubernetes →](/docs/installation/kubernetes-helm)

</div>

## Quick Start with Docker Compose

This is the fastest way to get ARKYRA running. Follow these steps:

### Step 1: Clone the Repository

```bash
git clone https://github.com/MOHJRNL/ARKYRA.git
cd ARKYRA
```

### Step 2: Configure Environment Variables

Copy the example environment file and edit it with your configuration:

```bash
cp .env.arkyra.example .env
```

Edit the `.env` file with your favorite editor:

```bash
nano .env
# or
vim .env
```

At minimum, configure these required variables:

```env
# Application URLs
MAIN_URL=http://localhost:4007
FRONTEND_URL=http://localhost:4007

# Security
JWT_SECRET=your-unique-random-string-here

# Database
DATABASE_URL=postgresql://arkyra:arkyra_password@postgres:5432/arkyra

# Redis
REDIS_URL=redis://redis:6379

# Temporal
TEMPORAL_ADDRESS=temporal:7233

# AI Provider (at least one)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
# or
OPENAI_API_KEY=your-openai-api-key
```

### Step 3: Start ARKYRA

Use the convenient startup script:

```bash
./start-arkyra.sh
```

Or start services manually:

```bash
docker compose up -d
```

### Step 4: Access ARKYRA

Once all services are running, you can access:

- **ARKYRA Platform**: http://localhost:4007
- **Temporal UI**: http://localhost:8080

### Step 5: Create Your First User

1. Navigate to http://localhost:4007
2. Click "Sign Up" to create your first account
3. Enter your details and create your workspace
4. Start scheduling your first posts!

## What's Next?

Now that you have ARKYRA running, here are some recommended next steps:

### Connect Social Media Accounts

Learn how to connect your social media platforms:

- [Instagram Setup →](/docs/providers/instagram)
- [LinkedIn Setup →](/docs/providers/linkedin)
- [X/Twitter Setup →](/docs/providers/x)
- [TikTok Setup →](/docs/providers/tiktok)
- [View all providers →](/docs/providers/overview)

### Configure AI Integrations

Enhance ARKYRA with AI-powered features:

- [OpenAI Integration →](/docs/integrations/openai)
- [Google Gemini Integration →](/docs/integrations/gemini)
- [Claude Integration →](/docs/integrations/claude)
- [Hybrid AI Router →](/docs/integrations/hybrid-routing)

### Set Up Automation

Connect ARKYRA to your automation tools:

- [Webhooks →](/docs/integrations/webhooks)
- [Zapier →](/docs/integrations/zapier)
- [Make (Integromat) →](/docs/integrations/make)
- [n8n →](/docs/integrations/n8n)

### Configure Video & Audio Generation

Add multimedia capabilities:

- [HeyGen Video →](/docs/integrations/heygen)
- [Synthesia Video →](/docs/integrations/synthesia)
- [ElevenLabs Audio →](/docs/integrations/elevenlabs)

### Customize Your Installation

Learn how to customize ARKYRA:

- [Environment Variables Reference →](/docs/configuration/reference)
- [Branding Configuration →](/docs/configuration/branding)
- [Email Notifications →](/docs/configuration/emails)
- [Storage Configuration →](/docs/configuration/storage)

## Troubleshooting

### Services Won't Start

If services fail to start, check:

1. **Docker is running**: `docker ps`
2. **Ports are available**: Ensure ports 4007, 5432, 6379, and 8080 are not in use
3. **Environment variables are set**: Check your `.env` file
4. **View logs**: `docker compose logs -f`

### Can't Access the Application

If you can't access http://localhost:4007:

1. **Check service status**: `docker compose ps`
2. **Verify FRONTEND_URL**: Ensure it matches your access URL
3. **Check firewall**: Ensure port 4007 is open
4. **View frontend logs**: `docker compose logs frontend`

### Database Connection Errors

If you see database connection errors:

1. **Check PostgreSQL is running**: `docker compose ps postgres`
2. **Verify DATABASE_URL**: Ensure it matches your configuration
3. **Check PostgreSQL logs**: `docker compose logs postgres`
4. **Try restarting**: `docker compose restart backend`

### Need More Help?

- **View full logs**: `docker compose logs`
- **Restart services**: `docker compose down && docker compose up -d`
- **Check GitHub Issues**: https://github.com/MOHJRNL/ARKYRA/issues
- **Read troubleshooting guide**: [Common Issues →](/docs/troubleshooting)

## Advanced Configuration

For production deployments, consider:

- **Use a reverse proxy**: [Nginx →](/docs/reverse-proxies/nginx) | [Caddy →](/docs/reverse-proxies/caddy) | [Traefik →](/docs/reverse-proxies/traefik)
- **Enable SSL/TLS**: [SSL Setup Guide →](/docs/configuration/ssl)
- **Configure backups**: [Backup Guide →](/docs/admin/backups)
- **Set up monitoring**: [Monitoring Guide →](/docs/admin/monitoring)
- **Scale with Kubernetes**: [Kubernetes Deployment →](/docs/installation/kubernetes-helm)

## Production Deployment

For production deployments:

- Use strong, unique values for `JWT_SECRET`
- Configure a managed PostgreSQL database
- Use Redis persistence or managed Redis
- Set up regular backups
- Enable SSL/TLS encryption
- Configure monitoring and alerting
- Review security best practices: [Security Guide →](/docs/admin/security)

---

**Ready to dive deeper?** Check out the [full installation guide →](/docs/installation/docker-compose) for more detailed instructions and configuration options.
