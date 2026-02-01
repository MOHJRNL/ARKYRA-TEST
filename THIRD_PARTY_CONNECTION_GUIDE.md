# Third-Party Integration Connection Guide
## ARKYRA Platform - Setup & Testing Instructions

**Last Updated:** February 1, 2026

---

## Quick Start

This guide helps you:
1. Obtain API keys for each integration
2. Configure environment variables
3. Test connections
4. Troubleshoot common issues

---

## 📊 Analytics Integrations

### 1. Google Analytics 4 (GA4)

#### Getting Your API Credentials

**Option A: OAuth2 (Recommended)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google Analytics Data API"
4. Create OAuth 2.0 credentials
5. Download credentials JSON
6. Use OAuth flow to get access token

**Option B: API Key (Simpler, Limited)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click "Create Credentials" > "API Key"
4. Copy the API key

**Getting Your Property ID:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to Admin > Property Settings
4. Copy "Property ID" (format: `123456789`)

#### Environment Variables
```bash
GA4_API_KEY="AIzaSy..." # OR use OAuth token
GA4_PROPERTY_ID="123456789"
```

#### Test Connection
```bash
# With API Key
curl "https://analyticsdata.googleapis.com/v1beta/properties/YOUR_PROPERTY_ID/metadata?key=YOUR_API_KEY"

# With OAuth Token
curl -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \
  "https://analyticsdata.googleapis.com/v1beta/properties/YOUR_PROPERTY_ID/metadata"
```

#### Expected Response
```json
{
  "name": "properties/123456789/metadata",
  "dimensions": [...],
  "metrics": [...]
}
```

---

### 2. PostHog

#### Getting Your API Credentials

