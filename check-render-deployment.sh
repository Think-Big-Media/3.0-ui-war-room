#\!/bin/bash

echo "🔍 Checking Render Deployment Configuration..."
echo "==========================================="

# Check for Render service ID
if [ -f .env.render.template ]; then
    echo "📄 .env.render.template contents:"
    grep -E "RENDER_SERVICE_ID|RENDER_DEPLOY_HOOK_URL" .env.render.template
fi

# Check render.yaml
if [ -f render.yaml ]; then
    echo -e "\n📄 render.yaml service name:"
    grep -A 5 "services:" render.yaml | grep "name:"
fi

# Check for deployment scripts
echo -e "\n📄 Deployment scripts found:"
ls -la scripts/*render* scripts/*deploy* 2>/dev/null || echo "No deployment scripts found"

# Check git remote
echo -e "\n📄 Git remote URL:"
git remote get-url origin

echo -e "\n✅ Next Steps:"
echo "1. Log into Render.com"
echo "2. Check if service ID 'srv-dlub5iumcj7s73ebrpo0' is in ThinkBig or War Room workspace"
echo "3. Verify the deployed branch and last deployment time"
EOF < /dev/null