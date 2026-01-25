# ARKYRA AI Models Guide

## Overview

ARKYRA supports multiple AI providers and models for content generation, giving you flexibility to choose the best model for your needs and budget. This guide covers all supported providers, recommended models, and use cases.

## Supported AI Providers

### 1. **Google Gemini** (Default, Recommended)

**Why Gemini?**
- **Cost-Effective**: Significantly cheaper than OpenAI
- **Fast**: Excellent response times
- **Multimodal**: Native support for text, images, and video
- **Long Context**: Up to 2M tokens context window
- **Arabic Support**: Excellent multilingual capabilities including Arabic

**Recommended Models:**

| Model | Use Case | Context | Cost (per 1M tokens) |
|-------|----------|---------|----------------------|
| `gemini-2.0-flash-exp` | General content generation, social media posts | 1M tokens | Free (experimental) |
| `gemini-1.5-pro` | Complex reasoning, long-form content | 2M tokens | $1.25 / $5.00 |
| `gemini-1.5-flash` | Fast responses, high-volume tasks | 1M tokens | $0.075 / $0.30 |

**Best For:**
- Social media content generation
- Multi-language support (Arabic, English, etc.)
- Image understanding and description
- Cost-sensitive deployments

**Setup:**
```env
AI_PROVIDER=google-gemini
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

---

### 2. **OpenAI GPT** (Premium Option)

**Why OpenAI?**
- **Industry Standard**: Most widely used and tested
- **Best Quality**: Highest quality outputs
- **Rich Ecosystem**: Extensive tools and integrations
- **Structured Outputs**: Native JSON mode support

**Recommended Models:**

| Model | Use Case | Context | Cost (per 1M tokens) |
|-------|----------|---------|----------------------|
| `gpt-4.1` | Best quality content, complex tasks | 128K tokens | $2.50 / $10.00 |
| `gpt-4.1-mini` | Fast, cost-effective alternative | 128K tokens | $0.15 / $0.60 |
| `gpt-4.1-nano` | Ultra-fast, simple tasks | 128K tokens | $0.04 / $0.16 |
| `dall-e-3` | Image generation | N/A | $0.040 per image |

**Best For:**
- Highest quality content generation
- Complex reasoning tasks
- Image generation (DALL-E 3)
- Structured JSON outputs

**Setup:**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_here
```

---

### 3. **Anthropic Claude** (Best for Long-Form Content)

**Why Claude?**
- **Long Context**: Up to 200K tokens
- **Best Reasoning**: Excellent for complex analysis
- **Safety**: Strong content moderation
- **Nuanced Writing**: Natural, human-like outputs

**Recommended Models:**

| Model | Use Case | Context | Cost (per 1M tokens) |
|-------|----------|---------|----------------------|
| `claude-3-7-sonnet-20250219` | Best balance of speed and quality | 200K tokens | $3.00 / $15.00 |
| `claude-3-5-haiku-20241022` | Fast, cost-effective | 200K tokens | $0.80 / $4.00 |
| `claude-3-opus-20240229` | Highest quality (legacy) | 200K tokens | $15.00 / $75.00 |

**Best For:**
- Long-form content (articles, blog posts)
- Complex reasoning and analysis
- Content that requires nuance
- Safety-critical applications

