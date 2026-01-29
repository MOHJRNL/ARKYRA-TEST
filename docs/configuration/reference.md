# Environment Variables Reference

ARKYRA relies entirely on environment variables for configuration. This page provides a complete reference of all available configuration options.

## Required Variables

These variables must be configured for ARKYRA to function:

### Database Configuration

```env
DATABASE_URL=postgresql://username:password@host:port/database
```

**Description:** PostgreSQL connection string for the main database.

**Format:** `postgresql://[user[:password]@][host][:port][/database]`

**Example:**
```env
DATABASE_URL=postgresql://arkyra:securepassword@postgres:5432/arkyra
```

**Supported Databases:**
- PostgreSQL 12+ (recommended)
- MariaDB 10.5+ (via Prisma)
- MySQL 8.0+ (via Prisma)

### Redis Configuration

```env
REDIS_URL=redis://[[:password]@]host:port
```

**Description:** Redis connection string for caching and job queues.

**Example:**
```env
# Without password
REDIS_URL=redis://redis:6379

# With password
REDIS_URL=redis://:mypassword@redis:6379

# With database selection
REDIS_URL=redis://redis:6379/0
```

### Security

```env
JWT_SECRET=your-unique-random-string-minimum-32-characters
```

**Description:** Secret key for signing JWT authentication tokens. Must be unique per installation.

**IMPORTANT:** This should be a long, random string that is kept secret.

**Generate:**
```bash
# Linux/macOS
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Application URLs

```env
MAIN_URL=http://localhost:4007
FRONTEND_URL=http://localhost:4007
NEXT_PUBLIC_BACKEND_URL=http://localhost:4007/api
BACKEND_INTERNAL_URL=http://backend:3000
```

**Descriptions:**
- `MAIN_URL`: Primary application URL (used for emails and redirects)
- `FRONTEND_URL`: Frontend application URL
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL accessible from browser
- `BACKEND_INTERNAL_URL`: Internal backend URL for server-side calls

**Production Example:**
```env
MAIN_URL=https://arkyra.yourdomain.com
FRONTEND_URL=https://arkyra.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://arkyra.yourdomain.com/api
BACKEND_INTERNAL_URL=http://backend:3000
```

### Temporal Configuration

```env
TEMPORAL_ADDRESS=temporal:7233
```

**Description:** Temporal workflow server address for job orchestration.

**Default:** `temporal:7233` (Docker Compose)

## Optional Variables

### Access Control

```env
DISABLE_REGISTRATION=true
```

**Description:** When set to `true`, only allows one user registration, then disables the signup form. Useful for single-user self-hosted instances.

**Note:** This also disables OAuth/OIDC authentication.

**Default:** `false`

### Performance

```env
DISABLE_IMAGE_COMPRESSION=true
```

**Description:** When set to `true`, skips automatic image compression. Useful for testing or when using pre-optimized images.

**Default:** `false`

### Branding

```env
NEXT_PUBLIC_BRAND_TYPE=aj-arkyra
```

**Description:** Controls branding mode.

**Options:**
- `aj-arkyra`: Al Jazeera internal branding
- `arkyra-saas`: Public SaaS branding

**Default:** `arkyra-saas`

### Language

```env
NEXT_PUBLIC_DEFAULT_LANGUAGE=ar
```

**Description:** Default UI language.

**Options:** `ar` (Arabic), `en` (English), `fr` (French), `es` (Spanish), `de` (German)

**Default:** `en`

## AI Provider Configuration

### OpenAI

```env
OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION_ID=org-...
OPENAI_DEFAULT_MODEL=gpt-4-turbo-preview
```

**Features:**
- GPT-4, GPT-3.5 Turbo for text generation
- DALL-E 3 for image generation
- Whisper for audio transcription

**Get API Key:** https://platform.openai.com/api-keys

### Google Gemini

```env
GOOGLE_GEMINI_API_KEY=AIza...
GOOGLE_GEMINI_DEFAULT_MODEL=gemini-pro
```

**Features:**
- Gemini Pro for text generation
- Gemini Pro Vision for multimodal tasks

**Get API Key:** https://makersuite.google.com/app/apikey

### Anthropic Claude

```env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_DEFAULT_MODEL=claude-3-opus-20240229
```

**Features:**
- Claude 3 Opus (most capable)
- Claude 3 Sonnet (balanced)
- Claude 3 Haiku (fastest)

**Get API Key:** https://console.anthropic.com/

### Mistral AI

```env
MISTRAL_API_KEY=...
MISTRAL_DEFAULT_MODEL=mistral-large-latest
```

**Features:**
- Mistral Large (most capable)
- Mistral Medium (balanced)
- Mistral Small (efficient)

**Get API Key:** https://console.mistral.ai/

### GLM 4.7

```env
GLM_API_KEY=...
GLM_DEFAULT_MODEL=glm-4
```

**Features:**
- Chinese language AI model
- Multilingual support

**Get API Key:** https://open.bigmodel.cn/

## Social Media Platform Configuration

### LinkedIn

```env
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

**Redirect URI:**
- Production: `https://your-domain.com/integrations/social/linkedin`
- Development: `http://localhost:4200/integrations/social/linkedin`

**Setup Guide:** [LinkedIn Provider Setup](/docs/providers/linkedin)

### LinkedIn Page

```env
LINKEDIN_PAGE_CLIENT_ID=your-linkedin-page-client-id
LINKEDIN_PAGE_CLIENT_SECRET=your-linkedin-page-client-secret
```

**Redirect URI:** `https://your-domain.com/integrations/social/linkedin-page`

### X / Twitter

```env
X_CLIENT_ID=your-x-client-id
X_CLIENT_SECRET=your-x-client-secret
```

**Redirect URI:** `https://your-domain.com/integrations/social/x`

**Setup Guide:** [X Provider Setup](/docs/providers/x)

### Facebook / Instagram

```env
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

**Redirect URI:** `https://your-domain.com/integrations/social/facebook`

**Setup Guide:** [Facebook Provider Setup](/docs/providers/facebook)

### TikTok

```env
TIKTOK_CLIENT_KEY=your-tiktok-client-key
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
```

**Redirect URI:** `https://your-domain.com/integrations/social/tiktok`

### YouTube

```env
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret
```

**Redirect URI:** `https://your-domain.com/integrations/social/youtube`

### Reddit

```env
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
```

**Redirect URI:** `https://your-domain.com/integrations/social/reddit`

### GitHub

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Used for:** Repository integration and authentication

## Storage Configuration

### Local Storage

```env
UPLOAD_DIRECTORY=/app/uploads
STORAGE_PROVIDER=local
```

**Description:** Store uploaded files locally in a directory.

**Recommended:** Development only

### Cloudflare R2

```env
STORAGE_PROVIDER=r2
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_ACCESS_KEY=your-access-key
CLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_BUCKETNAME=arkyra-media
CLOUDFLARE_BUCKET_URL=https://your-bucket.r2.cloudflarestorage.com
CLOUDFLARE_REGION=auto
```

**Setup Guide:** [Cloudflare R2 Configuration](/docs/configuration/r2)

### Amazon S3

```env
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=arkyra-media
```

## Email Configuration

### Resend (Recommended)

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
EMAIL_FROM_NAME=ARKYRA
EMAIL_FROM_ADDRESS=noreply@arkyra.pro
```

**Get API Key:** https://resend.com/

### SMTP

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM_NAME=ARKYRA
EMAIL_FROM_ADDRESS=your-email@gmail.com
```

**Setup Guide:** [Email Configuration](/docs/configuration/emails)

## Authentication Configuration

### OAuth / OIDC

```env
IS_GENERAL_OIDC=true
OIDC_NAME=Your Company SSO
OIDC_CLIENT_ID=your-oidc-client-id
OIDC_CLIENT_SECRET=your-oidc-client-secret
OIDC_ISSUER=https://your-idp.com
OIDC_REDIRECT_URI=https://arkyra.yourdomain.com/api/auth/callback/oidc
```

**Setup Guide:** [OAuth/OIDC Configuration](/docs/configuration/oauth)

### Authentik

```env
AUTHENTIK_CLIENT_ID=your-authentik-client-id
AUTHENTIK_CLIENT_SECRET=your-authentik-client-secret
AUTHENTIK_ISSUER=https://authentik.company.com/application/o/arkyra/
AUTHENTIK_REDIRECT_URI=https://arkyra.yourdomain.com/api/auth/callback/authentik
```

## Video Generation Configuration

### HeyGen

```env
HEYGEN_API_KEY=your-heygen-api-key
```

**Get API Key:** https://app.heygen.com/

### Synthesia

```env
SYNTHESIA_API_KEY=your-synthesia-api-key
```

**Get API Key:** https://www.synthesia.io/

### D-ID

```env
DID_API_KEY=your-did-api-key
```

**Get API Key:** https://www.d-id.com/

### Runway

```env
RUNWAY_API_KEY=your-runway-api-key
```

