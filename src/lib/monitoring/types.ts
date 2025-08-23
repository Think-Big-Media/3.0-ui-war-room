// Unified Monitoring Pipeline Types

export interface MonitoringEvent {
  id: string;
  source: 'mentionlytics';
  type: 'mention' | 'news' | 'social' | 'review' | 'forum';
  timestamp: Date;
  title: string;
  content: string;
  url: string;
  author: {
    name: string;
    handle?: string;
    followers?: number;
    verified?: boolean;
  };
  platform: string; // 'twitter', 'facebook', 'instagram', 'news', 'blog', etc.
  sentiment: {
    score: number; // -1 to 1
    label: 'positive' | 'negative' | 'neutral';
    confidence: number; // 0 to 1
    emotion?: 'joy' | 'anger' | 'fear' | 'sadness' | 'surprise' | 'disgust';
  };
  metrics: {
    reach?: number;
    engagement?: number;
    shares?: number;
    likes?: number;
    comments?: number;
    views?: number;
  };
  keywords: string[];
  mentions: string[]; // mentioned brands/entities
  language: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  influence_score?: number; // 0-100
  is_duplicate?: boolean;
  duplicate_of?: string; // ID of original event
  raw_data: any; // Original API response
}

export interface CrisisAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'volume_spike' | 'sentiment_drop' | 'negative_trend' | 'viral_negative';
  title: string;
  description: string;
  trigger_event_ids: string[];
  trigger_conditions: {
    mentions_per_hour?: number;
    sentiment_threshold?: number;
    reach_threshold?: number;
    duration_minutes?: number;
  };
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  assignee?: string;
  escalated: boolean;
  acknowledged?: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  affected_keywords: string[];
  affected_platforms: string[];
  estimated_reach: number;
  metadata: {
    peak_mentions_hour?: number;
    lowest_sentiment?: number;
    top_negative_posts?: string[];
    geographic_spread?: string[];
  };
}

export interface CrisisThresholds {
  velocityMultiplier: number;
  sentimentThreshold: number;
  minimumMentions: number;
  keywords: string[];
  excludeKeywords: string[];
  duration_minutes?: number;
}

export interface MonitoringConfig {
  keywords: string[];
  competitors?: string[];
  languages: string[];
  platforms: string[];
  filters: {
    exclude_keywords?: string[];
    min_followers?: number;
    min_reach?: number;
    min_engagement?: number;
    sentiment_threshold?: {
      positive: number;
      negative: number;
    };
  };
  crisis_thresholds: {
    mentions_per_hour: number;
    sentiment_threshold: number;
    reach_multiplier: number;
    duration_minutes: number;
  };
  alert_settings: {
    email_recipients: string[];
    slack_webhook?: string;
    sms_numbers?: string[];
    escalation_delay_minutes: number;
  };
  deduplication: {
    enabled: boolean;
    time_window_minutes: number;
    similarity_threshold: number;
  };
}

export interface ServiceHealth {
  service: 'mentionlytics';
  status: 'healthy' | 'degraded' | 'down';
  last_successful_request: Date;
  last_error?: {
    message: string;
    timestamp: Date;
    code?: string;
  };
  rate_limit: {
    remaining: number;
    reset_time: Date;
    limit: number;
  };
  response_time_ms: number;
  uptime_percentage: number;
}

export interface PipelineMetrics {
  events_processed_total: number;
  events_per_minute: number;
  alerts_generated: number;
  processing_latency_ms: number;
  service_health: ServiceHealth[];
  duplicate_events_filtered: number;
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  platform_distribution: Record<string, number>;
  last_updated: Date;
}

export interface MonitoringClient {
  name: 'mentionlytics';
  isHealthy(): Promise<boolean>;
  authenticate(): Promise<boolean>;
  fetchEvents(config: MonitoringConfig, since?: Date): Promise<MonitoringEvent[]>;
  getServiceHealth(): Promise<ServiceHealth>;
  setupWebhook?(url: string): Promise<boolean>;
  teardownWebhook?(): Promise<boolean>;
}

export interface WebhookPayload {
  service: 'mentionlytics';
  event_type: 'new_mention' | 'alert' | 'health_check';
  timestamp: Date;
  data: MonitoringEvent | CrisisAlert | ServiceHealth;
  signature?: string; // HMAC signature for verification
}

export interface EventFilter {
  apply(event: MonitoringEvent): boolean;
  describe(): string;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: (events: MonitoringEvent[], timeWindow: number) => boolean;
  severity: CrisisAlert['severity'];
  type: CrisisAlert['type'];
  cooldown_minutes: number;
  enabled: boolean;
}

export interface DeduplicationResult {
  is_duplicate: boolean;
  original_event_id?: string;
  similarity_score?: number;
  reason?: string;
}

export interface SentimentWeights {
  mentionlytics: number;
}
