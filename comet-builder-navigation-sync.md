# Comet Prompt: Builder.io Navigation Sync & Reconnaissance

## Context for Builder.io
We're finalizing the War Room Platform navigation structure. The app is deployed at https://war-room-3-ui.onrender.com and we need to ensure Builder.io is in sync with our exact naming requirements.

## Current Status
- ✅ Framer Motion completely removed (performance optimization complete)
- ✅ Build succeeds with proper chunk sizes
- ✅ App runs locally without errors
- 🔄 Navigation needs exact naming updates

## EXACT Navigation Requirements

### Primary Navigation (Must Match Exactly)
1. **Dashboard** - Default page at `/` and `/dashboard`
2. **Live Monitoring** - NOT "Real-Time Monitoring" at `/monitoring`
3. **War Room** - Central command at `/war-room`
4. **Intelligence** - NOT "Intelligence Hub" at `/intelligence`
5. **Alert Center** - Crisis management at `/alerts`
6. **Settings** - User settings at `/settings`

### Footer Pages (Need Creation in Builder)
- **Privacy Policy** at `/privacy`
- **Terms of Service** at `/terms`
- **Cookie Policy** at `/cookies`
- **Contact** at `/contact`

## Reconnaissance Tasks for Comet

### 1. Check Current Builder.io State
- Visit: https://builder.io/content/8686f311497044c0932b7d2247296478
- API Key: `8686f311497044c0932b7d2247296478`
- Check if navigation component exists as a Symbol
- Verify current menu items and their names

### 2. Navigation Component Updates Needed
If navigation exists in Builder:
- Update menu item names to match EXACTLY as listed above
- Ensure routes are correct (e.g., `/monitoring` not `/real-time-monitoring`)
- Make navigation a reusable Symbol if not already

If navigation doesn't exist:
- Create new Symbol called "Navigation"
- Add all 6 primary menu items with exact names
- Set correct route paths

### 3. Footer Component Creation
- Create new Symbol called "Footer"
- Include links to Privacy, Terms, Cookies, Contact
- Add copyright text: "© 2025 War Room Platform. All rights reserved."

### 4. Page Models to Create
Create these as Builder.io Page models (not React components):
- `privacy-policy` - Privacy Policy content
- `terms-of-service` - Terms of Service content  
- `cookie-policy` - Cookie Policy content
- `contact` - Contact form/information

### 5. Component Registration Mapping
Our React components map to Builder like this:
```
Dashboard → Dashboard (no change)
RealTimeMonitoring → Live Monitoring (display name)
CommandCenter → War Room (display name)
IntelligenceHub → Intelligence (display name)
AlertCenter → Alert Center (no change)
SettingsPage → Settings (display name)
```

## Code Changes Already Prepared
We've created wrapper components with cleaner names:
- `LiveMonitoring.tsx` (wraps RealTimeMonitoring)
- `WarRoom.tsx` (wraps CommandCenter)
- `Intelligence.tsx` (wraps IntelligenceHub)
- `Settings.tsx` (wraps SettingsPage)

## Builder.io Action Items

### Immediate Actions:
1. **Update Navigation Symbol** with exact menu names
2. **Create Footer Symbol** with legal links
3. **Create 4 Page models** for legal pages
4. **Test preview** to ensure navigation works

### Publishing:
- After updates, publish changes in Builder
- We'll then update our App.tsx routes to match

## Questions for Reconnaissance:
1. Is there already a Navigation component/Symbol in Builder?
2. Are there any existing page models we should know about?
3. Is the navigation currently hardcoded or using Builder's menu system?
4. Are there any custom components registered we haven't accounted for?

## Important Notes:
- We're working on branch `feature/clean-navigation-builder-sync`
- The goal is perfect synchronization between code and Builder
- No funny names, everything clean and professional
- This sets us up for the "bridge phase" as recommended

## End Goal:
A perfectly clean navigation where:
- Display names match exactly what users see
- Routes are simple and memorable
- Builder.io and code are 100% in sync
- Documentation matches implementation

Please perform reconnaissance and update Builder.io accordingly!