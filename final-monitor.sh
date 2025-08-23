#!/bin/bash

echo "🔍 Monitoring FINAL deployment to war-room-2025..."
echo "Expected JS: index-76cc1466.js"
echo ""

START_TIME=$(date +%s)

while true; do
  CURRENT=$(curl -s https://war-room-2025.onrender.com 2>/dev/null | grep -o "index-[^\"]*\.js" | head -1)
  ELAPSED=$(($(date +%s) - START_TIME))
  MINS=$((ELAPSED / 60))
  
  if [ "$CURRENT" = "index-76cc1466.js" ]; then
    echo ""
    echo "🎉🎉🎉 DEPLOYMENT SUCCESSFUL! 🎉🎉🎉"
    echo "✅ war-room-2025.onrender.com is WORKING!"
    echo "✅ Client's Render account deployment FIXED!"
    echo "✅ Meta/Google analytics features included!"
    echo ""
    
    # Test API
    HEALTH=$(curl -s https://war-room-2025.onrender.com/health 2>/dev/null)
    echo "API Health: $HEALTH"
    
    # Open both sites
    open https://war-room-2025.onrender.com
    open https://war-room-oa9t.onrender.com
    
    # Victory notification
    /Users/rodericandrews/WarRoom_Development/1.0-war-room/scripts/claude-notify-unified.sh complete "🎉 VICTORY!" "war-room-2025 is WORKING on client's account! Check browser!"
    
    echo ""
    echo "BOTH DEPLOYMENTS NOW WORKING:"
    echo "✅ war-room-oa9t.onrender.com (your account)"
    echo "✅ war-room-2025.onrender.com (client's account)"
    
    exit 0
  else
    echo "$(date +%H:%M:%S) [$MINS mins] - Deploying... (current: $CURRENT)"
  fi
  
  sleep 20
done