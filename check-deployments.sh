#!/bin/bash

echo "🔍 Checking War Room Deployments..."
echo ""

# Check war-room-2025 (new)
echo "1️⃣ war-room-2025.onrender.com (New - War Room AI workspace):"
HTML=$(curl -s https://war-room-2025.onrender.com 2>/dev/null | head -20)
if echo "$HTML" | grep -q "War Room Platform"; then
  JS_FILE=$(echo "$HTML" | grep -o 'index-[^"]*\.js' | head -1)
  echo "   ✅ HTML loads with JS: $JS_FILE"
  if [ "$JS_FILE" = "index-C_I-GJpD.js" ]; then
    echo "   🎉 NEW DEPLOYMENT IS LIVE!"
  else
    echo "   ⏳ Still on old deployment"
  fi
else
  echo "   ❌ Not loading properly"
fi

# Check API health
HEALTH=$(curl -s https://war-room-2025.onrender.com/health 2>/dev/null)
if echo "$HEALTH" | grep -q "healthy"; then
  echo "   ✅ API is healthy"
else
  echo "   ❌ API not responding"
fi

echo ""

# Check war-room-oa9t (old)
echo "2️⃣ war-room-oa9t.onrender.com (Old - Think Big Media workspace):"
HTML=$(curl -s https://war-room-oa9t.onrender.com 2>/dev/null | head -20)
if echo "$HTML" | grep -q "War Room Platform"; then
  JS_FILE=$(echo "$HTML" | grep -o 'index-[^"]*\.js' | head -1)
  echo "   ✅ HTML loads with JS: $JS_FILE"
else
  echo "   ❌ Not loading properly"
fi

# Check API health
HEALTH=$(curl -s https://war-room-oa9t.onrender.com/health 2>/dev/null)
if echo "$HEALTH" | grep -q "healthy"; then
  echo "   ✅ API is healthy"
else
  echo "   ❌ API not responding"
fi

echo ""
echo "Expected new JS bundle: index-C_I-GJpD.js"
echo "Deployment typically takes 8-10 minutes on Render"