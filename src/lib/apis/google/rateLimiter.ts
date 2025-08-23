/**
 * Token Bucket Rate Limiter for Google Ads API
 * Implements 15,000 queries/day limit with burst capacity
 * Redis-backed for distributed rate limiting
 */

import crypto from 'crypto';
import type Redis from 'ioredis';
import { EventEmitter } from 'events';
import { type RateLimitConfig, type RateLimitStatus } from './types';
import { RateLimitError } from './errors';

/**
 * Token bucket rate limiter implementation
 * Allows for burst requests while maintaining long-term rate limits
 */
export class TokenBucketRateLimiter extends EventEmitter {
  private redis: Redis;
  private config: Required<RateLimitConfig>;
  private keyPrefix: string;
  private refillScript: string;
  private consumeScript: string;

  constructor(config: RateLimitConfig, redis: Redis, keyPrefix = 'google_ads_rate_limit') {
    super();

    this.config = {
      maxRequestsPerDay: 15000,
      tokensPerSecond: 0.173, // 15000/(24*60*60)
      bucketSize: 100,
      ...config,
    } as Required<RateLimitConfig>;

    this.redis = redis;
    this.keyPrefix = keyPrefix;

    // Lua scripts for atomic operations
    this.refillScript = `
      local key = KEYS[1]
      local bucket_size = tonumber(ARGV[1])
      local tokens_per_second = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      
      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or bucket_size
      local last_refill = tonumber(bucket[2]) or now
      
      -- Calculate tokens to add based on time elapsed
      local time_elapsed = now - last_refill
      local tokens_to_add = time_elapsed * tokens_per_second
      
      -- Add tokens, but don't exceed bucket size
      tokens = math.min(bucket_size, tokens + tokens_to_add)
      
      -- Update bucket state
      redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
      redis.call('EXPIRE', key, 86400) -- Expire after 24 hours
      
      return {tokens, bucket_size}
    `;

    this.consumeScript = `
      local key = KEYS[1]
      local bucket_size = tonumber(ARGV[1])
      local tokens_per_second = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      local tokens_requested = tonumber(ARGV[4])
      
      -- First refill the bucket
      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1]) or bucket_size
      local last_refill = tonumber(bucket[2]) or now
      
      local time_elapsed = now - last_refill
      local tokens_to_add = time_elapsed * tokens_per_second
      tokens = math.min(bucket_size, tokens + tokens_to_add)
      
      -- Check if we have enough tokens
      if tokens >= tokens_requested then
        tokens = tokens - tokens_requested
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, 86400)
        return {1, tokens, bucket_size} -- Success
      else
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, 86400)
        return {0, tokens, bucket_size} -- Rate limited
      end
    `;
  }

