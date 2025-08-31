/**
 * Crisis Detection Engine
 * Analyzes monitoring events for potential crises
 */

import {
  type MonitoringEvent,
  type CrisisAlert,
  type CrisisThresholds,
  type AlertRule,
} from './types';

interface CrisisDetectorConfig {
  thresholds: CrisisThresholds;
  customRules?: AlertRule[];
  baselineWindow?: number; // minutes for baseline calculation
}

interface BaselineMetrics {
  mentionsPerHour: number;
  sentimentAverage: number;
  lastUpdated: Date;
}

export class CrisisDetector {
  private config: CrisisDetectorConfig;
  private baseline: BaselineMetrics;
  private recentEvents: MonitoringEvent[] = [];
  private activeAlerts: Map<string, CrisisAlert> = new Map();
  private alertCooldowns: Map<string, Date> = new Map();

  constructor(config: CrisisDetectorConfig) {
    this.config = config;
    this.baseline = {
      mentionsPerHour: 10, // Default baseline
      sentimentAverage: 0.5,
      lastUpdated: new Date(),
    };
  }

  /**
   * Analyze events for crisis indicators
   */
  analyzeEvents(events: MonitoringEvent[]): CrisisAlert[] {
    // Update recent events
    this.updateRecentEvents(events);

    // Update baseline if needed
    if (this.shouldUpdateBaseline()) {
      this.updateBaseline();
    }

    const alerts: CrisisAlert[] = [];

    // Check velocity spike
    const velocityAlert = this.checkVelocitySpike();
    if (velocityAlert) {
      alerts.push(velocityAlert);
    }

    // Check sentiment crash
    const sentimentAlert = this.checkSentimentCrash();
    if (sentimentAlert) {
      alerts.push(sentimentAlert);
    }

    // Check keyword triggers
    const keywordAlert = this.checkKeywordTriggers();
    if (keywordAlert) {
      alerts.push(keywordAlert);
    }

    // Check viral negative content
    const viralAlert = this.checkViralNegative();
    if (viralAlert) {
      alerts.push(viralAlert);
    }

    // Apply custom rules
    if (this.config.customRules) {
      for (const rule of this.config.customRules) {
        if (rule.enabled && this.checkCustomRule(rule)) {
          alerts.push(this.createCustomAlert(rule));
        }
      }
    }

    // Update active alerts
    alerts.forEach((alert) => this.activeAlerts.set(alert.id, alert));

    return alerts;
  }

  /**
   * Check for mention velocity spike
   */
  private checkVelocitySpike(): CrisisAlert | null {
    const alertType = 'volume_spike';
    if (this.isInCooldown(alertType)) {
      return null;
    }

    const currentVelocity = this.calculateCurrentVelocity();
    const threshold = this.baseline.mentionsPerHour * this.config.thresholds.velocityMultiplier;

    if (
      currentVelocity > threshold &&
      this.recentEvents.length >= this.config.thresholds.minimumMentions
    ) {
      const alert: CrisisAlert = {
        id: `crisis_${Date.now()}_velocity`,
        severity: this.calculateSeverity(currentVelocity / this.baseline.mentionsPerHour),
        type: 'volume_spike',
        title: 'Unusual Mention Volume Detected',
        description: `Mention rate is ${(currentVelocity / this.baseline.mentionsPerHour).toFixed(1)}x normal baseline`,
        trigger_event_ids: this.recentEvents.slice(0, 5).map((e) => e.id),
        trigger_conditions: {
          mentions_per_hour: currentVelocity,
          duration_minutes: this.config.thresholds.duration_minutes,
        },
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',
        escalated: false,
        affected_keywords: this.extractTopKeywords(),
        affected_platforms: this.extractAffectedPlatforms(),
        estimated_reach: this.calculateTotalReach(),
        metadata: {
          peak_mentions_hour: currentVelocity,
        },
      };

      this.setCooldown(alertType);
      return alert;
    }

    return null;
  }

  /**
   * Check for sentiment crash
   */
  private checkSentimentCrash(): CrisisAlert | null {
    const alertType = 'sentiment_drop';
    if (this.isInCooldown(alertType)) {
      return null;
    }

    const currentSentiment = this.calculateAverageSentiment();
    const positiveRatio = this.calculatePositiveRatio();

    if (
      positiveRatio < this.config.thresholds.sentimentThreshold &&
      this.recentEvents.length >= this.config.thresholds.minimumMentions
    ) {
      const alert: CrisisAlert = {
        id: `crisis_${Date.now()}_sentiment`,
        severity: this.calculateSentimentSeverity(positiveRatio),
        type: 'sentiment_drop',
        title: 'Negative Sentiment Surge',
        description: `Only ${(positiveRatio * 100).toFixed(0)}% positive sentiment (threshold: ${(this.config.thresholds.sentimentThreshold * 100).toFixed(0)}%)`,
        trigger_event_ids: this.getNegativeEvents()
          .slice(0, 5)
          .map((e) => e.id),
        trigger_conditions: {
          sentiment_threshold: currentSentiment,
        },
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',
        escalated: false,
        affected_keywords: this.extractTopKeywords(),
        affected_platforms: this.extractAffectedPlatforms(),
        estimated_reach: this.calculateTotalReach(),
        metadata: {
          lowest_sentiment: currentSentiment,
          top_negative_posts: this.getTopNegativePosts(),
        },
      };

      this.setCooldown(alertType);
      return alert;
    }

    return null;
  }