**Get API Key:** https://runwayml.com/

## Audio Generation Configuration

### ElevenLabs

```env
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

**Get API Key:** https://elevenlabs.io/

### Murf

```env
MURF_API_KEY=your-murf-api-key
```

**Get API Key:** https://murf.ai/

### PlayHT

```env
PLAYHT_API_KEY=your-playht-api-key
PLAYHT_USER_ID=your-playht-user-id
```

**Get API Key:** https://play.ht/

## Analytics Configuration

### Google Analytics 4

```env
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-api-secret
```

### PostHog

```env
POSTHOG_API_KEY=phc_...
POSTHOG_HOST=https://app.posthog.com
```

### Amplitude

```env
AMPLITUDE_API_KEY=your-amplitude-api-key
```

## Advanced Configuration

### Node.js Options

```env
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=2048
```

### Logging

```env
LOG_LEVEL=info
LOG_FORMAT=json
```

**Options:** `error`, `warn`, `info`, `debug`

### Queue Configuration

```env
QUEUE_CONCURRENCY=5
QUEUE_MAX_ATTEMPTS=3
QUEUE_BACKOFF_DELAY=5000
```

### Rate Limiting

```env
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Session Configuration

```env
SESSION_SECRET=your-session-secret
SESSION_DURATION=86400000
```

## Environment File Example

Complete `.env` file example:

```env
# Database
DATABASE_URL=postgresql://arkyra:password@postgres:5432/arkyra

# Redis
REDIS_URL=redis://redis:6379

# Security
JWT_SECRET=your-unique-random-string-minimum-32-characters
SESSION_SECRET=another-unique-random-string

# URLs
MAIN_URL=https://arkyra.yourdomain.com
FRONTEND_URL=https://arkyra.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://arkyra.yourdomain.com/api
BACKEND_INTERNAL_URL=http://backend:3000

# Temporal
TEMPORAL_ADDRESS=temporal:7233

# Branding
NEXT_PUBLIC_BRAND_TYPE=aj-arkyra
NEXT_PUBLIC_DEFAULT_LANGUAGE=ar

# AI Providers
GOOGLE_GEMINI_API_KEY=AIza...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Social Media
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
X_CLIENT_ID=...
X_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...

# Storage
STORAGE_PROVIDER=r2
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_ACCESS_KEY=...
CLOUDFLARE_SECRET_ACCESS_KEY=...
CLOUDFLARE_BUCKETNAME=arkyra-media
CLOUDFLARE_BUCKET_URL=https://...

# Email
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_...
EMAIL_FROM_NAME=ARKYRA
EMAIL_FROM_ADDRESS=noreply@arkyra.pro

# Optional
DISABLE_REGISTRATION=false
DISABLE_IMAGE_COMPRESSION=false
NODE_ENV=production
LOG_LEVEL=info
```

## Best Practices

### Security

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT_SECRET and SESSION_SECRET
3. **Rotate secrets regularly** in production
4. **Use environment-specific files** (`.env.development`, `.env.production`)
5. **Restrict access** to environment files

### Production

1. **Use managed services** for database and Redis
2. **Enable SSL/TLS** for all connections
3. **Configure monitoring** and alerts
4. **Set up backups** for database
5. **Use secrets management** (AWS Secrets Manager, Azure Key Vault)

### Development

1. **Copy `.env.example`** to `.env`
2. **Don't share API keys** with others
3. **Use development keys** separate from production
4. **Document custom variables** in your `.env.example`

## Troubleshooting

### Database Connection Errors

**Error:** `Error: P1001: Can't reach database server`

**Check:**
1. DATABASE_URL format is correct
2. Database server is running
3. Network connectivity
4. Firewall rules

### Redis Connection Errors

**Error:** `Error: connect ECONNREFUSED`

**Check:**
1. REDIS_URL format is correct
2. Redis server is running
3. Redis password (if required)

### JWT Errors

**Error:** `JsonWebTokenError: invalid signature`

**Solution:** Ensure JWT_SECRET is consistent across all services and not changed after users log in.

### API Key Errors

**Error:** `401 Unauthorized` from AI providers

**Check:**
1. API key is valid and active
2. No extra spaces or quotes in environment variable
3. API key has required permissions
4. Billing is active

## Next Steps

- [Docker Configuration →](/docs/configuration/docker)
- [OAuth/OIDC Setup →](/docs/configuration/oauth)
- [Email Configuration →](/docs/configuration/emails)
- [Storage Configuration →](/docs/configuration/r2)
- [Installation Guide →](/docs/installation/docker-compose)
