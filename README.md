# War Room v1.0 - Campaign Management Platform

## 🚦 Project Status & CI/CD Pipeline

### 📊 Build & Tests
[![CI/CD Pipeline](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/ci-cd.yml)
[![Frontend CI](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/frontend-ci.yml)
[![Security Scan](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/security.yml/badge.svg)](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/security.yml)

### 🔄 Code Quality & Coverage
[![codecov](https://codecov.io/gh/Think-Big-Media/1.0-war-room/branch/main/graph/badge.svg)](https://codecov.io/gh/Think-Big-Media/1.0-war-room)
[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/Think-Big-Media/1.0-war-room)
[![Test Coverage](https://img.shields.io/codecov/c/github/Think-Big-Media/1.0-war-room?label=Test%20Coverage)](https://codecov.io/gh/Think-Big-Media/1.0-war-room)

### ⚡ Performance & Monitoring
[![Performance Testing](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/performance-testing.yml/badge.svg)](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/performance-testing.yml)
[![Keep Warm](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/keep-warm.yml/badge.svg)](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/keep-warm.yml)
[![Response Time](https://img.shields.io/badge/Response%20Time-<3s-brightgreen)](https://war-room-oa9t.onrender.com/health)

### 🚀 Deployment & Infrastructure
[![Live Production](https://img.shields.io/badge/Status-Live%20Production-brightgreen)](https://war-room-oa9t.onrender.com)
[![Deployment](https://img.shields.io/website?down_message=down&label=Deployment&up_message=up&url=https%3A%2F%2Fwar-room-oa9t.onrender.com%2Fhealth)](https://war-room-oa9t.onrender.com/health)
[![Render Deploy](https://img.shields.io/badge/Deploy-Render-blue)](https://dashboard.render.com/web/srv-d1ub5iumcj7s73ebrpo0)

### 🔒 Security & Compliance
[![Environment Sync](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/environment-sync.yml/badge.svg)](https://github.com/Think-Big-Media/1.0-war-room/actions/workflows/environment-sync.yml)
[![Security Hardened](https://img.shields.io/badge/Security-Hardened-brightgreen)](#security--compliance)
[![API Health](https://img.shields.io/badge/API-Healthy-brightgreen)](https://war-room-oa9t.onrender.com/health)

### 📈 Project Health
[![GitHub Issues](https://img.shields.io/github/issues/Think-Big-Media/1.0-war-room)](https://github.com/Think-Big-Media/1.0-war-room/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Think-Big-Media/1.0-war-room)](https://github.com/Think-Big-Media/1.0-war-room/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/Think-Big-Media/1.0-war-room)](https://github.com/Think-Big-Media/1.0-war-room/commits/main)
[![Contributors](https://img.shields.io/github/contributors/Think-Big-Media/1.0-war-room)](https://github.com/Think-Big-Media/1.0-war-room/graphs/contributors)

**War Room is a comprehensive campaign management platform designed for political campaigns, advocacy groups, and non-profit organizations with real-time analytics, crisis monitoring, and AI-powered intelligence.**

🚀 **Live Production**: https://war-room-oa9t.onrender.com

---

## 🏃‍♂️ Quick Start - LOCAL DEVELOPMENT FIRST!

### Start Everything with One Command:
```bash
./START_LOCAL.sh
```

**That's it!** You now have the full application running locally with hot reload.

- 🌐 **Frontend**: http://localhost:5173 (AppBrandBOS with purple/blue theme)
- ⚙️ **Backend**: http://localhost:10000  
- 📚 **API Docs**: http://localhost:10000/docs
- 🔍 **Browser Zoom**: 95% recommended (optimized UI scaling)

> **"You have to deploy every time we make changes? Jeez, that's annoying."** - Rod
> 
> We fixed that! Now all development happens locally with instant feedback. No more waiting for deployments!

📖 **[LOCAL DEVELOPMENT GUIDE](./LOCAL_DEVELOPMENT_GUIDE.md)** - Everything you need to know about local development

---

## 📋 Complete Project Information

### **📖 [MASTER PROJECT SUMMARY](./MASTER_PROJECT_SUMMARY.md)**
**The definitive guide** - Contains everything you need to know about War Room including:
- Project vision, objectives, and current status
- Complete technical architecture and stack details
- Deployment guide for Render.com
- Development setup and best practices
- Key protocols and security measures

### **📚 Additional Resources**

- **[APP_ARCHITECTURE.md](./APP_ARCHITECTURE.md)** - 🆕 Frontend architecture guide (which app to use)
- **[INCIDENT_LOG.md](./INCIDENT_LOG.md)** - 🆕 Development incident tracking
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed technical specifications
- **[DEPLOYMENT_BEST_PRACTICES.md](./DEPLOYMENT_BEST_PRACTICES.md)** - Render.com deployment guide  
- **[GOOGLE_ADS_INTEGRATION.md](./GOOGLE_ADS_INTEGRATION.md)** - Google Ads OAuth2 integration guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[CLAUDE.md](./CLAUDE.md)** - Claude Code development instructions
- **[archive/](./archive/)** - Historical documentation and reports

---

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/Think-Big-Media/1.0-war-room.git
cd 1.0-war-room

# Frontend development
cd src/frontend
npm install && npm run dev
# Opens http://localhost:5173
```

**For complete setup instructions, see [MASTER_PROJECT_SUMMARY.md](./MASTER_PROJECT_SUMMARY.md#development-quick-start)**

---

## 🔧 Key Information

- **Tech Stack**: React + TypeScript + FastAPI + PostgreSQL + Supabase
- **Production URL**: https://war-room-oa9t.onrender.com
- **Status**: Live production with 99.9% uptime
- **Security**: Enterprise-grade with 0 vulnerabilities (npm audit clean)
- **Performance**: Sub-second response times (0.2s avg), keep-warm solution active
- **CI/CD**: 539 TypeScript issues remaining, continuous testing pipeline active

## 📊 Current CI/CD Status

### Security & Vulnerabilities
- ✅ **NPM Vulnerabilities**: 0 (fully resolved)
- ✅ **Security Audit**: Complete with enterprise-grade hardening
- ✅ **Dependencies**: All packages updated and secure

### Performance Metrics
- ✅ **Response Time**: 0.2s average (warm service)
- ✅ **Uptime**: 99.9% with keep-warm solution
- ✅ **Load Handling**: 15+ requests/second
- ✅ **Cold Start Prevention**: GitHub Actions every 10 minutes

### Testing & Quality
- 🔄 **TypeScript Issues**: 539 remaining (improvement ongoing)
- ✅ **Test Coverage**: Active test suite with continuous monitoring
- ✅ **Build Process**: Stable deployment pipeline
- ✅ **Error Tracking**: Sentry integration with real-time monitoring

**For detailed technical information, see [MASTER_PROJECT_SUMMARY.md](./MASTER_PROJECT_SUMMARY.md#technical-architecture--stack)**

## 🔌 Integrations

### Meta Business Suite OAuth2 Integration

War Room includes comprehensive Meta Business Suite integration for Facebook and Instagram advertising:

- **🔐 Secure OAuth2 Authentication** - Complete OAuth2 flow with encrypted token storage
- **📊 Campaign Management** - Create, monitor, and analyze Meta advertising campaigns
- **🎯 Ad Account Integration** - Multi-account access and management
- **📈 Real-time Analytics** - Live campaign performance metrics and insights
- **🔄 Automatic Token Refresh** - Seamless token management and renewal
- **🛡️ Security Features** - Rate limiting, circuit breakers, and comprehensive error handling

**📖 [Complete Meta Integration Guide](./META_INTEGRATION.md)**

#### Quick Setup
```bash
# 1. Configure environment variables
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_OAUTH_SCOPES=ads_management,ads_read,business_management

# 2. Run database migrations
alembic upgrade head

# 3. Test the integration
pytest tests/test_meta* -v
```

For complete setup instructions, Meta App configuration, API endpoints, and troubleshooting, see the [Meta Integration Documentation](./META_INTEGRATION.md).

### Google Ads OAuth2 Integration

War Room includes comprehensive Google Ads integration for campaign management and analytics:

- **🔐 Secure OAuth2 Authentication** - Complete OAuth2 flow with encrypted token storage
- **📊 Campaign Analytics** - Real-time campaign performance metrics and insights
- **🎯 Account Management** - Multi-account access and customer management
- **🔄 Automatic Token Refresh** - Seamless token management and renewal
- **⚡ Rate Limiting & Circuit Breakers** - Production-ready API protection

**📖 [Complete Google Ads Integration Guide](./GOOGLE_ADS_INTEGRATION.md)**

#### Quick Setup
```bash
# 1. Configure environment variables
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token

# 2. Run database migrations
alembic upgrade head

# 3. Test the integration
pytest tests/test_google_ads* -v
```

For complete setup instructions, authentication flow, API endpoints, and troubleshooting, see the [Google Ads Integration Documentation](./GOOGLE_ADS_INTEGRATION.md).

---

*For all project details, deployment guides, and development information, please refer to **[MASTER_PROJECT_SUMMARY.md](./MASTER_PROJECT_SUMMARY.md)***