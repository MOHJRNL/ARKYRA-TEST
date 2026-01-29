# ARKYRA Documentation

Welcome to the official ARKYRA documentation. This documentation provides comprehensive guides for installing, configuring, and using ARKYRA - the enterprise social media management platform built for Al Jazeera.

## Documentation Structure

```
docs/
├── introduction.md              # Platform overview and features
├── quickstart.md               # Quick start guide
├── architecture.md             # System architecture
├── contributing.md             # Contribution guidelines
├── developer-guide.md          # Developer setup guide
├── llms.txt                    # Complete documentation index
│
├── installation/               # Installation guides
│   ├── docker-compose.md
│   ├── docker.md
│   ├── kubernetes-helm.md
│   ├── coolify.md
│   ├── devcontainer.md
│   └── development.md
│
├── configuration/              # Configuration guides
│   ├── reference.md
│   ├── docker.md
│   ├── emails.md
│   ├── oauth.md
│   ├── r2.md
│   ├── branding.md
│   └── ssl.md
│
├── integrations/               # Integration guides
│   ├── overview.md
│   ├── hybrid-routing.md
│   ├── openai.md
│   ├── gemini.md
│   ├── claude.md
│   ├── mistral.md
│   ├── glm.md
│   ├── heygen.md
│   ├── synthesia.md
│   ├── d-id.md
│   ├── runway.md
│   ├── elevenlabs.md
│   ├── murf.md
│   ├── playht.md
│   ├── webhooks.md
│   ├── zapier.md
│   ├── make.md
│   ├── n8n.md
│   ├── notion.md
│   ├── google-sheets.md
│   ├── airtable.md
│   ├── ga4.md
│   ├── looker-studio.md
│   ├── posthog.md
│   └── amplitude.md
│
├── providers/                  # Social media provider guides
│   ├── overview.md
│   ├── instagram.md
│   ├── linkedin.md
│   ├── linkedin-page.md
│   ├── x.md
│   ├── facebook.md
│   ├── tiktok.md
│   ├── youtube.md
│   ├── pinterest.md
│   ├── threads.md
│   ├── discord.md
│   ├── mastodon.md
│   ├── bluesky.md
│   ├── reddit.md
│   ├── dribbble.md
│   ├── google-my-business.md
│   ├── telegram.md
│   └── slack.md
│
├── api/                        # API documentation
│   ├── overview.md
│   ├── authentication.md
│   ├── posts.md
│   ├── integrations.md
│   ├── uploads.md
│   ├── video.md
│   ├── analytics.md
│   ├── webhooks.md
│   └── rate-limiting.md
│
├── admin/                      # Administration guides
│   ├── users.md
│   ├── workspaces.md
│   ├── rbac.md
│   ├── quotas.md
│   ├── audit-logs.md
│   ├── backups.md
│   ├── monitoring.md
│   └── security.md
│
├── reverse-proxies/            # Reverse proxy configurations
│   ├── nginx.md
│   ├── caddy.md
│   └── traefik.md
│
├── troubleshooting/            # Troubleshooting guides
│   ├── index.md
│   ├── database.md
│   ├── connections.md
│   └── performance.md
│
└── assets/                     # Documentation assets
    ├── logos/
    ├── screenshots/
    └── diagrams/
```

## Quick Links

### Getting Started
- [Introduction](/docs/introduction.md) - Learn about ARKYRA
- [Quick Start](/docs/quickstart.md) - Get ARKYRA running in minutes
- [Architecture](/docs/architecture.md) - Understand the system design

### Installation
- [Docker Compose](/docs/installation/docker-compose.md) - Recommended installation
- [Kubernetes](/docs/installation/kubernetes-helm.md) - Production deployment
- [Local Development](/docs/installation/development.md) - Development setup

### Configuration
- [Environment Variables](/docs/configuration/reference.md) - Complete reference
- [Email Setup](/docs/configuration/emails.md) - Configure notifications
- [OAuth/OIDC](/docs/configuration/oauth.md) - Enterprise authentication

### Integrations
- [Integrations Overview](/docs/integrations/overview.md) - All integrations
- [Hybrid AI Router](/docs/integrations/hybrid-routing.md) - AI provider routing
- [OpenAI](/docs/integrations/openai.md) - GPT-4 and DALL-E
- [Webhooks](/docs/integrations/webhooks.md) - Custom integrations

