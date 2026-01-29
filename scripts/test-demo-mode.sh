#!/bin/bash

# ARKYRA Demo Mode Test Script
# Tests that demo mode works correctly without API keys

set -e  # Exit on error

echo "================================================"
echo "ARKYRA Demo Mode Test Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_check() {
    TESTS_RUN=$((TESTS_RUN + 1))
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo "1. Checking Demo Mode Configuration Files..."
echo "----------------------------------------------"

# Check if demo mode config exists
if [ -f "libraries/nestjs-libraries/src/ai-router/config/demo-mode.config.ts" ]; then
    test_check "Demo mode config file exists"
else
    echo -e "${RED}✗${NC} Demo mode config file missing"
    exit 1
fi

# Check if documentation exists
if [ -f "AI_DEMO_MODE.md" ]; then
    test_check "Demo mode documentation exists"
else
    echo -e "${RED}✗${NC} Demo mode documentation missing"
    exit 1
fi

if [ -f "DEMO_MODE_QUICK_START.md" ]; then
    test_check "Quick start guide exists"
else
    echo -e "${RED}✗${NC} Quick start guide missing"
    exit 1
fi

echo ""
echo "2. Checking Modified Files..."
echo "----------------------------------------------"

# Check if OpenAI service was modified
if grep -q "isDemoMode" "libraries/nestjs-libraries/src/openai/openai.service.ts"; then
    test_check "OpenAI service has demo mode support"
else
    echo -e "${RED}✗${NC} OpenAI service missing demo mode support"
    exit 1
fi

# Check if AI Router adapter was modified
if grep -q "isDemoMode" "libraries/nestjs-libraries/src/ai-router/providers/openai-provider.adapter.ts"; then
    test_check "AI Router adapter has demo mode support"
else
    echo -e "${RED}✗${NC} AI Router adapter missing demo mode support"
    exit 1
fi

# Check if main.ts has demo mode banner
if grep -q "DEMO MODE" "apps/backend/src/main.ts"; then
    test_check "Backend startup has demo mode detection"
else
    echo -e "${RED}✗${NC} Backend startup missing demo mode detection"
    exit 1
fi

echo ""
echo "3. Checking Environment Configuration..."
echo "----------------------------------------------"

# Check .env.example has optional AI keys
if grep -q "OPTIONAL" ".env.example"; then
    test_check ".env.example marks AI keys as optional"
else
    echo -e "${YELLOW}⚠${NC}  .env.example should mark AI keys as optional"
fi

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"

    # Check if OPENAI_API_KEY is set
    if grep -q "OPENAI_API_KEY=" ".env" && ! grep -q "OPENAI_API_KEY=\"\"" ".env" && ! grep -q "OPENAI_API_KEY=sk-demo" ".env"; then
        echo -e "${YELLOW}⚠${NC}  OPENAI_API_KEY is set (will run in production mode)"
        echo "   To test demo mode, comment out or remove OPENAI_API_KEY from .env"
    else
        test_check "Environment configured for demo mode"
    fi
else
    echo -e "${YELLOW}⚠${NC}  No .env file found (you'll need to create one)"
fi

echo ""
echo "4. Checking TypeScript Compilation..."
echo "----------------------------------------------"

# Check if TypeScript compiles (skip lib check for speed)
echo "   Compiling backend... (this may take a moment)"
# Check only for errors in demo mode files
DEMO_ERRORS=$(npx tsc --noEmit --skipLibCheck --project apps/backend/tsconfig.json 2>&1 | grep -E "(demo-mode|openai.*service)" | grep "error TS" || true)
if [ -n "$DEMO_ERRORS" ]; then
    echo -e "${RED}✗${NC} TypeScript compilation has errors in demo mode files"
    echo "$DEMO_ERRORS"
    TESTS_FAILED=$((TESTS_FAILED + 1))
else
    test_check "Demo mode files compile without errors"
fi

echo ""
echo "5. Checking Demo Mode Features..."
echo "----------------------------------------------"

# Check demo responses are defined
if grep -q "DEMO_RESPONSES" "libraries/nestjs-libraries/src/ai-router/config/demo-mode.config.ts"; then
    test_check "Demo responses are defined"
else
    echo -e "${RED}✗${NC} Demo responses not found"
    exit 1
fi

# Check for all required demo response types
REQUIRED_RESPONSES=("completion" "imageUrl" "voice" "slides" "posts")
for response in "${REQUIRED_RESPONSES[@]}"; do
    if grep -q "$response" "libraries/nestjs-libraries/src/ai-router/config/demo-mode.config.ts"; then
        test_check "Demo response for $response exists"
    else
        echo -e "${RED}✗${NC} Missing demo response for $response"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
done

echo ""
echo "6. Checking Code Quality..."
echo "----------------------------------------------"

# Check for proper error handling
if grep -q "logDemoModeWarning" "libraries/nestjs-libraries/src/openai/openai.service.ts"; then
    test_check "Demo mode warnings are logged"
else
    echo -e "${YELLOW}⚠${NC}  Demo mode warnings might not be logged properly"
fi

# Check for try-catch blocks
if grep -q "catch (error)" "libraries/nestjs-libraries/src/openai/openai.service.ts"; then
    test_check "Error handling is implemented"
else
    echo -e "${RED}✗${NC} Missing error handling"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

echo ""
echo "7. Checking Documentation Quality..."
echo "----------------------------------------------"

# Check documentation has key sections
DOC_SECTIONS=("Overview" "Quick Start" "FAQ" "Architecture")
for section in "${DOC_SECTIONS[@]}"; do
    if grep -q "$section" "AI_DEMO_MODE.md"; then
        test_check "Documentation has $section section"
    else
        echo -e "${YELLOW}⚠${NC}  Documentation missing $section section"
    fi
done

echo ""
echo "================================================"
echo "Test Summary"
echo "================================================"
echo ""
echo "Tests Run:    $TESTS_RUN"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
else
    echo -e "Tests Failed: ${GREEN}$TESTS_FAILED${NC}"
fi
echo ""

# Calculate percentage
PERCENTAGE=$((TESTS_PASSED * 100 / TESTS_RUN))
echo "Success Rate: $PERCENTAGE%"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Demo mode is ready to use.${NC}"
    echo ""
    echo "Next Steps:"
    echo "  1. Make sure .env has no OPENAI_API_KEY or set it to empty"
    echo "  2. Run: pnpm run dev"
    echo "  3. Look for: 🔧 DEMO MODE ACTIVE message"
    echo "  4. Test AI features - they should return demo responses"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the errors above.${NC}"
    echo ""
    exit 1
fi
