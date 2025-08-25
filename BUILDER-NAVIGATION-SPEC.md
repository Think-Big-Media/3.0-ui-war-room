# Builder.io Navigation Specification
## War Room Platform - Final Navigation Structure

### Primary Navigation (Top Bar)
These are the main navigation items that should appear in the header:

| Display Name | Route Path | Component Name | Builder Component |
|-------------|------------|----------------|-------------------|
| Dashboard | `/` or `/dashboard` | Dashboard | Dashboard |
| Live Monitoring | `/monitoring` | LiveMonitoring | LiveMonitoring |
| War Room | `/war-room` | WarRoom | CommandCenter |
| Intelligence | `/intelligence` | Intelligence | IntelligenceHub |
| Alert Center | `/alerts` | AlertCenter | AlertCenter |
| Settings | `/settings` | Settings | SettingsPage |

### Footer Navigation (Legal/Support)
These pages should be created as Builder.io Page models:

| Display Name | Route Path | Builder Page Model |
|-------------|------------|-------------------|
| Privacy Policy | `/privacy` | privacy-policy |
| Terms of Service | `/terms` | terms-of-service |
| Cookie Policy | `/cookies` | cookie-policy |
| Contact | `/contact` | contact |

### Builder.io Configuration Steps:

1. **Update Navigation Component in Builder**:
   - Go to https://builder.io/content/8686f311497044c0932b7d2247296478
   - Find or create the Navigation component
   - Update menu items with exact names above
   - Set correct route paths

2. **Create Footer Pages**:
   - Create new Page models for each footer link
   - Use Builder's visual editor to design these pages
   - They will be static content pages

3. **Component Registration Updates Needed**:
   ```tsx
   // Rename components to match navigation
   - RealTimeMonitoring → LiveMonitoring
   - IntelligenceHub → Intelligence  
   - CommandCenter → WarRoom
   ```

4. **Route Updates in App.tsx**:
   ```tsx
   <Route path="/" element={<Dashboard />} />
   <Route path="/dashboard" element={<Dashboard />} />
   <Route path="/monitoring" element={<LiveMonitoring />} />
   <Route path="/war-room" element={<WarRoom />} />
   <Route path="/intelligence" element={<Intelligence />} />
   <Route path="/alerts" element={<AlertCenter />} />
   <Route path="/settings" element={<Settings />} />
   
   // Footer routes (Builder.io pages)
   <Route path="/privacy" element={<BuilderPage model="privacy-policy" />} />
   <Route path="/terms" element={<BuilderPage model="terms-of-service" />} />
   <Route path="/cookies" element={<BuilderPage model="cookie-policy" />} />
   <Route path="/contact" element={<BuilderPage model="contact" />} />
   ```

### Important Notes:
- **DO NOT** rename files yet - work through Builder.io first
- **DO NOT** update routes until Builder publishes changes
- **ALWAYS** test in Builder.io preview before publishing
- The navigation component should be a Symbol in Builder for reuse

### Builder.io API Key:
`8686f311497044c0932b7d2247296478`

### Builder.io Dashboard:
https://builder.io/content/8686f311497044c0932b7d2247296478