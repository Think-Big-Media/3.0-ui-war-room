// WebSocket Broadcaster - Real-time Event Broadcasting

import { EventEmitter } from 'events';
import WebSocket, { WebSocketServer } from 'ws';
import {
  type MonitoringEvent,
  type CrisisAlert,
  type PipelineMetrics,
} from './types';
import { createHash, randomBytes } from 'crypto';

interface ConnectedClient {
  id: string;
  socket: WebSocket;
  subscriptions: Set<string>;
  lastHeartbeat: Date;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    userId?: string;
    sessionId?: string;
  };
}

interface BroadcastMessage {
  type: 'event' | 'alert' | 'metric' | 'heartbeat' | 'alert_update';
  timestamp: Date;
  data: any;
  channel?: string;
}

interface BroadcastMetrics {
  connected_clients: number;
  messages_sent: number;
  bytes_transmitted: number;
  average_latency_ms: number;
  last_broadcast: Date;
  failed_sends: number;
}

export class WebSocketBroadcaster extends EventEmitter {
  private clients = new Map<string, ConnectedClient>();
  private server?: WebSocketServer;
  private metrics: BroadcastMetrics;
  private heartbeatInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;
  private isRunning = false;

  // Channel subscriptions for targeted broadcasting
  private channels = new Set<string>([
    'events.all',
    'events.crisis',
    'alerts.all',
    'alerts.critical',
    'metrics.pipeline',
    'health.services',
  ]);

