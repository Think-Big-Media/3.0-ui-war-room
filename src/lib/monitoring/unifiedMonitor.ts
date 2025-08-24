/**
 * Unified Monitoring Interface
 * Aggregates data from all monitoring services
 */

import {
  type MonitoringClient,
  type MonitoringEvent,
  type MonitoringConfig,
  type ServiceHealth,
  type PipelineMetrics,
  type DeduplicationResult,
} from './types';
import { createMentionlyticsClient } from './mentionlytics';

interface UnifiedMonitorConfig {
  mentionlytics?: {
    apiKey: string;
    projectId: string;
    enabled: boolean;
  };
  config: MonitoringConfig;
  pollingInterval?: number; // milliseconds
}

}

export class UnifiedMonitor {
  private clients: Map<string, MonitoringClient> = new Map();
  private config: UnifiedMonitorConfig;
  private eventCache: Map<string, MonitoringEvent> = new Map();
  private metrics: PipelineMetrics;
  private pollingTimer?: NodeJS.Timeout;
  private lastPollTime = new Date();

  constructor(config: UnifiedMonitorConfig) {
    this.config = config;
    this.initializeClients();
    this.metrics = this.initializeMetrics();
  }

  private initializeClients(): void {
    if (this.config.mentionlytics?.enabled) {
      this.clients.set(
        'mentionlytics',
        createMentionlyticsClient(
          this.config.mentionlytics.apiKey,
          this.config.mentionlytics.projectId,
        ),
      );
    }
  }

  private initializeMetrics(): PipelineMetrics {
    return {
      events_processed_total: 0,
      events_per_minute: 0,
      alerts_generated: 0,
      processing_latency_ms: 0,
      service_health: [],
      duplicate_events_filtered: 0,
      sentiment_distribution: {
        positive: 0,
        negative: 0,
        neutral: 0,
      },
      platform_distribution: {},
      last_updated: new Date(),
    };
  }

  /**
   * Start monitoring with polling
   */
  async startMonitoring(callback: (events: MonitoringEvent[]) => void): Promise<void> {
    // Initial fetch
    const events = await this.fetchAllEvents();
    callback(events);

    // Set up polling
    const interval = this.config.pollingInterval || 60000; // Default 1 minute
    this.pollingTimer = setInterval(async () => {
      try {
        const newEvents = await this.fetchAllEvents(this.lastPollTime);
        if (newEvents.length > 0) {
          callback(newEvents);
        }
        this.lastPollTime = new Date();
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = undefined;
    }
  }

  /**
   * Fetch events from all services
   */
  async fetchAllEvents(since?: Date): Promise<MonitoringEvent[]> {
    const startTime = Date.now();
    const allEvents: MonitoringEvent[] = [];
    const errors: Array<{ service: string; error: Error }> = [];

    // Fetch from all services in parallel
    const promises = Array.from(this.clients.entries()).map(async ([name, client]) => {
      try {
        const events = await client.fetchEvents(this.config.config, since);
        return { service: name, events };
      } catch (error) {
        errors.push({ service: name, error: error as Error });
        return { service: name, events: [] };
      }
    });

    const results = await Promise.all(promises);

    // Process results
    for (const result of results) {
      for (const event of result.events) {
        const dedupeResult = this.checkDuplicate(event);
        if (!dedupeResult.is_duplicate) {
          allEvents.push(event);
          this.eventCache.set(event.id, event);
          this.updateMetrics(event);
        } else {
          this.metrics.duplicate_events_filtered++;
        }
      }
    }

    // Update processing metrics
    this.metrics.processing_latency_ms = Date.now() - startTime;
    this.metrics.events_processed_total += allEvents.length;
    this.metrics.last_updated = new Date();

    // Sort by timestamp (newest first)
    allEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return allEvents;
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<ServiceHealth[]> {
    const healthChecks = await Promise.all(
      Array.from(this.clients.entries()).map(async ([name, client]) => {
        try {
          return await client.getServiceHealth();
        } catch (error) {
          return {
            service: name as any,
            status: 'down' as const,
            last_successful_request: new Date(0),
            last_error: {
              message: error instanceof Error ? error.message : 'Unknown error',
              timestamp: new Date(),
            },
            rate_limit: {
              remaining: 0,
              reset_time: new Date(),
              limit: 0,
            },
            response_time_ms: 0,
            uptime_percentage: 0,
          };
        }
      }),
    );

    this.metrics.service_health = healthChecks;
    return healthChecks;
  }

  /**
   * Get pipeline metrics
   */
  getMetrics(): PipelineMetrics {
    // Calculate events per minute
    const timeDiff = Date.now() - this.metrics.last_updated.getTime();
    const minutes = timeDiff / 60000;
    this.metrics.events_per_minute = Math.round(
      this.metrics.events_processed_total / Math.max(1, minutes),
    );

    return { ...this.metrics };
  }

  /**
   * Check for duplicate events
   */
  private checkDuplicate(event: MonitoringEvent): DeduplicationResult {
    if (!this.config.config.deduplication.enabled) {
      return { is_duplicate: false };
    }

    const windowMs = this.config.config.deduplication.time_window_minutes * 60 * 1000;
    const threshold = this.config.config.deduplication.similarity_threshold;

    for (const [id, cachedEvent] of this.eventCache.entries()) {
      // Check time window
      if (event.timestamp.getTime() - cachedEvent.timestamp.getTime() > windowMs) {
        continue;
      }

      // Check similarity
      const similarity = this.calculateSimilarity(event, cachedEvent);
      if (similarity >= threshold) {
        return {
          is_duplicate: true,
          original_event_id: id,
          similarity_score: similarity,
          reason: 'Content similarity within time window',
        };
      }
    }

    return { is_duplicate: false };
  }

  /**
   * Calculate similarity between two events
   */
  private calculateSimilarity(event1: MonitoringEvent, event2: MonitoringEvent): number {
    // Simple similarity based on content overlap
    // In production, use more sophisticated algorithms
    const words1 = new Set(event1.content.toLowerCase().split(/\s+/));
    const words2 = new Set(event2.content.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Update metrics based on event
   */
  private updateMetrics(event: MonitoringEvent): void {
    // Update sentiment distribution
    this.metrics.sentiment_distribution[event.sentiment.label]++;

    // Update platform distribution
    if (!this.metrics.platform_distribution[event.platform]) {
      this.metrics.platform_distribution[event.platform] = 0;
    }
    this.metrics.platform_distribution[event.platform]++;
  }


  /**
   * Get recent events from cache
   */
  getRecentEvents(limit = 100): MonitoringEvent[] {
    return Array.from(this.eventCache.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Setup webhooks for real-time updates
   */
  async setupWebhooks(webhookUrl: string): Promise<void> {
    const setupPromises = Array.from(this.clients.entries()).map(async ([name, client]) => {
      if (client.setupWebhook) {
        try {
          await client.setupWebhook(webhookUrl);
          console.log(`Webhook setup successful for ${name}`);
        } catch (error) {
          console.error(`Webhook setup failed for ${name}:`, error);
        }
      }
    });

    await Promise.all(setupPromises);
  }
}

// Factory function
export function createUnifiedMonitor(config: UnifiedMonitorConfig): UnifiedMonitor {
  return new UnifiedMonitor(config);
