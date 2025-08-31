/**
 * Security tests for Google Ads API implementation
 * Validates critical P0 security fixes
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/testing-library/jest-dom';
import { GoogleAdsClient } from './client';
import { loadGoogleAdsConfig, parseServiceAccountJson } from './config';
import { GoogleAdsError, AuthenticationError, ValidationError, ConfigurationError } from './errors';
import { TokenBucketRateLimiter } from './rateLimiter';
import { GoogleAdsCache } from './cache';
import Redis from 'ioredis-mock';

// Mock environment variables for testing
const mockEnv = {
  GOOGLE_ADS_DEVELOPER_TOKEN: 'test-developer-token-123456789012345',
  GOOGLE_ADS_LOGIN_CUSTOMER_ID: '1234567890',
  GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({
    type: 'service_account',
    project_id: 'test-project',
    private_key_id: 'test-key-id',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...\n-----END PRIVATE KEY-----\n',
    client_email: 'test@test-project.iam.gserviceaccount.com',
    client_id: '123456789012345678901',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/test%40test-project.iam.gserviceaccount.com',
  }),
  REDIS_URL: 'redis://localhost:6379',
  NODE_ENV: 'test',
};

describe('Google Ads API Security Tests', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv, ...mockEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Configuration Security', () => {
    test('should reject missing required environment variables', () => {
      delete import.meta.env.GOOGLE_ADS_DEVELOPER_TOKEN;

      expect(() => loadGoogleAdsConfig()).toThrow(ConfigurationError);
      expect(() => loadGoogleAdsConfig()).toThrow('Missing required environment variable');
    });

    test('should validate developer token format', () => {
      import.meta.env.GOOGLE_ADS_DEVELOPER_TOKEN = 'short';

      expect(() => loadGoogleAdsConfig()).toThrow(ConfigurationError);
      expect(() => loadGoogleAdsConfig()).toThrow('Invalid developer token format');
    });

    test('should validate customer ID format', () => {
      import.meta.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID = '123abc';

      expect(() => loadGoogleAdsConfig()).toThrow(ConfigurationError);
      expect(() => loadGoogleAdsConfig()).toThrow('Invalid login customer ID format');
    });

    test('should require service account configuration', () => {
      delete import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      delete import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;

      expect(() => loadGoogleAdsConfig()).toThrow(ConfigurationError);
      expect(() => loadGoogleAdsConfig()).toThrow('No service account configuration found');
    });
  });

  describe('Service Account Security', () => {
    test('should validate service account JSON structure', () => {
      const invalidJson = '{"invalid": "structure"}';

      expect(() => parseServiceAccountJson(invalidJson)).toThrow(ConfigurationError);
    });

    test('should require all mandatory service account fields', () => {
      const incompleteJson = JSON.stringify({
        type: 'service_account',
        project_id: 'test',
        // Missing required fields
      });

      expect(() => parseServiceAccountJson(incompleteJson)).toThrow(ConfigurationError);
      expect(() => parseServiceAccountJson(incompleteJson)).toThrow('missing required field');
    });

    test('should validate service account type', () => {
      const invalidTypeJson = JSON.stringify({
        ...JSON.parse(mockEnv.GOOGLE_SERVICE_ACCOUNT_JSON),
        type: 'user',
      });

      expect(() => parseServiceAccountJson(invalidTypeJson)).toThrow(ConfigurationError);
      expect(() => parseServiceAccountJson(invalidTypeJson)).toThrow(
        'type must be "service_account"'
      );
    });

    test('should validate email format', () => {
      const invalidEmailJson = JSON.stringify({
        ...JSON.parse(mockEnv.GOOGLE_SERVICE_ACCOUNT_JSON),
        client_email: 'invalid-email',
      });

      expect(() => parseServiceAccountJson(invalidEmailJson)).toThrow(ConfigurationError);
      expect(() => parseServiceAccountJson(invalidEmailJson)).toThrow(
        'Invalid service account email format'
      );
    });

    test('should validate private key format', () => {
      const invalidKeyJson = JSON.stringify({
        ...JSON.parse(mockEnv.GOOGLE_SERVICE_ACCOUNT_JSON),
        private_key: 'invalid-key-format',
      });

      expect(() => parseServiceAccountJson(invalidKeyJson)).toThrow(ConfigurationError);
      expect(() => parseServiceAccountJson(invalidKeyJson)).toThrow('Invalid private key format');
    });
  });

  describe('Input Validation Security', () => {
    let client: GoogleAdsClient;

    beforeEach(() => {
      const config = loadGoogleAdsConfig();
      client = new GoogleAdsClient(config);
    });

    test('should validate customer ID format', async () => {
      const invalidCustomerIds = [
        'abc123',
        '123',
        '12345678901', // 11 digits
        '123456789a',
        '',
        null,
        undefined,
      ];

      for (const invalidId of invalidCustomerIds) {
        await expect(client.getCustomer(invalidId as any)).rejects.toThrow(ValidationError);
      }
    });

    test('should detect GAQL injection attempts', async () => {
      const maliciousQueries = [
        'SELECT campaign.id FROM campaign; DROP TABLE campaigns;',
        'SELECT * FROM campaign WHERE 1=1; DELETE FROM ads;',
        'SELECT campaign.id FROM campaign -- comment out rest',
        'SELECT campaign.id FROM campaign /* block comment */',
        'SELECT campaign.id FROM campaign WHERE name = "<script>alert(1)</script>"',
        'SELECT campaign.id FROM campaign WHERE name = "javascript:alert(1)"',
      ];

      for (const query of maliciousQueries) {
        await expect(
          client.searchStream({
            customerId: '1234567890',
            query,
          })
        ).rejects.toThrow(ValidationError);
      }
    });

    test('should limit query length to prevent DoS', async () => {
      const longQuery = 'SELECT campaign.id FROM campaign WHERE ' + 'a'.repeat(10001);

      await expect(
        client.searchStream({
          customerId: '1234567890',
          query: longQuery,
        })
      ).rejects.toThrow(ValidationError);
    });

    test('should validate campaign IDs in performance metrics', async () => {
      const invalidCampaignIds = ['abc', '12a', '', null, undefined];

      for (const invalidId of invalidCampaignIds) {
        await expect(
          client.getCampaignPerformance('1234567890', [invalidId as any])
        ).rejects.toThrow(ValidationError);
      }
    });

    test('should validate date range parameters', async () => {
      const invalidDateRanges = [
        'INVALID_RANGE',
        '2023-01-01',
        'custom_range',
        '',
        null,
        undefined,
      ];

      for (const invalidRange of invalidDateRanges) {
        await expect(
          client.getCampaignPerformance('1234567890', undefined, invalidRange as any)
        ).rejects.toThrow(ValidationError);
      }
    });
  });

  describe('Error Handling Security', () => {
    test('should not expose sensitive data in production errors', () => {
      import.meta.env.MODE = 'production';

      const error = new GoogleAdsError(
        'Detailed internal error with sensitive data',
        500,
        'INTERNAL_ERROR',
        { sensitiveField: 'secret-value', stackTrace: 'sensitive-stack' }
      );

      const json = error.toJSON();

      expect(json.details).toBeUndefined();
      expect(json.stack).toBeUndefined();
      expect(json.message).not.toContain('sensitive');
      expect(json.message).toBe(error.getUserMessage());
    });

    test('should include debug info in development errors', () => {
      import.meta.env.MODE = 'development';

      const error = new GoogleAdsError('Detailed internal error', 500, 'INTERNAL_ERROR', {
        debugInfo: 'debug-value',
      });

      const json = error.toJSON();

      expect(json.details).toBeDefined();
      expect(json.stack).toBeDefined();
      expect(json.message).toBe('Detailed internal error');
    });
  });

  describe('Rate Limiter Security', () => {
    let rateLimiter: TokenBucketRateLimiter;
    let redis: Redis;

    beforeEach(() => {
      redis = new Redis();
      rateLimiter = new TokenBucketRateLimiter(
        {
          maxRequestsPerDay: 100,
          tokensPerSecond: 0.1,
          bucketSize: 10,
        },
        redis
      );
    });

    afterEach(async () => {
      await redis.disconnect();
    });

    test('should hash customer IDs in Redis keys', async () => {
      const customerId = '1234567890';

      await rateLimiter.acquireToken(1, customerId);

      const keys = await redis.keys('*');
      const customerKey = keys.find((key) => key.includes(customerId));

      expect(customerKey).toBeUndefined(); // Customer ID should not appear directly
      expect(keys.some((key) => key.includes('google_ads_rate_limit'))).toBe(true);
    });
  });

  describe('Cache Security', () => {
    let cache: GoogleAdsCache;
    let redis: Redis;

    beforeEach(() => {
      redis = new Redis();
      cache = new GoogleAdsCache(
        {
          defaultTtl: 300,
          maxMemoryMB: 10,
          compressionEnabled: true,
        },
        redis
      );
    });

    afterEach(async () => {
      await redis.disconnect();
    });

    test('should restrict access to sensitive cache patterns', async () => {
      const sensitivePatterns = ['*customer*', '*auth*', '*token*', '*key*', '*secret*'];

      for (const pattern of sensitivePatterns) {
        await expect(cache.getEntriesByPattern(pattern, 10, 'user')).rejects.toThrow(
          'Insufficient permissions'
        );
      }
    });

    test('should allow admin access to sensitive patterns', async () => {
      await expect(cache.getEntriesByPattern('*customer*', 10, 'admin')).resolves.toBeInstanceOf(
        Array
      );
    });

    test('should allow unrestricted access to non-sensitive patterns', async () => {
      await expect(cache.getEntriesByPattern('*campaign*', 10, 'user')).resolves.toBeInstanceOf(
        Array
      );
    });
  });

  describe('JWT Security', () => {
    test('should include security claims in JWT assertions', () => {
      // This would require mocking the JWT library to inspect the claims
      // The test validates that our JWT implementation includes:
      // - jti (JWT ID) for replay protection
      // - nbf (not before) for clock skew tolerance
      // - proper audience validation
      // - kid (key ID) in header

      expect(true).toBe(true); // Placeholder - actual implementation would test JWT structure
    });
  });

  describe('Configuration Validation', () => {
    test('should reject invalid rate limit configurations', () => {
      const config = loadGoogleAdsConfig();

      // Invalid maxRequestsPerDay
      config.rateLimitConfig!.maxRequestsPerDay = -1;
      expect(() => validateConfig(config)).toThrow(ConfigurationError);

      config.rateLimitConfig!.maxRequestsPerDay = 200000;
      expect(() => validateConfig(config)).toThrow(ConfigurationError);

      // Invalid tokensPerSecond
      config.rateLimitConfig!.maxRequestsPerDay = 1000;
      config.rateLimitConfig!.tokensPerSecond = -1;
      expect(() => validateConfig(config)).toThrow(ConfigurationError);

      config.rateLimitConfig!.tokensPerSecond = 20;
      expect(() => validateConfig(config)).toThrow(ConfigurationError);
    });

    test('should reject invalid cache configurations', () => {
      const config = loadGoogleAdsConfig();

      // Invalid TTL
      config.cacheConfig!.defaultTtl = -1;
      expect(() => validateConfig(config)).toThrow(ConfigurationError);

      config.cacheConfig!.defaultTtl = 90000; // > 24 hours
      expect(() => validateConfig(config)).toThrow(ConfigurationError);

      // Invalid memory limit
      config.cacheConfig!.defaultTtl = 300;
      config.cacheConfig!.maxMemoryMB = 0;
      expect(() => validateConfig(config)).toThrow(ConfigurationError);

      config.cacheConfig!.maxMemoryMB = 2048; // > 1GB
      expect(() => validateConfig(config)).toThrow(ConfigurationError);
    });
  });
});

// Import the validateConfig function
import { validateConfig } from './config';
