# Docker Compose Installation

Docker Compose is the recommended installation method for most users. It provides an all-in-one solution with all services configured and ready to use.

## Prerequisites

Ensure you have the following installed:

- **Docker** 20.10 or higher
- **Docker Compose** 2.0 or higher
- **2GB RAM** minimum (4GB recommended for production)
- **2 vCPU** minimum (4 vCPU recommended for production)
- **10GB disk space** minimum (50GB+ recommended for media storage)

**Tested on:**
- Ubuntu 24.04 LTS (2GB RAM, 2 vCPU)
- macOS Monterey and later
- Windows 10/11 with WSL2

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/MOHJRNL/ARKYRA.git
cd ARKYRA
```

### Step 2: Configure Environment Variables

ARKYRA uses environment variables for all configuration. You have three options:

#### Option 1: Direct Configuration (Quick Start)

Copy the example file and edit directly:

```bash
cp .env.arkyra.example .env
nano .env
```

#### Option 2: Separate Configuration File

Create a dedicated configuration file:

```bash
mkdir -p config
nano config/arkyra.env
```

Then reference it in `docker-compose.yaml`:

```yaml
services:
  frontend:
    env_file:
      - ./config/arkyra.env
```

#### Option 3: Hybrid Approach

Combine both methods - use `.env` for common settings and override specific services in `docker-compose.yaml`.

### Step 3: Set Required Variables

Edit your `.env` file with the following required settings:

```env
# Application URLs
MAIN_URL=http://localhost:4007
FRONTEND_URL=http://localhost:4007

# Backend URLs
NEXT_PUBLIC_BACKEND_URL=http://localhost:4007/api
BACKEND_INTERNAL_URL=http://backend:3000

# Security (IMPORTANT: Use a unique random string)
JWT_SECRET=your-unique-random-string-minimum-32-characters

# Database
DATABASE_URL=postgresql://arkyra:arkyra_password@postgres:5432/arkyra

# Redis
REDIS_URL=redis://redis:6379

# Temporal
TEMPORAL_ADDRESS=temporal:7233
```

**Generate a secure JWT secret:**

```bash
# Linux/macOS
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Configure Optional Services

Add optional configurations based on your needs:

#### AI Providers

Configure at least one AI provider:

```env
# Google Gemini (recommended)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Anthropic Claude
ANTHROPIC_API_KEY=your-anthropic-api-key

# Mistral AI
MISTRAL_API_KEY=your-mistral-api-key

# GLM 4.7
GLM_API_KEY=your-glm-api-key
```

#### Social Media Platforms

Configure the platforms you want to use:

```env
# LinkedIn
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# X / Twitter
X_CLIENT_ID=your-x-client-id
X_CLIENT_SECRET=your-x-client-secret

# Facebook / Instagram
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# TikTok
TIKTOK_CLIENT_KEY=your-tiktok-client-key
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret

# YouTube
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret

# Reddit
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret

# GitHub (for repository integration)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Storage Configuration

Choose between local storage and Cloudflare R2:

**Local Storage (Development):**

```env
UPLOAD_DIRECTORY=/app/uploads
```

**Cloudflare R2 (Production):**

```env
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_ACCESS_KEY=your-cloudflare-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-cloudflare-secret-key
CLOUDFLARE_BUCKETNAME=arkyra-media
CLOUDFLARE_BUCKET_URL=https://your-bucket-url.r2.cloudflarestorage.com
CLOUDFLARE_REGION=auto
```

#### Email Notifications

Configure email provider (Resend recommended):

```env
# Resend
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM_NAME=ARKYRA
EMAIL_FROM_ADDRESS=noreply@arkyra.pro
```

#### OAuth / SSO

For enterprise authentication:

```env
# OIDC Configuration
IS_GENERAL_OIDC=true
OIDC_NAME=Your Company SSO
OIDC_CLIENT_ID=your-oidc-client-id
OIDC_CLIENT_SECRET=your-oidc-client-secret
OIDC_ISSUER=https://your-idp.com

# Or use Authentik
AUTHENTIK_CLIENT_ID=your-authentik-client-id
AUTHENTIK_CLIENT_SECRET=your-authentik-client-secret
AUTHENTIK_ISSUER=https://authentik.company.com/application/o/arkyra/
```

#### Access Control

Limit registration for self-hosted instances:

```env
# Allow only one user registration, then disable
DISABLE_REGISTRATION=true
```

**Note:** This disables OAuth/OIDC sign-ins. Remove for multi-user setups.

### Step 5: Start ARKYRA

Launch all services:

```bash
docker compose up -d
```

Or use the convenience script:

```bash
./start-arkyra.sh
```

**View startup logs:**

```bash
docker compose logs -f
```

### Step 6: Verify Installation

Check that all services are running:

```bash
docker compose ps
```

You should see:

```
NAME                STATUS              PORTS
arkyra-frontend     running             0.0.0.0:4007->4007/tcp
arkyra-backend      running             0.0.0.0:3000->3000/tcp
arkyra-worker       running
arkyra-cron         running
postgres            running             5432/tcp
redis               running             6379/tcp
temporal            running             7233/tcp, 0.0.0.0:8080->8080/tcp
```

### Step 7: Access ARKYRA

Open your browser and navigate to:

- **ARKYRA Platform**: http://localhost:4007
- **Temporal UI**: http://localhost:8080

## Post-Installation Setup

### Create Your First User

1. Navigate to http://localhost:4007
2. Click **Sign Up**
3. Enter your details:
   - Full Name
   - Email Address
   - Password (minimum 8 characters)
4. Create your first workspace
5. Complete onboarding

### Connect Social Media Accounts

After logging in:

1. Go to **Settings** → **Integrations**
2. Click **Connect** next to your desired platform
3. Follow the OAuth authorization flow
4. Verify the connection is successful

### Configure AI Providers

If you added AI provider API keys:

1. Go to **Settings** → **AI Integrations**
2. Verify your configured providers are active
3. Set quota limits per workspace
4. Test content generation

## Updating Configuration

**IMPORTANT:** When you change environment variables, you must recreate containers:

```bash
docker compose down
docker compose up -d
```

Just running `docker compose restart` will NOT apply new environment variables.

## Scaling Workers

Scale worker instances to handle more concurrent jobs:

```bash
# Scale to 3 worker instances
docker compose up -d --scale worker=3

