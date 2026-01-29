# Documentation Site Deployment Guide

This guide explains how to deploy the ARKYRA documentation as a static website to **docs.arkyra.pro**.

## Overview

The ARKYRA documentation is written in Markdown and can be deployed as a static website using various frameworks:

- **VitePress** (Recommended) - Fast, Vue-powered static site generator
- **Docusaurus** - React-based documentation framework
- **Next.js + MDX** - Full-featured React framework with MDX support
- **MkDocs** - Python-based documentation generator

## Option 1: VitePress (Recommended)

VitePress is fast, Vue-powered, and specifically designed for documentation sites.

### Setup

```bash
# Navigate to docs directory
cd "/Users/MOH/MOH - DATA/Work/Growingify /arkyra/docs"

# Install VitePress
npm install -D vitepress
```

### Configuration

Create `.vitepress/config.ts`:

```typescript
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'ARKYRA Documentation',
  description: 'Enterprise Social Media Management Platform',
  base: '/',

  themeConfig: {
    logo: '/logos/arkyra-pulse-light.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quickstart' },
      { text: 'Guide', link: '/introduction' },
      { text: 'API', link: '/api/overview' },
      { text: 'GitHub', link: 'https://github.com/MOHJRNL/ARKYRA' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Quick Start', link: '/quickstart' },
          { text: 'Architecture', link: '/architecture' }
        ]
      },
      {
        text: 'Installation',
        items: [
          { text: 'Docker Compose', link: '/installation/docker-compose' },
          { text: 'Docker', link: '/installation/docker' },
          { text: 'Kubernetes', link: '/installation/kubernetes-helm' }
        ]
      },
      {
        text: 'Configuration',
        items: [
          { text: 'Environment Variables', link: '/configuration/reference' },
          { text: 'Docker', link: '/configuration/docker' },
          { text: 'Email', link: '/configuration/emails' },
          { text: 'OAuth/OIDC', link: '/configuration/oauth' }
        ]
      },
      {
        text: 'Integrations',
        items: [
          { text: 'Overview', link: '/integrations/overview' },
          { text: 'Hybrid AI Router', link: '/integrations/hybrid-routing' },
          { text: 'OpenAI', link: '/integrations/openai' },
          { text: 'Google Gemini', link: '/integrations/gemini' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MOHJRNL/ARKYRA' }
    ],

    footer: {
      message: 'Licensed under AGPL-3.0',
      copyright: 'Built with ❤️ for Al Jazeera and the world'
    },

    search: {
      provider: 'local'
    }
  },

  // Al Jazeera branding colors
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            $primary-color: #048FCC;
            $secondary-color: #F8AB0C;
            $accent-color: #001969;
          `
        }
      }
    }
  }
});
```

### Custom Styling

Create `.vitepress/theme/custom.css`:

```css
:root {
  --vp-c-brand: #048FCC;
  --vp-c-brand-light: #0EA5E9;
  --vp-c-brand-lighter: #38BDF8;
  --vp-c-brand-dark: #0369A1;
  --vp-c-brand-darker: #075985;

  --vp-c-sponsor: #F8AB0C;
}

.dark {
  --vp-c-bg: #001969;
}

/* Al Jazeera color accents */
.logo {
  filter: brightness(1.1);
}

/* Custom badge styles */
.badge {
  background-color: var(--vp-c-brand);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Integration cards */
.integration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.integration-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.integration-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(4, 143, 204, 0.2);
}
```

### Development

```bash
# Start dev server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

### Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "docs:dev": "vitepress dev .",
    "docs:build": "vitepress build .",
    "docs:preview": "vitepress preview ."
  }
}
```

## Option 2: Docusaurus

Docusaurus provides a rich, React-based documentation experience.

### Setup

```bash
# Create Docusaurus site
npx create-docusaurus@latest docs-site classic --typescript

# Navigate to site
cd docs-site

