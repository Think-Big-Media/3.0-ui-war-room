/**
 * Secure configuration loader for Google Ads API
 * Handles environment variables and credential validation
 */

import { type GoogleAdsConfig, type ServiceAccountConfig } from './types';
import { ConfigurationError } from './errors';

/**
 * Securely load Google Ads configuration from environment variables
 */
export function loadGoogleAdsConfig(): GoogleAdsConfig {
  const requiredEnvVars = [
    'GOOGLE_ADS_DEVELOPER_TOKEN',
    'GOOGLE_ADS_LOGIN_CUSTOMER_ID',
  ];

  // Check required environment variables
  // Use import.meta.env for browser/Vite builds; process.env only in Node contexts
  for (const envVar of requiredEnvVars) {
    const value = (import.meta as any).env?.[envVar];
    if (!value) {
      throw new ConfigurationError(
        `Missing required environment variable: ${envVar}`,
        envVar,
        'string',
      );
    }
  }

  // Validate developer token format (should start with specific pattern)
  const developerToken = import.meta.env.GOOGLE_ADS_DEVELOPER_TOKEN!;
  if (!developerToken || developerToken.length < 20) {
    throw new ConfigurationError(
      'Invalid developer token format',
      'GOOGLE_ADS_DEVELOPER_TOKEN',
      'string (minimum 20 characters)',
    );
  }

  // Validate customer ID format
  const loginCustomerId = import.meta.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID!;
  if (!/^\d{10}$/.test(loginCustomerId)) {
    throw new ConfigurationError(
      'Invalid login customer ID format',
      'GOOGLE_ADS_LOGIN_CUSTOMER_ID',
      'string (exactly 10 digits)',
    );
  }

  const config: GoogleAdsConfig = {
    developerToken,
    loginCustomerId,
    redisUrl: import.meta.env.REDIS_URL || 'redis://localhost:6379',
    // Rate limiting configuration
    rateLimitConfig: {
      maxTokens: parseInt(import.meta.env.GOOGLE_ADS_BUCKET_SIZE || '100'),
      refillRate: parseFloat(import.meta.env.GOOGLE_ADS_TOKENS_PER_SECOND || '0.173'),
      tokensPerSecond: parseFloat(import.meta.env.GOOGLE_ADS_TOKENS_PER_SECOND || '0.173'),
      windowMs: parseInt(import.meta.env.GOOGLE_ADS_RATE_LIMIT_WINDOW || '60000'),
      maxRequestsPerDay: parseInt(import.meta.env.GOOGLE_ADS_MAX_REQUESTS_PER_DAY || '15000'),
      bucketSize: parseInt(import.meta.env.GOOGLE_ADS_BUCKET_SIZE || '100'),
    },
    // Cache configuration
    cacheConfig: {
      defaultTtl: parseInt(import.meta.env.GOOGLE_ADS_CACHE_TTL || '300'),
      maxMemoryMB: parseInt(import.meta.env.GOOGLE_ADS_CACHE_MAX_MEMORY || '50'),
      compressionEnabled: import.meta.env.GOOGLE_ADS_CACHE_COMPRESSION !== 'false',
      compressionThreshold: parseInt(import.meta.env.GOOGLE_ADS_CACHE_COMPRESSION_THRESHOLD || '1024'),
    },
    // Circuit breaker configuration
    circuitBreakerConfig: {
      failureThreshold: parseInt(import.meta.env.GOOGLE_ADS_CIRCUIT_BREAKER_THRESHOLD || '5'),
      resetTimeoutMs: parseInt(import.meta.env.GOOGLE_ADS_CIRCUIT_BREAKER_TIMEOUT || '60000'),
      monitoringWindowMs: parseInt(import.meta.env.GOOGLE_ADS_CIRCUIT_BREAKER_WINDOW || '300000'),
    },
  };

  // Handle service account configuration securely
  if (import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    config.serviceAccountJson = import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  } else if (import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE && import.meta.env.DEV) {
    config.serviceAccountKeyFile = import.meta.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE;
  } else {
    throw new ConfigurationError(
      'No service account configuration found. Set GOOGLE_SERVICE_ACCOUNT_JSON environment variable.',
      'GOOGLE_SERVICE_ACCOUNT_JSON',
      'JSON string',
    );
  }

  return config;
}

/**
 * Parse and validate service account JSON from environment variable
 */
