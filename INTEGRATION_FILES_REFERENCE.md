# Integration Files Reference

Quick reference for all third-party integration files created.

## File Structure

```
/apps/frontend/
├── src/components/third-parties/providers/
│   ├── airtable.provider.tsx
│   ├── amplitude.provider.tsx
│   ├── d-id.provider.tsx
│   ├── elevenlabs.provider.tsx
│   ├── ga4.provider.tsx
│   ├── google-sheets.provider.tsx
│   ├── heygen.provider.tsx (existing)
│   ├── looker-studio.provider.tsx
│   ├── make.provider.tsx
│   ├── murf.provider.tsx
│   ├── n8n.provider.tsx
│   ├── notion.provider.tsx
│   ├── playht.provider.tsx
│   ├── posthog.provider.tsx
│   ├── runway.provider.tsx
│   ├── synthesia.provider.tsx (existing)
│   ├── webhooks.provider.tsx
│   └── zapier.provider.tsx
│
└── public/icons/third-party/
    ├── airtable.png
    ├── amplitude.png
    ├── d-id.png
    ├── elevenlabs.png
    ├── ga4.png
    ├── google-sheets.png
    ├── heygen.png (existing)
    ├── looker-studio.png
    ├── make.png
    ├── murf.png
    ├── n8n.png
    ├── notion.png
    ├── playht.png
    ├── posthog.png
    ├── runway.png
    ├── synthesia.png
    ├── webhooks.png
    └── zapier.png
```

## Integration Details

| Integration | Provider Component | Logo | Backend | Category |
|-------------|-------------------|------|---------|----------|
| Synthesia | synthesia.provider.tsx | synthesia.png | /3rdparties/synthesia/ | Video |
| D-ID | d-id.provider.tsx | d-id.png | /3rdparties/d-id/ | Video |
| Runway | runway.provider.tsx | runway.png | /3rdparties/runway/ | Video |
| ElevenLabs | elevenlabs.provider.tsx | elevenlabs.png | /3rdparties/elevenlabs/ | Audio |
| Murf | murf.provider.tsx | murf.png | /3rdparties/murf/ | Audio |
| Play.ht | playht.provider.tsx | playht.png | /3rdparties/playht/ | Audio |
| Webhooks | webhooks.provider.tsx | webhooks.png | /3rdparties/webhooks/ | Automation |
| Zapier | zapier.provider.tsx | zapier.png | /3rdparties/zapier/ | Automation |
| Make | make.provider.tsx | make.png | /3rdparties/make/ | Automation |
| n8n | n8n.provider.tsx | n8n.png | /3rdparties/n8n/ | Automation |
| Notion | notion.provider.tsx | notion.png | /3rdparties/notion/ | Content |
| Google Sheets | google-sheets.provider.tsx | google-sheets.png | /3rdparties/google-sheets/ | Content |
| Airtable | airtable.provider.tsx | airtable.png | /3rdparties/airtable/ | Content |
| GA4 | ga4.provider.tsx | ga4.png | /3rdparties/ga4/ | Analytics |
| Looker Studio | looker-studio.provider.tsx | looker-studio.png | /3rdparties/looker-studio/ | Analytics |
| PostHog | posthog.provider.tsx | posthog.png | /3rdparties/posthog/ | Analytics |
| Amplitude | amplitude.provider.tsx | amplitude.png | /3rdparties/amplitude/ | Analytics |

## Provider Component Types

### Type 1: Complex Media Providers
**Files:** d-id, runway, elevenlabs, murf, playht, synthesia
**Features:**
- Avatar/Voice selection grids
- Multi-step forms
- Preview capabilities
- Advanced validation
- Loading indicators

### Type 2: Simple API Key Providers  
**Files:** zapier, make, notion, airtable, posthog, amplitude
**Features:**
- API key input
- Basic validation
- Documentation links
- Quick setup

### Type 3: Custom Configuration Providers
**Files:** webhooks, n8n, google-sheets, ga4, looker-studio
**Features:**
- Multiple configuration fields
- URL inputs
- JSON credential inputs
- Service account support

## Logo Specifications

- **Format:** PNG
- **Dimensions:** 256x256 pixels
- **Type:** RGB color (8-bit)
- **Style:** Brand color background with white letter/initials
- **Naming:** Lowercase with hyphens (e.g., google-sheets.png)

## Testing Checklist

- [ ] All providers visible on /third-party page
- [ ] Logos display correctly
- [ ] Forms validate input properly
- [ ] API connections work with valid credentials
- [ ] Loading states show during processing
- [ ] Error messages display for invalid input
- [ ] Documentation links open correctly
- [ ] Modal close/submit buttons work
- [ ] Backend integrations respond properly

## Improvement Opportunities

1. Replace placeholder logos with official brand assets
2. Add integration usage examples
3. Implement OAuth flows where applicable
4. Add connection testing before save
5. Create integration templates/presets
6. Add usage analytics
7. Implement batch configuration
8. Add integration health monitoring