# Check worker status
docker compose ps worker
```

## Data Persistence

ARKYRA uses Docker volumes for data persistence:

```yaml
volumes:
  postgres_data:    # Database data
  redis_data:       # Redis data
  uploads:          # Uploaded media files
  temporal_data:    # Temporal workflow state
```

**View volumes:**

```bash
docker volume ls | grep arkyra
```

**Backup volumes:**

```bash
# Backup database
docker compose exec postgres pg_dump -U arkyra arkyra > backup.sql

# Backup uploads
docker compose exec frontend tar -czf - /app/uploads > uploads-backup.tar.gz
```

## Troubleshooting

### Services Won't Start

**Check Docker resources:**

```bash
docker stats
```

Ensure you have sufficient CPU and memory allocated.

**Check port conflicts:**

```bash
# Linux/macOS
lsof -i :4007
lsof -i :3000
lsof -i :5432
lsof -i :6379

# Windows
netstat -ano | findstr :4007
```

### Database Connection Errors

**Check PostgreSQL logs:**

```bash
docker compose logs postgres
```

**Verify DATABASE_URL format:**

```
postgresql://username:password@host:port/database
```

**Test connection:**

```bash
docker compose exec backend npm run prisma -- db push
```

### Frontend Can't Connect to Backend

**Check NEXT_PUBLIC_BACKEND_URL:**

This must be accessible from the browser, not just from within Docker.

**For local development:**

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4007/api
```

**For production:**

```env
NEXT_PUBLIC_BACKEND_URL=https://arkyra.yourdomain.com/api
```

### Redis Connection Issues

**Check Redis logs:**

```bash
docker compose logs redis
```

**Test Redis connection:**

```bash
docker compose exec redis redis-cli ping
# Should return: PONG
```

**Check REDIS_URL format:**

```env
REDIS_URL=redis://redis:6379
# or with password
REDIS_URL=redis://:password@redis:6379
```

### Worker Jobs Not Processing

**Check worker logs:**

```bash
docker compose logs worker -f
```

**Check Redis queue status:**

```bash
docker compose exec redis redis-cli
> KEYS bull:*
> LLEN bull:posts:waiting
```

**Restart workers:**

```bash
docker compose restart worker
```

### High Memory Usage

**Check resource usage:**

```bash
docker stats
```

**Adjust memory limits in docker-compose.yaml:**

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 1G
```

### Viewing Logs

**All services:**

```bash
docker compose logs -f
```

**Specific service:**

```bash
docker compose logs -f backend
docker compose logs -f worker
```

**Last 100 lines:**

```bash
docker compose logs --tail=100 backend
```

## Production Recommendations

### Use External Database

For production, use a managed PostgreSQL service:

```env
DATABASE_URL=postgresql://user:password@your-managed-postgres.com:5432/arkyra
```

### Use External Redis

Use a managed Redis service for better reliability:

```env
REDIS_URL=redis://:password@your-managed-redis.com:6379
```

### Enable SSL/TLS

Use a reverse proxy (Nginx, Caddy, Traefik) with SSL:

- [Nginx Configuration →](/docs/reverse-proxies/nginx)
- [Caddy Configuration →](/docs/reverse-proxies/caddy)
- [Traefik Configuration →](/docs/reverse-proxies/traefik)

### Configure Backups

Set up automated backups:

```bash
# Cron job for daily backups
0 2 * * * docker compose exec -T postgres pg_dump -U arkyra arkyra | gzip > /backups/arkyra-$(date +\%Y\%m\%d).sql.gz
```

### Monitor Resources

Use monitoring tools:

- **Prometheus + Grafana** for metrics
- **ELK Stack** for log aggregation
- **Uptime Kuma** for availability monitoring

### Security Hardening

- Use strong, unique passwords
- Rotate JWT_SECRET regularly
- Enable firewall rules
- Use private networks for internal services
- Implement rate limiting
- Regular security updates

### Performance Optimization

```yaml
# docker-compose.yaml
services:
  backend:
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=2048
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Maintenance

### Updating ARKYRA

```bash
# Pull latest code
git pull origin main

# Rebuild containers
docker compose build

# Restart with new images
docker compose down
docker compose up -d
```

### Cleaning Up

**Remove unused images:**

```bash
docker image prune -a
```

**Remove unused volumes:**

```bash
docker volume prune
```

**Complete cleanup:**

```bash
docker compose down -v
# WARNING: This deletes all data!
```

## Next Steps

- [Configuration Reference →](/docs/configuration/reference)
- [Reverse Proxy Setup →](/docs/reverse-proxies/nginx)
- [SSL/TLS Configuration →](/docs/configuration/ssl)
- [Backup Guide →](/docs/admin/backups)
- [Monitoring Guide →](/docs/admin/monitoring)
- [Security Best Practices →](/docs/admin/security)
