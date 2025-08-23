#!/bin/bash

# War Room Deployment Verification Script
# Checks all critical endpoints and functionality

echo "🔍 War Room Deployment Verification"
echo "===================================="
echo ""

URL="https://war-room-2025.onrender.com"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_endpoint() {
    local endpoint=$1
    local expected=$2
    local description=$3
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$URL$endpoint")
    
    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}✅ $description${NC}"
        echo "   Endpoint: $endpoint"
        echo "   Status: $response"
    else
        echo -e "${RED}❌ $description${NC}"
        echo "   Endpoint: $endpoint"
        echo "   Expected: $expected, Got: $response"
    fi
    echo ""
}

# Check if content contains string
check_content() {
    local endpoint=$1
    local search=$2
    local description=$3
    
    if curl -s "$URL$endpoint" | grep -q "$search"; then
        echo -e "${GREEN}✅ $description${NC}"
        echo "   Found: '$search'"
    else
        echo -e "${RED}❌ $description${NC}"
        echo "   Missing: '$search'"
    fi
    echo ""
}

# 1. Basic connectivity
echo "1. Basic Connectivity"
echo "---------------------"
check_endpoint "" "200" "Homepage loads"

# 2. Frontend assets
echo "2. Frontend Assets"
echo "------------------"
check_content "" "index-" "JavaScript bundle loads"
check_content "" "War Room Platform" "HTML title present"

# 3. API Health
echo "3. API Endpoints"
echo "----------------"
check_endpoint "/health" "200" "Health endpoint"

# Check health details
echo "Health endpoint details:"
curl -s "$URL/health" | python3 -m json.tool 2>/dev/null || curl -s "$URL/health"
echo ""
echo ""

# 4. Check for JavaScript errors
echo "4. JavaScript Status"
echo "--------------------"
JS_HASH=$(curl -s "$URL" | grep -o "index-[^\"]*\.js" | head -1)
echo "Current JS hash: $JS_HASH"

if [ ! -z "$JS_HASH" ]; then
    # Check if JS has our fixes
    if curl -s "$URL/assets/$JS_HASH" | grep -q "placeholder.supabase.co"; then
        echo -e "${GREEN}✅ JavaScript has Supabase fallback fix${NC}"
    else
        echo -e "${YELLOW}⚠️  JavaScript may not have Supabase fallback${NC}"
    fi
    
    # Check for error strings
    if curl -s "$URL/assets/$JS_HASH" | grep -q "Missing Supabase environment"; then
        echo -e "${RED}❌ JavaScript contains error-throwing code${NC}"
    else
        echo -e "${GREEN}✅ No 'Missing Supabase' errors in JavaScript${NC}"
    fi
fi
echo ""

# 5. API Routes
echo "5. API Routes Check"
echo "-------------------"
check_endpoint "/api/v1/test" "200" "API v1 test endpoint"
check_endpoint "/api/v1/ad-insights/accounts" "200" "Mock ad-insights endpoint"

# 6. Environment check
echo "6. Environment Status"
echo "---------------------"
echo "Checking deployment version..."
check_endpoint "/deployment-version" "200" "Deployment version endpoint"

# 7. Final summary
echo ""
echo "===================================="
echo "📊 Deployment Summary"
echo "===================================="

if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Site is accessible${NC}"
    
    # Check if it's actually rendering content
    CONTENT_LENGTH=$(curl -s "$URL" | wc -c)
    if [ $CONTENT_LENGTH -gt 1000 ]; then
        echo -e "${GREEN}✅ Content is being served (${CONTENT_LENGTH} bytes)${NC}"
    else
        echo -e "${RED}❌ Content seems too small (${CONTENT_LENGTH} bytes)${NC}"
    fi
else
    echo -e "${RED}❌ Site is not accessible${NC}"
fi

echo ""
echo "🔗 Live URL: $URL"
echo "📝 Dashboard: https://dashboard.render.com/web/srv-d2dm57mmcj7s73c76dh0"
echo ""
echo "If everything shows ✅, the deployment is successful!"
echo "If you see ❌, check the Render dashboard for logs."