  constructor(private port = 8080) {
    super();

    this.metrics = {
      connected_clients: 0,
      messages_sent: 0,
      bytes_transmitted: 0,
      average_latency_ms: 0,
      last_broadcast: new Date(),
      failed_sends: 0,
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) {return;}

    console.log(`📡 Starting WebSocket broadcaster on port ${this.port}...`);

    this.server = new WebSocketServer({
      port: this.port,
      perMessageDeflate: true, // Enable compression
      maxPayload: 16 * 1024 * 1024, // 16MB max message size
    });

    this.server.on('connection', this.handleConnection.bind(this));
    this.server.on('error', this.handleServerError.bind(this));

    // Start heartbeat and cleanup intervals
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000); // 30 seconds

    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleConnections();
    }, 60000); // 1 minute

    this.isRunning = true;
    console.log(`✅ WebSocket broadcaster started on port ${this.port}`);

    this.emit('started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {return;}

    console.log('🛑 Stopping WebSocket broadcaster...');

    this.isRunning = false;

    // Clear intervals
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Close all client connections
    for (const client of this.clients.values()) {
      client.socket.close(1000, 'Server shutting down');
    }
    this.clients.clear();

    // Close server
    if (this.server) {
      this.server.close();
    }

    console.log('✅ WebSocket broadcaster stopped');
    this.emit('stopped');
  }

  private handleConnection(socket: WebSocket, request: any): void {
    const clientId = this.generateClientId();
    const client: ConnectedClient = {
      id: clientId,
      socket,
      subscriptions: new Set(['events.all']), // Default subscription
      lastHeartbeat: new Date(),
      metadata: {
        userAgent: request.headers['user-agent'],
        ipAddress: request.socket.remoteAddress,
        sessionId: request.headers['x-session-id'],
      },
    };

    this.clients.set(clientId, client);
    this.metrics.connected_clients = this.clients.size;

    console.log(`🔗 Client connected: ${clientId} (${this.clients.size} total)`);

    // Setup event handlers
    socket.on('message', (data) => this.handleClientMessage(clientId, data));
    socket.on('close', () => this.handleClientDisconnect(clientId));
    socket.on('error', (error) => this.handleClientError(clientId, error));
    socket.on('pong', () => this.handlePong(clientId));

    // Send welcome message with available channels
    this.sendToClient(clientId, {
      type: 'heartbeat',
      timestamp: new Date(),
      data: {
        message: 'Connected to War Room monitoring',
        client_id: clientId,
        available_channels: Array.from(this.channels),
        current_subscriptions: Array.from(client.subscriptions),
      },
    });

    this.emit('client_connected', { clientId, metadata: client.metadata });
  }

  private handleClientMessage(clientId: string, data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString());
      const client = this.clients.get(clientId);

      if (!client) {return;}

      switch (message.type) {
        case 'subscribe':
          this.handleSubscription(clientId, message.channels);
          break;
        case 'unsubscribe':
          this.handleUnsubscription(clientId, message.channels);
          break;
        case 'heartbeat':
          client.lastHeartbeat = new Date();
          this.sendToClient(clientId, {
            type: 'heartbeat',
            timestamp: new Date(),
            data: { status: 'alive' },
          });
          break;
        case 'auth':
          this.handleAuthentication(clientId, message.token);
          break;
        default:
          console.warn(`Unknown message type from client ${clientId}: ${message.type}`);
      }
    } catch (error) {
      console.error(`Error parsing message from client ${clientId}:`, error);
    }
  }

  private handleSubscription(clientId: string, channels: string[]): void {
    const client = this.clients.get(clientId);
    if (!client) {return;}

    const validChannels = channels.filter(channel => this.channels.has(channel));
    validChannels.forEach(channel => client.subscriptions.add(channel));

    this.sendToClient(clientId, {
      type: 'heartbeat',
      timestamp: new Date(),
      data: {
        message: 'Subscription updated',
        subscriptions: Array.from(client.subscriptions),
      },
    });

    console.log(`Client ${clientId} subscribed to: ${validChannels.join(', ')}`);
  }

  private handleUnsubscription(clientId: string, channels: string[]): void {
    const client = this.clients.get(clientId);
    if (!client) {return;}

    channels.forEach(channel => client.subscriptions.delete(channel));

    this.sendToClient(clientId, {
      type: 'heartbeat',
      timestamp: new Date(),
      data: {
        message: 'Unsubscribed',
        subscriptions: Array.from(client.subscriptions),
      },
    });
  }

  private handleAuthentication(clientId: string, token: string): void {
    // TODO: Implement JWT token validation
    const client = this.clients.get(clientId);
    if (!client) {return;}

    // For now, just acknowledge
    client.metadata.userId = 'authenticated_user'; // Would extract from JWT

    this.sendToClient(clientId, {
      type: 'heartbeat',
      timestamp: new Date(),
      data: { message: 'Authenticated successfully' },
    });
  }

  private handleClientDisconnect(clientId: string): void {
    this.clients.delete(clientId);
    this.metrics.connected_clients = this.clients.size;

    console.log(`🔌 Client disconnected: ${clientId} (${this.clients.size} remaining)`);
    this.emit('client_disconnected', { clientId });
  }

  private handleClientError(clientId: string, error: Error): void {
    console.error(`WebSocket error for client ${clientId}:`, error);
    this.emit('client_error', { clientId, error });
  }

  private handlePong(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.lastHeartbeat = new Date();
    }
  }

  private handleServerError(error: Error): void {
    console.error('WebSocket server error:', error);
    this.emit('server_error', error);
  }

  // Broadcasting methods
  async broadcastEvents(events: MonitoringEvent[]): Promise<void> {
    if (!this.isRunning || events.length === 0) {return;}

    const startTime = Date.now();

    // Broadcast to general events channel
    await this.broadcastToChannel('events.all', {
      type: 'event',
      timestamp: new Date(),
      data: {
        events: events.map(event => ({
          id: event.id,
          source: event.source,
          type: event.type,
          title: event.title,
          platform: event.platform,
          sentiment: event.sentiment,
          timestamp: event.timestamp,
          metrics: event.metrics,
        })),
      },
    });

    // Check for crisis-level events and broadcast to crisis channel
    const crisisEvents = events.filter(event =>
      event.sentiment.score < -0.6 ||
      (event.metrics.reach || 0) > 50000,
    );

    if (crisisEvents.length > 0) {
      await this.broadcastToChannel('events.crisis', {
        type: 'event',
        timestamp: new Date(),
        data: {
          events: crisisEvents,
          crisis_level: 'high',
        },
      });
    }

    const latency = Date.now() - startTime;
    this.updateMetrics(events.length, latency);
  }

  async broadcastAlert(alert: CrisisAlert): Promise<void> {
    if (!this.isRunning) {return;}

    const startTime = Date.now();

    // Broadcast to all alerts channel
    await this.broadcastToChannel('alerts.all', {
      type: 'alert',
      timestamp: new Date(),
      data: { alert },
    });

    // Broadcast critical alerts to critical channel
    if (alert.severity === 'critical') {
      await this.broadcastToChannel('alerts.critical', {
        type: 'alert',
        timestamp: new Date(),
        data: {
          alert,
          urgency: 'immediate_attention_required',
        },
      });
    }

    const latency = Date.now() - startTime;
    this.updateMetrics(1, latency);

    console.log(`📡 Broadcasted ${alert.severity} alert: ${alert.title}`);
  }

  async broadcastAlertUpdate(alertId: string, status: string): Promise<void> {
    if (!this.isRunning) {return;}

    await this.broadcastToChannel('alerts.all', {
      type: 'alert_update',
      timestamp: new Date(),
      data: {
        alert_id: alertId,
        status,
        updated_at: new Date(),
      },
    });
  }

  async broadcastMetrics(metrics: PipelineMetrics): Promise<void> {
    if (!this.isRunning) {return;}

    await this.broadcastToChannel('metrics.pipeline', {
      type: 'metric',
      timestamp: new Date(),
      data: { metrics },
    });
  }

  async broadcastServiceHealth(serviceHealth: any): Promise<void> {
    if (!this.isRunning) {return;}

    await this.broadcastToChannel('health.services', {
      type: 'metric',
      timestamp: new Date(),
      data: { service_health: serviceHealth },
    });
  }

  private async broadcastToChannel(channel: string, message: BroadcastMessage): Promise<void> {
    const subscribedClients = Array.from(this.clients.values())
      .filter(client => client.subscriptions.has(channel));

    if (subscribedClients.length === 0) {return;}

    const messageData = JSON.stringify({
      ...message,
      channel,
      timestamp: message.timestamp.toISOString(),
    });

    const promises = subscribedClients.map(client =>
      this.sendToClientSocket(client, messageData),
    );

    const results = await Promise.allSettled(promises);

    // Count failed sends
    const failedSends = results.filter(result => result.status === 'rejected').length;
    if (failedSends > 0) {
      this.metrics.failed_sends += failedSends;
      console.warn(`Failed to send to ${failedSends} clients on channel ${channel}`);
    }
  }

  private async sendToClient(clientId: string, message: BroadcastMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) {return;}

    const messageData = JSON.stringify({
      ...message,
      timestamp: message.timestamp.toISOString(),
    });

    await this.sendToClientSocket(client, messageData);
  }

  private async sendToClientSocket(client: ConnectedClient, messageData: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (client.socket.readyState !== WebSocket.OPEN) {
        reject(new Error('Socket not open'));
        return;
      }

      client.socket.send(messageData, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private sendHeartbeat(): void {
    const heartbeatMessage = {
      type: 'heartbeat',
      timestamp: new Date(),
      data: {
        server_time: new Date().toISOString(),
        connected_clients: this.clients.size,
        // Avoid direct process usage in browser builds; this runs server-side only
        uptime: 0, // Browser doesn't have process.uptime
      },
    };

    // Send ping to all clients
    for (const client of this.clients.values()) {
      if (client.socket.readyState === WebSocket.OPEN) {
        client.socket.ping();
      }
    }
  }

  private cleanupStaleConnections(): void {
    const staleThreshold = 5 * 60 * 1000; // 5 minutes
    const now = new Date();
    const staleClients: string[] = [];

    for (const [clientId, client] of this.clients.entries()) {
      const timeSinceHeartbeat = now.getTime() - client.lastHeartbeat.getTime();

      if (timeSinceHeartbeat > staleThreshold ||
          client.socket.readyState === WebSocket.CLOSED) {
        staleClients.push(clientId);
      }
    }

    // Remove stale clients
    staleClients.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client) {
        client.socket.terminate();
        this.clients.delete(clientId);
      }
    });

    if (staleClients.length > 0) {
      this.metrics.connected_clients = this.clients.size;
      console.log(`🧹 Cleaned up ${staleClients.length} stale connections`);
    }
  }

  private updateMetrics(messageCount: number, latency: number): void {
    this.metrics.messages_sent += messageCount;
    this.metrics.bytes_transmitted += messageCount * 1024; // Rough estimate
    this.metrics.average_latency_ms =
      (this.metrics.average_latency_ms + latency) / 2;
    this.metrics.last_broadcast = new Date();
  }

  private generateClientId(): string {
    return `client_${randomBytes(8).toString('hex')}`;
  }

  // Public API methods
  getMetrics(): BroadcastMetrics {
    return { ...this.metrics };
  }

  getConnectedClients(): number {
    return this.clients.size;
  }

  getClientSubscriptions(clientId: string): string[] {
    const client = this.clients.get(clientId);
    return client ? Array.from(client.subscriptions) : [];
  }

  disconnectClient(clientId: string, reason = 'Server request'): boolean {
    const client = this.clients.get(clientId);
    if (!client) {return false;}

    client.socket.close(1000, reason);
    return true;
  }

  // Channel management
  addChannel(channel: string): void {
    this.channels.add(channel);
    console.log(`➕ Added broadcast channel: ${channel}`);
  }

  removeChannel(channel: string): void {
    this.channels.delete(channel);

    // Remove subscriptions to this channel from all clients
    for (const client of this.clients.values()) {
      client.subscriptions.delete(channel);
    }

    console.log(`➖ Removed broadcast channel: ${channel}`);
  }

  getAvailableChannels(): string[] {
    return Array.from(this.channels);
  }

  // Emergency broadcast (bypasses subscriptions)
  async emergencyBroadcast(message: any): Promise<void> {
    if (!this.isRunning) {return;}

    const emergencyMessage = {
      type: 'alert',
      timestamp: new Date(),
      data: {
        emergency: true,
        ...message,
      },
      channel: 'emergency',
    };

    const messageData = JSON.stringify(emergencyMessage);

    // Send to all connected clients regardless of subscriptions
    const promises = Array.from(this.clients.values()).map(client =>
      this.sendToClientSocket(client, messageData),
    );

    await Promise.allSettled(promises);

    console.log(`🚨 EMERGENCY BROADCAST sent to ${this.clients.size} clients`);
  }

  isHealthy(): boolean {
    return this.isRunning && this.server !== undefined;
  }
}
