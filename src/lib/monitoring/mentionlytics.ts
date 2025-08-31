/**
 * Mentionlytics Service Implementation
 * Real-time social media and web monitoring
 */

import { type MonitoringClient, type MonitoringEvent, type ServiceHealth, type MonitoringConfig } from './types';

interface MentionlyticsConfig {
  apiKey: string;
  projectId: string;
  baseUrl?: string;
}

interface MentionlyticsResponse {
  mentions: Array<{
    id: string;
    type: string;
    created_at: string;
    url: string;
    title: string;
    text: string;
    author: string;
    author_url?: string;
    source: string;
    sentiment: {
      score: number;
      label: string;
    };
    reach?: number;
    engagement?: {
      likes?: number;
      shares?: number;
      comments?: number;
    };
    location?: {
      country?: string;
      city?: string;
    };
    language: string;
  }>;
  meta: {
    total: number;
    page: number;
    per_page: number;
  };
}

export class MentionlyticsClient implements MonitoringClient {
  name = 'mentionlytics' as const;
  private config: MentionlyticsConfig;
  private baseUrl: string;
  private lastRequestTime = 0;
  private requestCount = 0;
  private rateLimitReset = Date.now();

  constructor(config: MentionlyticsConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.mentionlytics.com/v1';
  }

  async isHealthy(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/health');
      return response.ok;
    } catch {
      return false;
    }
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/auth/verify');
      return response.ok;
    } catch {
      return false;
    }
  }

  async fetchEvents(config: MonitoringConfig, since?: Date): Promise<MonitoringEvent[]> {
    const params = new URLSearchParams({
      project_id: this.config.projectId,
      keywords: config.keywords.join(','),
      languages: config.languages.join(','),
      platforms: config.platforms.join(','),
      since: since ? since.toISOString() : new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      limit: '100',
    });

    if (config.filters.exclude_keywords?.length) {
      params.append('exclude', config.filters.exclude_keywords.join(','));
    }

    const response = await this.makeRequest(`/mentions?${params}`);
    const data: MentionlyticsResponse = await response.json();

    return data.mentions.map(mention => this.transformMention(mention));
  }

  async getServiceHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    let status: ServiceHealth['status'] = 'healthy';
    let lastError;

    try {
      await this.authenticate();
    } catch (error) {
      status = 'down';
      lastError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }

    return {
      service: 'mentionlytics',
      status,
      last_successful_request: new Date(this.lastRequestTime),
      last_error: lastError,
      rate_limit: {
        remaining: Math.max(0, 1000 - this.requestCount),
        reset_time: new Date(this.rateLimitReset),
        limit: 1000,
      },
      response_time_ms: Date.now() - startTime,
      uptime_percentage: status === 'healthy' ? 99.9 : 0,
    };
  }

  async setupWebhook(url: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('/webhooks', {
        method: 'POST',
        body: JSON.stringify({
          url,
          events: ['new_mention', 'sentiment_change'],
          project_id: this.config.projectId,
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    // Rate limiting
    if (this.requestCount >= 1000 && Date.now() < this.rateLimitReset) {
      throw new Error('Rate limit exceeded');
    }

    if (Date.now() >= this.rateLimitReset) {
      this.requestCount = 0;
      this.rateLimitReset = Date.now() + 60 * 60 * 1000; // 1 hour
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    this.requestCount++;
    this.lastRequestTime = Date.now();

    if (!response.ok) {
      throw new Error(`Mentionlytics API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  private transformMention(mention: any): MonitoringEvent {
    const sentimentScore = mention.sentiment?.score || 0;

    return {
      id: `mentionlytics_${mention.id}`,
      source: 'mentionlytics',
      type: this.detectType(mention.source),
      timestamp: new Date(mention.created_at),
      title: mention.title || mention.text.substring(0, 100),
      content: mention.text,
      url: mention.url,
      author: {
        name: mention.author,
        handle: mention.author_url?.split('/').pop(),
        followers: mention.reach,
      },
      platform: mention.source.toLowerCase(),
      sentiment: {
        score: sentimentScore,
        label: this.getSentimentLabel(sentimentScore),
        confidence: Math.abs(sentimentScore),
      },
      metrics: {
        reach: mention.reach || 0,
        engagement: this.calculateEngagement(mention.engagement),
        likes: mention.engagement?.likes,
        shares: mention.engagement?.shares,
        comments: mention.engagement?.comments,
      },
      keywords: this.extractKeywords(mention.text),
      mentions: this.extractMentions(mention.text),
      language: mention.language,
      location: mention.location,
      influence_score: this.calculateInfluence(mention),
      raw_data: mention,
    };
  }

  private detectType(source: string): MonitoringEvent['type'] {
    const lowerSource = source.toLowerCase();
    if (['twitter', 'facebook', 'instagram', 'tiktok'].includes(lowerSource)) {
      return 'social';
    }
    if (['bbc', 'cnn', 'reuters'].some(news => lowerSource.includes(news))) {
      return 'news';
    }
    if (lowerSource.includes('review')) {
      return 'review';
    }
    if (['reddit', 'forum'].some(forum => lowerSource.includes(forum))) {
      return 'forum';
    }
    return 'mention';
  }

  private getSentimentLabel(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.3) {return 'positive';}
    if (score < -0.3) {return 'negative';}
    return 'neutral';
  }

  private calculateEngagement(engagement?: any): number {
    if (!engagement) {return 0;}
    return (engagement.likes || 0) + (engagement.shares || 0) + (engagement.comments || 0);
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - in production, use NLP
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were'];
    return words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 10);
  }

  private extractMentions(text: string): string[] {
    const mentions = text.match(/@\w+/g) || [];
    const hashtags = text.match(/#\w+/g) || [];
    return [...mentions, ...hashtags];
  }

  private calculateInfluence(mention: any): number {
    const reach = mention.reach || 0;
    const engagement = this.calculateEngagement(mention.engagement);
    const reachScore = Math.min(reach / 10000, 1) * 50;
    const engagementScore = Math.min(engagement / 1000, 1) * 50;
    return Math.round(reachScore + engagementScore);
  }
}

// Factory function
export function createMentionlyticsClient(apiKey: string, projectId: string): MentionlyticsClient {
  return new MentionlyticsClient({ apiKey, projectId });
}