**Setup:**
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_api_key_here
```

---

### 4. **Groq** (Fastest Inference)

**Why Groq?**
- **Ultra-Fast**: Fastest inference speeds (up to 500 tokens/sec)
- **Free Tier**: Generous free tier
- **Open Models**: Uses open-source models
- **Cost-Effective**: Very affordable

**Recommended Models:**

| Model | Use Case | Context | Speed |
|-------|----------|---------|-------|
| `llama-3.3-70b-versatile` | Best quality open model | 128K tokens | ~300 tokens/sec |
| `llama-3.1-8b-instant` | Ultra-fast responses | 128K tokens | ~500 tokens/sec |
| `mixtral-8x7b-32768` | Good balance | 32K tokens | ~400 tokens/sec |

**Best For:**
- Real-time content generation
- High-volume batch processing
- Cost-sensitive deployments
- Open-source model preference

**Setup:**
```env
AI_PROVIDER=groq
GROQ_API_KEY=your_api_key_here
```

---

### 5. **Mistral AI** (European Alternative)

**Why Mistral?**
- **European**: GDPR-compliant, EU-based
- **Open Models**: Transparent and open-source
- **Multilingual**: Excellent European language support
- **Cost-Effective**: Competitive pricing

**Recommended Models:**

| Model | Use Case | Context | Cost (per 1M tokens) |
|-------|----------|---------|----------------------|
| `mistral-large-latest` | Best quality | 128K tokens | $2.00 / $6.00 |
| `mistral-small-latest` | Fast, affordable | 128K tokens | $0.20 / $0.60 |
| `mistral-medium-latest` | Balanced | 128K tokens | $0.70 / $2.10 |

**Best For:**
- European deployments (GDPR)
- Multilingual content (European languages)
- Cost-effective alternative to OpenAI
- Open-source preference

**Setup:**
```env
AI_PROVIDER=mistral
MISTRAL_API_KEY=your_api_key_here
```

---

## Use Case Recommendations

### Social Media Post Generation

**Best Choice: Google Gemini 2.0 Flash**
- Fast generation
- Cost-effective for high volume
- Excellent multilingual support
- Good quality for short-form content

**Alternative: GPT-4.1-mini**
- Higher quality
- Better for brand-critical content
- More expensive

### Long-Form Content (Articles, Blogs)

**Best Choice: Claude 3.7 Sonnet**
- Best for nuanced writing
- Long context window
- Natural, human-like tone

**Alternative: GPT-4.1**
- Industry standard
- Reliable quality

### Image Generation

**Best Choice: DALL-E 3 (OpenAI)**
- Highest quality
- Best prompt understanding
- Consistent results

**Alternative: Imagen 3.0 (Google)**
- Good quality
- More affordable
- Integrated with Gemini

### Real-Time Content Generation

**Best Choice: Groq (Llama 3.3 70B)**
- Ultra-fast inference
- Good quality
- Free tier available

**Alternative: Gemini 2.0 Flash**
- Very fast
- Better quality
- Slightly slower than Groq

### Multilingual Content (Arabic Focus)

**Best Choice: Google Gemini**
- Excellent Arabic support
- Trained on diverse multilingual data
- Cost-effective

**Alternative: GPT-4.1**
- Good Arabic support
- Higher quality
- More expensive

### Batch Processing (190+ Accounts)

**Best Choice: Groq or Gemini Flash**
- Fast inference
- Cost-effective
- Can handle high volume

**Cost Comparison (1M tokens):**
- Groq: Free tier, then ~$0.27
- Gemini Flash: ~$0.075
- GPT-4.1-mini: ~$0.15

---

## Cost Optimization Strategies

### 1. **Hybrid Approach**

Use different models for different tasks:
- **Gemini Flash**: Social media posts (80% of usage)
- **GPT-4.1**: Brand-critical content (15% of usage)
- **Claude Sonnet**: Long-form articles (5% of usage)

**Estimated Monthly Cost (1M posts):**
- Pure OpenAI: ~$2,500
- Pure Gemini: ~$75
- Hybrid: ~$500

### 2. **Caching Strategy**

- Cache common prompts and templates
- Reuse generated content variations
- Implement smart retry logic

### 3. **Rate Limiting**

- Implement intelligent rate limiting
- Use provider rotation for load distribution
- Fallback to cheaper models during high load

---

## Environment Configuration

### Complete .env Example

```env
# ============================================================================
# AI PROVIDER CONFIGURATION
# ============================================================================

# Default AI Provider (google-gemini, openai, anthropic, groq, mistral)
AI_PROVIDER=google-gemini

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-7-sonnet-20250219

# Groq API
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Mistral AI API
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-large-latest

# ============================================================================
# AI FEATURE FLAGS
# ============================================================================

