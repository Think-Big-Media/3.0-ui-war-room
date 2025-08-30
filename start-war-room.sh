#!/bin/bash

# War Room Startup Script - Run this every time you start working
# This ensures everything is properly configured and running

echo "🚀 WAR ROOM STARTUP SEQUENCE INITIATED"
echo "======================================="

# 1. Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the War Room project directory!"
    echo "Please navigate to: repositories/3.0-ui-war-room/"
    exit 1
fi

echo "✅ Step 1: Directory confirmed"

# 2. Ensure we're on the right branch
echo "📌 Step 2: Checking Git branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "ai_main_4e977d4d0163" ]; then
    echo "   Switching to the stable branch..."
    git checkout ai_main_4e977d4d0163
fi
echo "✅ Step 2: On correct branch (ai_main_4e977d4d0163)"

# 3. Pull latest changes
echo "🔄 Step 3: Pulling latest changes..."
git pull origin ai_main_4e977d4d0163 2>/dev/null || echo "   (No remote changes or offline - continuing...)"
echo "✅ Step 3: Code is up to date"

# 4. Install dependencies
echo "📦 Step 4: Checking dependencies..."
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
else
    echo "   Dependencies already installed"
fi
echo "✅ Step 4: Dependencies ready"

# 5. Ensure Supabase is installed
if ! npm list @supabase/supabase-js >/dev/null 2>&1; then
    echo "   Installing Supabase..."
    npm install @supabase/supabase-js
fi
echo "✅ Step 5: Supabase configured"

# 6. Check environment file
if [ ! -f ".env" ]; then
    echo "⚠️  Step 6: Creating .env file from template..."
    cp .env.example .env
    echo "   Please configure your .env file with real values later"
else
    echo "✅ Step 6: Environment file exists"
fi

# 7. Kill any existing dev servers on port 5173
echo "🔧 Step 7: Clearing port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo "✅ Step 7: Port cleared"

# 8. Start the development server
echo ""
echo "======================================="
echo "🎯 WAR ROOM IS READY!"
echo "======================================="
echo ""
echo "Starting development server..."
echo "App will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev