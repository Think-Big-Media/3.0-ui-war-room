# Backend Naming Update Guide for Leap.new

## Purpose
This document outlines the naming changes made to the frontend and the corresponding updates needed in the backend API to maintain consistency.

## Summary of Changes
We've standardized on punchy, memorable names instead of corporate/bureaucratic ones.

## Navigation & Routes

### Primary Pages
| Old Name | New Name | Frontend Route | Backend API Prefix |
|----------|----------|----------------|-------------------|
| Command Center | Dashboard | `/dashboard` | `/api/v1/dashboard` |
| Real-Time Monitoring | Live Monitoring | `/live-monitoring` | `/api/v1/monitoring` |
| Campaign Control | War Room | `/war-room` | `/api/v1/campaigns` |
| Intelligence Hub | Intelligence | `/intelligence` | `/api/v1/intelligence` |
| Alert Center | Alert Center | `/alert-center` | `/api/v1/alerts` |
| Settings | Settings | `/settings` | `/api/v1/settings` |

## Backend API Endpoints to Update

### Dashboard (formerly Command Center)
```
OLD: /api/v1/analytics/summary
NEW: /api/v1/dashboard/summary

OLD: /api/v1/analytics/sentiment  
NEW: /api/v1/dashboard/sentiment
```

### Live Monitoring (formerly Real-Time Monitoring)
```
# These stay the same - already using 'monitoring'
/api/v1/monitoring/mentions
/api/v1/monitoring/sentiment
/api/v1/monitoring/trends
```

### War Room (formerly Campaign Control)
```
# Consider renaming from 'campaigns' to 'war-room' for consistency
OLD: /api/v1/campaigns/meta
NEW: /api/v1/war-room/meta

OLD: /api/v1/campaigns/google
NEW: /api/v1/war-room/google

OLD: /api/v1/campaigns/insights
NEW: /api/v1/war-room/insights
```

### Intelligence (formerly Intelligence Hub)
```
# These can stay as-is, already using 'intelligence'
/api/v1/intelligence/chat/message
/api/v1/intelligence/documents/analyze
/api/v1/intelligence/reports
```

### Alert Center
```
# These stay the same - already using 'alerts'
/api/v1/alerts/crisis
/api/v1/alerts/queue
/api/v1/alerts/send
```

## WebSocket Events to Update

### Dashboard Events
```
OLD: command_center_update
NEW: dashboard_update

OLD: analytics_refresh
NEW: dashboard_refresh
```

### Live Monitoring Events
```
OLD: real_time_monitoring_update
NEW: live_monitoring_update

OLD: monitoring_alert
NEW: live_alert
```

### War Room Events  
```
OLD: campaign_update
NEW: war_room_update

OLD: campaign_control_refresh
NEW: war_room_refresh
```

## Database Schema Updates

### Table Names (if applicable)
- `command_center_metrics` → `dashboard_metrics`
- `real_time_monitoring_data` → `live_monitoring_data`
- `campaign_control_settings` → `war_room_settings`

### Column Names
- Any columns with `command_center_` prefix → `dashboard_`
- Any columns with `real_time_` prefix → `live_`
- Any columns with `campaign_control_` prefix → `war_room_`

## Response Object Keys

Update any API response objects that use the old naming:

```python
# OLD
return {
    "command_center": {...},
    "real_time_monitoring": {...},
    "campaign_control": {...}
}

# NEW  
return {
    "dashboard": {...},
    "live_monitoring": {...},
    "war_room": {...}
}
```

## Environment Variables

Update any environment variables using old naming:
```
OLD: COMMAND_CENTER_API_KEY
NEW: DASHBOARD_API_KEY

OLD: REAL_TIME_MONITORING_ENABLED
NEW: LIVE_MONITORING_ENABLED

OLD: CAMPAIGN_CONTROL_WEBHOOK
NEW: WAR_ROOM_WEBHOOK
```

## Error Messages & Logging

Update error messages and log entries:
```python
# OLD
logger.error("Command Center failed to load")
# NEW
logger.error("Dashboard failed to load")

# OLD
raise ValueError("Real-Time Monitoring data invalid")
# NEW
raise ValueError("Live Monitoring data invalid")
```

## Migration Strategy

1. **Phase 1**: Add new endpoints alongside old ones (dual support)
2. **Phase 2**: Update frontend to use new endpoints
3. **Phase 3**: Deprecate old endpoints with warnings
4. **Phase 4**: Remove old endpoints after migration period

## Testing Checklist

- [ ] All new endpoint paths return correct data
- [ ] WebSocket events fire with new names
- [ ] Database queries use updated table/column names
- [ ] Error messages reflect new naming
- [ ] API documentation updated with new names
- [ ] Postman/Insomnia collections updated
- [ ] Integration tests pass with new endpoints

## Notes for Leap.new Implementation

When implementing these changes in Leap.new:

1. Use the "Find and Replace" feature to update naming across the codebase
2. Update OpenAPI/Swagger documentation
3. Ensure backward compatibility during transition
4. Update any hardcoded strings in the backend
5. Review and update API rate limiting rules
6. Update CORS configuration if paths change

## Component Renaming

- `SidebarNavigation` → `TopNavigation` (it's actually a top nav bar, not a sidebar)

---

*Last Updated: August 31, 2025*
*Generated from frontend naming standardization effort*