// Event Store - Supabase-backed Event History & Storage

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { type MonitoringEvent, type CrisisAlert, type PipelineMetrics } from './types';
import { createHash } from 'crypto';

interface StoredEvent extends Omit<MonitoringEvent, 'timestamp'> {
  timestamp: string; // ISO string for Supabase
  created_at: string;
  updated_at: string;
}

interface StoredAlert extends Omit<CrisisAlert, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_by?: string;
  resolved_at?: string;
}

interface SimilarEvent {
  id: string;
  similarity_score: number;
}

export class EventStore {
  private supabase: SupabaseClient;
  private batchQueue: StoredEvent[] = [];
  private batchTimeout?: NodeJS.Timeout;
  private readonly BATCH_SIZE = 50;
  private readonly BATCH_TIMEOUT_MS = 5000; // 5 seconds

  constructor(
    supabaseUrl: string = import.meta.env.SUPABASE_URL!,
    supabaseKey: string = import.meta.env.SUPABASE_ANON_KEY!
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false, // Server-side usage
      },
    });

    this.initializeTables();
  }

  private async initializeTables(): Promise<void> {
    try {
      // Create tables if they don't exist (via migrations)
      console.log('📊 Initializing EventStore tables...');

      // Check if tables exist
      const { error: eventsTableError } = await this.supabase
        .from('monitoring_events')
        .select('id')
        .limit(1);

      if (eventsTableError) {
        console.warn('Monitoring events table not found. Please run migrations.');
      }

      const { error: alertsTableError } = await this.supabase
        .from('crisis_alerts')
        .select('id')
        .limit(1);

      if (alertsTableError) {
        console.warn('Crisis alerts table not found. Please run migrations.');
      }

      console.log('✅ EventStore initialized');
    } catch (error) {
      console.error('Error initializing EventStore:', error);
      throw error;
    }
  }

  async storeEvent(event: MonitoringEvent): Promise<void> {
    try {
      const storedEvent: StoredEvent = {
        ...event,
        timestamp: event.timestamp.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to batch queue for efficient bulk insertion
      this.batchQueue.push(storedEvent);

      // Process batch if it's full
      if (this.batchQueue.length >= this.BATCH_SIZE) {
        await this.processBatch();
      } else if (!this.batchTimeout) {
        // Set timeout to process batch after delay
        this.batchTimeout = setTimeout(() => {
          this.processBatch().catch(console.error);
        }, this.BATCH_TIMEOUT_MS);
      }
    } catch (error) {
      console.error('Error storing event:', error);
      throw error;
    }
  }

  private async processBatch(): Promise<void> {
    if (this.batchQueue.length === 0) {
      return;
    }

    const eventsToStore = [...this.batchQueue];
    this.batchQueue = [];

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = undefined;
    }

    try {
      const { error } = await this.supabase.from('monitoring_events').insert(eventsToStore);

      if (error) {
        console.error('Batch insert error:', error);
        // Re-queue failed events
        this.batchQueue.unshift(...eventsToStore);
        throw error;
      }

      console.log(`💾 Stored batch of ${eventsToStore.length} events`);
    } catch (error) {
      console.error('Error processing batch:', error);
      throw error;
    }
  }

  async getEvent(eventId: string): Promise<MonitoringEvent | null> {
    try {
      const { data, error } = await this.supabase
        .from('monitoring_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error || !data) {
        return null;
      }

      return this.convertStoredEventToMonitoringEvent(data);
    } catch (error) {
      console.error('Error getting event:', error);
      return null;
    }
  }

  async getRecentEvents(limit = 100, since?: Date): Promise<MonitoringEvent[]> {
    try {
      let query = this.supabase
        .from('monitoring_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (since) {
        query = query.gte('timestamp', since.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error getting recent events:', error);
        return [];
      }

      return data.map((item) => this.convertStoredEventToMonitoringEvent(item));
    } catch (error) {
      console.error('Error getting recent events:', error);
      return [];
    }
  }

  async getEventsSince(since: Date): Promise<MonitoringEvent[]> {
    try {
      const { data, error } = await this.supabase
        .from('monitoring_events')
        .select('*')
        .gte('timestamp', since.toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error getting events since:', error);
        return [];
      }

      return data.map((item) => this.convertStoredEventToMonitoringEvent(item));
    } catch (error) {
      console.error('Error getting events since:', error);
      return [];
    }
  }

  async findSimilarEvents(
    event: MonitoringEvent,
    since: Date,
    similarityThreshold = 0.8
  ): Promise<SimilarEvent[]> {
    try {
      // Get recent events from same platform
      const { data, error } = await this.supabase
        .from('monitoring_events')
        .select('id, title, content, platform, author')
        .eq('platform', event.platform)
        .gte('timestamp', since.toISOString())
        .neq('id', event.id)
        .limit(100);

      if (error || !data) {
        return [];
      }

      // Calculate similarity scores
      const similarEvents: SimilarEvent[] = [];

      for (const storedEvent of data) {
        const similarity = this.calculateContentSimilarity(event, storedEvent as any);

        if (similarity >= similarityThreshold) {
          similarEvents.push({
            id: storedEvent.id,
            similarity_score: similarity,
          });
        }
      }

      // Sort by similarity score (highest first)
      return similarEvents.sort((a, b) => b.similarity_score - a.similarity_score);
    } catch (error) {
      console.error('Error finding similar events:', error);
      return [];
    }
  }

  private calculateContentSimilarity(event1: MonitoringEvent, event2: any): number {
    // Simple similarity calculation based on content, title, and author
    let similarity = 0;
    let factors = 0;

    // Title similarity
    if (event1.title && event2.title) {
      const titleSim = this.calculateStringSimilarity(event1.title, event2.title);
      similarity += titleSim * 0.4; // 40% weight
      factors += 0.4;
    }

    // Content similarity
    if (event1.content && event2.content) {
      const contentSim = this.calculateStringSimilarity(event1.content, event2.content);
      similarity += contentSim * 0.5; // 50% weight
      factors += 0.5;
    }

    // Author similarity
    if (event1.author.name && event2.author?.name) {
      const authorSim = event1.author.name === event2.author.name ? 1.0 : 0.0;
      similarity += authorSim * 0.1; // 10% weight
      factors += 0.1;
    }

    return factors > 0 ? similarity / factors : 0;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    // Simple Jaccard similarity based on word sets
    const words1 = new Set(str1.toLowerCase().split(/\s+/));
    const words2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter((word) => words2.has(word)));
    const union = new Set([...words1, ...words2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  async storeAlert(alert: CrisisAlert): Promise<void> {
    try {
      const storedAlert: StoredAlert = {
        ...alert,
        created_at: alert.created_at.toISOString(),
        updated_at: alert.updated_at.toISOString(),
      };

      const { error } = await this.supabase.from('crisis_alerts').insert([storedAlert]);

      if (error) {
        console.error('Error storing alert:', error);
        throw error;
      }

      console.log(`🚨 Stored crisis alert: ${alert.id}`);
    } catch (error) {
      console.error('Error storing alert:', error);
      throw error;
    }
  }

  async getActiveAlerts(): Promise<CrisisAlert[]> {
    try {
      const { data, error } = await this.supabase
        .from('crisis_alerts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting active alerts:', error);
        return [];
      }

      return data.map((item) => this.convertStoredAlertToCrisisAlert(item));
    } catch (error) {
      console.error('Error getting active alerts:', error);
      return [];
    }
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('crisis_alerts')
        .update({
          status: 'acknowledged',
          acknowledged_by: userId,
          acknowledged_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) {
        console.error('Error acknowledging alert:', error);
        throw error;
      }

      console.log(`✅ Alert acknowledged: ${alertId}`);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  async resolveAlert(alertId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('crisis_alerts')
        .update({
          status: 'resolved',
          resolved_by: userId,
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) {
        console.error('Error resolving alert:', error);
        throw error;
      }

      console.log(`✅ Alert resolved: ${alertId}`);
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }

  async getEventMetrics(timeRange: { from: Date; to: Date }): Promise<PipelineMetrics> {
    try {
      // Get event counts and metrics for the time range
      const { data: events, error: eventsError } = await this.supabase
        .from('monitoring_events')
        .select('source, platform, sentiment, metrics')
        .gte('timestamp', timeRange.from.toISOString())
        .lte('timestamp', timeRange.to.toISOString());

      if (eventsError) {
        console.error('Error getting event metrics:', eventsError);
        throw eventsError;
      }

      // Get alert counts
      const { data: alerts, error: alertsError } = await this.supabase
        .from('crisis_alerts')
        .select('severity')
        .gte('created_at', timeRange.from.toISOString())
        .lte('created_at', timeRange.to.toISOString());

      if (alertsError) {
        console.error('Error getting alert metrics:', alertsError);
        throw alertsError;
      }

      // Calculate metrics
      const sentimentDistribution = { positive: 0, negative: 0, neutral: 0 };
      const platformDistribution: Record<string, number> = {};

      events.forEach((event) => {
        // Sentiment distribution
        if (event.sentiment?.label) {
          sentimentDistribution[event.sentiment.label as keyof typeof sentimentDistribution]++;
        }

        // Platform distribution
        if (event.platform) {
          platformDistribution[event.platform] = (platformDistribution[event.platform] || 0) + 1;
        }
      });

      const timeDiffMs = timeRange.to.getTime() - timeRange.from.getTime();
      const timeDiffMinutes = timeDiffMs / (1000 * 60);

      return {
        events_processed_total: events.length,
        events_per_minute: timeDiffMinutes > 0 ? events.length / timeDiffMinutes : 0,
        alerts_generated: alerts.length,
        processing_latency_ms: 0, // Would need to track this separately
        service_health: [], // Would need to query service health table
        duplicate_events_filtered: 0, // Would need to track this separately
        sentiment_distribution: sentimentDistribution,
        platform_distribution: platformDistribution,
        last_updated: new Date(),
      };
    } catch (error) {
      console.error('Error getting event metrics:', error);
      throw error;
    }
  }

  // Analytics queries
  async getTopKeywords(
    timeRange: { from: Date; to: Date },
    limit = 10
  ): Promise<Array<{ keyword: string; count: number }>> {
    try {
      const { data, error } = await this.supabase
        .from('monitoring_events')
        .select('keywords')
        .gte('timestamp', timeRange.from.toISOString())
        .lte('timestamp', timeRange.to.toISOString());

      if (error) {
        throw error;
      }

      // Count keyword occurrences
      const keywordCounts = new Map<string, number>();

      data.forEach((event) => {
        if (event.keywords && Array.isArray(event.keywords)) {
          event.keywords.forEach((keyword: string) => {
            keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
          });
        }
      });

      // Sort and return top keywords
      return Array.from(keywordCounts.entries())
        .map(([keyword, count]) => ({ keyword, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting top keywords:', error);
      return [];
    }
  }

  async getSentimentTrend(
    timeRange: { from: Date; to: Date },
    bucketSize: 'hour' | 'day' = 'hour'
  ): Promise<Array<{ timestamp: string; sentiment: number; count: number }>> {
    try {
      // Use Supabase's date functions to bucket data
      const dateFormat = bucketSize === 'hour' ? 'YYYY-MM-DD HH24:00:00' : 'YYYY-MM-DD';

      const { data, error } = await this.supabase.rpc('get_sentiment_trend', {
        start_date: timeRange.from.toISOString(),
        end_date: timeRange.to.toISOString(),
        date_format: dateFormat,
      });

      if (error) {
        console.error('Error getting sentiment trend:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting sentiment trend:', error);
      return [];
    }
  }

  // Cleanup methods
  async cleanupOldEvents(retentionDays = 30): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

      const { data, error } = await this.supabase
        .from('monitoring_events')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) {
        console.error('Error cleaning up old events:', error);
        return 0;
      }

      const deletedCount = (data as any)?.length || 0;
      console.log(`🧹 Cleaned up ${deletedCount} old events (older than ${retentionDays} days)`);

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old events:', error);
      return 0;
    }
  }

  // Utility methods
  private convertStoredEventToMonitoringEvent(storedEvent: any): MonitoringEvent {
    return {
      ...storedEvent,
      timestamp: new Date(storedEvent.timestamp),
    };
  }

  private convertStoredAlertToCrisisAlert(storedAlert: any): CrisisAlert {
    return {
      ...storedAlert,
      created_at: new Date(storedAlert.created_at),
      updated_at: new Date(storedAlert.updated_at),
    };
  }

  // Force flush pending batches (useful for shutdown)
  async flush(): Promise<void> {
    if (this.batchQueue.length > 0) {
      await this.processBatch();
    }
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    try {
      const { error } = await this.supabase.from('monitoring_events').select('id').limit(1);

      return !error;
    } catch {
      return false;
    }
  }
}
