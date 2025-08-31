// Mentionlytics API Client - Social Sentiment Monitoring

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
  type MonitoringEvent,
  type MonitoringClient,
  type MonitoringConfig,
  type ServiceHealth,
} from '../types';
import { createHash } from 'crypto';

interface MentionlyticsConfig {
  apiToken: string;
  apiUrl: string;
  rateLimit?: {
    requestsPerMinute: number;
    burstLimit: number;
  };
}

interface MentionlyticsResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_more: boolean;
  };
  rate_limit: {
    remaining: number;
    reset: number;
    limit: number;
  };
}

interface MentionlyticsMention {
  id: string;
  title: string;
  snippet: string;
  url: string;
  date: string;
  source: {
    name: string;
    type: string; // 'twitter', 'facebook', 'instagram', 'news', 'blog', etc.
    domain?: string;
  };
  author: {
    name: string;
    handle?: string;
    followers?: number;
    verified?: boolean;
  };
  sentiment: {
    polarity: number; // -1 to 1
    label: string; // 'positive', 'negative', 'neutral'
    confidence: number; // 0 to 1
  };
  metrics: {
    reach?: number;
    engagement?: number;
    shares?: number;
    likes?: number;
    comments?: number;
    retweets?: number;
  };
  keywords: string[];
  language: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  influence_score?: number;
}

export class MentionlyticsClient implements MonitoringClient {
  readonly name = 'mentionlytics' as const;
  private client: AxiosInstance;
  private config: MentionlyticsConfig;
  private lastRequestTime = 0;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private healthMetrics: ServiceHealth;