### API
- [API Overview](/docs/api/overview.md) - REST API documentation
- [Authentication](/docs/api/authentication.md) - API authentication
- [Posts API](/docs/api/posts.md) - Create and manage posts

### Administration
- [User Management](/docs/admin/users.md) - Manage users
- [Workspaces](/docs/admin/workspaces.md) - Manage workspaces
- [Quota Management](/docs/admin/quotas.md) - Configure quotas
- [Security](/docs/admin/security.md) - Security best practices

## Documentation Features

### Al Jazeera Branding
All documentation follows Al Jazeera's visual identity:
- **Primary Color**: #048FCC (Al Jazeera Blue)
- **Secondary Color**: #F8AB0C (Al Jazeera Gold)
- **Accent Color**: #001969 (Al Jazeera Navy)

### Code Examples
Comprehensive code examples in:
- **TypeScript/JavaScript** for frontend and API usage
- **Bash/Shell** for installation and configuration
- **YAML** for Docker and Kubernetes configurations
- **Environment Variables** for setup

### Interactive Components
Documentation includes:
- React/Next.js component examples
- API request/response examples
- Configuration file templates
- Troubleshooting guides

### Multi-Language Support
Documentation supports:
- English (primary)
- Arabic (العربية)
- French (Français)
- Spanish (Español)
- German (Deutsch)

## Contributing to Documentation

We welcome contributions to improve the documentation!

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/MOHJRNL/ARKYRA.git
   cd ARKYRA/docs
   ```

2. **Create a new branch**
   ```bash
   git checkout -b docs/improve-integration-guide
   ```

3. **Make your changes**
   - Follow the existing structure
   - Use clear, concise language
   - Include code examples
   - Add screenshots where helpful

4. **Submit a pull request**
   - Describe your changes
   - Link to related issues
   - Follow the PR template

### Documentation Guidelines

**Style Guide:**
- Use clear, concise language
- Write in active voice
- Use headings to organize content
- Include code examples
- Add diagrams for complex concepts
- Test all code examples

**Formatting:**
- Use Markdown for all docs
- Follow consistent heading levels
- Use code fences for code blocks
- Include language hints for syntax highlighting
- Use tables for structured data

**Branding:**
- Use Al Jazeera colors (#048FCC, #F8AB0C, #001969)
- Replace generic names with "ARKYRA"
- Use Al Jazeera branding in examples
- Include ARKYRA logo where appropriate

## Building Documentation Site

To deploy this documentation as a website:

### Option 1: VitePress

```bash
# Install VitePress
npm install -D vitepress

# Create .vitepress/config.ts
# Run dev server
npx vitepress dev docs

# Build for production
npx vitepress build docs
```

### Option 2: Docusaurus

```bash
# Install Docusaurus
npx create-docusaurus@latest docs-site classic

# Copy docs to Docusaurus
cp -r docs/* docs-site/docs/

# Start dev server
cd docs-site && npm start

# Build for production
npm run build
```

### Option 3: Next.js (Recommended)

```bash
# Create Next.js app
npx create-next-app@latest docs-site --typescript --tailwind

# Install MDX support
npm install @next/mdx @mdx-js/loader @mdx-js/react

# Configure next.config.js for MDX
# Copy docs and build
```

## Deployment

Deploy the documentation to **docs.arkyra.pro**:

### Using Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd docs-site
vercel --prod
```

### Using Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd docs-site
netlify deploy --prod
```

### Using Cloudflare Pages

```bash
# Connect repository to Cloudflare Pages
# Configure build settings:
# Build command: npm run build
# Output directory: out
```

## Documentation Versions

- **Latest**: Main branch documentation
- **v1.0**: Initial release documentation
- **Development**: Unreleased features

## Support

Need help with the documentation?

- **GitHub Issues**: [Report documentation issues](https://github.com/MOHJRNL/ARKYRA/issues)
- **Discussions**: [Ask questions](https://github.com/MOHJRNL/ARKYRA/discussions)
- **Email**: support@arkyra.pro

## License

Documentation is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).

Code examples in documentation are licensed under MIT License.

---

<p align="center">
  <strong>Built for Al Jazeera, documented for the world</strong><br>
  <a href="https://arkyra.pro">arkyra.pro</a> | <a href="https://docs.arkyra.pro">docs.arkyra.pro</a>
</p>
