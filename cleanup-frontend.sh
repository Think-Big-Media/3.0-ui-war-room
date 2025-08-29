#!/bin/bash

# SAFE CLEANUP SCRIPT FOR 3.0-ui-war-room
# Run from 3.0-ui-war-room directory
# Creates backup before removing anything

echo "🧹 Frontend Cleanup Script - Removing deployment conflicts and Python contamination"
echo "================================================"

# Create backup directory with timestamp
BACKUP_DIR="../frontend-backup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup at $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Function to safely remove files
safe_remove() {
    if [ -e "$1" ]; then
        echo "  Moving $1 to backup..."
        mv "$1" "$BACKUP_DIR/" 2>/dev/null
    fi
}

echo ""
echo "1️⃣ Removing conflicting deployment configs..."
safe_remove "vercel.json"
safe_remove "vercel-alternative.json"
safe_remove ".vercelignore"
safe_remove "render.yaml"
safe_remove "render-staging.yaml"
safe_remove "render-v2-staging.yaml"
safe_remove "render-war-room-2025.yaml"
safe_remove "render.yaml.backup"
safe_remove "render-build.sh"
safe_remove "render-oauth-env.txt"
safe_remove "runtime.txt"
safe_remove "Procfile"
safe_remove "netlify.toml"

echo ""
echo "2️⃣ Removing Python contamination..."
safe_remove "requirements.txt"
safe_remove "requirements-minimal.txt"
safe_remove "agents"
safe_remove "sub-agents"

echo ""
echo "3️⃣ Removing conflicting package manager files..."
echo "  Keeping package-lock.json (npm)"
safe_remove "pnpm-lock.yaml"
safe_remove "yarn.lock"

echo ""
echo "4️⃣ Organizing scattered scripts..."
mkdir -p scripts/deployment
mkdir -p scripts/fixes
mkdir -p scripts/monitoring

# Move scripts to organized folders
for script in fix-*.sh; do
    [ -f "$script" ] && mv "$script" scripts/fixes/ 2>/dev/null
done

for script in monitor-*.sh; do
    [ -f "$script" ] && mv "$script" scripts/monitoring/ 2>/dev/null
done

for script in deploy*.sh render*.sh vercel*.sh netlify*.sh; do
    [ -f "$script" ] && mv "$script" scripts/deployment/ 2>/dev/null
done

echo ""
echo "5️⃣ Removing Python cache directories..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null

echo ""
echo "6️⃣ Cleaning up test/temp files..."
safe_remove "test-results-summary.txt"
safe_remove "performance-results-*.json"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  - Backup created at: $BACKUP_DIR"
echo "  - Removed deployment configs for Vercel, Netlify, Render"
echo "  - Removed Python files and directories"
echo "  - Organized scripts into folders"
echo "  - Kept only npm package-lock.json"
echo ""
echo "🔍 Next steps:"
echo "  1. Run 'npm ci' to ensure clean dependencies"
echo "  2. Test 'npm run dev' still works"
echo "  3. Commit these changes"
echo "  4. If anything breaks, restore from $BACKUP_DIR"