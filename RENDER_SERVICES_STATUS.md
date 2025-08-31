# 📋 WAR ROOM INFRASTRUCTURE STATUS
**Last Updated**: August 31, 2025

---

## ⚠️ MIGRATION NOTICE: RENDER.COM → ENCORE.DEV

**All Render.com services are now DEPRECATED**

## ✅ CURRENT ACTIVE INFRASTRUCTURE
**Backend**: `war-room-3-backend`  
**URL**: https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev  
**Status**: ✅ ACTIVE - This is your PRODUCTION backend  
**Platform**: Encore.dev  
**Purpose**: TypeScript microservices with proper API structure  

### Why Encore.dev:
- TypeScript microservices architecture
- Proper API endpoint structure
- Built-in observability and monitoring
- Scalable cloud-native platform
- Better development experience

---

## ❌ DEPRECATED RENDER.COM SERVICES
**Service Name**: `war-room-2025`  
**URL**: https://war-room-2025.onrender.com  
**Status**: ❌ DEPRECATED - DO NOT USE  
**Service Name**: `war-room-oa9t`  
**URL**: https://war-room-oa9t.onrender.com  
**Status**: ❌ DEPRECATED - DO NOT USE  
**Migration Status**: ✅ Fully migrated to Encore.dev

---

## 🚨 IMPORTANT REMINDERS

1. **ALWAYS use Encore.dev backend** for all API calls
2. **Frontend development** uses localhost:5173 with proxy to Encore.dev
3. **NO MORE RENDER.COM** - all services migrated

---

## 📅 MIGRATION COMPLETED

- [x] **Aug 31**: Migrate backend to Encore.dev
- [x] **Aug 31**: Update all API references
- [x] **Aug 31**: Update documentation
- [ ] **Sept 15**: Remove all Render.com service accounts

---

## 🔧 CURRENT DEVELOPMENT WORKFLOW

**Frontend Development**:
1. Run `npm run dev` (localhost:5173)
2. Frontend proxies API calls to Encore.dev backend
3. All data flows through war-room-3-backend-d2msjrk82vjjq794glog.lp.dev

**Backend Development**:
1. Use Encore.dev CLI: `encore run`
2. Deploy with: `git push` (auto-deploys to Encore.dev)

---

## 📝 CURRENT API ENDPOINTS

Use these for all API calls:

```bash
# Check backend health
curl -s https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/analytics/summary

# Frontend development
npm run dev  # Starts localhost:5173 with API proxy

# Backend deployment (handled by Encore.dev)
git push origin main  # Auto-deploys backend

# Check all endpoints
curl -s https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/monitoring/mentions
```

---

**Remember**: All API calls go to → `war-room-3-backend-d2msjrk82vjjq794glog.lp.dev`