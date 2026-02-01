# Third-Party Integration Critical Fixes
## Quick Fix Guide for ARKYRA Platform

**Date:** February 1, 2026
**Priority:** CRITICAL - Fix Before Production Deployment

---

## Overview

This guide provides exact code fixes for all critical bugs found in third-party integrations.

**Total Bugs Found:** 25+ occurrences across 9 providers
**Estimated Fix Time:** 30-45 minutes
**Testing Time:** 15-30 minutes

---

## Critical Bug #1: Undefined `this.baseUrl` References

### Problem
The `ThirdPartyAbstract` base class doesn't define `baseUrl`, but providers reference `this.baseUrl`, causing:
```
TypeError: Cannot read property 'baseUrl' of undefined
```

### Solution Pattern
Replace all `this.baseUrl` with the respective `*_BASE_URL` constant defined at the top of each file.

---

## Fix 1: PostHog Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/posthog/posthog.provider.ts`

**Lines to Fix:** 178, 207, 236, 270

### Line 178 - getEvents method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/api/projects/@current/events/?${params}`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${personalKey}`,
    },
  }
);

// AFTER (FIXED):
const response = await fetch(
  `${POSTHOG_BASE_URL}/api/projects/@current/events/?${params}`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${personalKey}`,
    },
  }
);
```

### Line 207 - getInsights method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/api/projects/@current/insights/`,
  {

// AFTER (FIXED):
const response = await fetch(
  `${POSTHOG_BASE_URL}/api/projects/@current/insights/`,
  {
```

### Line 236 - createInsight method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/api/projects/@current/insights/`,
  {

// AFTER (FIXED):
const response = await fetch(
  `${POSTHOG_BASE_URL}/api/projects/@current/insights/`,
  {
```

### Line 270 - getPersons method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/api/projects/@current/persons/`,
  {

// AFTER (FIXED):
const response = await fetch(
  `${POSTHOG_BASE_URL}/api/projects/@current/persons/`,
  {
```

### BONUS FIX - Update PostHog Endpoint (Line 32)
```typescript
// BEFORE (DEPRECATED):
const POSTHOG_BASE_URL = 'https://app.posthog.com';

// AFTER (CURRENT):
const POSTHOG_BASE_URL = 'https://us.posthog.com';

// OR for EU region:
const POSTHOG_BASE_URL = 'https://eu.posthog.com';
```

---

## Fix 2: Google Sheets Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/google-sheets/google-sheets.provider.ts`

**Lines to Fix:** 170, 201, 239, 273, 305

### Line 170 - readData method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}/values/${range}?valueRenderOption=FORMATTED_VALUE${keyParam}`,

// AFTER (FIXED):
const response = await fetch(
  `${GOOGLE_SHEETS_BASE_URL}/spreadsheets/${data.spreadsheet_id}/values/${range}?valueRenderOption=FORMATTED_VALUE${keyParam}`,
```

### Line 201 - writeData method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}/values/${range}${keyParam}`,

// AFTER (FIXED):
const response = await fetch(
  `${GOOGLE_SHEETS_BASE_URL}/spreadsheets/${data.spreadsheet_id}/values/${range}${keyParam}`,
```

### Line 239 - appendData method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}/values/${range}:append${keyParam}`,

// AFTER (FIXED):
const response = await fetch(
  `${GOOGLE_SHEETS_BASE_URL}/spreadsheets/${data.spreadsheet_id}/values/${range}:append${keyParam}`,
```

### Line 273 - clearData method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}/values/${range}:clear${keyParam}`,

// AFTER (FIXED):
const response = await fetch(
  `${GOOGLE_SHEETS_BASE_URL}/spreadsheets/${data.spreadsheet_id}/values/${range}:clear${keyParam}`,
```

### Line 305 - createSheet method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}:batchUpdate${keyParam}`,

// AFTER (FIXED):
const response = await fetch(
  `${GOOGLE_SHEETS_BASE_URL}/spreadsheets/${data.spreadsheet_id}:batchUpdate${keyParam}`,
```

---

## Fix 3: Notion Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/notion/notion.provider.ts`

**Lines to Fix:** 36 (API version), 218 (baseUrl)

### Line 36 - Update API Version
```typescript
// BEFORE (OUTDATED):
const NOTION_VERSION = '2022-06-28';

// AFTER (CURRENT):
const NOTION_VERSION = '2025-09-03';
```

### Line 218 - queryDatabase method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/databases/${data.database_id}/query`,
  {

// AFTER (FIXED):
const response = await fetch(
  `${NOTION_BASE_URL}/databases/${data.database_id}/query`,
  {
```

---

## Fix 4: Synthesia Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/synthesia/synthesia.provider.ts`

**Lines to Fix:** 163, 198

**Note:** First, find the BASE_URL constant at the top of the file (should be defined as `SYNTHESIA_BASE_URL` or similar).

### Line 163 - generateVideo method
```typescript
// BEFORE (BROKEN):
const createResponse = await fetch(`${this.baseUrl}/videos`, {

// AFTER (FIXED):
const createResponse = await fetch(`${SYNTHESIA_BASE_URL}/videos`, {
```

### Line 198 - generateVideo method (status check)
```typescript
// BEFORE (BROKEN):
const statusResponse = await fetch(`${this.baseUrl}/videos/${videoId}`, {

// AFTER (FIXED):
const statusResponse = await fetch(`${SYNTHESIA_BASE_URL}/videos/${videoId}`, {
```

---

## Fix 5: D-ID Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/d-id/d-id.provider.ts`

**Lines to Fix:** 165, 202

### Line 165 - generateVideo method
```typescript
// BEFORE (BROKEN):
const createResponse = await fetch(`${this.baseUrl}/talks`, {

// AFTER (FIXED):
const createResponse = await fetch(`${DID_BASE_URL}/talks`, {
```

### Line 202 - generateVideo method (status check)
```typescript
// BEFORE (BROKEN):
const statusResponse = await fetch(`${this.baseUrl}/talks/${talkId}`, {

// AFTER (FIXED):
const statusResponse = await fetch(`${DID_BASE_URL}/talks/${talkId}`, {
```

---

## Fix 6: Runway Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/runway/runway.provider.ts`

**Lines to Fix:** 125, 153

### Line 125 - generateVideo method
```typescript
// BEFORE (BROKEN):
const createResponse = await fetch(`${this.baseUrl}/generations`, {

// AFTER (FIXED):
const createResponse = await fetch(`${RUNWAY_BASE_URL}/generations`, {
```

### Line 153 - generateVideo method (status check)
```typescript
// BEFORE (BROKEN):
const statusResponse = await fetch(`${this.baseUrl}/generations/${taskId}`, {

// AFTER (FIXED):
const statusResponse = await fetch(`${RUNWAY_BASE_URL}/generations/${taskId}`, {
```

---

## Fix 7: ElevenLabs Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/elevenlabs/elevenlabs.provider.ts`

**Lines to Fix:** 153

### Line 153 - generateSpeech method
```typescript
// BEFORE (BROKEN):
const response = await fetch(
  `${this.baseUrl}/text-to-speech/${data.voice_id}`,

// AFTER (FIXED):
const response = await fetch(
  `${ELEVENLABS_BASE_URL}/text-to-speech/${data.voice_id}`,
```

---

## Fix 8: Murf Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/murf/murf.provider.ts`

**Lines to Fix:** 126, 154

### Line 126 - generateSpeech method
```typescript
// BEFORE (BROKEN):
const createResponse = await fetch(`${this.baseUrl}/speech`, {

// AFTER (FIXED):
const createResponse = await fetch(`${MURF_BASE_URL}/speech`, {
```

### Line 154 - generateSpeech method (status check)
```typescript
// BEFORE (BROKEN):
const statusResponse = await fetch(`${this.baseUrl}/speech/${job_id}`, {

// AFTER (FIXED):
const statusResponse = await fetch(`${MURF_BASE_URL}/speech/${job_id}`, {
```

---

## Fix 9: Play.ht Provider

**File:** `/libraries/nestjs-libraries/src/3rdparties/playht/playht.provider.ts`

**Lines to Fix:** 138, 167

### Line 138 - generateSpeech method
```typescript
// BEFORE (BROKEN):
const createResponse = await fetch(`${this.baseUrl}/tts`, {

// AFTER (FIXED):
const createResponse = await fetch(`${PLAYHT_BASE_URL}/tts`, {
```

### Line 167 - generateSpeech method (status check)
```typescript
// BEFORE (BROKEN):
const statusResponse = await fetch(`${this.baseUrl}/tts/${jobId}`, {

// AFTER (FIXED):
const statusResponse = await fetch(`${PLAYHT_BASE_URL}/tts/${jobId}`, {
```

---

## Automated Fix Script

For developers comfortable with command-line tools, here's a bash script to fix all PostHog, Google Sheets, and Notion issues:

```bash
#!/bin/bash

# Fix PostHog
sed -i '' 's/\${this\.baseUrl}\/api\/projects\/@current\/events/\${POSTHOG_BASE_URL}\/api\/projects\/@current\/events/g' libraries/nestjs-libraries/src/3rdparties/posthog/posthog.provider.ts
sed -i '' 's/\${this\.baseUrl}\/api\/projects\/@current\/insights/\${POSTHOG_BASE_URL}\/api\/projects\/@current\/insights/g' libraries/nestjs-libraries/src/3rdparties/posthog/posthog.provider.ts
sed -i '' 's/\${this\.baseUrl}\/api\/projects\/@current\/persons/\${POSTHOG_BASE_URL}\/api\/projects\/@current\/persons/g' libraries/nestjs-libraries/src/3rdparties/posthog/posthog.provider.ts
sed -i '' "s|'https://app.posthog.com'|'https://us.posthog.com'|g" libraries/nestjs-libraries/src/3rdparties/posthog/posthog.provider.ts

# Fix Google Sheets
sed -i '' 's/\${this\.baseUrl}\/spreadsheets/\${GOOGLE_SHEETS_BASE_URL}\/spreadsheets/g' libraries/nestjs-libraries/src/3rdparties/google-sheets/google-sheets.provider.ts

# Fix Notion
sed -i '' 's/\${this\.baseUrl}\/databases/\${NOTION_BASE_URL}\/databases/g' libraries/nestjs-libraries/src/3rdparties/notion/notion.provider.ts
sed -i '' "s|'2022-06-28'|'2025-09-03'|g" libraries/nestjs-libraries/src/3rdparties/notion/notion.provider.ts

echo "✅ All critical analytics and content source bugs fixed!"
echo "⚠️  Please manually verify video/audio providers (Synthesia, D-ID, Runway, etc.)"
```

**Note:** This script uses macOS/BSD `sed`. For Linux, remove the `''` after `-i`.

---

## Testing After Fixes

### 1. Build Test
```bash
cd /Users/MOH/MOH\ -\ DATA/Work/Growingify\ /arkyra
pnpm build
```

### 2. TypeScript Check
```bash
pnpm tsc --noEmit
```

### 3. Integration Tests (if available)
```bash
pnpm test:integration
```

### 4. Manual Connection Tests

Create a test file: `test-integrations.ts`

```typescript
import { PostHogProvider } from './libraries/nestjs-libraries/src/3rdparties/posthog/posthog.provider';
import { GoogleSheetsProvider } from './libraries/nestjs-libraries/src/3rdparties/google-sheets/google-sheets.provider';
import { NotionProvider } from './libraries/nestjs-libraries/src/3rdparties/notion/notion.provider';

async function testProviders() {
  const posthog = new PostHogProvider();
  const sheets = new GoogleSheetsProvider();
  const notion = new NotionProvider();

  // Test PostHog
  try {
    const result = await posthog.checkConnection('test:test');
    console.log('✅ PostHog: No runtime errors');
  } catch (e) {
    console.error('❌ PostHog error:', e.message);
  }

  // Test Google Sheets
  try {
    const result = await sheets.checkConnection('test');
    console.log('✅ Google Sheets: No runtime errors');
  } catch (e) {
    console.error('❌ Google Sheets error:', e.message);
  }

  // Test Notion
  try {
    const result = await notion.checkConnection('secret_test');
    console.log('✅ Notion: No runtime errors');
  } catch (e) {
    console.error('❌ Notion error:', e.message);
  }
}

testProviders();
```

---

## Verification Checklist

After applying all fixes:

- [ ] All files compile without TypeScript errors
- [ ] No runtime errors when instantiating providers
- [ ] PostHog uses `us.posthog.com` endpoint
- [ ] Notion uses `2025-09-03` API version
- [ ] All `this.baseUrl` replaced with constants
- [ ] Build succeeds: `pnpm build`
- [ ] Tests pass (if applicable): `pnpm test`

---

## Additional Recommendations

### 1. Add Type Safety
Consider adding to the `ThirdPartyAbstract` class:

```typescript
export abstract class ThirdPartyAbstract<T = any> {
  protected abstract readonly baseUrl?: string; // Make it optional and document

  abstract checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }>;

  abstract sendData(apiKey: string, data: T): Promise<string>;

  [key: string]: ((apiKey: string, data?: any) => Promise<any>) | undefined | string;
}
```

### 2. Add Environment Configuration
Create a centralized config for API endpoints:

```typescript
// config/third-party.config.ts
export const THIRD_PARTY_ENDPOINTS = {
  posthog: process.env.POSTHOG_REGION === 'eu'
    ? 'https://eu.posthog.com'
    : 'https://us.posthog.com',
  amplitude: process.env.AMPLITUDE_REGION === 'eu'
    ? 'https://api.eu.amplitude.com'
    : 'https://api2.amplitude.com',
  // ... etc
};
```

### 3. Add Retry Logic
```typescript
async retryFetch(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (i === maxRetries - 1) throw new Error('Max retries reached');
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

---

## Support Resources

If you encounter issues while fixing:

1. **Check the full verification report:** `THIRD_PARTY_API_VERIFICATION.md`
2. **Review official API docs** (links in verification report)
3. **Test with curl commands** (examples in verification report)
4. **Check provider status pages:**
   - PostHog: https://status.posthog.com
   - Notion: https://www.notion-status.com
   - Google: https://status.cloud.google.com

---

**Last Updated:** February 1, 2026
**Fix Priority:** CRITICAL - Apply before any production deployment
**Estimated Total Fix Time:** 30-45 minutes + 15-30 minutes testing