export function parseServiceAccountJson(json?: string): ServiceAccountConfig {
  if (!json) {
    throw new ConfigurationError(
      'Service account JSON not provided',
      'serviceAccountJson',
      'JSON string',
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    throw new ConfigurationError(
      'Invalid JSON in service account configuration',
      'serviceAccountJson',
      'valid JSON string',
    );
  }

  // Validate required fields
  const requiredFields = [
    'type', 'project_id', 'private_key_id', 'private_key',
    'client_email', 'client_id', 'auth_uri', 'token_uri',
  ];

  for (const field of requiredFields) {
    if (!parsed[field]) {
      throw new ConfigurationError(
        `Service account missing required field: ${field}`,
        field,
        'string',
      );
    }
  }

  // Additional validation
  if (parsed.type !== 'service_account') {
    throw new ConfigurationError(
      'Service account type must be "service_account"',
      'type',
      'service_account',
    );
  }

  if (!parsed.client_email.includes('@')) {
    throw new ConfigurationError(
      'Invalid service account email format',
      'client_email',
      'valid email address',
    );
  }

  if (!parsed.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new ConfigurationError(
      'Invalid private key format',
      'private_key',
      'PEM format private key',
    );
  }

  return parsed as ServiceAccountConfig;
}

/**
 * Get environment-specific configuration overrides
 */
export function getEnvironmentConfig(): Partial<GoogleAdsConfig> {
  const env = import.meta.env.MODE || 'development';

  switch (env) {
    case 'production':
      return {
        rateLimitConfig: {
          maxTokens: 50,
          refillRate: 0.173,
          tokensPerSecond: 0.173,
          windowMs: 60000,
          maxRequestsPerDay: 15000,
          bucketSize: 50, // More conservative in production
        },
        cacheConfig: {
          defaultTtl: 600, // 10 minutes in production
          maxMemoryMB: 100,
          compressionEnabled: true,
          compressionThreshold: 512,
        },
      };

    case 'staging':
      return {
        rateLimitConfig: {
          maxTokens: 25,
          refillRate: 0.058,
          tokensPerSecond: 0.058,
          windowMs: 60000,
          maxRequestsPerDay: 5000,
          bucketSize: 25,
        },
      };

    case 'development':
    default:
      return {
        rateLimitConfig: {
          maxTokens: 10,
          refillRate: 0.012,
          windowMs: 1000,
          maxRequestsPerDay: 1000,
          tokensPerSecond: 0.012,
          bucketSize: 10,
        },
        cacheConfig: {
          defaultTtl: 60, // 1 minute in development
          maxMemoryMB: 10,
        },
      };
  }
}

/**
 * Validate configuration at runtime
 */
export function validateConfig(config: GoogleAdsConfig): void {
  // Rate limit validation
  if (config.rateLimitConfig) {
    const { maxRequestsPerDay, tokensPerSecond, bucketSize } = config.rateLimitConfig;

    if (maxRequestsPerDay !== undefined && (maxRequestsPerDay <= 0 || maxRequestsPerDay > 100000)) {
      throw new ConfigurationError(
        'Invalid maxRequestsPerDay value',
        'maxRequestsPerDay',
        'number between 1 and 100000',
      );
    }

    if (tokensPerSecond !== undefined && (tokensPerSecond <= 0 || tokensPerSecond > 10)) {
      throw new ConfigurationError(
        'Invalid tokensPerSecond value',
        'tokensPerSecond',
        'number between 0 and 10',
      );
    }

    if (bucketSize !== undefined && (bucketSize <= 0 || bucketSize > 1000)) {
      throw new ConfigurationError(
        'Invalid bucketSize value',
        'bucketSize',
        'number between 1 and 1000',
      );
    }
  }

  // Cache validation
  if (config.cacheConfig) {
    const { defaultTtl, maxMemoryMB } = config.cacheConfig;

    if (defaultTtl !== undefined && (defaultTtl < 0 || defaultTtl > 86400)) { // Max 24 hours
      throw new ConfigurationError(
        'Invalid defaultTtl value',
        'defaultTtl',
        'number between 0 and 86400 seconds',
      );
    }

    if (maxMemoryMB !== undefined && (maxMemoryMB <= 0 || maxMemoryMB > 1024)) { // Max 1GB
      throw new ConfigurationError(
        'Invalid maxMemoryMB value',
        'maxMemoryMB',
        'number between 1 and 1024',
      );
    }
  }
}
