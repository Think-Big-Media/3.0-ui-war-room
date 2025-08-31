// Alert Engine - <60s Crisis Detection & Alert Processing

import { EventEmitter } from 'events';
import {
  type MonitoringEvent,
  type CrisisAlert,
  type MonitoringConfig,
  type AlertRule,
  SentimentWeights,
} from './types';
import { type EventStore } from './eventStore';
import { createHash } from 'crypto';

interface AlertWindow {
  events: MonitoringEvent[];
  start_time: Date;
  end_time: Date;
}

interface ProcessingMetrics {
  events_analyzed: number;
  alerts_generated: number;
  processing_time_ms: number;
  average_latency_ms: number;
  last_processed: Date;
}

export class AlertEngine extends EventEmitter {
  private config: MonitoringConfig;
  private eventStore: EventStore;
  private processingMetrics: ProcessingMetrics;
  private activeRules: AlertRule[] = [];
  private alertCooldowns = new Map<string, Date>();
  private isRunning = false;
  private processingQueue: MonitoringEvent[] = [];
  private processingInProgress = false;

  // Crisis detection thresholds
  private readonly CRISIS_THRESHOLDS = {
    MENTIONS_PER_HOUR: 100,
    SENTIMENT_THRESHOLD: 0.6, // Below -0.6 is concerning
    VOLUME_SPIKE_MULTIPLIER: 3.0, // 3x normal volume
    REACH_AMPLIFICATION: 5.0, // 5x normal reach
    PROCESSING_TARGET_MS: 60000, // <60s processing target
  };

  constructor(config: MonitoringConfig, eventStore: EventStore) {
    super();
    this.config = config;
    this.eventStore = eventStore;

    this.processingMetrics = {
      events_analyzed: 0,
      alerts_generated: 0,
      processing_time_ms: 0,
      average_latency_ms: 0,
      last_processed: new Date(),
    };

    this.initializeAlertRules();
    this.startProcessingLoop();
  }

  private initializeAlertRules(): void {
    this.activeRules = [
      {
        id: 'volume_spike',
        name: 'Volume Spike Detection',
        condition: this.checkVolumeSpike.bind(this),
        severity: 'high',
        type: 'volume_spike',
        cooldown_minutes: 30,
        enabled: true,
      },
      {
        id: 'sentiment_crisis',
        name: 'Sentiment Crisis Detection',
        condition: this.checkSentimentCrisis.bind(this),
        severity: 'critical',
        type: 'sentiment_drop',
        cooldown_minutes: 15,
        enabled: true,
      },
      {
        id: 'viral_negative',
        name: 'Viral Negative Content',
        condition: this.checkViralNegative.bind(this),
        severity: 'critical',
        type: 'viral_negative',
        cooldown_minutes: 10,
        enabled: true,
      },
      {
        id: 'negative_trend',
        name: 'Negative Trend Detection',
        condition: this.checkNegativeTrend.bind(this),
        severity: 'medium',
        type: 'negative_trend',
        cooldown_minutes: 60,
        enabled: true,
      },
    ];
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    console.log('🚨 Starting Alert Engine...');
    this.isRunning = true;

    // Load historical baseline data
    await this.loadHistoricalBaseline();

    console.log('✅ Alert Engine started');
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('🛑 Alert Engine stopped');
  }

  private startProcessingLoop(): void {
    // Process events from queue every second for <60s target
    setInterval(async () => {
      if (this.processingQueue.length > 0 && !this.processingInProgress) {
        await this.processQueuedEvents();
      }
    }, 1000);
  }

  async analyzeEvents(events: MonitoringEvent[]): Promise<void> {
    if (!this.isRunning || events.length === 0) {
      return;
    }

    // Add events to processing queue for immediate processing
    this.processingQueue.push(...events);

    // If queue is getting large, process immediately
    if (this.processingQueue.length > 50 && !this.processingInProgress) {
      await this.processQueuedEvents();
    }
  }

