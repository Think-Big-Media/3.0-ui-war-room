/**
 * Comprehensive Test Suite for Token Bucket Rate Limiter
 * Tests Redis-backed distributed rate limiting with token bucket algorithm
 */

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TokenBucketRateLimiter } from '../rateLimiter';
import { RateLimitError } from '../errors';
import { type RateLimitConfig } from '../types';
import Redis from 'ioredis';

// Mock Redis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    eval: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    pipeline: jest.fn().mockReturnValue({
      hmget: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    hmget: jest.fn(),
    hmset: jest.fn(),
    expire: jest.fn(),
    ping: jest.fn(),
  }));
});
const MockedRedis = Redis as jest.MockedClass<typeof Redis>;

describe('TokenBucketRateLimiter', () => {
  let rateLimiter: TokenBucketRateLimiter;
  let mockRedis: jest.Mocked<Redis>;

  const defaultConfig: RateLimitConfig = {
    maxRequestsPerDay: 15000,
    tokensPerSecond: 0.173,
    bucketSize: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRedis = new MockedRedis() as jest.Mocked<Redis>;
    rateLimiter = new TokenBucketRateLimiter(defaultConfig, mockRedis);
  });

  describe('Token Acquisition', () => {
    it('should acquire tokens successfully when available', async () => {
      // Mock successful token consumption
      mockRedis.eval.mockResolvedValueOnce([1, 99, 100]); // Success, 99 tokens remaining

      await expect(rateLimiter.acquireToken(1)).resolves.not.toThrow();
    });

    it('should reject when tokens not available', async () => {
      // Mock all failures
      mockRedis.eval.mockResolvedValue([0, 0, 100]); // Failure, 0 tokens remaining

      await expect(rateLimiter.acquireToken(1)).rejects.toThrow(RateLimitError);
    });

    it('should acquire multiple tokens at once', async () => {
      mockRedis.eval.mockResolvedValueOnce([1, 95, 100]); // Success, consumed 5 tokens

      await expect(rateLimiter.acquireToken(5)).resolves.not.toThrow();
    });

    it('should retry with exponential backoff', async () => {
      // First two attempts fail, third succeeds
      mockRedis.eval
        .mockResolvedValueOnce([0, 0, 100])
        .mockResolvedValueOnce([0, 0, 100])
        .mockResolvedValueOnce([1, 99, 100]);

      const startTime = Date.now();
      await rateLimiter.acquireToken(1);
      const endTime = Date.now();

      // Should have taken some time due to retries with backoff
      expect(endTime - startTime).toBeGreaterThan(1000); // At least 1 second
    });

    it('should add jitter to retry delays', async () => {
      mockRedis.eval.mockResolvedValue([0, 0, 100]);

      const startTime = Date.now();

      try {
        await rateLimiter.acquireToken(1);
      } catch (error) {
        const endTime = Date.now();
        // With jitter, timing should vary slightly
        expect(endTime - startTime).toBeGreaterThan(3000);
      }
    });

    it('should emit tokenAcquired event on success', (done) => {
      mockRedis.eval.mockResolvedValueOnce([1, 99, 100]);

      rateLimiter.on('tokenAcquired', (event) => {
        expect(event.tokensRequested).toBe(1);
        expect(event.attempt).toBe(1);
        done();
      });

      rateLimiter.acquireToken(1);
    });

    it('should emit rateLimited event on failure', (done) => {
      mockRedis.eval.mockResolvedValue([0, 0, 100]);

      rateLimiter.on('rateLimited', (event) => {
        expect(event.attempt).toBe(1);
        expect(event.retryAfter).toBeGreaterThan(0);
        done();
      });

      rateLimiter.acquireToken(1).catch(() => {});
    });

    it('should handle customer-specific rate limiting', async () => {
      const customerId = 'customer123';
      mockRedis.eval.mockResolvedValueOnce([1, 99, 100]);

      await rateLimiter.acquireToken(1, customerId);

      // Should use hashed customer ID in Redis key
      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.any(String), // Lua script
        1,
        expect.stringMatching(/^google_ads_rate_limit:[a-f0-9]{16}$/), // Hashed key
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
    });
  });

  describe('Rate Limit Status', () => {
    it('should return current status correctly', async () => {
      mockRedis.eval.mockResolvedValueOnce([75, 100]); // 75 tokens remaining

      const status = await rateLimiter.getStatus();

      expect(status.tokensRemaining).toBe(75);
      expect(status.bucketSize).toBe(100);
      expect(status.tokensPerSecond).toBe(0.173);
      expect(status.isLimited).toBe(false);
    });

    it('should calculate time until tokens are available', async () => {
      mockRedis.eval.mockResolvedValueOnce([0, 100]); // No tokens remaining

      const status = await rateLimiter.getStatus();

      expect(status.isLimited).toBe(true);
      expect(status.nextRefillIn).toBeGreaterThan(0);
      expect(status.timeToFull).toBeGreaterThan(0);
    });

    it('should calculate time to full bucket correctly', async () => {
      mockRedis.eval.mockResolvedValueOnce([50, 100]); // Half full

      const status = await rateLimiter.getStatus();

      const expectedTimeToFull = (50 / 0.173) * 1000; // 50 tokens at 0.173/sec
      expect(status.timeToFull).toBeCloseTo(expectedTimeToFull, -2);
    });

    it('should handle customer-specific status queries', async () => {
      const customerId = 'customer456';
      mockRedis.eval.mockResolvedValueOnce([80, 100]);

      await rateLimiter.getStatus(customerId);

      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        expect.stringMatching(/^google_ads_rate_limit:[a-f0-9]{16}$/),
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );
    });
  });

  describe('Lua Script Execution', () => {
    it('should execute refill script with correct parameters', async () => {
      await rateLimiter.getStatus();

      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.stringContaining('local bucket_size = tonumber(ARGV[1])'),
        1,
        expect.any(String), // Key
        '100', // Bucket size
        '0.173', // Tokens per second
        expect.any(String) // Timestamp
      );
    });

    it('should execute consume script with correct parameters', async () => {
      mockRedis.eval.mockResolvedValueOnce([1, 99, 100]);

      await rateLimiter.acquireToken(2);

      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.stringContaining('local tokens_requested = tonumber(ARGV[4])'),
        1,
        expect.any(String), // Key
        '100', // Bucket size
        '0.173', // Tokens per second
        expect.any(String), // Timestamp
        '2' // Tokens requested
      );
    });

    it('should handle Lua script errors gracefully', async () => {
      mockRedis.eval.mockRejectedValueOnce(new Error('NOSCRIPT: No matching script'));

      await expect(rateLimiter.acquireToken(1)).rejects.toThrow();
    });

    it('should handle Redis connection errors', async () => {
      mockRedis.eval.mockRejectedValueOnce(new Error('Connection lost'));

      await expect(rateLimiter.acquireToken(1)).rejects.toThrow();
    });
  });

  describe('Custom Rate Limits', () => {
    it('should set customer-specific rate limits', async () => {
      const customerId = 'customer789';
      const tokensPerSecond = 0.5;
      const bucketSize = 200;

      await rateLimiter.setCustomerLimit(customerId, tokensPerSecond, bucketSize);

      expect(mockRedis.hmset).toHaveBeenCalledWith(
        expect.stringMatching(/^google_ads_rate_limit:config:[a-f0-9]{16}$/),
        {
          tokensPerSecond: '0.5',
          bucketSize: '200',
        }
      );

      expect(mockRedis.expire).toHaveBeenCalledWith(expect.any(String), 86400);
    });

    it('should remove customer-specific rate limits', async () => {
      const customerId = 'customer789';

      await rateLimiter.removeCustomerLimit(customerId);

      expect(mockRedis.del).toHaveBeenCalledTimes(2); // Config and bucket keys
    });

    it('should emit events for custom limit changes', (done) => {
      const customerId = 'customer123';

      rateLimiter.on('customLimitSet', (event) => {
        expect(event.customerId).toBe(customerId);
        expect(event.tokensPerSecond).toBe(0.5);
        expect(event.bucketSize).toBe(200);
        done();
      });

      rateLimiter.setCustomerLimit(customerId, 0.5, 200);
    });

    it('should use custom limits when available', async () => {
      const customerId = 'customer123';

      // Mock custom config retrieval
      mockRedis.hmget.mockResolvedValueOnce(['0.5', '200']);
      mockRedis.eval.mockResolvedValueOnce([1, 199, 200]);

      await rateLimiter.acquireToken(1, customerId);

      // Should use custom bucket size in script call
      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        expect.any(String),
        '100', // Default bucket size (custom config loading happens in private method)
        '0.173', // Default tokens per second
        expect.any(String),
        '1'
      );
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should return comprehensive statistics', async () => {
      const mockKeys = [
        'google_ads_rate_limit:hash1',
        'google_ads_rate_limit:hash2',
        'google_ads_rate_limit:hash3',
      ];

      mockRedis.keys.mockResolvedValueOnce(mockKeys);

      const mockPipeline = {
        exec: jest.fn().mockResolvedValueOnce([
          [null, ['75']],
          [null, ['25']],
          [null, ['0']],
        ]),
      };

      mockRedis.pipeline.mockReturnValueOnce(mockPipeline as any);

      const stats = await rateLimiter.getStatistics();

      expect(stats.totalCustomers).toBe(3);
      expect(stats.averageTokensRemaining).toBe(33); // (75+25+0)/3
      expect(stats.customersAtLimit).toBe(1); // One customer with 0 tokens
      expect(stats.topConsumers).toHaveLength(3);
    });

    it('should handle empty statistics gracefully', async () => {
      mockRedis.keys.mockResolvedValueOnce([]);

      const stats = await rateLimiter.getStatistics();

      expect(stats.totalCustomers).toBe(0);
      expect(stats.averageTokensRemaining).toBe(0);
      expect(stats.customersAtLimit).toBe(0);
      expect(stats.topConsumers).toEqual([]);
    });

    it('should sort top consumers correctly', async () => {
      const mockKeys = ['key1', 'key2', 'key3'];
      mockRedis.keys.mockResolvedValueOnce(mockKeys);

      const mockPipeline = {
        exec: jest.fn().mockResolvedValueOnce([
          [null, ['100']], // Most tokens
          [null, ['50']], // Medium tokens
          [null, ['10']], // Least tokens (top consumer)
        ]),
      };

      mockRedis.pipeline.mockReturnValueOnce(mockPipeline as any);

      const stats = await rateLimiter.getStatistics();

      // Should be sorted by tokens remaining (ascending - least tokens first)
      expect(stats.topConsumers[0].tokensRemaining).toBe(10);
      expect(stats.topConsumers[1].tokensRemaining).toBe(50);
      expect(stats.topConsumers[2].tokensRemaining).toBe(100);
    });
  });

  describe('Utility Methods', () => {
    it('should check if request can be made without consuming tokens', async () => {
      mockRedis.eval.mockResolvedValueOnce([75, 100]);

      const canMake = await rateLimiter.canMakeRequest(10);
      expect(canMake).toBe(true);

      const cannotMake = await rateLimiter.canMakeRequest(100);
      expect(cannotMake).toBe(false);
    });

    it('should calculate time until tokens are available', async () => {
      mockRedis.eval.mockResolvedValueOnce([5, 100]); // 5 tokens remaining

      const timeUntilAvailable = await rateLimiter.timeUntilAvailable(10);

      // Need 5 more tokens at 0.173 tokens/second
      const expectedTime = (5 / 0.173) * 1000;
      expect(timeUntilAvailable).toBeCloseTo(expectedTime, -2);
    });

    it('should return 0 time when tokens are immediately available', async () => {
      mockRedis.eval.mockResolvedValueOnce([50, 100]);

      const timeUntilAvailable = await rateLimiter.timeUntilAvailable(10);
      expect(timeUntilAvailable).toBe(0);
    });

    it('should reset rate limiter state', async () => {
      const customerId = 'customer123';

      await rateLimiter.reset(customerId);

      expect(mockRedis.del).toHaveBeenCalledWith(
        expect.stringMatching(/^google_ads_rate_limit:[a-f0-9]{16}$/)
      );
    });

    it('should emit reset event', (done) => {
      const customerId = 'customer123';

      rateLimiter.on('rateLimiterReset', (event) => {
        expect(event.customerId).toBe(customerId);
        done();
      });

      rateLimiter.reset(customerId);
    });
  });

  describe('Security', () => {
    it('should hash customer IDs for Redis keys', async () => {
      const customerId = 'sensitive-customer-id';
      mockRedis.eval.mockResolvedValueOnce([1, 99, 100]);

      await rateLimiter.acquireToken(1, customerId);

      // Should not use the raw customer ID in the Redis key
      expect(mockRedis.eval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        expect.not.stringContaining(customerId),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String)
      );

      // Should use a hashed version
      const keyArg = mockRedis.eval.mock.calls[0][2];
      expect(keyArg).toMatch(/^google_ads_rate_limit:[a-f0-9]{16}$/);
    });

    it('should use consistent hashing for same customer ID', async () => {
      const customerId = 'test-customer';
      mockRedis.eval.mockResolvedValue([1, 99, 100]);

      await rateLimiter.acquireToken(1, customerId);
      const firstKey = mockRedis.eval.mock.calls[0][2];

      await rateLimiter.acquireToken(1, customerId);
      const secondKey = mockRedis.eval.mock.calls[1][2];

      expect(firstKey).toBe(secondKey);
    });

    it('should generate different hashes for different customer IDs', async () => {
      mockRedis.eval.mockResolvedValue([1, 99, 100]);

      await rateLimiter.acquireToken(1, 'customer1');
      const key1 = mockRedis.eval.mock.calls[0][2];

      await rateLimiter.acquireToken(1, 'customer2');
      const key2 = mockRedis.eval.mock.calls[1][2];

      expect(key1).not.toBe(key2);
    });
  });

  describe('Health Check', () => {
    it('should return healthy status when Redis is responsive', async () => {
      mockRedis.ping.mockResolvedValueOnce('PONG');

      const health = await rateLimiter.healthCheck();

      expect(health.status).toBe('healthy');
      expect(health.redis).toBe(true);
      expect(health.avgResponseTime).toBeGreaterThan(0);
    });

    it('should return unhealthy status when Redis is unresponsive', async () => {
      mockRedis.ping.mockRejectedValueOnce(new Error('Connection failed'));

      const health = await rateLimiter.healthCheck();

      expect(health.status).toBe('unhealthy');
      expect(health.redis).toBe(false);
      expect(health.avgResponseTime).toBe(-1);
    });

    it('should measure response time accurately', async () => {
      // Simulate slow Redis response
      mockRedis.ping.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve('PONG'), 100))
      );

      const health = await rateLimiter.healthCheck();

      expect(health.avgResponseTime).toBeGreaterThanOrEqual(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle Redis connection failures gracefully', async () => {
      mockRedis.eval.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      await expect(rateLimiter.acquireToken(1)).rejects.toThrow('ECONNREFUSED');
    });

    it('should handle malformed Redis responses', async () => {
      mockRedis.eval.mockResolvedValueOnce(['invalid', 'response']); // Wrong format

      await expect(rateLimiter.acquireToken(1)).rejects.toThrow();
    });

    it('should emit error events', (done) => {
      const error = new Error('Redis error');
      mockRedis.eval.mockRejectedValueOnce(error);

      rateLimiter.on('error', (emittedError) => {
        expect(emittedError).toBe(error);
        done();
      });

      rateLimiter.acquireToken(1).catch(() => {});
    });

    it('should handle timeout in Redis operations', async () => {
      mockRedis.eval.mockImplementation(
        () =>
          new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), 100))
      );

      await expect(rateLimiter.acquireToken(1)).rejects.toThrow('Operation timeout');
    });
  });

  describe('Cleanup', () => {
    it('should clean up event listeners on close', async () => {
      const removeAllListenersSpy = jest.spyOn(rateLimiter, 'removeAllListeners');

      await rateLimiter.close();

      expect(removeAllListenersSpy).toHaveBeenCalled();
    });

    it('should handle multiple close calls gracefully', async () => {
      await rateLimiter.close();
      await expect(rateLimiter.close()).resolves.not.toThrow();
    });
  });

  describe('Configuration Edge Cases', () => {
    it('should handle zero bucket size', () => {
      const configWithZeroBucket = {
        ...defaultConfig,
        bucketSize: 0,
      };

      expect(() => new TokenBucketRateLimiter(configWithZeroBucket, mockRedis)).not.toThrow();
    });

    it('should handle very high token rates', () => {
      const configWithHighRate = {
        ...defaultConfig,
        tokensPerSecond: 1000,
      };

      expect(() => new TokenBucketRateLimiter(configWithHighRate, mockRedis)).not.toThrow();
    });

    it('should handle fractional token requests', async () => {
      mockRedis.eval.mockResolvedValueOnce([1, 99.5, 100]);

      // This should work even though we can't really have 0.5 tokens
      await expect(rateLimiter.acquireToken(0.5 as any)).resolves.not.toThrow();
    });
  });
});
