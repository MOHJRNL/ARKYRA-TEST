# Cloudflare DNS Configuration for arkyra.pro

## Overview

This guide provides step-by-step instructions for configuring Cloudflare DNS for the ARKYRA platform hosted at **arkyra.pro**.

## Prerequisites

- Cloudflare account with arkyra.pro domain added
- Server IP address or Railway deployment URL
- Access to Cloudflare dashboard

## DNS Configuration Steps

### Step 1: Access Cloudflare Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select the **arkyra.pro** domain
3. Navigate to **DNS** → **Records**

### Step 2: Configure DNS Records

Add the following DNS records:

#### For Self-Hosted Deployment (with Server IP)

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | @ | `<YOUR_SERVER_IP>` | Proxied (Orange Cloud) | Auto |
| A | www | `<YOUR_SERVER_IP>` | Proxied (Orange Cloud) | Auto |
| CNAME | api | arkyra.pro | Proxied (Orange Cloud) | Auto |

**Example:**
```
Type: A
Name: @
Content: 203.0.113.10
Proxy: Enabled (Orange Cloud)
TTL: Auto
```

#### For Railway Deployment

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| CNAME | @ | `<YOUR_RAILWAY_DOMAIN>.railway.app` | Proxied (Orange Cloud) | Auto |
| CNAME | www | arkyra.pro | Proxied (Orange Cloud) | Auto |

**Note**: Replace `<YOUR_RAILWAY_DOMAIN>` with your actual Railway deployment domain.

### Step 3: SSL/TLS Configuration

1. Navigate to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

#### SSL/TLS Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Encryption Mode** | Full (strict) | Encrypts traffic between Cloudflare and origin server |
| **Always Use HTTPS** | On | Redirects all HTTP requests to HTTPS |
| **Automatic HTTPS Rewrites** | On | Automatically rewrites insecure URLs |
| **Minimum TLS Version** | TLS 1.2 | Ensures modern encryption standards |
| **TLS 1.3** | On | Enables latest TLS protocol |

### Step 4: Page Rules (Optional but Recommended)

Create page rules for better performance:

#### Rule 1: Force HTTPS
- **URL**: `http://*arkyra.pro/*`
- **Setting**: Always Use HTTPS

#### Rule 2: Cache API Responses
- **URL**: `arkyra.pro/api/*`
- **Settings**:
  - Cache Level: Standard
  - Edge Cache TTL: 2 hours

#### Rule 3: Cache Static Assets
- **URL**: `arkyra.pro/uploads/*`
- **Settings**:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month

### Step 5: Firewall Rules

Protect your application with firewall rules:

#### Rule 1: Block Bad Bots
- **Expression**: `(cf.client.bot)`
- **Action**: Block

#### Rule 2: Rate Limiting
- **Expression**: `(http.request.uri.path contains "/api/")`
- **Action**: Rate Limit (100 requests per minute)

#### Rule 3: Geographic Restrictions (Optional)
If you want to restrict access to specific countries:
- **Expression**: `(ip.geoip.country ne "AE" and ip.geoip.country ne "QA")`
- **Action**: Challenge

### Step 6: Caching Configuration

1. Navigate to **Caching** → **Configuration**
2. Set **Caching Level** to Standard
3. Enable **Browser Cache TTL** (4 hours recommended)
4. Clear cache after deployment

### Step 7: Speed Optimization

Enable the following features:

| Feature | Status | Description |
|---------|--------|-------------|
| **Auto Minify** | On (JS, CSS, HTML) | Reduces file sizes |
| **Brotli** | On | Better compression than gzip |
| **Rocket Loader** | Off | Can break some JS frameworks |
| **HTTP/2** | On | Faster protocol |
| **HTTP/3 (QUIC)** | On | Latest protocol |

### Step 8: Verify Configuration

#### DNS Propagation Check

Use the following command to verify DNS:

```bash
dig arkyra.pro
dig www.arkyra.pro
```

Or use online tools:
- https://dnschecker.org
- https://www.whatsmydns.net

#### SSL Certificate Check

```bash
curl -I https://arkyra.pro
```

Should return `200 OK` with HTTPS.

## Railway-Specific Configuration

If deploying on Railway:

### 1. Get Railway Domain

```bash
railway domain
```