  private async processQueuedEvents(): Promise<void> {
    if (this.processingInProgress) {
      return;
    }

    this.processingInProgress = true;
    const startTime = Date.now();

    try {
      const eventsToProcess = [...this.processingQueue];
      this.processingQueue = [];

      if (eventsToProcess.length === 0) {
        return;
      }

      console.log(`🔍 Processing ${eventsToProcess.length} events for alerts...`);

      // Group events by time windows for analysis
      const windows = this.createAnalysisWindows(eventsToProcess);

      // Check each rule against each window
      for (const rule of this.activeRules.filter((r) => r.enabled)) {
        for (const window of windows) {
          try {
            const shouldAlert = rule.condition(window.events, 3600000); // 1 hour window

            if (shouldAlert && this.checkCooldown(rule.id)) {
              const alert = await this.createAlert(
                rule,
                window.events,
                window.start_time,
                window.end_time
              );

              this.emit('alert', alert);
              this.processingMetrics.alerts_generated++;
              this.setCooldown(rule.id, rule.cooldown_minutes);

              console.log(`🚨 ALERT: ${alert.severity.toUpperCase()} - ${alert.title}`);
            }
          } catch (error) {
            console.error(`Error processing rule ${rule.id}:`, error);
          }
        }
      }

      // Update metrics
      const processingTime = Date.now() - startTime;
      this.processingMetrics.events_analyzed += eventsToProcess.length;
      this.processingMetrics.processing_time_ms = processingTime;
      this.processingMetrics.average_latency_ms =
        (this.processingMetrics.average_latency_ms + processingTime) / 2;
      this.processingMetrics.last_processed = new Date();

      // Check if we're meeting the <60s target
      if (processingTime > this.CRISIS_THRESHOLDS.PROCESSING_TARGET_MS) {
        console.warn(
          `⚠️ Alert processing took ${processingTime}ms (target: <${this.CRISIS_THRESHOLDS.PROCESSING_TARGET_MS}ms)`
        );
      }
    } finally {
      this.processingInProgress = false;
    }
  }

  private createAnalysisWindows(events: MonitoringEvent[]): AlertWindow[] {
    // Sort events by timestamp
    const sortedEvents = events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (sortedEvents.length === 0) {
      return [];
    }

    // Create sliding windows of 1 hour each, overlapping by 30 minutes
    const windows: AlertWindow[] = [];
    const windowSize = 3600000; // 1 hour in ms
    const stepSize = 1800000; // 30 minutes in ms

    const startTime = sortedEvents[0].timestamp.getTime();
    const endTime = sortedEvents[sortedEvents.length - 1].timestamp.getTime();

    for (let windowStart = startTime; windowStart <= endTime; windowStart += stepSize) {
      const windowEnd = windowStart + windowSize;

      const windowEvents = sortedEvents.filter((event) => {
        const eventTime = event.timestamp.getTime();
        return eventTime >= windowStart && eventTime < windowEnd;
      });

      if (windowEvents.length > 0) {
        windows.push({
          events: windowEvents,
          start_time: new Date(windowStart),
          end_time: new Date(windowEnd),
        });
      }
    }

    return windows;
  }

  // Alert Rule Conditions
  private checkVolumeSpike(events: MonitoringEvent[], timeWindow: number): boolean {
    const currentVolume = events.length;
    const threshold = this.config.crisis_thresholds.mentions_per_hour;

    // Check if current volume exceeds threshold
    if (currentVolume < threshold) {
      return false;
    }

    // Additional check: compare to historical baseline
    // TODO: Implement historical comparison

    return currentVolume >= threshold;
  }

