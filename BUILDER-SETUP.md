# Builder.io Setup Guide for War Room 3.0

## Quick Start

This guide will help you set up Builder.io for visual editing of the War Room UI.

## 1. Get Your Builder.io API Key

1. **Sign up / Login** to [Builder.io](https://builder.io)
2. **Create a new Space** (or use existing):
   - Name: "War Room Platform"
   - Type: "Website"
3. **Get your API key**:
   - Go to Settings → API Keys
   - Copy your Public API Key
   - It looks like: `abc123def456...`

## 2. Configure Your Local Environment

1. **Update the .env file**:
```bash
# Edit the .env file
VITE_BUILDER_IO_KEY=your-actual-api-key-here
```

2. **Restart your dev server**:
```bash
npm run dev
```

## 3. Set Up Render Deployment

The app auto-deploys to Render when you push to GitHub.

### Option A: Using Render Dashboard (Easiest)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository: `Think-Big-Media/3.0-ui-war-room`
4. Use these settings:
   - **Name**: war-room-3-ui
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click "Create Static Site"
6. Copy your site URL (e.g., `https://war-room-3-ui.onrender.com`)

### Option B: Using render.yaml (Already configured)
The `render.yaml` file is already set up. Render will automatically detect it when you connect the repository.

## 4. Configure Builder.io Preview URL

1. **In Builder.io Dashboard**:
   - Go to Settings → Advanced Settings
   - Set "Preview URL" to your Render URL: `https://war-room-3-ui.onrender.com`
   - Save changes

2. **Test the preview**:
   - Create a new page in Builder
   - The preview should show your deployed app

## 5. Create Your First Page in Builder

1. **In Builder.io**:
   - Click "Content" → "New Entry"
   - Choose "Page" model
   - Set the URL path (e.g., `/builder/landing`)

2. **Start designing**:
   - Drag and drop components from the left panel
   - Use your registered War Room components:
     - Dashboard
     - CommandCenter
     - FeatureCard
     - RecentActivity
     - QuickActions

3. **Style with custom fonts**:
   - Barlow Condensed is available for headings
   - JetBrains Mono is available for code/interface elements

4. **Publish when ready**:
   - Click "Publish" in the top right
   - Your page is now live at `/builder/landing`

## 6. View Your Builder Pages

### In Development:
```
http://localhost:5173/builder/your-page-name
```

### In Production:
```
https://war-room-3-ui.onrender.com/builder/your-page-name
```

## Workflow Summary

1. **Visual Editing**: Use Builder.io to create/edit pages visually
2. **Code Changes**: Edit React components locally
3. **Deploy**: Push to GitHub → Auto-deploys to Render
4. **Preview**: Builder shows your Render URL for live preview

## Available Components in Builder

### Page Components
- `Dashboard` - Main dashboard view
- `AnalyticsDashboard` - Analytics and metrics
- `AutomationDashboard` - Workflow automation
- `DocumentIntelligence` - AI document analysis
- `SettingsPage` - User settings

### Layout Components
- `MainLayout` - App layout with sidebar
- `Sidebar` - Navigation sidebar
- `Navbar` - Top navigation

### Feature Components
- `CommandCenter` - Key metrics display
- `FeatureCard` - Feature showcase cards
- `RecentActivity` - Activity feed
- `QuickActions` - Quick action buttons

## Troubleshooting

### "No content found for this page"
- Make sure you've created content in Builder for that URL path
- Check that your API key is correct in `.env`

### Components not showing in Builder
- Ensure `npm run dev` is running locally
- Check browser console for errors
- Verify components are registered in `src/builder-registry.tsx`

### Deployment not updating
- Check GitHub Actions/Render logs
- Ensure `render.yaml` is configured correctly
- Verify auto-deploy is enabled in Render

## Next Steps

1. **Create landing pages** in Builder without code
2. **A/B test** different designs
3. **Use targeting** to show different content to different users
4. **Integrate forms** for lead capture
5. **Add animations** with Builder's built-in tools

## Support

- [Builder.io Docs](https://www.builder.io/c/docs)
- [Builder.io Discord](https://discord.gg/builder)
- [Render Docs](https://render.com/docs)

---

Happy building! 🚀