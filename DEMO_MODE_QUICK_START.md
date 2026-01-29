# ARKYRA Demo Mode - Quick Start Guide

## 🚀 Get Started in 5 Minutes (No API Keys Required!)

ARKYRA now runs fully functional without any AI API keys. Perfect for testing, development, and evaluation.

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Redis server

## Setup Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/arkyra.git
cd arkyra

# Install dependencies
pnpm install
```

### 2. Configure Environment (Minimal Setup)

```bash
# Copy example environment
cp .env.example .env

# Edit .env with only these required fields:
nano .env
```

**Minimum Required Configuration:**
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/arkyra"

# Redis
REDIS_URL="redis://localhost:6379"

# Security
JWT_SECRET="your-random-secret-string-make-it-long"

# URLs
FRONTEND_URL="http://localhost:4200"
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"
BACKEND_INTERNAL_URL="http://localhost:3000"
MAIN_URL="http://localhost:4200"

# Storage (local mode)
STORAGE_PROVIDER="local"

# Leave OPENAI_API_KEY empty for demo mode!
OPENAI_API_KEY=""
```

### 3. Setup Database

```bash
# Run migrations
pnpm prisma:migrate

# Seed database (optional)
pnpm prisma:seed
```

### 4. Start the Platform

```bash
# Start backend and frontend
pnpm run dev
```

**Expected Output:**
```
🚀 Backend is running on: http://localhost:3000
═══════════════════════════════════════════════════════════
🔧 DEMO MODE ACTIVE - AI features will return mock data
To enable real AI features, add to your .env file:
   OPENAI_API_KEY=your-openai-api-key
Platform is fully functional in demo mode for testing!
═══════════════════════════════════════════════════════════
[AIRouterService] 🔧 AI Router running in DEMO MODE
```

### 5. Access the Platform

Open your browser to:
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api

## ✅ What Works in Demo Mode

Everything works! AI features just return sample data:

### Fully Functional
- ✅ User authentication and registration
- ✅ Dashboard and all UI pages
- ✅ Post scheduling and calendar
- ✅ Media library and file uploads
- ✅ Settings and configuration
- ✅ Database operations
- ✅ Third-party integrations setup

### Mock Data (Demo Responses)
- 🎭 AI post generation → Returns demo posts
- 🎭 Image generation → Returns placeholder images
- 🎭 Content analysis → Returns sample analysis
- 🎭 Voice/Audio generation → Returns demo text
- 🎭 Slide generation → Returns sample slides

## 🔑 Enabling Real AI (Optional)

Want to try real AI features? Add your OpenAI API key:

```bash
# Get API key from https://platform.openai.com/api-keys

# Add to .env
echo 'OPENAI_API_KEY=sk-proj-your-actual-key' >> .env

# Restart
pnpm run dev
```

You'll see:
```
✅ AI features enabled with configured API keys
```

## 🧪 Testing Scenarios

### Scenario 1: Test Post Generation (Demo Mode)
1. Navigate to "Create Post"
2. Enter any content
3. Click "Generate with AI"
4. Receive demo post with message about demo mode

### Scenario 2: Test Image Generation (Demo Mode)
1. Navigate to "Media Library"
2. Click "Generate Image"
3. Enter a prompt
4. Receive placeholder image URL

### Scenario 3: Test Full Workflow (Demo Mode)
1. Create a social media account connection (can be dummy in demo)
2. Generate post content (receives demo response)
3. Schedule for later
4. View in calendar
5. Check analytics (shows demo data)

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check if Redis is running
redis-cli ping
```

### Database connection error
```bash
# Verify DATABASE_URL format
postgresql://username:password@host:port/database

# Test connection
pnpm prisma:studio
```

### Redis connection error
```bash
# Start Redis
redis-server

# Or with Docker
docker run -d -p 6379:6379 redis
```

### Port already in use
```bash
# Change port in .env
PORT=3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

## 📚 Next Steps

- **Explore Features:** Navigate through all pages and test workflows
- **Add API Keys:** Enable real AI features when ready
- **Configure Integrations:** Add social media and third-party connections
- **Deploy:** Follow deployment guide when ready for production

## 💡 Tips

1. **No API Costs:** Demo mode incurs zero API costs
2. **Full Testing:** All features can be tested without AI keys
3. **Gradual Upgrade:** Add API keys one at a time as needed
4. **Development:** Perfect for frontend development without backend dependencies
5. **CI/CD:** Run tests without API keys in pipelines

## 🔗 Resources

- **Full Demo Mode Docs:** [AI_DEMO_MODE.md](./AI_DEMO_MODE.md)
- **Configuration Reference:** [.env.example](./.env.example)
- **AI Provider Guide:** See docs for adding multiple AI providers
- **Deployment Guide:** Check deployment documentation

## 🆘 Need Help?

- 📖 Read [AI_DEMO_MODE.md](./AI_DEMO_MODE.md) for detailed documentation
- 🐛 Check GitHub Issues
- 💬 Join Discord community
- 📧 Email support

## ⚡ Quick Commands

```bash
# Start in demo mode
pnpm run dev

# Check demo mode status
grep OPENAI_API_KEY .env

# Force demo mode (even if key exists)
echo 'OPENAI_API_KEY=sk-demo-key' > .env

# Enable production mode
echo 'OPENAI_API_KEY=sk-proj-real-key' > .env

# View logs with demo mode indicators
pnpm run dev | grep "DEMO MODE"
```

## 🎯 Success Criteria

You'll know demo mode is working when:
- ✅ Backend starts without API key errors
- ✅ You see "DEMO MODE ACTIVE" message
- ✅ All pages load successfully
- ✅ AI features return demo responses
- ✅ No API cost warnings or errors

---

**Ready in 5 minutes! No API keys required!** 🚀
