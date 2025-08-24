// Unified Monitoring Pipeline - Orchestration Layer

import { EventEmitter } from 'events';
import {
  type MonitoringEvent,
  type CrisisAlert,
  type MonitoringConfig,
  type MonitoringClient,
  type PipelineMetrics,
  AlertRule,
  type DeduplicationResult,
  type SentimentWeights,
  ServiceHealth,
} from './types';
import { MentionlyticsClient } from './mentionlytics/client';
import { AlertEngine } from './alertEngine';
import { type EventStore } from './eventStore';
import { type WebSocketBroadcaster } from './websocketBroadcaster';
import { createHash } from 'crypto';

export class UnifiedMonitoringPipeline extends EventEmitter {
  private clients: MonitoringClient[];
  private alertEngine: AlertEngine;
  private eventStore: EventStore;
  private broadcaster: WebSocketBroadcaster;
  private config: MonitoringConfig;
  private isRunning = false;
  private processedEvents = new Map<string, Date>(); // Deduplication cache
  private metrics: PipelineMetrics;
  private intervalId?: NodeJS.Timeout;
  private sentimentWeights: SentimentWeights = {
    mentionlytics: 1.0,
  };

  constructor(
    config: MonitoringConfig,
    eventStore: EventStore,
    broadcaster: WebSocketBroadcaster,
  ) {
    super();
    this.config = config;
    this.eventStore = eventStore;
    this.broadcaster = broadcaster;

    // Initialize monitoring clients
    this.clients = [
      new MentionlyticsClient({
        apiToken: import.meta.env.MENTIONLYTICS_API_TOKEN!,
        apiUrl: import.meta.env.MENTIONLYTICS_API_URL || 'https://app.mentionlytics.com/api',
      }),
    ];

    // Initialize alert engine
    this.alertEngine = new AlertEngine(this.config, this.eventStore);

    // Initialize metrics
    this.metrics = {
      events_processed_total: 0,
      events_per_minute: 0,
      alerts_generated: 0,
      processing_latency_ms: 0,
      service_health: [],
      duplicate_events_filtered: 0,
      sentiment_distribution: { positive: 0, negative: 0, neutral: 0 },
      platform_distribution: {},
      last_updated: new Date(),
    };

    // Setup event listeners
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.alertEngine.on('alert', (alert: CrisisAlert) => {
      this.handleCrisisAlert(alert);
    });

    this.on('event_processed', (event: MonitoringEvent) => {
      this.updateMetrics(event);
    });

    this.on('duplicate_filtered', () => {
      this.metrics.duplicate_events_filtered++;
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Pipeline is already running');
    }

    console.log('🚀 Starting Unified Monitoring Pipeline');

    // Test client connections
    await this.testClientConnections();

    // Start alert engine
    await this.alertEngine.start();

    this.isRunning = true;

    // Start polling loop (fallback for webhook failures)
    this.intervalId = setInterval(() => {
      this.pollForEvents().catch(error => {
        console.error('Polling error:', error);
        this.emit('error', error);
      });
    }, 30000); // Poll every 30 seconds

    console.log('✅ Unified Monitoring Pipeline started');
    this.emit('started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {return;}

    console.log('🛑 Stopping Unified Monitoring Pipeline');

    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    await this.alertEngine.stop();

    // Cleanup webhooks
    for (const client of this.clients) {
      if (client.teardownWebhook) {
        await client.teardownWebhook().catch(console.error);
      }
    }

    console.log('✅ Unified Monitoring Pipeline stopped');
    this.emit('stopped');
  }

  private async testClientConnections(): Promise<void> {
    const healthChecks = await Promise.all(
      this.clients.map(async (client) => {
        try {
          const healthy = await client.isHealthy();
          const health = await client.getServiceHealth();
          return { client: client.name, healthy, health };
        } catch (error) {
          console.error(`Health check failed for ${client.name}:`, error);
          return {
            client: client.name,
            healthy: false,
            health: null,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      }),
    );

    const unhealthyClients = healthChecks.filter(check => !check.healthy);
    if (unhealthyClients.length === this.clients.length) {
      throw new Error('All monitoring clients are unhealthy');
    }

    if (unhealthyClients.length > 0) {
      console.warn('Some clients are unhealthy:', unhealthyClients);
    }

    this.metrics.service_health = healthChecks
      .filter(check => check.health)
      .map(check => check.health!);
  }

  private async pollForEvents(): Promise<void> {
    const startTime = Date.now();
    const since = new Date(Date.now() - 5 * 60 * 1000); // Last 5 minutes

    try {
      // Fetch from all healthy clients in parallel
      const eventPromises = this.clients.map(async (client) => {
        try {
          if (await client.isHealthy()) {
            return await client.fetchEvents(this.config, since);
          }
          return [];
        } catch (error) {
          console.error(`Error fetching from ${client.name}:`, error);
          return [];
        }
      });

      const eventResults = await Promise.all(eventPromises);
      const allEvents = eventResults.flat();

      if (allEvents.length > 0) {
        console.log(`📥 Received ${allEvents.length} events from monitoring services`);
        await this.processEvents(allEvents);
      }

      this.metrics.processing_latency_ms = Date.now() - startTime;
      this.metrics.last_updated = new Date();

    } catch (error) {
      console.error('Error in polling loop:', error);
      this.emit('error', error);
    }
  }

  async processEvents(events: MonitoringEvent[]): Promise<void> {
    const processedEvents: MonitoringEvent[] = [];

    for (const event of events) {
      try {
        // Deduplication check
        const deduplicationResult = await this.checkDuplication(event);
        if (deduplicationResult.is_duplicate) {
          event.is_duplicate = true;
          event.duplicate_of = deduplicationResult.original_event_id;
          this.emit('duplicate_filtered', event);
          continue;
        }

        // Apply sentiment weighting
        event.sentiment = this.applySentimentWeighting(event);

        // Store event
        await this.eventStore.storeEvent(event);

        // Add to processing cache
        this.processedEvents.set(event.id, event.timestamp);

        processedEvents.push(event);
        this.emit('event_processed', event);

      } catch (error) {
        console.error(`Error processing event ${event.id}:`, error);
        this.emit('error', error);
      }
    }

    if (processedEvents.length > 0) {
      // Send to alert engine for analysis
      await this.alertEngine.analyzeEvents(processedEvents);

      // Broadcast to connected clients
      await this.broadcaster.broadcastEvents(processedEvents);

      console.log(`✅ Processed ${processedEvents.length} events (${events.length - processedEvents.length} duplicates filtered)`);
    }

    // Cleanup old entries from processing cache (keep last 24 hours)
    this.cleanupProcessingCache();
  }

  private async checkDuplication(event: MonitoringEvent): Promise<DeduplicationResult> {
    if (!this.config.deduplication.enabled) {
      return { is_duplicate: false };
    }

    // Generate content hash for similarity comparison
    const contentHash = this.generateContentHash(event);

    // Check if we've seen this exact content recently
    const timeWindow = this.config.deduplication.time_window_minutes * 60 * 1000;
    const since = new Date(Date.now() - timeWindow);

    // Check processing cache first (faster)
    for (const [cachedId, timestamp] of this.processedEvents.entries()) {
      if (timestamp >= since) {
        const cachedEvent = await this.eventStore.getEvent(cachedId);
        if (cachedEvent) {
          const cachedHash = this.generateContentHash(cachedEvent);
          if (contentHash === cachedHash) {
            return {
              is_duplicate: true,
              original_event_id: cachedId,
              similarity_score: 1.0,
              reason: 'exact_content_match',
            };
          }
        }
      }
    }

    // Check database for similar events
    const similarEvents = await this.eventStore.findSimilarEvents(
      event,
      since,
      this.config.deduplication.similarity_threshold,
    );

    if (similarEvents.length > 0) {
      const mostSimilar = similarEvents[0];
      return {
        is_duplicate: true,
        original_event_id: mostSimilar.id,
        similarity_score: mostSimilar.similarity_score,
        reason: 'content_similarity',
      };
    }

    return { is_duplicate: false };
  }

  private generateContentHash(event: MonitoringEvent): string {
    // Create hash from key content fields
    const content = [
      event.title?.toLowerCase().trim(),
      event.content?.toLowerCase().trim(),
      event.author.name?.toLowerCase().trim(),
      event.platform,
    ].filter(Boolean).join('|');

    return createHash('sha256').update(content).digest('hex');
  }

  private applySentimentWeighting(event: MonitoringEvent): MonitoringEvent['sentiment'] {
    // Apply weighted sentiment based on source reliability
    const weight = this.sentimentWeights[event.source];
    const baseScore = event.sentiment.score;

    // Adjust confidence based on source weight
    const adjustedConfidence = event.sentiment.confidence * weight;

    return {
      ...event.sentiment,
      confidence: adjustedConfidence,
    };
  }

  private async handleCrisisAlert(alert: CrisisAlert): Promise<void> {
    console.log(`🚨 CRISIS ALERT: ${alert.severity.toUpperCase()} - ${alert.title}`);

    try {
      // Store alert
      await this.eventStore.storeAlert(alert);

      // Broadcast to connected clients
      await this.broadcaster.broadcastAlert(alert);

      // Send notifications (email, Slack, SMS)
      await this.sendAlertNotifications(alert);

      this.metrics.alerts_generated++;
      this.emit('alert', alert);

    } catch (error) {
      console.error('Error handling crisis alert:', error);
      this.emit('error', error);
    }
  }

  private async sendAlertNotifications(alert: CrisisAlert): Promise<void> {
    const { alert_settings } = this.config;

    // TODO: Implement notification sending
    // - Email notifications
    // - Slack webhook
    // - SMS alerts for critical issues
    // - Push notifications

    console.log(`📧 Alert notifications sent for ${alert.id}`);
  }

  private updateMetrics(event: MonitoringEvent): void {
    this.metrics.events_processed_total++;

    // Update sentiment distribution
    this.metrics.sentiment_distribution[event.sentiment.label]++;

    // Update platform distribution
    this.metrics.platform_distribution[event.platform] =
      (this.metrics.platform_distribution[event.platform] || 0) + 1;

    // Calculate events per minute (rolling window)
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentEvents = Array.from(this.processedEvents.values())
      .filter(timestamp => timestamp > oneMinuteAgo).length;
    this.metrics.events_per_minute = recentEvents;
  }

  private cleanupProcessingCache(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    for (const [id, timestamp] of this.processedEvents.entries()) {
      if (timestamp < oneDayAgo) {
        this.processedEvents.delete(id);
      }
    }
  }

  // Webhook endpoint handler
  async handleWebhook(service: 'mentionlytics', payload: any): Promise<void> {
    try {
      console.log(`📥 Webhook received from ${service}`);

      // Find the appropriate client
      const client = this.clients.find(c => c.name === service);
      if (!client) {
        throw new Error(`Unknown service: ${service}`);
      }

      // Parse webhook payload into events
      const events = await this.parseWebhookPayload(service, payload);

      if (events.length > 0) {
        await this.processEvents(events);
      }

    } catch (error) {
      console.error(`Webhook error for ${service}:`, error);
      this.emit('error', error);
    }
  }

  private async parseWebhookPayload(service: string, payload: any): Promise<MonitoringEvent[]> {
    // TODO: Implement service-specific webhook parsing
    // This would convert webhook payloads to standardized MonitoringEvent format
    return [];
  }

  // Public API methods
  getMetrics(): PipelineMetrics {
    return { ...this.metrics };
  }

  async getRecentEvents(limit = 100, since?: Date): Promise<MonitoringEvent[]> {
    return this.eventStore.getRecentEvents(limit, since);
  }

  async getActiveAlerts(): Promise<CrisisAlert[]> {
    return this.eventStore.getActiveAlerts();
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    await this.eventStore.acknowledgeAlert(alertId, userId);
    await this.broadcaster.broadcastAlertUpdate(alertId, 'acknowledged');
  }

  async resolveAlert(alertId: string, userId: string): Promise<void> {
    await this.eventStore.resolveAlert(alertId, userId);
    await this.broadcaster.broadcastAlertUpdate(alertId, 'resolved');
  }

  isHealthy(): boolean {
    return this.isRunning &&
           this.metrics.service_health.some(health => health.status === 'healthy');
  }

  async updateConfig(newConfig: Partial<MonitoringConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.alertEngine.updateConfig(this.config);
    this.emit('config_updated', this.config);
  }
