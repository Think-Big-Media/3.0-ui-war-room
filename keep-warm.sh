#!/bin/bash

# War Room - Keep Warm Script
# Prevents Render cold starts by pinging the service regularly
# Run this as a cron job every 10 minutes to keep the service active

URL="https://war-room-oa9t.onrender.com/health"
SETTINGS_URL="https://war-room-oa9t.onrender.com/settings"

echo "🔥 Keeping War Room warm at $(date)"

# Ping health endpoint
echo "Checking health endpoint..."
curl -s -o /dev/null -w "Health Response: %{http_code} - Time: %{time_total}s\n" "$URL"

# Also ping settings page to keep frontend warm
echo "Checking settings page..."
curl -s -o /dev/null -w "Settings Response: %{http_code} - Time: %{time_total}s\n" "$SETTINGS_URL"

echo "✅ Keep-warm ping complete"
echo "---"