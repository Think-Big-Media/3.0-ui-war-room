/**
 * Alert Service with WebSocket Support
 * Real-time alert delivery and management
 */

import { type CrisisAlert, type MonitoringEvent } from './types';
// Mock Supabase client
const createClient = (url: string, key: string) => ({ /* mock */ });
// Use browser WebSocket
const WS = WebSocket;

interface AlertServiceConfig {
  supabaseUrl: string;
  supabaseKey: string;
  websocketUrl?: string;
  enableEmail?: boolean;
  enableSMS?: boolean;
  enableWebhook?: boolean;
}

interface AlertSubscriber {
  id: string;
  type: 'websocket' | 'email' | 'sms' | 'webhook';
  endpoint: string; // WebSocket connection, email, phone, or webhook URL
  filters?: {
    severity?: CrisisAlert['severity'][];
    types?: CrisisAlert['type'][];
    keywords?: string[];
  };
}

export class AlertService {
  private config: AlertServiceConfig;
  private supabase: any;
  private subscribers: Map<string, AlertSubscriber> = new Map();
  private websocketConnections: Map<string, WS> = new Map();
  private alertQueue: CrisisAlert[] = [];
  private processingQueue = false;

  constructor(config: AlertServiceConfig) {
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    this.initializeSupabase();
  }

  /**
   * Initialize Supabase tables and real-time subscriptions
   */
  private async initializeSupabase(): Promise<void> {
    // Subscribe to alert changes
    this.supabase
      .channel('alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'monitoring_alerts',
      }, (payload: any) => {
        this.handleNewAlert(payload.new as CrisisAlert);
      })
      .subscribe();

