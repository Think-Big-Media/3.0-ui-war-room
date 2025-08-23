#!/bin/bash

echo "🔄 Monitoring deployment at https://war-room-2025.onrender.com"
echo "Checking for new JavaScript bundle..."

CURRENT_HASH="index-64b84631.js"
NEW_HASH=""

while true; do
  # Get the HTML and extract the JS file name
  HTML=$(curl -s https://war-room-2025.onrender.com 2>/dev/null)
  JS_FILE=$(echo "$HTML" | grep -o 'src="/assets/index-[^"]*\.js"' | sed 's/.*index-/index-/' | sed 's/".*//')
  
  if [ -z "$JS_FILE" ]; then
    echo "⚠️  Could not fetch site"
  elif [ "$JS_FILE" != "$CURRENT_HASH" ]; then
    echo "✅ New deployment detected: $JS_FILE"
    echo "🎉 Deployment complete!"
    
    # Test if the site loads
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://war-room-2025.onrender.com)
    echo "HTTP Status: $STATUS"
    
    # Test API health
    HEALTH=$(curl -s https://war-room-2025.onrender.com/health | python3 -m json.tool 2>/dev/null)
    if [ $? -eq 0 ]; then
      echo "API Health:"
      echo "$HEALTH"
    fi
    
    break
  else
    echo "⏳ Still on old deployment ($JS_FILE). Waiting..."
  fi
  
  sleep 30
done

echo "Opening site..."
open https://war-room-2025.onrender.com