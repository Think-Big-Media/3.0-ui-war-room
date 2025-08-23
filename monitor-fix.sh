#!/bin/bash

echo "🔄 Monitoring fix deployment..."
echo "Expected: index-C_I-GJpD.js"
echo ""

while true; do
  # Get current JS bundle
  CURRENT=$(curl -s https://war-room-2025.onrender.com 2>/dev/null | grep -o "index-[^\"]*\.js" | head -1)
  
  if [ "$CURRENT" = "index-C_I-GJpD.js" ]; then
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "✅ war-room-2025.onrender.com is now serving the correct build!"
    
    # Test API
    HEALTH=$(curl -s https://war-room-2025.onrender.com/health 2>/dev/null)
    echo "API Health: $HEALTH"
    
    # Open the site
    open https://war-room-2025.onrender.com
    
    # Success notification
    /Users/rodericandrews/WarRoom_Development/1.0-war-room/scripts/claude-notify-unified.sh complete "Deployment Fixed!" "war-room-2025 is working! Check browser."
    
    exit 0
  else
    echo "$(date +%H:%M:%S) - Still deploying... (current: $CURRENT)"
  fi
  
  sleep 30
done