    // Subscribe to event changes
    this.supabase
      .channel('events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'monitoring_events',
      }, (payload: any) => {
        this.broadcastEvent(payload.new as MonitoringEvent);
      })
      .subscribe();
  }

  /**
   * Send alert to all subscribers
   */
  async sendAlert(alert: CrisisAlert): Promise<void> {
    // Save to database
    await this.saveAlertToDatabase(alert);

    // Add to queue for processing
    this.alertQueue.push(alert);

    // Process queue
    if (!this.processingQueue) {
      this.processAlertQueue();
    }
  }

  /**
   * Process alert queue
   */
  private async processAlertQueue(): Promise<void> {
    this.processingQueue = true;

    while (this.alertQueue.length > 0) {
      const alert = this.alertQueue.shift()!;

      // Send to all subscribers
      for (const subscriber of this.subscribers.values()) {
        if (this.shouldSendToSubscriber(alert, subscriber)) {
          try {
            await this.sendToSubscriber(alert, subscriber);
          } catch (error) {
            console.error(`Failed to send alert to subscriber ${subscriber.id}:`, error);
          }
        }
      }
    }

    this.processingQueue = false;
  }

  /**
   * Check if alert matches subscriber filters
   */
  private shouldSendToSubscriber(alert: CrisisAlert, subscriber: AlertSubscriber): boolean {
    if (!subscriber.filters) {return true;}

    // Check severity filter
    if (subscriber.filters.severity && !subscriber.filters.severity.includes(alert.severity)) {
      return false;
    }

    // Check type filter
    if (subscriber.filters.types && !subscriber.filters.types.includes(alert.type)) {
      return false;
    }

    // Check keyword filter
    if (subscriber.filters.keywords) {
      const hasKeyword = subscriber.filters.keywords.some(keyword =>
        alert.affected_keywords.some(ak => ak.toLowerCase().includes(keyword.toLowerCase())),
      );
      if (!hasKeyword) {return false;}
    }

    return true;
  }

  /**
   * Send alert to specific subscriber
   */
  private async sendToSubscriber(alert: CrisisAlert, subscriber: AlertSubscriber): Promise<void> {
    switch (subscriber.type) {
      case 'websocket':
        this.sendWebSocketAlert(alert, subscriber);
        break;
      case 'email':
        if (this.config.enableEmail) {
          await this.sendEmailAlert(alert, subscriber);
        }
        break;
      case 'sms':
        if (this.config.enableSMS) {
          await this.sendSMSAlert(alert, subscriber);
        }
        break;
      case 'webhook':
        if (this.config.enableWebhook) {
          await this.sendWebhookAlert(alert, subscriber);
        }
        break;
    }
  }

  /**
   * Send WebSocket alert
   */
  private sendWebSocketAlert(alert: CrisisAlert, subscriber: AlertSubscriber): void {
    const ws = this.websocketConnections.get(subscriber.id);
    if (ws && ws.readyState === WS.OPEN) {
      ws.send(JSON.stringify({
        type: 'alert',
        data: alert,
        timestamp: new Date().toISOString(),
      }));
    }
  }

  /**
   * Send email alert
   */
  private async sendEmailAlert(alert: CrisisAlert, subscriber: AlertSubscriber): Promise<void> {
    // Integration with email service (SendGrid, etc.)
    console.log(`Sending email alert to ${subscriber.endpoint}`);

    // Example implementation
    const emailData = {
      to: subscriber.endpoint,
      subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
      html: this.generateEmailHTML(alert),
    };

    // Call email service API
    // await sendEmail(emailData);
  }

  /**
   * Send SMS alert
   */
  private async sendSMSAlert(alert: CrisisAlert, subscriber: AlertSubscriber): Promise<void> {
    // Integration with SMS service (Twilio, etc.)
    console.log(`Sending SMS alert to ${subscriber.endpoint}`);

    const message = `[${alert.severity.toUpperCase()}] ${alert.title}\n${alert.description}\nReach: ${alert.estimated_reach.toLocaleString()}`;

    // Call SMS service API
    // await sendSMS(subscriber.endpoint, message);
  }

  /**
   * Send webhook alert
   */
  private async sendWebhookAlert(alert: CrisisAlert, subscriber: AlertSubscriber): Promise<void> {
    try {
      const response = await fetch(subscriber.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Alert-Type': 'crisis',
          'X-Alert-Severity': alert.severity,
        },
        body: JSON.stringify(alert),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
    } catch (error) {
      console.error(`Webhook delivery failed for ${subscriber.endpoint}:`, error);
    }
  }

  /**
   * Generate email HTML
   */
  private generateEmailHTML(alert: CrisisAlert): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${this.getSeverityColor(alert.severity)}; color: white; padding: 20px;">
          <h1 style="margin: 0;">${alert.title}</h1>
          <p style="margin: 5px 0;">Severity: ${alert.severity.toUpperCase()}</p>
        </div>
        <div style="padding: 20px; background-color: #f5f5f5;">
          <p><strong>Description:</strong> ${alert.description}</p>
          <p><strong>Detected at:</strong> ${alert.created_at.toLocaleString()}</p>
          <p><strong>Estimated Reach:</strong> ${alert.estimated_reach.toLocaleString()}</p>
          <p><strong>Affected Platforms:</strong> ${alert.affected_platforms.join(', ')}</p>
          <p><strong>Top Keywords:</strong> ${alert.affected_keywords.slice(0, 5).join(', ')}</p>
          <a href="${this.config.websocketUrl}/alerts/${alert.id}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Alert Details</a>
        </div>
      </div>
    `;
  }

  /**
   * Get severity color
   */
  private getSeverityColor(severity: CrisisAlert['severity']): string {
    const colors = {
      critical: '#dc3545',
      high: '#fd7e14',
      medium: '#ffc107',
      low: '#28a745',
    };
    return colors[severity];
  }

  /**
   * Save alert to database
   */
  private async saveAlertToDatabase(alert: CrisisAlert): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('monitoring_alerts')
        .insert([{
          ...alert,
          trigger_event_ids: JSON.stringify(alert.trigger_event_ids),
          trigger_conditions: JSON.stringify(alert.trigger_conditions),
          affected_keywords: JSON.stringify(alert.affected_keywords),
          affected_platforms: JSON.stringify(alert.affected_platforms),
          metadata: JSON.stringify(alert.metadata),
        }]);

      if (error) {throw error;}
    } catch (error) {
      console.error('Failed to save alert to database:', error);
    }
  }

  /**
   * Handle new alert from database
   */
  private handleNewAlert(alert: CrisisAlert): void {
    // Parse JSON fields
    alert.trigger_event_ids = JSON.parse(alert.trigger_event_ids as any);
    alert.trigger_conditions = JSON.parse(alert.trigger_conditions as any);
    alert.affected_keywords = JSON.parse(alert.affected_keywords as any);
    alert.affected_platforms = JSON.parse(alert.affected_platforms as any);
    alert.metadata = JSON.parse(alert.metadata as any);

    // Broadcast to WebSocket subscribers
    this.broadcastToWebSockets({
      type: 'alert',
      data: alert,
    });
  }

  /**
   * Broadcast event to WebSocket subscribers
   */
  private broadcastEvent(event: MonitoringEvent): void {
    this.broadcastToWebSockets({
      type: 'event',
      data: event,
    });
  }

  /**
   * Broadcast to all WebSocket connections
   */
  private broadcastToWebSockets(message: any): void {
    const messageStr = JSON.stringify({
      ...message,
      timestamp: new Date().toISOString(),
    });

    for (const [id, ws] of this.websocketConnections.entries()) {
      if (ws.readyState === WS.OPEN) {
        ws.send(messageStr);
      } else if (ws.readyState === WS.CLOSED) {
        // Clean up closed connections
        this.websocketConnections.delete(id);
        this.subscribers.delete(id);
      }
    }
  }

  /**
   * Subscribe to alerts
   */
  subscribe(subscriber: AlertSubscriber): string {
    const id = subscriber.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    subscriber.id = id;
    this.subscribers.set(id, subscriber);
    return id;
  }

  /**
   * Unsubscribe from alerts
   */
  unsubscribe(subscriberId: string): void {
    this.subscribers.delete(subscriberId);
    const ws = this.websocketConnections.get(subscriberId);
    if (ws) {
      ws.close();
      this.websocketConnections.delete(subscriberId);
    }
  }

  /**
   * Register WebSocket connection
   */
  registerWebSocket(subscriberId: string, ws: WS): void {
    this.websocketConnections.set(subscriberId, ws);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      subscriberId,
      timestamp: new Date().toISOString(),
    }));

    // Handle WebSocket events
    ws.on('close', () => {
      this.websocketConnections.delete(subscriberId);
    });

    ws.on('error', (error: any) => {
      console.error(`WebSocket error for ${subscriberId}:`, error);
    });
  }

  /**
   * Get alert statistics
   */
  async getAlertStats(timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<any> {
    const since = new Date();
    switch (timeframe) {
      case 'hour':
        since.setHours(since.getHours() - 1);
        break;
      case 'day':
        since.setDate(since.getDate() - 1);
        break;
      case 'week':
        since.setDate(since.getDate() - 7);
        break;
    }

    const { data, error } = await this.supabase
      .from('monitoring_alerts')
      .select('severity, type, created_at')
      .gte('created_at', since.toISOString());

    if (error) {throw error;}

    // Calculate statistics
    const stats = {
      total: data.length,
      bySeverity: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      timeline: [] as Array<{ time: string; count: number }>,
    };

    data.forEach((alert: any) => {
      // By severity
      stats.bySeverity[alert.severity] = (stats.bySeverity[alert.severity] || 0) + 1;

      // By type
      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
    });

    return stats;
  }
}

// Factory function
export function createAlertService(config: AlertServiceConfig): AlertService {
  return new AlertService(config);
}