# Enable AI content generation
FEATURE_AI_CONTENT_GENERATION=true

# Enable AI image generation
FEATURE_AI_IMAGE_GENERATION=true

# Enable AI auto-posting
FEATURE_AI_AUTO_POST=false

# ============================================================================
# AI PERFORMANCE SETTINGS
# ============================================================================

# Maximum tokens per request
AI_MAX_TOKENS=4096

# Temperature (0.0 - 2.0, higher = more creative)
AI_TEMPERATURE=0.7

# Enable response caching
AI_ENABLE_CACHING=true

# Cache TTL (seconds)
AI_CACHE_TTL=3600
```

---

## API Key Setup Guides

### Google Gemini

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy and add to `.env`

**Free Tier:** 60 requests per minute

### OpenAI

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add billing information
4. Copy and add to `.env`

**Pricing:** Pay-as-you-go

### Anthropic Claude

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Navigate to API Keys
3. Create a new key
4. Copy and add to `.env`

**Free Tier:** $5 credit

### Groq

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for free account
3. Generate API key
4. Copy and add to `.env`

**Free Tier:** 14,400 requests per day

### Mistral AI

1. Visit [Mistral Console](https://console.mistral.ai/)
2. Create account
3. Generate API key
4. Copy and add to `.env`

**Free Tier:** Limited free tier available

---

## Performance Benchmarks

### Speed Comparison (Average Response Time)

| Provider | Model | Speed | Quality |
|----------|-------|-------|---------|
| Groq | Llama 3.3 70B | ⚡⚡⚡⚡⚡ (1-2s) | ⭐⭐⭐⭐ |
| Gemini | 2.0 Flash | ⚡⚡⚡⚡ (2-3s) | ⭐⭐⭐⭐ |
| OpenAI | GPT-4.1-mini | ⚡⚡⚡ (3-5s) | ⭐⭐⭐⭐⭐ |
| Anthropic | Claude 3.7 Sonnet | ⚡⚡⚡ (4-6s) | ⭐⭐⭐⭐⭐ |
| Mistral | Large | ⚡⚡⚡ (3-5s) | ⭐⭐⭐⭐ |

### Quality Comparison (Social Media Posts)

| Provider | Model | Quality | Arabic Support | Cost |
|----------|-------|---------|----------------|------|
| OpenAI | GPT-4.1 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 💰💰💰 |
| Gemini | 2.0 Flash | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 💰 |
| Claude | 3.7 Sonnet | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 💰💰💰 |
| Groq | Llama 3.3 70B | ⭐⭐⭐⭐ | ⭐⭐⭐ | 💰 |
| Mistral | Large | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 💰💰 |

---

## Troubleshooting

### Provider Not Available Error

**Problem:** `AI Provider X is not configured`

**Solution:**
1. Check if API key is set in `.env`
2. Verify API key is valid
3. Ensure provider is spelled correctly in `AI_PROVIDER`

### Rate Limit Errors

**Problem:** Too many requests

**Solution:**
1. Implement request queuing
2. Use multiple API keys (provider rotation)
3. Upgrade to paid tier
4. Switch to provider with higher limits

### Poor Quality Outputs

**Problem:** Generated content is low quality

**Solution:**
1. Adjust temperature (lower = more focused)
2. Improve prompts with examples
3. Switch to higher-quality model
4. Add system prompts for context

---

## Best Practices

1. **Start with Gemini**: Best balance of cost, speed, and quality
2. **Use Hybrid Approach**: Different models for different tasks
3. **Implement Caching**: Reduce API calls and costs
4. **Monitor Usage**: Track costs and performance
5. **Test Thoroughly**: Validate outputs before production
6. **Have Fallbacks**: Configure multiple providers
7. **Optimize Prompts**: Better prompts = better results

---

## Support

For AI-related issues:
- Check this guide first
- Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Create an issue on [GitHub](https://github.com/MOHJRNL/ARKYRA/issues)

---

**Last Updated:** January 2026  
**Maintained by:** ARKYRA Team