  private checkSentimentCrisis(events: MonitoringEvent[], timeWindow: number): boolean {
    if (events.length < 10) {
      return false;
    } // Need minimum volume

    // Calculate sentiment from available sources
    const sentimentWeights = { mentionlytics: 1.0 };
    let totalWeightedSentiment = 0;
    let totalWeight = 0;

    for (const event of events) {
      const weight = sentimentWeights[event.source];
      totalWeightedSentiment += event.sentiment.score * weight * event.sentiment.confidence;
      totalWeight += weight * event.sentiment.confidence;
    }

    const averageSentiment = totalWeight > 0 ? totalWeightedSentiment / totalWeight : 0;

    // Crisis if average sentiment is below threshold AND we have volume
    return (
      averageSentiment < -this.config.crisis_thresholds.sentiment_threshold &&
      events.length >= this.config.crisis_thresholds.mentions_per_hour
    );
  }

  private checkViralNegative(events: MonitoringEvent[], timeWindow: number): boolean {
    // Look for high-reach negative content
    const viralThreshold = 10000; // 10k+ reach
    const sentimentThreshold = -0.5; // Strongly negative

    const viralNegativeEvents = events.filter(
      (event) =>
        event.sentiment.score < sentimentThreshold && (event.metrics.reach || 0) > viralThreshold
    );

    return viralNegativeEvents.length > 0;
  }

  private checkNegativeTrend(events: MonitoringEvent[], timeWindow: number): boolean {
    if (events.length < 5) {
      return false;
    }

    // Sort events by time and check if sentiment is trending downward
    const sortedEvents = events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Split into two halves and compare average sentiment
    const midPoint = Math.floor(sortedEvents.length / 2);
    const firstHalf = sortedEvents.slice(0, midPoint);
    const secondHalf = sortedEvents.slice(midPoint);

    const firstHalfSentiment =
      firstHalf.reduce((sum, event) => sum + event.sentiment.score, 0) / firstHalf.length;
    const secondHalfSentiment =
      secondHalf.reduce((sum, event) => sum + event.sentiment.score, 0) / secondHalf.length;

    // Negative trend if recent sentiment is significantly worse
    const sentimentDrop = firstHalfSentiment - secondHalfSentiment;
    return sentimentDrop > 0.3; // 0.3 point drop indicates negative trend
  }

  private async createAlert(
    rule: AlertRule,
    triggerEvents: MonitoringEvent[],
    startTime: Date,
    endTime: Date
  ): Promise<CrisisAlert> {
    const alertId = this.generateAlertId(rule, triggerEvents, startTime);

    // Calculate alert metrics
    const totalReach = triggerEvents.reduce((sum, event) => sum + (event.metrics.reach || 0), 0);
    const averageSentiment =
      triggerEvents.reduce((sum, event) => sum + event.sentiment.score, 0) / triggerEvents.length;
    const platforms = [...new Set(triggerEvents.map((event) => event.platform))];
    const keywords = [...new Set(triggerEvents.flatMap((event) => event.keywords))];

    // Get top negative posts for context
    const topNegativePosts = triggerEvents
      .filter((event) => event.sentiment.score < -0.3)
      .sort((a, b) => a.sentiment.score - b.sentiment.score)
      .slice(0, 5)
      .map((event) => event.id);

    // Calculate peak mentions per hour
    const peakMentionsHour = this.calculatePeakMentionsPerHour(triggerEvents);

    return {
      id: alertId,
      severity: rule.severity,
      type: rule.type,
      title: this.generateAlertTitle(rule, triggerEvents.length, averageSentiment),
      description: this.generateAlertDescription(rule, triggerEvents, averageSentiment, totalReach),
      trigger_event_ids: triggerEvents.map((event) => event.id),
      trigger_conditions: {
        mentions_per_hour: triggerEvents.length,
        sentiment_threshold: averageSentiment,
        reach_threshold: totalReach,
        duration_minutes: (endTime.getTime() - startTime.getTime()) / 60000,
      },
      created_at: new Date(),
      updated_at: new Date(),
      status: 'active',
      escalated: rule.severity === 'critical',
      affected_keywords: keywords,
      affected_platforms: platforms,
      estimated_reach: totalReach,
      metadata: {
        peak_mentions_hour: peakMentionsHour,
        lowest_sentiment: Math.min(...triggerEvents.map((e) => e.sentiment.score)),
        top_negative_posts: topNegativePosts,
        geographic_spread: this.calculateGeographicSpread(triggerEvents),
      },
    };
  }