1. **Login to PostHog:** Go to [PostHog Dashboard](https://app.posthog.com/) (or your self-hosted instance)

2. **Get Project Key (for event capture):**
   - Navigate to Project Settings
   - Find "Project API Key" (starts with `phc_`)
   - Copy the key

3. **Get Personal API Key (for analytics queries):**
   - Click your profile icon
   - Go to "Account Settings"
   - Navigate to "Personal API Keys"
   - Click "Create Personal API Key"
   - Copy the key (starts with `phx_`)

4. **Determine Your Region:**
   - **US Cloud:** If you signed up at `app.posthog.com` → use `us`
   - **EU Cloud:** If you signed up at `eu.posthog.com` → use `eu`

#### Environment Variables
```bash
POSTHOG_PROJECT_KEY="phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
POSTHOG_PERSONAL_API_KEY="phx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
POSTHOG_REGION="us"  # or "eu"
```

#### Test Connection
```bash
# Test with Personal API Key (US region)
curl -H "Authorization: Bearer YOUR_PERSONAL_API_KEY" \
  "https://us.posthog.com/api/projects/@current/"

# Test event capture (US region)
curl -X POST "https://us.posthog.com/capture/" \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_PROJECT_KEY",
    "event": "test_connection",
    "properties": {
      "distinct_id": "test_user"
    }
  }'

# For EU region, replace "us.posthog.com" with "eu.posthog.com"
```

#### Expected Response (Connection Test)
```json
{
  "id": 12345,
  "name": "Your Project Name",
  "api_token": "phc_xxx..."
}
```

#### Expected Response (Event Capture)
```json
{
  "status": 1
}
```

---

### 3. Amplitude

#### Getting Your API Credentials

1. **Login to Amplitude:** [https://analytics.amplitude.com/](https://analytics.amplitude.com/)

2. **Get API Key:**
   - Go to Settings > Projects
   - Select your project
   - Find "API Key" under "Keys and Tokens"
   - Copy the API key

3. **Get Secret Key (for analytics queries):**
   - Same location as API Key
   - Copy "Secret Key"

4. **Determine Region:**
   - US by default
   - If EU data residency, note to use EU endpoints

#### Environment Variables
```bash
AMPLITUDE_API_KEY="a1b2c3d4e5f6g7h8i9j0"
AMPLITUDE_SECRET_KEY="s1e2c3r4e5t6k7e8y9"  # Optional, for analytics
AMPLITUDE_REGION="us"  # or "eu"
```

#### Test Connection
```bash
# Test event tracking
curl -X POST "https://api2.amplitude.com/2/httpapi" \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_API_KEY",
    "events": [{
      "user_id": "test_user_123",
      "event_type": "test_connection",
      "time": 1707000000000,
      "event_properties": {
        "source": "connection_test"
      }
    }]
  }'

# Test analytics query (requires secret key)
curl -u "YOUR_API_KEY:YOUR_SECRET_KEY" \
  "https://amplitude.com/api/2/events/list"
```

#### Expected Response (Event Tracking)
```json
{
  "code": 200,
  "events_ingested": 1,
  "payload_size_bytes": 123
}
```

---

### 4. Looker Studio

**⚠️ Important Note:** Looker Studio has **very limited API access**. Direct API is only available to Google Workspace/Cloud Identity organizations.

#### What You CAN Do:
1. **Manual Connection:** Connect Looker Studio to data sources via UI
2. **Linking API:** Generate URLs to reports
3. **Google Sheets Integration:** Export data to Sheets, then visualize in Looker Studio

#### What You CANNOT Do (without Workspace):
- ❌ Programmatically create/modify reports
- ❌ Export report data via API
- ❌ Automate report generation

#### Alternative Solution
**Use Google Sheets API + Looker Studio:**
1. Export data to Google Sheets (via ARKYRA's Google Sheets integration)
2. Connect Looker Studio to Google Sheets data source manually
3. Create reports in Looker Studio UI
4. Share report URLs

---

## 📝 Content Source Integrations

### 5. Notion

#### Getting Your Integration Token

1. **Create Integration:**
   - Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Click "New integration"
   - Give it a name (e.g., "ARKYRA Integration")
   - Select workspace
   - Click "Submit"

2. **Copy Integration Secret:**
   - After creation, you'll see "Internal Integration Token"
   - Click "Show" and copy the token (starts with `secret_`)

3. **Share Pages/Databases:**
   - Open the Notion page or database you want to access
   - Click "Share" button
   - Invite your integration by name
   - Grant appropriate permissions

#### Environment Variables
```bash
NOTION_INTEGRATION_TOKEN="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

#### Test Connection
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Notion-Version: 2025-09-03" \
  "https://api.notion.com/v1/users/me"
```

#### Expected Response
```json
{
  "object": "user",
  "id": "xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx",
  "type": "bot",
  "name": "ARKYRA Integration",
  "bot": {
    "owner": {
      "type": "workspace",
      "workspace": true
    }
  }
}
```

---

### 6. Google Sheets

#### Getting Your API Credentials

**Option A: OAuth2 (Recommended for user data)**
1. Follow GA4 OAuth setup above
2. Enable "Google Sheets API" in Cloud Console
3. Add OAuth scope: `https://www.googleapis.com/auth/spreadsheets`

**Option B: Service Account (For app-controlled sheets)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create Service Account
3. Download JSON key
4. Share your Google Sheets with service account email

**Option C: API Key (Read-only public sheets)**
1. Create API key (same as GA4)
2. Make sheet publicly readable

#### Environment Variables
```bash
GOOGLE_SHEETS_API_KEY="AIzaSy..." # OR use OAuth token
```

#### Test Connection
```bash
# Test with public sheet and API key
curl "https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID/values/Sheet1!A1:B10?key=YOUR_API_KEY"

# Test with OAuth
curl -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \
  "https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID/values/Sheet1!A1:B10"
```

#### Expected Response
```json
{
  "range": "Sheet1!A1:B10",
  "majorDimension": "ROWS",
  "values": [
    ["Header 1", "Header 2"],
    ["Data 1", "Data 2"]
  ]
}
```

---

### 7. Airtable

#### Getting Your API Key

**New Method (Personal Access Tokens):**
1. Go to [https://airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click "Create token"
3. Name it (e.g., "ARKYRA Integration")
4. Add scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. Add bases you want to access
6. Click "Create token"
7. Copy the token (starts with `pat...` for new tokens)

**Old Method (API Key - being phased out):**
1. Go to [https://airtable.com/account](https://airtable.com/account)
2. Generate API key
3. Copy key (starts with `key...`)

#### Getting Base ID
1. Open your Airtable base
2. Click "Help" > "API Documentation"
3. Base ID is in the URL and docs (starts with `app...`)

#### Environment Variables
```bash
AIRTABLE_API_KEY="patxxxxxxxxxxxxxxxxxxxxx"  # or keyxxxxxxxxxxxx
AIRTABLE_BASE_ID="appxxxxxxxxxxxxx"
```

#### Test Connection
```bash
# List bases (verify key works)
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.airtable.com/v0/meta/bases"

# List records from a table
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE_NAME?maxRecords=3"
```

#### Expected Response (Bases)
```json
{
  "bases": [
    {
      "id": "appxxxxx",
      "name": "Your Base Name",
      "permissionLevel": "create"
    }
  ]
}
```

---

## 🎥 Video/Media Generation APIs

### 8. HeyGen
1. Sign up at [https://heygen.com/](https://heygen.com/)
2. Go to API settings
3. Generate API key
4. `HEYGEN_API_KEY="your_key"`

### 9. Synthesia
1. Sign up at [https://synthesia.io/](https://synthesia.io/)
2. Contact sales for API access
3. Get API key from dashboard
4. `SYNTHESIA_API_KEY="your_key"`

### 10. D-ID
1. Sign up at [https://www.d-id.com/](https://www.d-id.com/)
2. Go to Settings > API
3. Generate API key
4. `DID_API_KEY="your_key"`

### 11. Runway
1. Sign up at [https://runwayml.com/](https://runwayml.com/)
2. Request API access
3. Get credentials from account settings
4. `RUNWAY_API_KEY="your_key"`

---

## 🔊 Audio/Voice Generation APIs

### 12. ElevenLabs
1. Sign up at [https://elevenlabs.io/](https://elevenlabs.io/)
2. Go to Profile > API Keys
3. Generate new key
4. `ELEVENLABS_API_KEY="your_key"`

### 13. Murf.ai
1. Sign up at [https://murf.ai/](https://murf.ai/)
2. Access API documentation
3. Get API key
4. `MURF_API_KEY="your_key"`

### 14. Play.ht
1. Sign up at [https://play.ht/](https://play.ht/)
2. Go to API access
3. Get API key and User ID
4. `PLAYHT_API_KEY="your_key"`
5. `PLAYHT_USER_ID="your_user_id"`

---

## 🔗 Automation Integrations

### 15. Zapier

**Setup:**
1. Login to [Zapier](https://zapier.com/)
2. Create a new Zap
3. Select "Webhooks by Zapier" as trigger
4. Choose "Catch Hook"
5. Copy the webhook URL provided

**Environment Variable:**
```bash
ZAPIER_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/12345/xxxxx/"
```

**Test:**
```bash
curl -X POST "YOUR_ZAPIER_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "from": "ARKYRA"}'
```

### 16. Make (Integromat)

**Setup:**
1. Login to [Make](https://www.make.com/)
2. Create a new scenario
3. Add "Webhooks" > "Custom webhook"
4. Copy the webhook URL

**Environment Variable:**
```bash
MAKE_WEBHOOK_URL="https://hook.eu1.make.com/xxxxxxxxxxxxx"
```

**Test:**
```bash
curl -X POST "YOUR_MAKE_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "from": "ARKYRA"}'
```

### 17. n8n

**Setup:**
1. Access your n8n instance
2. Create workflow with Webhook trigger
3. Set webhook path
4. Copy the webhook URL

**Environment Variable:**
```bash
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/xxxxx"
```

**Test:**
```bash
curl -X POST "YOUR_N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "from": "ARKYRA"}'
```

---

## Complete .env.example Configuration

```bash
# === Third-Party Analytics Integration Keys ===

# Google Analytics 4
# Get from: https://console.cloud.google.com/apis/credentials
GA4_API_KEY=""              # OR use OAuth2 token
GA4_PROPERTY_ID=""          # Format: 123456789

# PostHog Analytics
# Get from: https://app.posthog.com/project/settings
POSTHOG_PROJECT_KEY=""      # Format: phc_xxx... (for event capture)
POSTHOG_PERSONAL_API_KEY="" # Format: phx_xxx... (for analytics queries)
POSTHOG_REGION="us"         # Options: us, eu

# Amplitude Analytics
# Get from: https://analytics.amplitude.com/
AMPLITUDE_API_KEY=""        # For event tracking
AMPLITUDE_SECRET_KEY=""     # For analytics queries (optional)
AMPLITUDE_REGION="us"       # Options: us, eu

# === Content Source Integration Keys ===

# Notion
# Get from: https://www.notion.so/my-integrations
NOTION_INTEGRATION_TOKEN="" # Format: secret_xxx...

# Google Sheets
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_SHEETS_API_KEY=""    # OR use OAuth2 token

# Airtable
# Get from: https://airtable.com/create/tokens
AIRTABLE_API_KEY=""         # Format: patXXXXXXXXXXXXXX or keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=""         # Format: appXXXXXXXXXXXXXX

# === Video/Media Generation Keys ===

# HeyGen - https://heygen.com/
HEYGEN_API_KEY=""

# Synthesia - https://synthesia.io/
SYNTHESIA_API_KEY=""

# D-ID - https://www.d-id.com/
DID_API_KEY=""

# Runway - https://runwayml.com/
RUNWAY_API_KEY=""

# === Audio/Voice Generation Keys ===

# ElevenLabs - https://elevenlabs.io/
ELEVENLABS_API_KEY=""

# Murf.ai - https://murf.ai/
MURF_API_KEY=""

# Play.ht - https://play.ht/
PLAYHT_API_KEY=""
PLAYHT_USER_ID=""

# === Automation Webhook URLs ===

# Zapier - https://zapier.com/
ZAPIER_WEBHOOK_URL=""       # Your Zapier webhook URL

# Make (Integromat) - https://www.make.com/
MAKE_WEBHOOK_URL=""         # Your Make webhook URL

# n8n - Your n8n instance
N8N_WEBHOOK_URL=""          # Your n8n webhook URL
```

---

## Troubleshooting

### Common Issues

#### 1. "401 Unauthorized"
- ✅ Check API key is correct
- ✅ Check API key has necessary permissions
- ✅ Check authentication header format
- ✅ For OAuth, check token hasn't expired

#### 2. "403 Forbidden"
- ✅ Check API key has access to the resource
- ✅ For Notion: Check integration is shared with page/database
- ✅ For Google Sheets: Check sheet sharing settings

#### 3. "404 Not Found"
- ✅ Check endpoint URL is correct
- ✅ Check resource ID exists (property ID, base ID, etc.)
- ✅ Check API version is correct

#### 4. "Cannot read property 'baseUrl' of undefined"
- 🔴 **This is a known bug!** See `THIRD_PARTY_INTEGRATION_FIXES.md`
- Apply the fixes before using the integration

#### 5. "CORS Error"
- ✅ These APIs should be called from backend only
- ✅ Don't call directly from frontend JavaScript

### Testing Tools

**Postman Collections:**
- Import API collections for easier testing
- Available for most providers

**cURL Commands:**
- All examples in this guide use cURL
- Easy to test from command line

**API Testing:**
```bash
# Test if an API endpoint is reachable
curl -I "https://api.notion.com/v1/users/me"

# Test with verbose output
curl -v -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.notion.com/v1/users/me"
```

---

## Support & Documentation

### Provider Support
- **Google (GA4, Sheets):** [Google Cloud Support](https://cloud.google.com/support)
- **PostHog:** [PostHog Community](https://posthog.com/questions)
- **Amplitude:** [Amplitude Help Center](https://help.amplitude.com/)
- **Notion:** [Notion Help](https://notion.so/help)
- **Airtable:** [Airtable Support](https://support.airtable.com/)

### Status Pages
- **PostHog:** https://status.posthog.com
- **Notion:** https://www.notion-status.com
- **Google:** https://status.cloud.google.com
- **Airtable:** https://status.airtable.com

### Official Documentation Links
All official API documentation links are in `THIRD_PARTY_API_VERIFICATION.md`.

---

**Document Version:** 1.0
**Last Updated:** February 1, 2026
**Maintained By:** ARKYRA Development Team