This will output something like: `arkyra-production-abc123.railway.app`

### 2. Add Custom Domain in Railway

1. Go to Railway dashboard
2. Select your project
3. Click **Settings** → **Domains**
4. Click **Add Custom Domain**
5. Enter `arkyra.pro`
6. Railway will provide DNS records to add

### 3. Update Cloudflare DNS

Add the CNAME record provided by Railway:

```
Type: CNAME
Name: @
Content: arkyra-production-abc123.railway.app
Proxy: Enabled
```

### 4. Wait for Propagation

DNS changes can take 5-60 minutes to propagate globally.

## Environment Variables Update

After DNS configuration, update your `.env` file:

```env
# Update these URLs
MAIN_URL=https://arkyra.pro
FRONTEND_URL=https://arkyra.pro
NEXT_PUBLIC_BACKEND_URL=https://arkyra.pro/api
BACKEND_INTERNAL_URL=http://arkyra-backend:3000

# Cloudflare settings
CLOUDFLARE_ZONE_ID=<your-zone-id>
CLOUDFLARE_API_TOKEN=<your-api-token>
```

## Nginx Configuration for Cloudflare

Update `nginx.arkyra.conf` to work with Cloudflare:

```nginx
# Add Cloudflare IP ranges
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
real_ip_header CF-Connecting-IP;

server {
    listen 80;
    server_name arkyra.pro www.arkyra.pro;

    # Force HTTPS (Cloudflare handles this, but good to have)
    if ($http_x_forwarded_proto != "https") {
        return 301 https://$server_name$request_uri;
    }

    # Rest of your configuration...
}
```

## Troubleshooting

### DNS Not Resolving

**Problem**: arkyra.pro doesn't resolve to your server

**Solution**:
1. Check DNS records in Cloudflare dashboard
2. Verify nameservers are pointing to Cloudflare
3. Wait for DNS propagation (up to 48 hours, usually 5-60 minutes)
4. Use `dig arkyra.pro` to check DNS

### SSL Certificate Errors

**Problem**: Browser shows SSL certificate errors

**Solution**:
1. Ensure SSL/TLS mode is set to "Full (strict)"
2. Verify origin server has valid SSL certificate
3. Check if "Always Use HTTPS" is enabled
4. Clear browser cache

### 502 Bad Gateway

**Problem**: Cloudflare shows 502 error

**Solution**:
1. Check if origin server is running
2. Verify origin server IP is correct in DNS
3. Check firewall rules on origin server
4. Ensure port 80/443 are open

### Redirect Loop

**Problem**: Too many redirects error

**Solution**:
1. Change SSL/TLS mode to "Full" or "Full (strict)"
2. Disable "Always Use HTTPS" temporarily
3. Check Nginx configuration for redirect rules

## Security Best Practices

1. **Enable WAF (Web Application Firewall)**
   - Navigate to **Security** → **WAF**
   - Enable managed rules

2. **Enable DDoS Protection**
   - Automatically enabled with Cloudflare

3. **Set Up Rate Limiting**
   - Protect API endpoints from abuse

4. **Enable Bot Fight Mode**
   - Navigate to **Security** → **Bots**
   - Enable Bot Fight Mode

5. **Configure Security Headers**
   - Add custom headers in Cloudflare Workers or origin server

## Monitoring

### Cloudflare Analytics

1. Navigate to **Analytics & Logs** → **Traffic**
2. Monitor:
   - Requests per second
   - Bandwidth usage
   - Cache hit ratio
   - Threats blocked

### Set Up Alerts

1. Navigate to **Notifications**
2. Create alerts for:
   - High error rates
   - DDoS attacks
   - SSL certificate expiration

## Cost Optimization

- **Free Plan**: Suitable for development and small deployments
- **Pro Plan** ($20/month): Recommended for production
  - Better performance
  - Advanced analytics
  - More page rules

## Next Steps

After DNS configuration:
1. Test the domain: https://arkyra.pro
2. Verify SSL certificate
3. Test all application features
4. Monitor Cloudflare analytics
5. Set up alerts and notifications

## Support

For Cloudflare-specific issues:
- [Cloudflare Support](https://support.cloudflare.com)
- [Cloudflare Community](https://community.cloudflare.com)

For ARKYRA-specific issues:
- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Create an issue on GitHub