  private generateAlertId(rule: AlertRule, events: MonitoringEvent[], startTime: Date): string {
    const content = `${rule.id}_${events.length}_${startTime.toISOString()}`;
    return createHash('md5').update(content).digest('hex').substring(0, 12);
  }

  private generateAlertTitle(rule: AlertRule, eventCount: number, avgSentiment: number): string {
    switch (rule.type) {
      case 'volume_spike':
        return `Volume Spike Alert: ${eventCount} mentions detected`;
      case 'sentiment_drop':
        return `Sentiment Crisis: ${(avgSentiment * 100).toFixed(1)}% negative sentiment`;
      case 'viral_negative':
        return 'Viral Negative Content Alert';
      case 'negative_trend':
        return 'Negative Sentiment Trend Detected';
      default:
        return `${rule.name}: ${eventCount} events`;
    }
  }

  private generateAlertDescription(
    rule: AlertRule,
    events: MonitoringEvent[],
    avgSentiment: number,
    totalReach: number
  ): string {
    const eventCount = events.length;
    const platforms = [...new Set(events.map((e) => e.platform))].join(', ');
    const timeSpan = this.calculateTimeSpan(events);

    let description = `Detected ${eventCount} mentions over ${timeSpan} across ${platforms}. `;

    if (avgSentiment < -0.3) {
      description += `Average sentiment: ${(avgSentiment * 100).toFixed(1)}%. `;
    }

    if (totalReach > 10000) {
      description += `Estimated reach: ${totalReach.toLocaleString()}. `;
    }

    switch (rule.type) {
      case 'volume_spike':
        description +=
          'This represents a significant increase in mention volume that requires attention.';
        break;
      case 'sentiment_drop':
        description += 'Negative sentiment levels have reached crisis thresholds.';
        break;
      case 'viral_negative':
        description += 'High-reach negative content is spreading rapidly.';
        break;
      case 'negative_trend':
        description += 'Sentiment has been declining consistently over the monitoring period.';
        break;
    }

    return description;
  }

  private calculatePeakMentionsPerHour(events: MonitoringEvent[]): number {
    // Group events by hour and find the peak
    const hourlyBuckets = new Map<string, number>();

    for (const event of events) {
      const hourKey = event.timestamp.toISOString().substring(0, 13); // YYYY-MM-DDTHH
      hourlyBuckets.set(hourKey, (hourlyBuckets.get(hourKey) || 0) + 1);
    }

    return Math.max(...Array.from(hourlyBuckets.values()));
  }

  private calculateGeographicSpread(events: MonitoringEvent[]): string[] {
    const countries = new Set<string>();

    for (const event of events) {
      if (event.location?.country) {
        countries.add(event.location.country);
      }
    }

    return Array.from(countries);
  }

  private calculateTimeSpan(events: MonitoringEvent[]): string {
    if (events.length === 0) {
      return '0 minutes';
    }

    const times = events.map((e) => e.timestamp.getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    const diffMs = maxTime - minTime;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      return `${Math.ceil(diffMs / (1000 * 60))} minutes`;
    }
    return `${diffHours.toFixed(1)} hours`;
  }

  // Cooldown management
  private checkCooldown(ruleId: string): boolean {
    const cooldownEnd = this.alertCooldowns.get(ruleId);
    if (!cooldownEnd) {
      return true;
    }

    return new Date() > cooldownEnd;
  }

  private setCooldown(ruleId: string, cooldownMinutes: number): void {
    const cooldownEnd = new Date(Date.now() + cooldownMinutes * 60 * 1000);
    this.alertCooldowns.set(ruleId, cooldownEnd);
  }