  /**
   * Check for crisis keyword triggers
   */
  private checkKeywordTriggers(): CrisisAlert | null {
    const alertType = 'negative_trend';
    if (this.isInCooldown(alertType)) {
      return null;
    }

    const triggerEvents = this.recentEvents.filter((event) => {
      const content = `${event.content} ${event.title}`.toLowerCase();
      return (
        this.config.thresholds.keywords.some((keyword: string) =>
          content.includes(keyword.toLowerCase())
        ) &&
        !this.config.thresholds.excludeKeywords.some((exclude: string) =>
          content.includes(exclude.toLowerCase())
        )
      );
    });

    if (triggerEvents.length >= 3) {
      // At least 3 mentions with crisis keywords
      const alert: CrisisAlert = {
        id: `crisis_${Date.now()}_keywords`,
        severity: 'high',
        type: 'negative_trend',
        title: 'Crisis Keywords Detected',
        description: `Found ${triggerEvents.length} mentions containing crisis keywords`,
        trigger_event_ids: triggerEvents.slice(0, 5).map((e) => e.id),
        trigger_conditions: {},
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',
        escalated: false,
        affected_keywords: this.config.thresholds.keywords,
        affected_platforms: [...new Set(triggerEvents.map((e) => e.platform))],
        estimated_reach: triggerEvents.reduce((sum, e) => sum + (e.metrics?.reach || 0), 0),
        metadata: {},
      };

      this.setCooldown(alertType);
      return alert;
    }

    return null;
  }

  /**
   * Check for viral negative content
   */
  private checkViralNegative(): CrisisAlert | null {
    const alertType = 'viral_negative';
    if (this.isInCooldown(alertType)) {
      return null;
    }

    const viralNegatives = this.recentEvents.filter(
      (event) =>
        event.sentiment.label === 'negative' &&
        event.metrics &&
        (event.metrics.engagement ?? 0) > 1000 &&
        (event.metrics.reach ?? 0) > 10000
    );

    if (viralNegatives.length > 0) {
      const topViral = viralNegatives[0];
      const alert: CrisisAlert = {
        id: `crisis_${Date.now()}_viral`,
        severity: 'critical',
        type: 'viral_negative',
        title: 'Viral Negative Content Detected',
        description: `Negative content with ${(topViral.metrics?.reach ?? 0).toLocaleString()} reach and ${(topViral.metrics?.engagement ?? 0).toLocaleString()} engagements`,
        trigger_event_ids: viralNegatives.slice(0, 3).map((e) => e.id),
        trigger_conditions: {
          reach_threshold: 10000,
        },
        created_at: new Date(),
        updated_at: new Date(),
        status: 'active',
        escalated: true, // Auto-escalate viral content
        affected_keywords: this.extractKeywordsFromEvents(viralNegatives),
        affected_platforms: [...new Set(viralNegatives.map((e) => e.platform))],
        estimated_reach: viralNegatives.reduce((sum, e) => sum + (e.metrics?.reach || 0), 0),
        metadata: {
          geographic_spread: this.extractGeographicSpread(viralNegatives),
        },
      };

      this.setCooldown(alertType);
      return alert;
    }

    return null;
  }

  /**
   * Helper methods
   */
  private updateRecentEvents(newEvents: MonitoringEvent[]): void {
    this.recentEvents = [...newEvents, ...this.recentEvents];

    // Keep only events from the last hour
    const cutoff = new Date(Date.now() - 60 * 60 * 1000);
    this.recentEvents = this.recentEvents.filter((e) => e.timestamp > cutoff);
  }

  private shouldUpdateBaseline(): boolean {
    const windowMs = (this.config.baselineWindow || 60) * 60 * 1000;
    return Date.now() - this.baseline.lastUpdated.getTime() > windowMs;
  }

  private updateBaseline(): void {
    // Calculate baseline from events older than 1 hour
    const cutoff = new Date(Date.now() - 60 * 60 * 1000);
    const baselineEvents = this.recentEvents.filter((e) => e.timestamp < cutoff);

    if (baselineEvents.length > 0) {
      this.baseline = {
        mentionsPerHour: baselineEvents.length,
        sentimentAverage: this.calculateAverageSentiment(baselineEvents),
        lastUpdated: new Date(),
      };
    }
  }

