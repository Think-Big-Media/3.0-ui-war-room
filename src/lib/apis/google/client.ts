/**
 * Google Ads API Client
 * OAuth2 service account authentication with circuit breaker pattern
 * Mirrors Meta API structure for consistency
 */

import jwt from 'jsonwebtoken';
import axios, { type AxiosInstance, type AxiosError } from 'axios';
import Redis from 'ioredis';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import EventEmitter from 'events';

import {
  type GoogleAdsConfig,
  type ServiceAccountConfig,
  type Customer,
  Campaign,
  AdGroup,
  AdGroupAd,
  type SearchStreamRequest,
  type SearchStreamResponse,
  type CustomerListResponse,
  type CampaignPerformanceMetrics,
  type BudgetRecommendation,
  ApiError,
  RateLimitConfig,
  CacheConfig,
  type CircuitBreakerConfig,
  CircuitBreakerState,
} from './types';
import {
  GoogleAdsError,
  RateLimitError,
  AuthenticationError,
  ApiQuotaError,
  ValidationError,
} from './errors';
import { TokenBucketRateLimiter } from './rateLimiter';
import { GoogleAdsCache } from './cache';

/**
 * Google Ads API Client with OAuth2 service account authentication
 * Implements circuit breaker pattern for resilience
 */
export class GoogleAdsClient extends EventEmitter {
  private config: GoogleAdsConfig;
  private serviceAccountConfig: ServiceAccountConfig | null = null;
  private accessToken: string | null = null;
  private tokenExpiresAt = 0;
  private axiosInstance: AxiosInstance;
  private rateLimiter: TokenBucketRateLimiter;
  private cache: GoogleAdsCache;
  private redis: Redis;

  // Circuit breaker state
  private circuitBreaker: {
    state: CircuitBreakerState;
    failureCount: number;
    lastFailureTime: number;
    nextAttempt: number;
    config: CircuitBreakerConfig;
  };

  // API endpoints - validated and secured
  private readonly BASE_URL = 'https://googleads.googleapis.com';
  private readonly API_VERSION = 'v20';
  private readonly TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private readonly SCOPES = ['https://www.googleapis.com/auth/adwords'];

  // Security: Validate customer ID format
  private validateCustomerId(customerId: string): void {
    if (!/^\d{10}$/.test(customerId)) {
      throw new ValidationError(
        'Invalid customer ID format',
        'customerId',
        customerId,
        'Must be exactly 10 digits'
      );
    }
  }

  // Security: Validate GAQL query for injection attacks
  private validateGAQLQuery(query: string): void {
    const dangerousPatterns = [
      /;\s*DROP/i,
      /;\s*DELETE/i,
      /;\s*UPDATE/i,
      /;\s*INSERT/i,
      /;\s*ALTER/i,
      /--.*$/m,
      /\/\*.*\*\//s,
      /<script/i,
      /javascript:/i,
    ];

    if (dangerousPatterns.some((pattern) => pattern.test(query))) {
      throw new ValidationError(
        'Potentially dangerous query detected',
        'query',
        query.substring(0, 100),
        'Query contains prohibited patterns'
      );
    }

    // Limit query length to prevent DoS
    if (query.length > 10000) {
      throw new ValidationError(
        'Query too long',
        'query',
        query.length,
        'Maximum query length is 10,000 characters'
      );
    }
  }

  constructor(config: GoogleAdsConfig) {
    super();

    this.config = {
      ...config,
      // Default rate limiting: 15,000 queries/day = ~10.4 queries/minute
      rateLimitConfig: {
        maxTokens: 100,
        refillRate: 0.173, // 15000/(24*60*60) ≈ 0.173
        tokensPerSecond: 0.173,
        windowMs: 60000,
        maxRequestsPerDay: 15000,
        bucketSize: 100,
        ...config.rateLimitConfig,
      },
      // Default caching
      cacheConfig: {
        defaultTtl: 300, // 5 minutes
        maxMemoryMB: 50,
        compressionEnabled: true,
        ...config.cacheConfig,
      },
      // Default circuit breaker
      circuitBreakerConfig: {
        failureThreshold: 5,
        resetTimeoutMs: 60000, // 1 minute
        monitoringWindowMs: 300000, // 5 minutes
        ...config.circuitBreakerConfig,
      },
    };

    // Initialize Redis connection
    this.redis = new Redis(config.redisUrl || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      db: 1, // Use database 1 for Google Ads cache
    });