  // Historical baseline loading
  private async loadHistoricalBaseline(): Promise<void> {
    try {
      // Load last 7 days of data to establish baseline
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const historicalEvents = await this.eventStore.getEventsSince(sevenDaysAgo);

      // Calculate baseline metrics
      const baselineMetrics = this.calculateBaselineMetrics(historicalEvents);

      // Update thresholds based on baseline
      this.updateDynamicThresholds(baselineMetrics);

      console.log(`📊 Loaded baseline from ${historicalEvents.length} historical events`);
    } catch (error) {
      console.warn('Could not load historical baseline:', error);
      // Continue with default thresholds
    }
  }

  private calculateBaselineMetrics(events: MonitoringEvent[]): any {
    if (events.length === 0) {
      return null;
    }

    // Group by day and calculate averages
    const dailyStats = new Map<string, MonitoringEvent[]>();

    for (const event of events) {
      const dayKey = event.timestamp.toISOString().substring(0, 10); // YYYY-MM-DD
      if (!dailyStats.has(dayKey)) {
        dailyStats.set(dayKey, []);
      }
      dailyStats.get(dayKey)!.push(event);
    }

    const dailyVolumes = Array.from(dailyStats.values()).map((dayEvents) => dayEvents.length);
    const dailySentiments = Array.from(dailyStats.values()).map(
      (dayEvents) =>
        dayEvents.reduce((sum, event) => sum + event.sentiment.score, 0) / dayEvents.length
    );

    return {
      average_daily_volume: dailyVolumes.reduce((sum, vol) => sum + vol, 0) / dailyVolumes.length,
      average_sentiment:
        dailySentiments.reduce((sum, sent) => sum + sent, 0) / dailySentiments.length,
      max_daily_volume: Math.max(...dailyVolumes),
      min_sentiment: Math.min(...dailySentiments),
    };
  }

  private updateDynamicThresholds(baseline: any): void {
    if (!baseline) {
      return;
    }

    // Update volume spike threshold to 3x baseline average
    const dynamicVolumeThreshold = Math.max(
      baseline.average_daily_volume * this.CRISIS_THRESHOLDS.VOLUME_SPIKE_MULTIPLIER,
      this.config.crisis_thresholds.mentions_per_hour
    );

    // Update config with dynamic thresholds
    this.config.crisis_thresholds.mentions_per_hour = Math.floor(dynamicVolumeThreshold);

    console.log(
      `🎯 Updated dynamic thresholds: volume=${this.config.crisis_thresholds.mentions_per_hour}`
    );
  }

  // Public API methods
  getProcessingMetrics(): ProcessingMetrics {
    return { ...this.processingMetrics };
  }

  async updateConfig(newConfig: MonitoringConfig): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Alert engine configuration updated');
  }

  getActiveRules(): AlertRule[] {
    return [...this.activeRules];
  }

  updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const ruleIndex = this.activeRules.findIndex((rule) => rule.id === ruleId);
    if (ruleIndex === -1) {
      return false;
    }

    this.activeRules[ruleIndex] = { ...this.activeRules[ruleIndex], ...updates };
    console.log(`⚙️ Updated alert rule: ${ruleId}`);
    return true;
  }

  addCustomRule(rule: AlertRule): void {
    this.activeRules.push(rule);
    console.log(`➕ Added custom alert rule: ${rule.name}`);
  }

  removeRule(ruleId: string): boolean {
    const initialLength = this.activeRules.length;
    this.activeRules = this.activeRules.filter((rule) => rule.id !== ruleId);

    if (this.activeRules.length < initialLength) {
      console.log(`➖ Removed alert rule: ${ruleId}`);
      return true;
    }

    return false;
  }

  // Emergency escalation
  async escalateAlert(alertId: string): Promise<void> {
    console.log(`🚨 ESCALATING ALERT: ${alertId}`);
    // TODO: Implement emergency escalation (SMS, phone calls, etc.)
    this.emit('escalation', { alertId, timestamp: new Date() });
  }
}