  private calculateCurrentVelocity(): number {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = this.recentEvents.filter((e) => e.timestamp > oneHourAgo).length;
    return recentCount;
  }

  private calculateAverageSentiment(events = this.recentEvents): number {
    if (events.length === 0) {
      return 0;
    }
    const sum = events.reduce((acc, e) => acc + e.sentiment.score, 0);
    return sum / events.length;
  }

  private calculatePositiveRatio(): number {
    if (this.recentEvents.length === 0) {
      return 1;
    }
    const positive = this.recentEvents.filter((e) => e.sentiment.label === 'positive').length;
    return positive / this.recentEvents.length;
  }

  private calculateSeverity(multiplier: number): CrisisAlert['severity'] {
    if (multiplier > 10) {
      return 'critical';
    }
    if (multiplier > 5) {
      return 'high';
    }
    if (multiplier > 3) {
      return 'medium';
    }
    return 'low';
  }

  private calculateSentimentSeverity(positiveRatio: number): CrisisAlert['severity'] {
    if (positiveRatio < 0.1) {
      return 'critical';
    }
    if (positiveRatio < 0.3) {
      return 'high';
    }
    if (positiveRatio < 0.5) {
      return 'medium';
    }
    return 'low';
  }

  private getNegativeEvents(): MonitoringEvent[] {
    return this.recentEvents.filter((e) => e.sentiment.label === 'negative');
  }

  private getTopNegativePosts(): string[] {
    return this.getNegativeEvents()
      .sort((a, b) => (b.metrics?.engagement || 0) - (a.metrics?.engagement || 0))
      .slice(0, 3)
      .map((e) => e.url);
  }

  private extractTopKeywords(): string[] {
    const keywordCounts = new Map<string, number>();

    this.recentEvents.forEach((event) => {
      event.keywords.forEach((keyword) => {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
      });
    });

    return Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword]) => keyword);
  }

  private extractKeywordsFromEvents(events: MonitoringEvent[]): string[] {
    const keywords = new Set<string>();
    events.forEach((event) => {
      event.keywords.forEach((keyword) => keywords.add(keyword));
    });
    return Array.from(keywords).slice(0, 10);
  }

  private extractAffectedPlatforms(): string[] {
    const platforms = new Map<string, number>();

    this.recentEvents.forEach((event) => {
      platforms.set(event.platform, (platforms.get(event.platform) || 0) + 1);
    });

    return Array.from(platforms.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([platform]) => platform);
  }

  private extractGeographicSpread(events: MonitoringEvent[]): string[] {
    const locations = new Set<string>();
    events.forEach((event) => {
      if (event.location?.country) {
        locations.add(event.location.country);
      }
    });
    return Array.from(locations);
  }

  private calculateTotalReach(): number {
    return this.recentEvents.reduce((sum, event) => sum + (event.metrics?.reach || 0), 0);
  }

  private isInCooldown(alertType: string): boolean {
    const cooldown = this.alertCooldowns.get(alertType);
    if (!cooldown) {
      return false;
    }
    return Date.now() < cooldown.getTime();
  }

  private setCooldown(alertType: string): void {
    const cooldownMinutes = 30; // 30 minute cooldown
    this.alertCooldowns.set(alertType, new Date(Date.now() + cooldownMinutes * 60 * 1000));
  }

  private checkCustomRule(rule: AlertRule): boolean {
    // Implementation depends on specific rule conditions
    // This is a placeholder for custom rule evaluation
    return false;
  }

  private createCustomAlert(rule: AlertRule): CrisisAlert {
    return {
      id: `crisis_${Date.now()}_custom_${rule.id}`,
      severity: 'medium',
      type: 'negative_trend',
      title: rule.name,
      description: 'Custom rule triggered',
      trigger_event_ids: [],
      trigger_conditions: {},
      created_at: new Date(),
      updated_at: new Date(),
      status: 'active',
      escalated: false,
      affected_keywords: [],
      affected_platforms: [],
      estimated_reach: 0,
      metadata: {},
    };
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): CrisisAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId: string, userId: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = 'acknowledged';
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date();
      alert.acknowledgedBy = userId;
    }
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = 'resolved';
      this.activeAlerts.delete(alertId);
    }
  }
}

// Factory function with default thresholds
export function createCrisisDetector(customThresholds?: Partial<CrisisThresholds>): CrisisDetector {
  const defaultThresholds: CrisisThresholds = {
    velocityMultiplier: 3,
    sentimentThreshold: 0.5,
    minimumMentions: 10,
    keywords: ['crisis', 'scandal', 'outrage', 'boycott', 'fail', 'disaster'],
    excludeKeywords: ['crisis management', 'crisis averted'],
  };

  return new CrisisDetector({
    thresholds: { ...defaultThresholds, ...customThresholds },
  });
}