  /**
   * Acquire a token from the rate limiter
   * Blocks until token is available or throws error
   */
  async acquireToken(tokensRequested = 1, customerId?: string): Promise<void> {
    const key = this.buildKey(customerId);
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const success = await this.tryAcquireToken(key, tokensRequested);

        if (success) {
          this.emit('tokenAcquired', {
            customerId,
            tokensRequested,
            attempt: attempt + 1,
          });
          return;
        }

        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 0.1 * delay; // Add 10% jitter

        this.emit('rateLimited', {
          customerId,
          attempt: attempt + 1,
          retryAfter: delay + jitter,
        });

        if (attempt < maxRetries - 1) {
          await this.sleep(delay + jitter);
        }

      } catch (error) {
        this.emit('error', error);
        throw error;
      }
    }

    // All retries exhausted
    const status = await this.getStatus(customerId);
    throw new RateLimitError(
      `Rate limit exceeded. ${status.tokensRemaining} tokens remaining. ` +
      `Next refill in ${status.nextRefillIn}ms.`,
    );
  }

  /**
   * Try to acquire tokens (non-blocking)
   */
  private async tryAcquireToken(key: string, tokensRequested: number): Promise<boolean> {
    const now = Date.now() / 1000;

    const result = await this.redis.eval(
      this.consumeScript,
      1,
      key,
      this.config.bucketSize.toString(),
      this.config.tokensPerSecond.toString(),
      now.toString(),
      tokensRequested.toString(),
    ) as [number, number, number];

    return result[0] === 1;
  }

  /**
   * Get current rate limit status
   */
  async getStatus(customerId?: string): Promise<RateLimitStatus> {
    const key = this.buildKey(customerId);
    const now = Date.now() / 1000;

    const result = await this.redis.eval(
      this.refillScript,
      1,
      key,
      this.config.bucketSize.toString(),
      this.config.tokensPerSecond.toString(),
      now.toString(),
    ) as [number, number];

    const [tokensRemaining, bucketSize] = result;

    // Calculate time until bucket is full
    const tokensNeeded = bucketSize - tokensRemaining;
    const timeToFull = tokensNeeded / this.config.tokensPerSecond * 1000; // ms

    // Calculate next refill time (when at least 1 token will be available)
    const nextRefillIn = tokensRemaining > 0 ? 0 : (1 / this.config.tokensPerSecond * 1000);

    return {
      tokensRemaining: Math.floor(tokensRemaining),
      bucketSize,
      tokensPerSecond: this.config.tokensPerSecond,
      nextRefillIn: Math.ceil(nextRefillIn),
      timeToFull: Math.ceil(timeToFull),
      resetTime: new Date(now * 1000 + timeToFull),
      isLimited: tokensRemaining < 1,
    };
  }

  /**
   * Reset rate limiter for a customer (admin operation)
   */
  async reset(customerId?: string): Promise<void> {
    const key = this.buildKey(customerId);
    await this.redis.del(key);

    this.emit('rateLimiterReset', { customerId });
  }

  /**
   * Get rate limiter statistics
   */
  async getStatistics(): Promise<{
    totalCustomers: number;
    averageTokensRemaining: number;
    customersAtLimit: number;
    topConsumers: Array<{ customerId: string; tokensRemaining: number }>;
  }> {
    const pattern = `${this.keyPrefix}:*`;
    const keys = await this.redis.keys(pattern);

    if (keys.length === 0) {
      return {
        totalCustomers: 0,
        averageTokensRemaining: 0,
        customersAtLimit: 0,
        topConsumers: [],
      };
    }

    const pipeline = this.redis.pipeline();
    keys.forEach(key => {
      pipeline.hmget(key, 'tokens');
    });

    const results = await pipeline.exec();
    const tokenCounts: Array<{ customerId: string; tokensRemaining: number }> = [];

    keys.forEach((key, index) => {
      const result = results?.[index];
      if (result && !result[0]) {
        const tokens = parseFloat(String((result[1] as any)?.[0] || '0')) || 0;
        const customerId = key.replace(`${this.keyPrefix}:`, '') || 'default';
        tokenCounts.push({ customerId, tokensRemaining: Math.floor(tokens) });
      }
    });

    const averageTokens = tokenCounts.reduce((sum, item) => sum + item.tokensRemaining, 0) / tokenCounts.length;
    const customersAtLimit = tokenCounts.filter(item => item.tokensRemaining < 1).length;
    const topConsumers = tokenCounts
      .sort((a, b) => a.tokensRemaining - b.tokensRemaining)
      .slice(0, 10);

    return {
      totalCustomers: tokenCounts.length,
      averageTokensRemaining: Math.floor(averageTokens),
      customersAtLimit,
      topConsumers,
    };
  }

  /**
   * Check if rate limiter allows request without consuming tokens
   */
  async canMakeRequest(tokensRequested = 1, customerId?: string): Promise<boolean> {
    const status = await this.getStatus(customerId);
    return status.tokensRemaining >= tokensRequested;
  }

  /**
   * Get time until tokens are available
   */
  async timeUntilAvailable(tokensRequested = 1, customerId?: string): Promise<number> {
    const status = await this.getStatus(customerId);

    if (status.tokensRemaining >= tokensRequested) {
      return 0;
    }

    const tokensNeeded = tokensRequested - status.tokensRemaining;
    const timeNeeded = tokensNeeded / this.config.tokensPerSecond * 1000;

    return Math.ceil(timeNeeded);
  }

  /**
   * Set custom rate limit for specific customer
   */
  async setCustomerLimit(
    customerId: string,
    tokensPerSecond: number,
    bucketSize: number,
  ): Promise<void> {
    const key = `${this.keyPrefix}:config:${customerId}`;

    await this.redis.hmset(key, {
      tokensPerSecond: tokensPerSecond.toString(),
      bucketSize: bucketSize.toString(),
    });

    await this.redis.expire(key, 86400); // Expire after 24 hours

    this.emit('customLimitSet', { customerId, tokensPerSecond, bucketSize });
  }

  /**
   * Remove custom rate limit for specific customer
   */
  async removeCustomerLimit(customerId: string): Promise<void> {
    const configKey = `${this.keyPrefix}:config:${customerId}`;
    const bucketKey = this.buildKey(customerId);

    await Promise.all([
      this.redis.del(configKey),
      this.redis.del(bucketKey),
    ]);

    this.emit('customLimitRemoved', { customerId });
  }

  /**
   * Get effective rate limit config for customer
   */
  private async getEffectiveConfig(customerId?: string): Promise<RateLimitConfig> {
    if (!customerId) {
      return this.config;
    }

    const configKey = `${this.keyPrefix}:config:${customerId}`;
    const customConfig = await this.redis.hmget(configKey, 'tokensPerSecond', 'bucketSize');

    if (customConfig[0] && customConfig[1]) {
      return {
        ...this.config,
        tokensPerSecond: parseFloat(customConfig[0]),
        bucketSize: parseInt(customConfig[1]),
      };
    }

    return this.config;
  }

  /**
   * Build secure Redis key for rate limiter (hashed for security)
   */
  private buildKey(customerId?: string): string {
    if (!customerId) {
      return `${this.keyPrefix}:default`;
    }

    // Hash customer ID for security (prevents enumeration)
    const hash = crypto.createHash('sha256')
      .update(customerId)
      .digest('hex')
      .substring(0, 16); // Use first 16 chars for readability

    return `${this.keyPrefix}:${hash}`;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup and close connections
   */
  async close(): Promise<void> {
    this.removeAllListeners();
  }

  /**
   * Health check for rate limiter
   */
  async healthCheck(): Promise<{ status: string; redis: boolean; avgResponseTime: number }> {
    try {
      const start = Date.now();
      await this.redis.ping();
      const responseTime = Date.now() - start;

      return {
        status: 'healthy',
        redis: true,
        avgResponseTime: responseTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        redis: false,
        avgResponseTime: -1,
      };
    }
  }
}

export default TokenBucketRateLimiter;