  constructor(config: MentionlyticsConfig) {
    this.config = {
      rateLimit: {
        requestsPerMinute: 100, // Mentionlytics default
        burstLimit: 10,
      },
      ...config,
    };

    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WarRoom-Monitor/1.0',
      },
    });

    this.healthMetrics = {
      service: 'mentionlytics',
      status: 'healthy',
      last_successful_request: new Date(),
      rate_limit: {
        remaining: 100,
        reset_time: new Date(),
        limit: 100,
      },
      response_time_ms: 0,
      uptime_percentage: 100,
    };

    this.setupInterceptors();
    this.startQueueProcessor();
  }

  private setupInterceptors(): void {
    // Request interceptor for authentication
    this.client.interceptors.request.use((config) => {
      config.params = {
        ...config.params,
        token: this.config.apiToken,
      };
      return config;
    });

    // Response interceptor for rate limiting and health metrics
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        this.updateHealthMetrics(response);
        return response;
      },
      (error) => {
        this.handleError(error);
        throw error;
      },
    );
  }

  private updateHealthMetrics(response: AxiosResponse): void {
    this.healthMetrics.last_successful_request = new Date();
    this.healthMetrics.status = 'healthy';
    this.healthMetrics.response_time_ms = (response.config as any).metadata?.startTime
      ? Date.now() - (response.config as any).metadata.startTime
      : 0;

    // Update rate limit info from headers
    const rateLimit = response.data?.rate_limit;
    if (rateLimit) {
      this.healthMetrics.rate_limit = {
        remaining: rateLimit.remaining,
        reset_time: new Date(rateLimit.reset * 1000),
        limit: rateLimit.limit,
      };
    }
  }

  private handleError(error: any): void {
    this.healthMetrics.last_error = {
      message: error.message,
      timestamp: new Date(),
      code: error.response?.status?.toString(),
    };

    if (error.response?.status >= 500) {
      this.healthMetrics.status = 'down';
    } else if (error.response?.status === 429) {
      this.healthMetrics.status = 'degraded';
    }
  }

  private async rateLimit(): Promise<void> {
    const minInterval = 60000 / this.config.rateLimit!.requestsPerMinute; // ms between requests
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.requestQueue.length > 0 && !this.isProcessingQueue) {
        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
          const request = this.requestQueue.shift()!;
          try {
            await this.rateLimit();
            await request();
          } catch (error) {
            console.error('Queued request failed:', error);
          }
        }

        this.isProcessingQueue = false;
      }
    }, 1000);
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await this.client.get('/token', {
        params: {
          email: import.meta.env.MENTIONLYTICS_EMAIL,
          password: import.meta.env.MENTIONLYTICS_PASSWORD,
        },
      });

      if (response.data?.token) {
        this.config.apiToken = response.data.token;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Mentionlytics authentication failed:', error);
      return false;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Quick health check - get account info
      const response = await this.client.get('/account', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getServiceHealth(): Promise<ServiceHealth> {
    return { ...this.healthMetrics };
  }

  async fetchEvents(config: MonitoringConfig, since?: Date): Promise<MonitoringEvent[]> {
    try {
      const mentions = await this.fetchMentions(config, since);
      return mentions.map(mention => this.transformToMonitoringEvent(mention));
    } catch (error) {
      console.error('Error fetching Mentionlytics events:', error);
      throw error;
    }
  }

  private async fetchMentions(config: MonitoringConfig, since?: Date): Promise<MentionlyticsMention[]> {
    const allMentions: MentionlyticsMention[] = [];
    let page = 1;
    let hasMore = true;

    const params: any = {
      keywords: config.keywords.join(','),
      per_page: 50,
      sort: 'date',
      order: 'desc',
    };

    if (since) {
      params.date_from = since.toISOString().split('T')[0];
    }

    if (config.languages.length > 0) {
      params.languages = config.languages.join(',');
    }

    if (config.platforms.length > 0) {
      params.sources = config.platforms.join(',');
    }

    while (hasMore && page <= 10) { // Limit to 10 pages (500 mentions)
      try {
        await this.rateLimit();

        const response = await this.client.get<MentionlyticsResponse>('/mentions', {
          params: { ...params, page },
        });

        const mentions = response.data.data.map(item => this.parseMention(item));
        allMentions.push(...mentions);

        hasMore = response.data.meta.has_more && mentions.length > 0;
        page++;

      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        break;
      }
    }

    return allMentions;
  }

  private parseMention(data: any): MentionlyticsMention {
    return {
      id: data.id || this.generateMentionId(data),
      title: data.title || data.snippet?.substring(0, 100) || '',
      snippet: data.snippet || data.content || '',
      url: data.url || data.link || '',
      date: data.date || data.created_at || new Date().toISOString(),
      source: {
        name: data.source?.name || data.domain || 'unknown',
        type: this.mapSourceType(data.source?.type || data.channel),
        domain: data.source?.domain || data.domain,
      },
      author: {
        name: data.author?.name || data.author || 'Anonymous',
        handle: data.author?.handle || data.author?.username,
        followers: data.author?.followers || data.author?.followers_count,
        verified: data.author?.verified || false,
      },
      sentiment: {
        polarity: data.sentiment?.polarity || 0,
        label: this.mapSentimentLabel(data.sentiment?.label || data.polarity),
        confidence: data.sentiment?.confidence || data.sentiment_confidence || 0.5,
      },
      metrics: {
        reach: data.reach || data.potential_reach,
        engagement: data.engagement || data.total_engagement,
        shares: data.shares || data.share_count,
        likes: data.likes || data.like_count || data.favorite_count,
        comments: data.comments || data.comment_count || data.reply_count,
        retweets: data.retweets || data.retweet_count,
      },
      keywords: data.keywords || [],
      language: data.language || 'en',
      location: data.location ? {
        country: data.location.country,
        region: data.location.region,
        city: data.location.city,
      } : undefined,
      influence_score: data.influence_score || data.author?.influence_score,
    };
  }

  private generateMentionId(data: any): string {
    // Generate deterministic ID from content hash
    const content = `${data.url || ''}${data.snippet || ''}${data.date || ''}`;
    return createHash('md5').update(content).digest('hex');
  }

  private mapSourceType(sourceType: string): string {
    const typeMap: Record<string, string> = {
      'twitter': 'twitter',
      'facebook': 'facebook',
      'instagram': 'instagram',
      'youtube': 'youtube',
      'linkedin': 'linkedin',
      'reddit': 'reddit',
      'news': 'news',
      'blog': 'blog',
      'forum': 'forum',
      'review': 'review',
    };

    return typeMap[sourceType?.toLowerCase()] || 'social';
  }

  private mapSentimentLabel(label: string | number): 'positive' | 'negative' | 'neutral' {
    if (typeof label === 'number') {
      if (label > 0.1) {return 'positive';}
      if (label < -0.1) {return 'negative';}
      return 'neutral';
    }

    const labelLower = label?.toLowerCase() || '';
    if (labelLower.includes('pos')) {return 'positive';}
    if (labelLower.includes('neg')) {return 'negative';}
    return 'neutral';
  }

  private transformToMonitoringEvent(mention: MentionlyticsMention): MonitoringEvent {
    return {
      id: `mentionlytics_${mention.id}`,
      source: 'mentionlytics',
      type: this.mapToEventType(mention.source.type),
      timestamp: new Date(mention.date),
      title: mention.title,
      content: mention.snippet,
      url: mention.url,
      author: {
        name: mention.author.name,
        handle: mention.author.handle,
        followers: mention.author.followers,
        verified: mention.author.verified,
      },
      platform: mention.source.name,
      sentiment: {
        score: mention.sentiment.polarity,
        label: mention.sentiment.label as 'positive' | 'negative' | 'neutral',
        confidence: mention.sentiment.confidence,
      },
      metrics: {
        reach: mention.metrics.reach,
        engagement: mention.metrics.engagement,
        shares: mention.metrics.shares,
        likes: mention.metrics.likes,
        comments: mention.metrics.comments,
        views: mention.metrics.retweets, // Twitter-specific
      },
      keywords: mention.keywords,
      mentions: [], // Will be extracted from content
      language: mention.language,
      location: mention.location,
      influence_score: mention.influence_score,
      raw_data: mention,
    };
  }

  private mapToEventType(sourceType: string): MonitoringEvent['type'] {
    const typeMap: Record<string, MonitoringEvent['type']> = {
      'news': 'news',
      'blog': 'social',
      'forum': 'forum',
      'review': 'review',
    };

    return typeMap[sourceType] || 'social';
  }

  // Optional webhook setup (if Mentionlytics supports it)
  async setupWebhook(webhookUrl: string): Promise<boolean> {
    try {
      // TODO: Implement webhook setup if Mentionlytics API supports it
      console.log(`Webhook setup not yet implemented for Mentionlytics: ${webhookUrl}`);
      return false;
    } catch (error) {
      console.error('Failed to setup Mentionlytics webhook:', error);
      return false;
    }
  }

  async teardownWebhook(): Promise<boolean> {
    try {
      // TODO: Implement webhook teardown
      return true;
    } catch (error) {
      console.error('Failed to teardown Mentionlytics webhook:', error);
      return false;
    }
  }

  // Aggregation endpoint for summary data
  async getAggregation(config: MonitoringConfig, dateRange: { from: Date; to: Date }) {
    try {
      await this.rateLimit();

      const response = await this.client.get('/aggregation', {
        params: {
          keywords: config.keywords.join(','),
          date_from: dateRange.from.toISOString().split('T')[0],
          date_to: dateRange.to.toISOString().split('T')[0],
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Mentionlytics aggregation:', error);
      throw error;
    }
  }

  // Top mentioners endpoint
  async getTopMentioners(config: MonitoringConfig, limit = 10) {
    try {
      await this.rateLimit();

      const response = await this.client.get('/mentioners', {
        params: {
          keywords: config.keywords.join(','),
          limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching Mentionlytics top mentioners:', error);
      throw error;
    }
  }
}
