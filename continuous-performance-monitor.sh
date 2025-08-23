#!/bin/bash

# War Room Continuous Performance Monitor
# Monitors performance metrics and alerts on issues
# Usage: ./continuous-performance-monitor.sh [duration_minutes]

set -e

DURATION_MINUTES=${1:-60}  # Default: monitor for 1 hour
BASE_URL="https://war-room-oa9t.onrender.com"
INTERVAL=300  # Check every 5 minutes
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="continuous-monitor-${TIMESTAMP}.log"

# Performance thresholds
RESPONSE_TIME_THRESHOLD=3.0  # seconds
SUCCESS_RATE_THRESHOLD=95    # percentage
COLD_START_THRESHOLD=10.0    # seconds

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 War Room Continuous Performance Monitor${NC}" | tee $LOG_FILE
echo "Duration: ${DURATION_MINUTES} minutes" | tee -a $LOG_FILE
echo "Check Interval: ${INTERVAL} seconds" | tee -a $LOG_FILE
echo "Started: $(date)" | tee -a $LOG_FILE
echo "=========================" | tee -a $LOG_FILE

# Calculate end time
END_TIME=$(($(date +%s) + ($DURATION_MINUTES * 60)))
CHECK_COUNT=0
ALERTS_GENERATED=0

# Function to check endpoint
check_endpoint() {
    local endpoint=$1
    local url="${BASE_URL}${endpoint}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}" "$url" 2>/dev/null || echo "000|0")
    IFS='|' read -r http_code time_total <<< "$response"
    
    echo "$http_code|$time_total"
}

# Function to generate alert
alert() {
    local severity=$1
    local message=$2
    ALERTS_GENERATED=$((ALERTS_GENERATED + 1))
    
    case $severity in
        "WARNING")
            echo -e "${YELLOW}⚠️  WARNING: $message${NC}" | tee -a $LOG_FILE
            ;;
        "CRITICAL")
            echo -e "${RED}🚨 CRITICAL: $message${NC}" | tee -a $LOG_FILE
            ;;
    esac
    
    # Log to system log if available
    if command -v logger >/dev/null 2>&1; then
        logger "War Room Monitor [$severity]: $message"
    fi
}

# Main monitoring loop
while [ $(date +%s) -lt $END_TIME ]; do
    CHECK_COUNT=$((CHECK_COUNT + 1))
    CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo -e "\n${BLUE}Check #$CHECK_COUNT - $CURRENT_TIME${NC}" | tee -a $LOG_FILE
    
    # Check health endpoint
    health_result=$(check_endpoint "/health")
    IFS='|' read -r health_code health_time <<< "$health_result"
    
    # Check settings endpoint  
    settings_result=$(check_endpoint "/settings")
    IFS='|' read -r settings_code settings_time <<< "$settings_result"
    
    # Check root endpoint
    root_result=$(check_endpoint "/")
    IFS='|' read -r root_code root_time <<< "$root_result"
    
    # Report status
    echo "  Health: HTTP $health_code - ${health_time}s" | tee -a $LOG_FILE
    echo "  Settings: HTTP $settings_code - ${settings_time}s" | tee -a $LOG_FILE
    echo "  Root: HTTP $root_code - ${root_time}s" | tee -a $LOG_FILE
    
    # Check for issues
    declare -a failed_endpoints=()
    declare -a slow_endpoints=()
    declare -a cold_start_endpoints=()
    
    # Health endpoint checks
    if [[ ! "$health_code" =~ ^[2-3][0-9][0-9]$ ]]; then
        failed_endpoints+=("health (HTTP $health_code)")
    elif (( $(echo "$health_time > $RESPONSE_TIME_THRESHOLD" | bc -l) )); then
        slow_endpoints+=("health (${health_time}s)")
    fi
    
    if (( $(echo "$health_time > $COLD_START_THRESHOLD" | bc -l) )); then
        cold_start_endpoints+=("health (${health_time}s)")
    fi
    
    # Settings endpoint checks
    if [[ ! "$settings_code" =~ ^[2-3][0-9][0-9]$ ]]; then
        failed_endpoints+=("settings (HTTP $settings_code)")
    elif (( $(echo "$settings_time > $RESPONSE_TIME_THRESHOLD" | bc -l) )); then
        slow_endpoints+=("settings (${settings_time}s)")
    fi
    
    if (( $(echo "$settings_time > $COLD_START_THRESHOLD" | bc -l) )); then
        cold_start_endpoints+=("settings (${settings_time}s)")
    fi
    
    # Root endpoint checks
    if [[ ! "$root_code" =~ ^[2-3][0-9][0-9]$ ]]; then
        failed_endpoints+=("root (HTTP $root_code)")
    elif (( $(echo "$root_time > $RESPONSE_TIME_THRESHOLD" | bc -l) )); then
        slow_endpoints+=("root (${root_time}s)")
    fi
    
    if (( $(echo "$root_time > $COLD_START_THRESHOLD" | bc -l) )); then
        cold_start_endpoints+=("root (${root_time}s)")
    fi
    
    # Generate alerts
    if [ ${#failed_endpoints[@]} -gt 0 ]; then
        alert "CRITICAL" "Endpoint failures detected: ${failed_endpoints[*]}"
    fi
    
    if [ ${#cold_start_endpoints[@]} -gt 0 ]; then
        alert "WARNING" "Cold start detected (>10s): ${cold_start_endpoints[*]}"
    fi
    
    if [ ${#slow_endpoints[@]} -gt 0 ]; then
        alert "WARNING" "Slow response times (>3s): ${slow_endpoints[*]}"
    fi
    
    # Status summary
    if [ ${#failed_endpoints[@]} -eq 0 ] && [ ${#slow_endpoints[@]} -eq 0 ] && [ ${#cold_start_endpoints[@]} -eq 0 ]; then
        echo -e "  ${GREEN}✅ All endpoints healthy${NC}" | tee -a $LOG_FILE
    fi
    
    # Sleep until next check
    if [ $(date +%s) -lt $END_TIME ]; then
        sleep $INTERVAL
    fi
done

# Final report
echo -e "\n${BLUE}📊 Monitoring Complete${NC}" | tee -a $LOG_FILE
echo "Completed: $(date)" | tee -a $LOG_FILE
echo "Total Checks: $CHECK_COUNT" | tee -a $LOG_FILE
echo "Alerts Generated: $ALERTS_GENERATED" | tee -a $LOG_FILE

if [ $ALERTS_GENERATED -eq 0 ]; then
    echo -e "${GREEN}🎉 No issues detected during monitoring period${NC}" | tee -a $LOG_FILE
else
    echo -e "${YELLOW}⚠️  $ALERTS_GENERATED alerts generated - review log for details${NC}" | tee -a $LOG_FILE
fi

echo "Log file: $LOG_FILE" | tee -a $LOG_FILE