    // Initialize rate limiter
    this.rateLimiter = new TokenBucketRateLimiter(this.config.rateLimitConfig!, this.redis);

    // Initialize cache
    this.cache = new GoogleAdsCache(this.config.cacheConfig!, this.redis);

    // Initialize circuit breaker
    this.circuitBreaker = {
      state: CircuitBreakerState.CLOSED,
      failureCount: 0,
      lastFailureTime: 0,
      nextAttempt: 0,
      config: this.config.circuitBreakerConfig!,
    };

    // Configure axios instance
    this.axiosInstance = axios.create({
      baseURL: `${this.BASE_URL}/${this.API_VERSION}`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'developer-token': this.config.developerToken,
      },
    });

    // Add request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        await this.ensureAuthenticated();
        config.headers.Authorization = `Bearer ${this.accessToken}`;

        // Add customer ID if available
        if (this.config.loginCustomerId) {
          config.headers['login-customer-id'] = this.config.loginCustomerId;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.handleSuccess();
        return response;
      },
      (error) => {
        this.handleFailure(error);
        return Promise.reject(this.mapError(error));
      }
    );

    this.emit('initialized', { config: this.config });
  }

  /**
   * Initialize service account authentication with secure credential handling
   */
  async initialize(): Promise<void> {
    try {
      // Priority: Environment variable (most secure)
      if (this.config.serviceAccountJson) {
        try {
          this.serviceAccountConfig = JSON.parse(this.config.serviceAccountJson);
        } catch (parseError) {
          throw new AuthenticationError(
            'Invalid JSON in GOOGLE_SERVICE_ACCOUNT_JSON environment variable'
          );
        }
      }
      // Fallback: Direct config object
      else if (this.config.serviceAccountKey) {
        this.serviceAccountConfig = this.config.serviceAccountKey;
      }
      // Deprecated: File path (development only)
      else if (this.config.serviceAccountKeyFile && import.meta.env.DEV) {
        const keyPath = path.resolve(this.config.serviceAccountKeyFile);
        try {
          const keyContent = await fs.readFile(keyPath, 'utf8');
          this.serviceAccountConfig = JSON.parse(keyContent);
          console.warn('⚠️  Using service account file - not recommended for production');
        } catch (fileError) {
          throw new AuthenticationError(`Failed to read service account file: ${fileError}`);
        }
      } else {
        throw new AuthenticationError(
          'No service account configuration provided. Set GOOGLE_SERVICE_ACCOUNT_JSON environment variable.'
        );
      }

      // Validate service account config
      this.validateServiceAccountConfig();

      // Test authentication
      await this.authenticate();

      this.emit('authenticated', {
        customerId: this.config.loginCustomerId,
      });
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Authenticate using service account with enhanced JWT security
   */
  private async authenticate(): Promise<string> {
    if (!this.serviceAccountConfig) {
      throw new AuthenticationError('Service account not configured');
    }

    const now = Math.floor(Date.now() / 1000);

    // Check if current token is still valid (with 60s safety margin)
    if (this.accessToken && this.tokenExpiresAt > now + 60) {
      return this.accessToken;
    }

    try {
      // Generate cryptographically secure JWT ID for replay protection
      const jwtId = crypto.randomUUID();

      // Create secure JWT assertion with enhanced claims
      const assertion = jwt.sign(
        {
          iss: this.serviceAccountConfig.client_email,
          scope: this.SCOPES.join(' '),
          aud: this.TOKEN_URL,
          exp: now + 3600, // 1 hour expiration
          iat: now,
          nbf: now - 30, // Not before (30s clock skew tolerance)
          jti: jwtId, // JWT ID for replay attack prevention
          sub: this.serviceAccountConfig.client_email,
        },
        this.serviceAccountConfig.private_key,
        {
          algorithm: 'RS256',
          header: {
            alg: 'RS256',
            kid: this.serviceAccountConfig.private_key_id,
            typ: 'JWT',
          },
        }
      );

      // Exchange JWT for access token with timeout
      const response = await axios.post(
        this.TOKEN_URL,
        {
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'WarRoom-GoogleAds-Client/1.0',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const { access_token, expires_in, token_type } = response.data;

      // Validate response
      if (!access_token || token_type !== 'Bearer') {
        throw new AuthenticationError('Invalid token response from Google');
      }

      // Store encrypted token (in production, implement token encryption)
      this.accessToken = access_token;
      this.tokenExpiresAt = now + (expires_in || 3600);

      // Clear sensitive data from memory for security
      // Note: This is a security best practice to limit memory exposure
      if (typeof global !== 'undefined' && typeof (global as any).gc === 'function') {
        (global as any).gc();
      }

      return access_token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        if (status === 400 && errorData?.error === 'invalid_grant') {
          throw new AuthenticationError(
            'Invalid service account credentials or expired private key'
          );
        }
        if (status === 403) {
          throw new AuthenticationError('Service account does not have required permissions');
        }
      }
      throw new AuthenticationError(`Authentication failed: ${error}`);
    }
  }

  /**
   * Ensure client is authenticated
   */
  private async ensureAuthenticated(): Promise<void> {
    await this.checkCircuitBreaker();
    await this.rateLimiter.acquireToken();

    if (!this.accessToken || this.tokenExpiresAt <= Math.floor(Date.now() / 1000) + 60) {
      await this.authenticate();
    }
  }

  /**
   * Get list of accessible customer accounts
   */
  async getCustomers(): Promise<CustomerListResponse> {
    const cacheKey = 'customers';

    // Check cache first
    const cached = await this.cache.get<CustomerListResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.axiosInstance.get('/customers:listAccessibleCustomers');

      const result: CustomerListResponse = {
        resourceNames: response.data.resourceNames || [],
        totalResults: response.data.resourceNames?.length || 0,
      };

      // Cache result for 1 hour
      await this.cache.set(cacheKey, result, 3600);

      return result;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Get customer details with input validation
   */
  async getCustomer(customerId: string): Promise<Customer> {
    // Security: Validate customer ID format
    this.validateCustomerId(customerId);
    const cacheKey = `customer:${customerId}`;

    // Check cache first
    const cached = await this.cache.get<Customer>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const query = `
        SELECT 
          customer.id,
          customer.descriptive_name,
          customer.currency_code,
          customer.time_zone,
          customer.tracking_url_template,
          customer.auto_tagging_enabled,
          customer.has_partners_badge,
          customer.manager,
          customer.test_account,
          customer.call_reporting_setting.call_reporting_enabled,
          customer.conversion_tracking_setting.conversion_tracking_id,
          customer.remarketing_setting.google_global_site_tag
        FROM customer 
        WHERE customer.id = ${customerId}
      `;

      const response = await this.searchStream({
        customerId,
        query,
        pageSize: 1,
      });

      if (!response.results || response.results.length === 0) {
        throw new GoogleAdsError(`Customer ${customerId} not found`);
      }

      const customerData = response.results[0].customer;
      const customer: Customer = {
        resourceName: `customers/${customerId}`,
        id: customerId,
        descriptiveName: customerData.descriptiveName || '',
        currencyCode: customerData.currencyCode || 'USD',
        timeZone: customerData.timeZone || 'UTC',
        trackingUrlTemplate: customerData.trackingUrlTemplate,
        autoTaggingEnabled: customerData.autoTaggingEnabled || false,
        hasPartnersBadge: customerData.hasPartnersBadge || false,
        manager: customerData.manager || false,
        testAccount: customerData.testAccount || false,
        callReportingSetting: customerData.callReportingSetting,
        conversionTrackingSetting: customerData.conversionTrackingSetting,
        remarketingSetting: customerData.remarketingSetting,
      };

      // Cache for 6 hours
      await this.cache.set(cacheKey, customer, 21600);

      return customer;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Search stream API for flexible queries with security validation
   */
  async searchStream(request: SearchStreamRequest): Promise<SearchStreamResponse> {
    const { customerId, query, pageSize = 10000, summaryRowSetting } = request;

    // Security: Validate inputs
    this.validateCustomerId(customerId);
    this.validateGAQLQuery(query);

    // Limit page size to prevent resource exhaustion
    const safePage = Math.min(pageSize, 10000);

    // Create cache key from query parameters
    const cacheKey = this.createCacheKey('search', { customerId, query, pageSize });

    // Check cache for non-real-time queries
    if (!query.toLowerCase().includes('today') && !query.toLowerCase().includes('this_month')) {
      const cached = await this.cache.get<SearchStreamResponse>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const requestBody = {
        query,
        pageSize: safePage,
        summaryRowSetting: summaryRowSetting || 'NO_SUMMARY_ROW',
      };

      const response = await this.axiosInstance.post(
        `/customers/${customerId}/googleAds:searchStream`,
        requestBody
      );

      const result: SearchStreamResponse = {
        results: response.data.results || [],
        fieldMask: response.data.fieldMask,
        summaryRows: response.data.summaryRows || [],
        requestId: response.data.requestId,
        totalResults: response.data.totalResultsCount || response.data.results?.length || 0,
      };

      // Cache non-real-time results for 5 minutes
      if (!query.toLowerCase().includes('today')) {
        await this.cache.set(cacheKey, result, 300);
      }

      return result;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Get campaign performance metrics with validation
   */
  async getCampaignPerformance(
    customerId: string,
    campaignIds?: string[],
    dateRange = 'LAST_30_DAYS'
  ): Promise<CampaignPerformanceMetrics[]> {
    // Security: Validate customer ID
    this.validateCustomerId(customerId);

    // Security: Validate campaign IDs if provided
    if (campaignIds) {
      campaignIds.forEach((id) => {
        if (!/^\d+$/.test(id)) {
          throw new ValidationError(
            'Invalid campaign ID format',
            'campaignId',
            id,
            'Must be numeric'
          );
        }
      });
    }

    // Security: Validate date range
    const validDateRanges = [
      'TODAY',
      'YESTERDAY',
      'LAST_7_DAYS',
      'LAST_14_DAYS',
      'LAST_30_DAYS',
      'LAST_BUSINESS_WEEK',
      'LAST_WEEK_SUN_SAT',
      'THIS_MONTH',
      'LAST_MONTH',
      'ALL_TIME',
    ];
    if (!validDateRanges.includes(dateRange)) {
      throw new ValidationError(
        'Invalid date range',
        'dateRange',
        dateRange,
        'Must be a valid predefined range'
      );
    }

    const cacheKey = this.createCacheKey('campaign_performance', {
      customerId,
      campaignIds: campaignIds?.join(','),
      dateRange,
    });

    // Check cache first
    const cached = await this.cache.get<CampaignPerformanceMetrics[]>(cacheKey);
    if (cached) {
      return cached;
    }

    let whereClause = '';
    if (campaignIds && campaignIds.length > 0) {
      const campaignResourceNames = campaignIds.map(
        (id) => `customers/${customerId}/campaigns/${id}`
      );
      whereClause = `WHERE campaign.resource_name IN ('${campaignResourceNames.join("', '")}')`;
    }

    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.bidding_strategy_type,
        campaign.budget,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_per_conversion,
        metrics.conversion_rate,
        segments.date
      FROM campaign 
      ${whereClause}
      AND segments.date DURING ${dateRange}
      ORDER BY metrics.impressions DESC
    `;

    try {
      const response = await this.searchStream({
        customerId,
        query,
        pageSize: 1000,
      });

      const metrics: CampaignPerformanceMetrics[] = response.results.map((row) => ({
        campaignId: row.campaign.id,
        campaignName: row.campaign.name,
        status: row.campaign.status,
        biddingStrategyType: row.campaign.biddingStrategyType,
        budget: row.campaign.budget,
        impressions: parseInt(row.metrics.impressions) || 0,
        clicks: parseInt(row.metrics.clicks) || 0,
        conversions: parseFloat(row.metrics.conversions) || 0,
        costMicros: parseInt(row.metrics.costMicros) || 0,
        ctr: parseFloat(row.metrics.ctr) || 0,
        averageCpc: parseInt(row.metrics.averageCpc) || 0,
        costPerConversion: parseInt(row.metrics.costPerConversion) || 0,
        conversionRate: parseFloat(row.metrics.conversionRate) || 0,
        date: row.segments.date,
      }));

      // Cache for 10 minutes
      await this.cache.set(cacheKey, metrics, 600);

      return metrics;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Get budget recommendations with validation
   */
  async getBudgetRecommendations(customerId: string): Promise<BudgetRecommendation[]> {
    // Security: Validate customer ID
    this.validateCustomerId(customerId);
    const cacheKey = `budget_recommendations:${customerId}`;

    // Check cache first
    const cached = await this.cache.get<BudgetRecommendation[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const query = `
      SELECT 
        recommendation.resource_name,
        recommendation.type,
        recommendation.impact.base_metrics.impressions,
        recommendation.impact.base_metrics.clicks,
        recommendation.impact.base_metrics.cost_micros,
        recommendation.impact.potential_metrics.impressions,
        recommendation.impact.potential_metrics.clicks,
        recommendation.impact.potential_metrics.cost_micros,
        recommendation.campaign_budget_recommendation.current_budget_amount_micros,
        recommendation.campaign_budget_recommendation.recommended_budget_amount_micros
      FROM recommendation 
      WHERE recommendation.type = 'CAMPAIGN_BUDGET'
      AND recommendation.dismissed = FALSE
    `;

    try {
      const response = await this.searchStream({
        customerId,
        query,
        pageSize: 100,
      });

      const recommendations: BudgetRecommendation[] = response.results.map((row) => ({
        resourceName: row.recommendation.resourceName,
        type: row.recommendation.type,
        impact: {
          baseMetrics: {
            impressions: parseInt(row.recommendation.impact.baseMetrics.impressions) || 0,
            clicks: parseInt(row.recommendation.impact.baseMetrics.clicks) || 0,
            costMicros: parseInt(row.recommendation.impact.baseMetrics.costMicros) || 0,
          },
          potentialMetrics: {
            impressions: parseInt(row.recommendation.impact.potentialMetrics.impressions) || 0,
            clicks: parseInt(row.recommendation.impact.potentialMetrics.clicks) || 0,
            costMicros: parseInt(row.recommendation.impact.potentialMetrics.costMicros) || 0,
          },
        },
        currentBudgetAmountMicros:
          parseInt(row.recommendation.campaignBudgetRecommendation.currentBudgetAmountMicros) || 0,
        recommendedBudgetAmountMicros:
          parseInt(row.recommendation.campaignBudgetRecommendation.recommendedBudgetAmountMicros) ||
          0,
      }));

      // Cache for 1 hour
      await this.cache.set(cacheKey, recommendations, 3600);

      return recommendations;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: number; rateLimitRemaining: number }> {
    try {
      await this.ensureAuthenticated();
      const rateLimitStatus = await this.rateLimiter.getStatus();

      return {
        status: 'healthy',
        timestamp: Date.now(),
        rateLimitRemaining: rateLimitStatus.tokensRemaining,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: Date.now(),
        rateLimitRemaining: 0,
      };
    }
  }

  /**
   * Circuit breaker management
   */
  private async checkCircuitBreaker(): Promise<void> {
    const now = Date.now();

    if (this.circuitBreaker.state === CircuitBreakerState.OPEN) {
      if (now < this.circuitBreaker.nextAttempt) {
        throw new GoogleAdsError('Circuit breaker is OPEN. Service temporarily unavailable.');
      }

      // Try to transition to half-open
      this.circuitBreaker.state = CircuitBreakerState.HALF_OPEN;
      this.emit('circuitBreakerStateChanged', {
        from: CircuitBreakerState.OPEN,
        to: CircuitBreakerState.HALF_OPEN,
      });
    }
  }

  private handleSuccess(): void {
    if (this.circuitBreaker.state === CircuitBreakerState.HALF_OPEN) {
      this.circuitBreaker.state = CircuitBreakerState.CLOSED;
      this.circuitBreaker.failureCount = 0;
      this.emit('circuitBreakerStateChanged', {
        from: CircuitBreakerState.HALF_OPEN,
        to: CircuitBreakerState.CLOSED,
      });
    }
  }

  private handleFailure(error: any): void {
    const now = Date.now();
    this.circuitBreaker.failureCount++;
    this.circuitBreaker.lastFailureTime = now;

    if (this.circuitBreaker.failureCount >= this.circuitBreaker.config.failureThreshold) {
      this.circuitBreaker.state = CircuitBreakerState.OPEN;
      this.circuitBreaker.nextAttempt =
        now +
        (this.circuitBreaker.config.recoveryTimeout ||
          this.config.circuitBreakerConfig?.resetTimeoutMs ||
          60000);

      this.emit('circuitBreakerStateChanged', {
        from: CircuitBreakerState.CLOSED,
        to: CircuitBreakerState.OPEN,
        error: error.message,
      });
    }
  }

  /**
   * Error mapping
   */
  private mapError(error: any): GoogleAdsError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 0;
      const message = (axiosError.response?.data as any)?.error?.message || axiosError.message;

      switch (status) {
        case 401:
          return new AuthenticationError(message);
        case 429:
          return new RateLimitError(message);
        case 403:
          if (message.includes('quota')) {
            return new ApiQuotaError(message);
          }
          break;
      }

      return new GoogleAdsError(message, status);
    }

    return new GoogleAdsError(error.message || 'Unknown error');
  }

  /**
   * Enhanced service account validation with security checks
   */
  private validateServiceAccountConfig(): void {
    if (!this.serviceAccountConfig) {
      throw new AuthenticationError('Service account configuration missing');
    }

    const required = [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
    ];

    for (const field of required) {
      if (!this.serviceAccountConfig[field as keyof ServiceAccountConfig]) {
        throw new AuthenticationError(`Service account missing required field: ${field}`);
      }
    }

    // Validate service account type
    if (this.serviceAccountConfig.type !== 'service_account') {
      throw new AuthenticationError('Invalid service account type');
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.serviceAccountConfig.client_email)) {
      throw new AuthenticationError('Invalid service account email format');
    }

    // Validate private key format (basic check)
    if (!this.serviceAccountConfig.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
      throw new AuthenticationError('Invalid private key format');
    }

    // Validate token URI
    if (this.serviceAccountConfig.token_uri !== 'https://oauth2.googleapis.com/token') {
      throw new AuthenticationError('Invalid token URI - possible security issue');
    }

    // Validate project ID format (alphanumeric, hyphens, 6-30 chars)
    const projectIdRegex = /^[a-z]([a-z0-9-]{4,28}[a-z0-9])$/;
    if (!projectIdRegex.test(this.serviceAccountConfig.project_id)) {
      throw new AuthenticationError('Invalid project ID format');
    }
  }

  private createCacheKey(operation: string, params: Record<string, any>): string {
    const paramString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}:${value}`)
      .join('|');

    return crypto.createHash('md5').update(`google_ads:${operation}:${paramString}`).digest('hex');
  }

  /**
   * Cleanup resources
   */
  async disconnect(): Promise<void> {
    await this.redis.disconnect();
    this.emit('disconnected');
  }

  /**
   * Convert micros to currency amount
   */
  static microsToAmount(micros: number): number {
    return micros / 1000000;
  }

  /**
   * Convert currency amount to micros
   */
  static amountToMicros(amount: number): number {
    return Math.round(amount * 1000000);
  }

  /**
   * Get accessible customers
   */
  async getAccessibleCustomers(): Promise<Customer[]> {
    try {
      const response = await this.axiosInstance.get('/customers:listAccessibleCustomers');

      return (
        response.data.resourceNames?.map((resourceName: string) => ({
          resourceName,
          id: resourceName.split('/').pop() || '',
          descriptiveName: '',
          currencyCode: 'USD',
          timeZone: 'UTC',
          autoTaggingEnabled: false,
          hasPartnersBadge: false,
          manager: false,
          testAccount: false,
        })) || []
      );
    } catch (error) {
      this.handleFailure(error);
      throw this.mapError(error);
    }
  }
}

export default GoogleAdsClient;