# Copy documentation
cp -r ../docs/* docs/
```

### Configuration

Edit `docusaurus.config.js`:

```javascript
module.exports = {
  title: 'ARKYRA Documentation',
  tagline: 'Enterprise Social Media Management Platform',
  url: 'https://docs.arkyra.pro',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  organizationName: 'MOHJRNL',
  projectName: 'ARKYRA',

  themeConfig: {
    navbar: {
      title: 'ARKYRA',
      logo: {
        alt: 'ARKYRA Logo',
        src: 'img/arkyra-logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'introduction',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/MOHJRNL/ARKYRA',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction',
            },
            {
              label: 'Quick Start',
              to: '/docs/quickstart',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/MOHJRNL/ARKYRA',
            },
          ],
        },
      ],
      copyright: `Built with ❤️ for Al Jazeera and the world. © ${new Date().getFullYear()}`,
    },

    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
      additionalLanguages: ['bash', 'typescript', 'yaml', 'json'],
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/MOHJRNL/ARKYRA/edit/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

### Custom CSS

Edit `src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #048FCC;
  --ifm-color-primary-dark: #0479B3;
  --ifm-color-primary-darker: #04729A;
  --ifm-color-primary-darkest: #035E7F;
  --ifm-color-primary-light: #06A6E5;
  --ifm-color-primary-lighter: #19B3FF;
  --ifm-color-primary-lightest: #38BEFF;

  --ifm-color-secondary: #F8AB0C;
  --ifm-color-accent: #001969;
}
```

## Option 3: Next.js + MDX

For maximum flexibility and custom features.

### Setup

```bash
# Create Next.js app
npx create-next-app@latest docs-site --typescript --tailwind --app

# Install MDX support
cd docs-site
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

### Configuration

Create `next.config.mjs`:

```javascript
import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'export',
  images: {
    unoptimized: true
  }
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
```

## Deployment to docs.arkyra.pro

### Using Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd docs-site
vercel --prod

# Configure custom domain in Vercel dashboard
# Add DNS record: CNAME docs.arkyra.pro -> cname.vercel-dns.com
```

### Using Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd docs-site
netlify deploy --prod

# Configure custom domain
# Add DNS record: CNAME docs.arkyra.pro -> [your-site].netlify.app
```

### Using Cloudflare Pages

```bash
# Build the site
npm run docs:build

# Deploy via Cloudflare Pages dashboard
# 1. Connect GitHub repository
# 2. Configure build settings:
#    - Build command: npm run docs:build
#    - Output directory: .vitepress/dist (VitePress) or build (Docusaurus)
# 3. Add custom domain: docs.arkyra.pro
```

### Using GitHub Pages

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        working-directory: ./docs
        run: npm install

      - name: Build documentation
        working-directory: ./docs
        run: npm run docs:build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/.vitepress/dist
          cname: docs.arkyra.pro
```

## DNS Configuration

Add CNAME record to Cloudflare DNS:

```
Type: CNAME
Name: docs
Content: [your-deployment-platform]
Proxy status: Proxied (recommended)
TTL: Auto
```

**Examples:**
- Vercel: `cname.vercel-dns.com`
- Netlify: `[your-site].netlify.app`
- Cloudflare Pages: `[your-site].pages.dev`
- GitHub Pages: `mohjrnl.github.io`

## SSL/TLS Configuration

All deployment platforms provide automatic SSL certificates:

- **Vercel**: Automatic Let's Encrypt
- **Netlify**: Automatic Let's Encrypt
- **Cloudflare Pages**: Automatic Cloudflare SSL
- **GitHub Pages**: Automatic Let's Encrypt (when using custom domain)

## SEO Optimization

### Meta Tags

Add to your documentation site:

```html
<meta name="description" content="ARKYRA - Enterprise Social Media Management Platform built for Al Jazeera">
<meta name="keywords" content="ARKYRA, social media, management, Al Jazeera, enterprise">
<meta property="og:title" content="ARKYRA Documentation">
<meta property="og:description" content="Complete documentation for ARKYRA platform">
<meta property="og:image" content="https://docs.arkyra.pro/og-image.png">
<meta property="og:url" content="https://docs.arkyra.pro">
<meta name="twitter:card" content="summary_large_image">
```

### Sitemap

VitePress generates sitemap automatically. For others:

```bash
# Install sitemap generator
npm install sitemap

# Generate sitemap
npx sitemap-generator https://docs.arkyra.pro
```

### robots.txt

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://docs.arkyra.pro/sitemap.xml
```

## Analytics

### Google Analytics 4

Add to your documentation site:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### PostHog

```javascript
import posthog from 'posthog-js';

posthog.init('phc_...', {
  api_host: 'https://app.posthog.com'
});
```

## Monitoring

### Uptime Monitoring

Use services like:
- **UptimeRobot**: Free monitoring every 5 minutes
- **Pingdom**: Advanced monitoring
- **Cloudflare Analytics**: Built-in with Cloudflare

### Performance Monitoring

- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

## Maintenance

### Updating Documentation

```bash
# Pull latest changes
git pull origin main

# Navigate to docs
cd docs

# Make changes
# ...

# Commit and push
git add .
git commit -m "docs: update integration guide"
git push origin main

# Deployment happens automatically via CI/CD
```

### Versioning

For VitePress, create versioned docs:

```bash
docs/
├── v1.0/
│   └── [documentation for v1.0]
├── v2.0/
│   └── [documentation for v2.0]
└── [latest documentation]
```

## Troubleshooting

### Build Failures

Check:
1. Node.js version compatibility
2. Package dependencies
3. Markdown syntax errors
4. Broken internal links

### Deployment Issues

Check:
1. Build command is correct
2. Output directory is correct
3. Environment variables (if needed)
4. DNS configuration

### Custom Domain Not Working

Check:
1. DNS propagation (can take 24-48 hours)
2. CNAME record points to correct target
3. SSL certificate issued
4. Cloudflare proxy status

## Next Steps

- [Install VitePress and deploy docs](/docs/DEPLOYMENT.md)
- [Configure custom domain](/docs/configuration/ssl.md)
- [Set up analytics](/docs/integrations/ga4.md)
- [Enable search](/docs/configuration/search.md)
