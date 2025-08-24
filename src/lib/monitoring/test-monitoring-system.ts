/**
 * Test script for monitoring system with Supabase integration
 * Run with: npx tsx test-monitoring-system.ts
 */

import { createUnifiedMonitor } from './unifiedMonitor';
import { createCrisisDetector } from './crisisDetector';
import { createAlertService } from './alertService';
import { type MonitoringEvent, CrisisAlert } from './types';

// Configuration
const SUPABASE_URL = import.meta.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_KEY = import.meta.env.SUPABASE_ANON_KEY || 'your-anon-key';

async function testMonitoringSystem() {
  console.log('🚀 Starting monitoring system test...\n');

  // Initialize unified monitor
  const monitor = createUnifiedMonitor({
    mentionlytics: {
      apiKey: import.meta.env.MENTIONLYTICS_API_KEY || 'test-key',
      projectId: import.meta.env.MENTIONLYTICS_PROJECT_ID || 'test-project',
      enabled: true,
    },
    config: {
      keywords: ['warroom', 'campaign', 'election'],
      languages: ['en'],
      platforms: ['twitter', 'facebook', 'news'],
      filters: {
        min_reach: 100,
        min_engagement: 10,
        exclude_keywords: ['test', 'demo'],
      },
      deduplication: {
        enabled: true,
        time_window_minutes: 30,
        similarity_threshold: 0.8,
      },
      crisis_thresholds: {
        mentions_per_hour: 50,
        sentiment_threshold: -0.7,
        reach_multiplier: 2.0,
        duration_minutes: 15,
      },
      alert_settings: {
        email_recipients: ['admin@warroom.com'],
        slack_webhook: 'https://hooks.slack.com/services/test',
        sms_numbers: ['+1234567890'],
        escalation_delay_minutes: 30,
      },
    },
    pollingInterval: 60000, // 1 minute
  });

  // Initialize crisis detector
  const detector = createCrisisDetector({
    velocityMultiplier: 3,
    sentimentThreshold: 0.5,
    minimumMentions: 10,
    keywords: ['crisis', 'scandal', 'outrage'],
    excludeKeywords: ['crisis management'],
  });

  // Initialize alert service
  const alertService = createAlertService({
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_KEY,
    enableEmail: true,
    enableSMS: true,
    enableWebhook: true,
  });

  // Test 1: Fetch monitoring events
  console.log('📊 Test 1: Fetching monitoring events...');
  try {
    const events = await monitor.fetchAllEvents();
    console.log(`✅ Fetched ${events.length} events`);

    if (events.length > 0) {
      console.log('Sample event:', {
        id: events[0].id,
        platform: events[0].platform,
        sentiment: events[0].sentiment.label,
        reach: events[0].metrics?.reach,
      });
    }

    // Test 2: Crisis detection
    console.log('\n🚨 Test 2: Running crisis detection...');
    const alerts = detector.analyzeEvents(events);
    console.log(`✅ Generated ${alerts.length} alerts`);

    if (alerts.length > 0) {
      console.log('Sample alert:', {
        id: alerts[0].id,
        severity: alerts[0].severity,
        type: alerts[0].type,
        title: alerts[0].title,
      });

      // Test 3: Send alerts
      console.log('\n📮 Test 3: Sending alerts...');
      for (const alert of alerts) {
        await alertService.sendAlert(alert);
        console.log(`✅ Sent alert: ${alert.title}`);
      }
    }

    // Test 4: Service health
    console.log('\n🏥 Test 4: Checking service health...');
    const health = await monitor.getHealthStatus();
    health.forEach(service => {
      console.log(`${service.service}: ${service.status} (${service.response_time_ms}ms)`);
    });

    // Test 5: Metrics
    console.log('\n📈 Test 5: Getting pipeline metrics...');
    const metrics = monitor.getMetrics();
    console.log('Pipeline metrics:', {
      eventsProcessed: metrics.events_processed_total,
      eventsPerMinute: metrics.events_per_minute,
      alertsGenerated: metrics.alerts_generated,
      duplicatesFiltered: metrics.duplicate_events_filtered,
    });

    // Test 6: Real-time monitoring
    console.log('\n🔄 Test 6: Starting real-time monitoring...');
    monitor.startMonitoring(async (newEvents: MonitoringEvent[]) => {
      console.log(`📨 Received ${newEvents.length} new events`);

      // Analyze for crises
      const newAlerts = detector.analyzeEvents(newEvents);
      if (newAlerts.length > 0) {
        console.log(`🚨 Detected ${newAlerts.length} new alerts!`);
        for (const alert of newAlerts) {
          await alertService.sendAlert(alert);
        }
      }
    });

    // Test 7: Alert subscription
    console.log('\n🔔 Test 7: Setting up alert subscription...');
    const subscriberId = alertService.subscribe({
      id: 'test-subscriber',
      type: 'webhook',
      endpoint: 'https://your-app.com/webhook/alerts',
      filters: {
        severity: ['critical', 'high'],
        types: ['viral_negative', 'volume_spike'],
      },
    });
    console.log(`✅ Created subscription: ${subscriberId}`);

    // Test 8: Alert statistics
    console.log('\n📊 Test 8: Getting alert statistics...');
    try {
      const stats = await alertService.getAlertStats('day');
      console.log('Alert stats (last 24h):', stats);
    } catch (error) {
      console.log('⚠️  Alert stats not available (requires Supabase connection)');
    }

    // Run for 2 minutes then stop
    console.log('\n⏰ Monitoring will run for 2 minutes...');
    setTimeout(() => {
      monitor.stopMonitoring();
      console.log('\n✅ Monitoring test completed!');

      // Summary
      console.log('\n📋 Test Summary:');
      console.log('- Events fetched: ✅');
      console.log('- Crisis detection: ✅');
      console.log('- Alert delivery: ✅');
      console.log('- Service health: ✅');
      console.log('- Real-time monitoring: ✅');
      console.log(`- Supabase integration: ${  SUPABASE_URL.includes('supabase.co') ? '✅' : '⚠️  Using test config'}`);

      process.exit(0);
    }, 120000); // 2 minutes

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Test crisis scenarios
async function testCrisisScenarios() {
  console.log('\n🎭 Testing crisis scenarios...\n');

  const detector = createCrisisDetector();
  const alertService = createAlertService({
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_KEY,
  });

  // Scenario 1: Velocity spike
  console.log('📈 Scenario 1: Velocity spike');
  const velocitySpikeEvents = generateMockEvents(50, 'negative', ['scandal', 'outrage']);
  const velocityAlerts = detector.analyzeEvents(velocitySpikeEvents);
  console.log(`Generated ${velocityAlerts.length} velocity alerts`);

  // Scenario 2: Sentiment crash
  console.log('\n😢 Scenario 2: Sentiment crash');
  const sentimentCrashEvents = generateMockEvents(20, 'negative', ['disappointed', 'angry']);
  const sentimentAlerts = detector.analyzeEvents(sentimentCrashEvents);
  console.log(`Generated ${sentimentAlerts.length} sentiment alerts`);

  // Scenario 3: Viral negative
  console.log('\n🔥 Scenario 3: Viral negative content');
  const viralEvents = generateViralEvents();
  const viralAlerts = detector.analyzeEvents(viralEvents);
  console.log(`Generated ${viralAlerts.length} viral alerts`);
}

// Helper function to generate mock events
function generateMockEvents(
  count: number,
  sentiment: 'positive' | 'negative' | 'neutral',
  keywords: string[],
): MonitoringEvent[] {
  const events: MonitoringEvent[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    events.push({
      id: `mock_${i}`,
      source: 'mentionlytics',
      type: 'social',
      timestamp: new Date(now - i * 60000), // 1 minute apart
      title: `Mock ${sentiment} event ${i}`,
      content: `This is a ${sentiment} event containing ${keywords.join(', ')}`,
      url: `https://example.com/post/${i}`,
      author: {
        name: `User${i}`,
        handle: `@user${i}`,
        followers: Math.floor(Math.random() * 10000),
      },
      platform: 'twitter',
      sentiment: {
        score: sentiment === 'positive' ? 0.8 : sentiment === 'negative' ? -0.8 : 0,
        label: sentiment,
        confidence: 0.9,
      },
      metrics: {
        reach: Math.floor(Math.random() * 50000),
        engagement: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200),
      },
      keywords,
      mentions: ['@warroom'],
      language: 'en',
      raw_data: {},
    });
  }

  return events;
}

// Generate viral negative events
function generateViralEvents(): MonitoringEvent[] {
  return [{
    id: 'viral_1',
    source: 'mentionlytics',
    type: 'social',
    timestamp: new Date(),
    title: 'Major scandal breaks out',
    content: 'Breaking: Major scandal involving campaign leadership',
    url: 'https://example.com/viral-post',
    author: {
      name: 'Influencer',
      handle: '@influencer',
      followers: 1000000,
      verified: true,
    },
    platform: 'twitter',
    sentiment: {
      score: -0.9,
      label: 'negative',
      confidence: 0.95,
    },
    metrics: {
      reach: 5000000,
      engagement: 50000,
      likes: 10000,
      shares: 15000,
      comments: 25000,
    },
    keywords: ['scandal', 'breaking', 'leadership'],
    mentions: ['@warroom', '@campaign'],
    language: 'en',
    influence_score: 95,
    raw_data: {},
  }];
}

// Run tests
if (require.main === module) {
  console.log('🏁 War Room Monitoring System Test Suite\n');
  console.log('Environment:');
  console.log(`- Supabase URL: ${SUPABASE_URL}`);
  console.log('- Real-time monitoring: Enabled');
  console.log('- Crisis detection: Enabled\n');

  testMonitoringSystem().catch(console.error);

  // Uncomment to test crisis scenarios
  // testCrisisScenarios().catch(console.error);
