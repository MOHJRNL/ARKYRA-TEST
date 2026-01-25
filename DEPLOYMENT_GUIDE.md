# ARKYRA Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Railway Deployment](#railway-deployment)
5. [Domain Configuration](#domain-configuration)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Docker** 20.10+ and **Docker Compose** 2.0+
- **Node.js** 22.12.0+
- **pnpm** 10.6.1+
- **Git** 2.30+

### Optional Tools
- **GitHub CLI** (`gh`) for repository management
- **Railway CLI** for cloud deployment

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MOHJRNL/ARKYRA.git
cd ARKYRA
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
cp .env.arkyra.example .env
```

Edit `.env` and set the required variables:
- `NEXT_PUBLIC_BRAND_TYPE`: Set to `aj-arkyra` or `arkyra-saas`
- `POSTGRES_PASSWORD`: Set a secure password
- `REDIS_PASSWORD`: Set a secure password
- `JWT_SECRET`: Generate a random secret
- `GOOGLE_GEMINI_API_KEY`: Add your Gemini API key

### 4. Generate Prisma Client

```bash
pnpm run prisma-generate
```

### 5. Start Development Server

```bash
pnpm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api

## Docker Deployment

### Quick Start

Use the provided script for easy deployment:

```bash
./start-arkyra.sh
```

This script will:
1. Check for Docker installation
2. Create `.env` file if missing
3. Build Docker images
4. Start all services
5. Display access URLs

### Manual Docker Deployment

#### 1. Build Images

```bash
docker-compose -f docker-compose.arkyra.yaml build
```

#### 2. Start Services

```bash
docker-compose -f docker-compose.arkyra.yaml up -d
```

#### 3. Check Status

```bash
docker-compose -f docker-compose.arkyra.yaml ps
```

#### 4. View Logs

```bash
docker-compose -f docker-compose.arkyra.yaml logs -f
```

#### 5. Stop Services

```bash
docker-compose -f docker-compose.arkyra.yaml down
```

### Access Points

After deployment, access the following:

| Service | URL | Description |
|---------|-----|-------------|
| **ARKYRA Platform** | http://localhost:4007 | Main application |
| **Temporal UI** | http://localhost:8080 | Workflow monitoring |
| **PostgreSQL** | localhost:5432 | Database |
| **Redis** | localhost:6379 | Cache & queue |

## Railway Deployment

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Project

```bash
railway init
```

### 4. Add Services

Add the following services in Railway dashboard:
- **PostgreSQL** (from template)
- **Redis** (from template)

### 5. Set Environment Variables

In Railway dashboard, add all variables from `.env.arkyra.example`:

```bash
# Copy from .env file
railway variables set NEXT_PUBLIC_BRAND_TYPE=arkyra-saas
railway variables set DATABASE_URL=<railway-postgres-url>
railway variables set REDIS_URL=<railway-redis-url>
# ... add all other variables
```

### 6. Deploy

```bash
railway up
```

### 7. Get Deployment URL

```bash
railway domain
```

## Domain Configuration

### For arkyra.pro Domain

#### 1. DNS Configuration

Add the following DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | <your-server-ip> | 3600 |
| A | www | <your-server-ip> | 3600 |
| CNAME | api | arkyra.pro | 3600 |

#### 2. SSL Certificate (Let's Encrypt)

Install Certbot:

```bash
sudo apt-get install certbot python3-certbot-nginx
```

Generate certificate:

```bash
sudo certbot --nginx -d arkyra.pro -d www.arkyra.pro
```

#### 3. Update Nginx Configuration

Edit `nginx.arkyra.conf` to include SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name arkyra.pro www.arkyra.pro;

    ssl_certificate /etc/letsencrypt/live/arkyra.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/arkyra.pro/privkey.pem;

    # ... rest of configuration
}

server {
    listen 80;
    server_name arkyra.pro www.arkyra.pro;
    return 301 https://$server_name$request_uri;
}
```

Restart Nginx:

```bash
docker-compose -f docker-compose.arkyra.yaml restart arkyra-nginx
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BRAND_TYPE` | Brand type | `arkyra-saas` or `aj-arkyra` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | Redis connection | `redis://host:6379` |
| `JWT_SECRET` | JWT signing secret | Random 32+ character string |
| `GOOGLE_GEMINI_API_KEY` | Gemini API key | Your API key |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | Default language | `en` |
| `LOG_LEVEL` | Logging level | `info` |
| `FEATURE_MULTI_TENANCY` | Enable multi-tenancy | `true` |

## Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to PostgreSQL

**Solution**:
1. Check if PostgreSQL container is running:
   ```bash
   docker-compose -f docker-compose.arkyra.yaml ps arkyra-postgres
   ```
2. Verify DATABASE_URL in `.env`
3. Check PostgreSQL logs:
   ```bash
   docker-compose -f docker-compose.arkyra.yaml logs arkyra-postgres
   ```

### Redis Connection Issues

**Problem**: Cannot connect to Redis

**Solution**:
1. Check if Redis container is running
2. Verify REDIS_URL includes password if set
3. Test Redis connection:
   ```bash
   docker exec -it arkyra-redis redis-cli -a <password> ping
   ```

### Font Not Loading

**Problem**: Al-Jazeera-Arabic-Bold font not displaying

**Solution**:
1. Verify font file exists in `apps/frontend/public/fonts/`
2. Check browser console for font loading errors
3. Clear browser cache
4. Verify `arkyra-globals.css` is imported

### RTL Layout Issues

**Problem**: Arabic text not displaying right-to-left

**Solution**:
1. Check `html[dir="rtl"]` attribute in browser inspector
2. Verify language is set to Arabic in settings
3. Ensure `tailwindcss-rtl` plugin is installed
4. Check for conflicting CSS

### Docker Build Failures

**Problem**: Docker build fails

**Solution**:
1. Clear Docker cache:
   ```bash
   docker system prune -a
   ```
2. Rebuild without cache:
   ```bash
   docker-compose -f docker-compose.arkyra.yaml build --no-cache
   ```
3. Check Docker logs for specific errors

### Port Already in Use

**Problem**: Port 4007 or other ports already in use

**Solution**:
1. Find process using the port:
   ```bash
   lsof -i :4007
   ```
2. Kill the process or change port in `docker-compose.arkyra.yaml`

## Support

For additional help:
- Check the [ARKYRA_PROJECT_README.md](./ARKYRA_PROJECT_README.md)
- Review implementation guides in `/arkyra_research/`
- Create an issue on GitHub: https://github.com/MOHJRNL/ARKYRA/issues

## Next Steps

After successful deployment:
1. Complete Phase 1 tasks (see GitHub Issues)
2. Test RTL support with Arabic content
3. Verify dark mode functionality
4. Test multi-language switching
5. Configure social media API credentials
6. Set up monitoring and logging
7. Implement backup strategy
