# AI Provider Dependencies

## Required NPM Packages

Add these dependencies to your `package.json` to support all AI providers:

```json
{
  "dependencies": {
    "openai": "^4.77.3",
    "@anthropic-ai/sdk": "^0.32.1",
    "@google/generative-ai": "^0.21.0"
  }
}
```

## Installation Commands

### Install All Providers

```bash
pnpm add openai @anthropic-ai/sdk @google/generative-ai
```

### Install Individual Providers

```bash
# OpenAI (already included in base project)
pnpm add openai

# Anthropic Claude
pnpm add @anthropic-ai/sdk

# Google Gemini
pnpm add @google/generative-ai
```

### Optional: Groq and Mistral

Groq and Mistral use OpenAI-compatible APIs, so no additional packages are needed beyond `openai`.

## TypeScript Types

All packages include TypeScript definitions out of the box.

## Version Compatibility

- **Node.js**: 18.x or higher
- **TypeScript**: 5.x or higher
- **NestJS**: 10.x or higher

## Next Steps

1. Install dependencies: `pnpm install`
2. Configure API keys in `.env` (see `.env.arkyra.example`)
3. Read `AI_MODELS_GUIDE.md` for provider setup
4. Test with: `pnpm test`

## Troubleshooting

### Module Not Found

If you see "Cannot find module '@anthropic-ai/sdk'" or similar:

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

If you see TypeScript errors related to AI packages:

```bash
# Rebuild TypeScript
pnpm run build
```

### API Connection Issues

Check your API keys and network connectivity:

```bash
# Test API connectivity
curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_API_KEY"
```
