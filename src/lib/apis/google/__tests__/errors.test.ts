/**
 * Comprehensive Test Suite for Google Ads API Error System
 * Tests all error classes, error mapping, and utility functions
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  GoogleAdsError,
  AuthenticationError,
  OAuth2Error,
  ServiceAccountError,
  RateLimitError,
  ApiQuotaError,
  ValidationError,
  ResourceNotFoundError,
  PermissionDeniedError,
  NetworkError,
  CircuitBreakerError,
  CacheError,
  ConfigurationError,
  ResponseParsingError,
  GoogleAdsApiError,
  BatchOperationError,
  ErrorUtils,
} from '../errors';

describe('Google Ads API Error System', () => {
  describe('GoogleAdsError Base Class', () => {
    it('should create error with default values', () => {
      const error = new GoogleAdsError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('GoogleAdsError');
      expect(error.code).toBe('GOOGLE_ADS_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.retryable).toBe(false);
      expect(error.category).toBe('server');
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should create error with custom values', () => {
      const details = { field: 'test' };
      const error = new GoogleAdsError(
        'Custom error',
        400,
        'CUSTOM_ERROR',
        details,
        true,
        'client'
      );

      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.details).toBe(details);
      expect(error.retryable).toBe(true);
      expect(error.category).toBe('client');
    });

    it('should capture stack trace', () => {
      const error = new GoogleAdsError('Test error');
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('GoogleAdsError');
    });

    describe('toJSON method', () => {
      beforeEach(() => {
        // Ensure we're not in production for these tests
        import.meta.env.MODE = 'test';
      });

      it('should serialize error for development', () => {
        const details = { debug: 'info' };
        const error = new GoogleAdsError('Test error', 400, 'TEST_ERROR', details);
        error.requestId = 'req-123';

        const json = error.toJSON();

        expect(json).toEqual({
          name: 'GoogleAdsError',
          message: 'Test error',
          code: 'TEST_ERROR',
          statusCode: 400,
          timestamp: error.timestamp.toISOString(),
          requestId: 'req-123',
          retryable: false,
          category: 'server',
          details,
          stack: error.stack,
        });
      });

      it('should serialize error safely for production', () => {
        const originalEnv = import.meta.env.MODE;
        import.meta.env.MODE = 'production';

        try {
          const details = { sensitive: 'data' };
          const error = new GoogleAdsError('Internal error', 500, 'INTERNAL_ERROR', details);

          const json = error.toJSON();

          expect(json).not.toHaveProperty('details');
          expect(json).not.toHaveProperty('stack');
          expect(json.message).toBe('Service temporarily unavailable. Please try again.');
        } finally {
          import.meta.env.MODE = originalEnv;
        }
      });
    });

    describe('getUserMessage method', () => {
      it('should return user-friendly message for auth errors', () => {
        const error = new GoogleAdsError(
          'Internal auth error',
          401,
          'AUTH_ERROR',
          {},
          false,
          'auth'
        );
        expect(error.getUserMessage()).toBe(
          'Authentication failed. Please verify your API credentials.'
        );
      });

      it('should return user-friendly message for rate limit errors', () => {
        const error = new GoogleAdsError(
          'Rate limited',
          429,
          'RATE_LIMIT',
          {},
          false,
          'rate_limit'
        );
        expect(error.getUserMessage()).toBe('Request rate limit exceeded. Please try again later.');
      });

      it('should return user-friendly message for quota errors', () => {
        const error = new GoogleAdsError('Quota exceeded', 403, 'QUOTA_ERROR', {}, false, 'quota');
        expect(error.getUserMessage()).toBe(
          'API quota exceeded. Please contact support if this persists.'
        );
      });

      it('should return user-friendly message for client errors', () => {
        const error = new GoogleAdsError('Bad request', 400, 'CLIENT_ERROR', {}, false, 'client');
        expect(error.getUserMessage()).toBe('Invalid request parameters. Please check your input.');
      });

      it('should return generic message for unknown categories', () => {
        const error = new GoogleAdsError('Unknown error', 500, 'UNKNOWN', {}, false, 'server');
        expect(error.getUserMessage()).toBe('Service temporarily unavailable. Please try again.');
      });
    });

    describe('shouldRetry method', () => {
      it('should not retry client errors', () => {
        const error = new GoogleAdsError('Bad request', 400, 'CLIENT_ERROR', {}, true, 'client');
        expect(error.shouldRetry()).toBe(false);
      });

      it('should not retry auth errors', () => {
        const error = new GoogleAdsError('Unauthorized', 401, 'AUTH_ERROR', {}, true, 'auth');
        expect(error.shouldRetry()).toBe(false);
      });

      it('should retry server errors when marked retryable', () => {
        const error = new GoogleAdsError('Server error', 500, 'SERVER_ERROR', {}, true, 'server');
        expect(error.shouldRetry()).toBe(true);
      });

      it('should not retry when marked non-retryable', () => {
        const error = new GoogleAdsError('Server error', 500, 'SERVER_ERROR', {}, false, 'server');
        expect(error.shouldRetry()).toBe(false);
      });
    });

    describe('getRetryDelay method', () => {
      it('should return retry-after delay for rate limit errors', () => {
        const error = new GoogleAdsError(
          'Rate limited',
          429,
          'RATE_LIMIT',
          { retryAfter: 30000 },
          true,
          'rate_limit'
        );
        expect(error.getRetryDelay()).toBe(30000);
      });

      it('should cap retry-after delay at 5 minutes', () => {
        const error = new GoogleAdsError(
          'Rate limited',
          429,
          'RATE_LIMIT',
          { retryAfter: 600000 }, // 10 minutes
          true,
          'rate_limit'
        );
        expect(error.getRetryDelay()).toBe(300000); // Capped at 5 minutes
      });

      it('should return exponential backoff for server errors', () => {
        const error = new GoogleAdsError(
          'Server error',
          500,
          'SERVER_ERROR',
          { attemptCount: 3 },
          true,
          'server'
        );
        expect(error.getRetryDelay()).toBe(8000); // 1000 * 2^3
      });

      it('should cap exponential backoff at 30 seconds', () => {
        const error = new GoogleAdsError(
          'Server error',
          500,
          'SERVER_ERROR',
          { attemptCount: 10 },
          true,
          'server'
        );
        expect(error.getRetryDelay()).toBe(30000); // Capped at 30 seconds
      });

      it('should return 0 for non-retryable errors', () => {
        const error = new GoogleAdsError('Client error', 400, 'CLIENT_ERROR', {}, false, 'client');
        expect(error.getRetryDelay()).toBe(0);
      });
    });
  });

  describe('AuthenticationError', () => {
    it('should create authentication error with correct properties', () => {
      const error = new AuthenticationError('Invalid credentials');

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(401);
      expect(error.category).toBe('auth');
      expect(error.retryable).toBe(false);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should accept custom details and code', () => {
      const details = { provider: 'google' };
      const error = new AuthenticationError('Token expired', details, 'TOKEN_EXPIRED');

      expect(error.details).toBe(details);
      expect(error.code).toBe('TOKEN_EXPIRED');
    });
  });

  describe('OAuth2Error', () => {
    it('should create OAuth2 error with grant type and scope', () => {
      const error = new OAuth2Error(
        'Invalid grant',
        'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'https://www.googleapis.com/auth/adwords'
      );

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.grantType).toBe('urn:ietf:params:oauth:grant-type:jwt-bearer');
      expect(error.scope).toBe('https://www.googleapis.com/auth/adwords');
      expect(error.code).toBe('OAUTH2_ERROR');
    });

    it('should handle missing grant type and scope', () => {
      const error = new OAuth2Error('OAuth error');

      expect(error.grantType).toBeUndefined();
      expect(error.scope).toBeUndefined();
    });
  });

  describe('ServiceAccountError', () => {
    it('should create service account error with config field', () => {
      const error = new ServiceAccountError('Missing private key', 'private_key');

      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.configField).toBe('private_key');
      expect(error.code).toBe('SERVICE_ACCOUNT_ERROR');
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error with rate limit info', () => {
      const resetTime = new Date(Date.now() + 60000);
      const error = new RateLimitError('Rate limit exceeded', 100, 0, resetTime, 60000);

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(429);
      expect(error.category).toBe('rate_limit');
      expect(error.retryable).toBe(true);
      expect(error.limit).toBe(100);
      expect(error.remaining).toBe(0);
      expect(error.resetTime).toBe(resetTime);
      expect(error.retryAfter).toBe(60000);
    });

    it('should use default reset time when not provided', () => {
      const error = new RateLimitError('Rate limit exceeded', 100, 0, undefined, 30000);

      const expectedResetTime = new Date(Date.now() + 30000);
      expect(error.resetTime.getTime()).toBeCloseTo(expectedResetTime.getTime(), -2);
    });

    it('should provide user-friendly message with reset time', () => {
      const resetTime = new Date('2023-12-25T10:30:00Z');
      const error = new RateLimitError('Rate limit exceeded', 100, 25, resetTime);

      const message = error.getUserMessage();
      expect(message).toContain('25 requests remaining');
      expect(message).toContain('Resets at');
    });
  });

  describe('ApiQuotaError', () => {
    it('should create API quota error with quota info', () => {
      const resetTime = new Date('2023-12-26T00:00:00Z');
      const error = new ApiQuotaError('Daily quota exceeded', 'daily', 10000, 10000, resetTime);

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(403);
      expect(error.category).toBe('quota');
      expect(error.quotaType).toBe('daily');
      expect(error.quotaLimit).toBe(10000);
      expect(error.quotaUsed).toBe(10000);
      expect(error.quotaResetTime).toBe(resetTime);
      expect(error.retryable).toBe(true); // Daily quotas are retryable
    });

    it('should mark monthly quotas as non-retryable', () => {
      const error = new ApiQuotaError('Monthly quota exceeded', 'monthly', 1000000, 1000000);

      expect(error.retryable).toBe(false);
    });

    it('should provide user-friendly message with quota info', () => {
      const resetTime = new Date('2023-12-26T00:00:00Z');
      const error = new ApiQuotaError('Daily quota exceeded', 'daily', 10000, 9500, resetTime);

      const message = error.getUserMessage();
      expect(message).toContain('daily API quota exceeded');
      expect(message).toContain('9500/10000');
      expect(message).toContain('12/26/2023');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with field info', () => {
      const error = new ValidationError(
        'Invalid customer ID',
        'customerId',
        'invalid-id',
        'Must be exactly 10 digits'
      );

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(400);
      expect(error.category).toBe('client');
      expect(error.retryable).toBe(false);
      expect(error.field).toBe('customerId');
      expect(error.value).toBe('invalid-id');
      expect(error.constraint).toBe('Must be exactly 10 digits');
    });
  });

  describe('ResourceNotFoundError', () => {
    it('should create resource not found error', () => {
      const error = new ResourceNotFoundError('Campaign', '123456789');

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(404);
      expect(error.category).toBe('client');
      expect(error.resourceType).toBe('Campaign');
      expect(error.resourceId).toBe('123456789');
      expect(error.message).toBe("Campaign with ID '123456789' not found");
    });
  });

  describe('PermissionDeniedError', () => {
    it('should create permission denied error', () => {
      const error = new PermissionDeniedError('Access denied', 'campaign', 'read', '1234567890');

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(403);
      expect(error.category).toBe('client');
      expect(error.resource).toBe('campaign');
      expect(error.action).toBe('read');
      expect(error.customerId).toBe('1234567890');
    });
  });

  describe('NetworkError', () => {
    it('should create network error', () => {
      const error = new NetworkError('Connection failed', 'getCustomers', false);

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(500);
      expect(error.category).toBe('server');
      expect(error.retryable).toBe(true);
      expect(error.operation).toBe('getCustomers');
      expect(error.timeout).toBe(false);
      expect(error.code).toBe('NETWORK_ERROR');
    });

    it('should create timeout error', () => {
      const error = new NetworkError('Request timeout', 'searchStream', true);

      expect(error.statusCode).toBe(408);
      expect(error.timeout).toBe(true);
      expect(error.code).toBe('REQUEST_TIMEOUT');
    });
  });

  describe('CircuitBreakerError', () => {
    it('should create circuit breaker error', () => {
      const nextAttemptTime = new Date(Date.now() + 60000);
      const error = new CircuitBreakerError('Service unavailable', 'OPEN', 5, nextAttemptTime);

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(503);
      expect(error.category).toBe('server');
      expect(error.retryable).toBe(false); // Circuit breaker manages retries
      expect(error.state).toBe('OPEN');
      expect(error.failureCount).toBe(5);
      expect(error.nextAttemptTime).toBe(nextAttemptTime);
    });

    it('should provide user-friendly message with next attempt time', () => {
      const nextAttemptTime = new Date('2023-12-25T10:30:00Z');
      const error = new CircuitBreakerError('Service unavailable', 'OPEN', 5, nextAttemptTime);

      const message = error.getUserMessage();
      expect(message).toContain('Service temporarily unavailable');
      expect(message).toContain('Next attempt at');
    });
  });

  describe('CacheError', () => {
    it('should create cache error', () => {
      const error = new CacheError('Redis connection failed', 'get', 'customers');

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(500);
      expect(error.category).toBe('server');
      expect(error.retryable).toBe(true);
      expect(error.operation).toBe('get');
      expect(error.cacheKey).toBe('customers');
    });
  });

  describe('ConfigurationError', () => {
    it('should create configuration error', () => {
      const error = new ConfigurationError('Missing developer token', 'developerToken', 'string');

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(500);
      expect(error.category).toBe('client');
      expect(error.retryable).toBe(false);
      expect(error.configKey).toBe('developerToken');
      expect(error.expectedType).toBe('string');
    });
  });

  describe('ResponseParsingError', () => {
    it('should create response parsing error', () => {
      const responseData = { invalid: 'data' };
      const error = new ResponseParsingError(
        'Invalid response format',
        responseData,
        'SearchStreamResponse'
      );

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(500);
      expect(error.category).toBe('server');
      expect(error.retryable).toBe(false);
      expect(error.responseData).toBe(responseData);
      expect(error.expectedFormat).toBe('SearchStreamResponse');
    });
  });

  describe('GoogleAdsApiError', () => {
    it('should create Google Ads API error', () => {
      const error = new GoogleAdsApiError(
        'INVALID_CUSTOMER_ID',
        'INVALID_CUSTOMER_ID',
        400,
        'customer123',
        'customerId'
      );

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(400);
      expect(error.category).toBe('client');
      expect(error.errorCode).toBe('INVALID_CUSTOMER_ID');
      expect(error.trigger).toBe('customer123');
      expect(error.location).toBe('customerId');
    });

    describe('fromApiResponse static method', () => {
      it('should parse Google Ads API error response', () => {
        const apiResponse = {
          status: 400,
          error: {
            message: 'Request contains an invalid argument.',
            metadata: {
              requestId: 'req-12345',
            },
            details: [
              {
                errors: [
                  {
                    errorCode: 'INVALID_CUSTOMER_ID',
                    message: 'Customer ID is invalid',
                    trigger: 'customer123',
                    location: {
                      field: 'customerId',
                    },
                  },
                ],
              },
            ],
          },
        };

        const error = GoogleAdsApiError.fromApiResponse(apiResponse);

        expect(error.message).toBe('Request contains an invalid argument.');
        expect(error.errorCode).toBe('INVALID_CUSTOMER_ID');
        expect(error.statusCode).toBe(400);
        expect(error.trigger).toBe('customer123');
        expect(error.location).toBe('customerId');
        expect(error.details.requestId).toBe('req-12345');
      });

      it('should handle minimal API error response', () => {
        const apiResponse = {
          error: {
            message: 'Unknown error',
          },
        };

        const error = GoogleAdsApiError.fromApiResponse(apiResponse);

        expect(error.message).toBe('Unknown error');
        expect(error.errorCode).toBe('UNKNOWN_ERROR');
        expect(error.statusCode).toBe(400);
      });

      it('should handle completely malformed response', () => {
        const apiResponse = {};

        const error = GoogleAdsApiError.fromApiResponse(apiResponse);

        expect(error.message).toBe('Unknown Google Ads API error');
        expect(error.errorCode).toBe('UNKNOWN_ERROR');
      });
    });
  });

  describe('BatchOperationError', () => {
    it('should create batch operation error with partial results', () => {
      const partialResults = [
        { success: true, result: { id: '1' } },
        { success: false, error: new Error('Failed') },
        { success: true, result: { id: '2' } },
      ];

      const error = new BatchOperationError('Batch operation failed', partialResults);

      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error.statusCode).toBe(207); // Multi-status
      expect(error.category).toBe('client');
      expect(error.partialResults).toBe(partialResults);
      expect(error.successCount).toBe(2);
      expect(error.failureCount).toBe(1);
    });

    it('should provide user-friendly message with counts', () => {
      const partialResults = [
        { success: true, result: {} },
        { success: false, error: new Error('Failed') },
      ];

      const error = new BatchOperationError('Batch failed', partialResults);
      const message = error.getUserMessage();

      expect(message).toContain('1 successes');
      expect(message).toContain('1 failures');
    });
  });

  describe('ErrorUtils', () => {
    describe('isRetryable method', () => {
      it('should identify retryable GoogleAdsError', () => {
        const retryableError = new GoogleAdsError('Server error', 500, 'ERROR', {}, true);
        const nonRetryableError = new GoogleAdsError('Client error', 400, 'ERROR', {}, false);

        expect(ErrorUtils.isRetryable(retryableError)).toBe(true);
        expect(ErrorUtils.isRetryable(nonRetryableError)).toBe(false);
      });

      it('should identify retryable network errors', () => {
        const timeoutError = new Error('ETIMEDOUT');
        const connectionError = new Error('ECONNRESET');
        const dnsError = new Error('ENOTFOUND');
        const otherError = new Error('Other error');

        expect(ErrorUtils.isRetryable(timeoutError)).toBe(true);
        expect(ErrorUtils.isRetryable(connectionError)).toBe(true);
        expect(ErrorUtils.isRetryable(dnsError)).toBe(true);
        expect(ErrorUtils.isRetryable(otherError)).toBe(false);
      });
    });

    describe('getRetryDelay method', () => {
      it('should get retry delay from GoogleAdsError', () => {
        const error = new RateLimitError('Rate limited', 100, 0, undefined, 30000);
        expect(ErrorUtils.getRetryDelay(error)).toBe(30000);
      });

      it('should calculate exponential backoff for other errors', () => {
        const error = new Error('Network error');

        expect(ErrorUtils.getRetryDelay(error, 0)).toBe(1000);
        expect(ErrorUtils.getRetryDelay(error, 1)).toBe(2000);
        expect(ErrorUtils.getRetryDelay(error, 2)).toBe(4000);
        expect(ErrorUtils.getRetryDelay(error, 10)).toBe(30000); // Capped at 30s
      });
    });

    describe('wrapError method', () => {
      it('should return GoogleAdsError unchanged', () => {
        const originalError = new GoogleAdsError('Original error');
        const wrappedError = ErrorUtils.wrapError(originalError);

        expect(wrappedError).toBe(originalError);
      });

      it('should wrap other errors in GoogleAdsError', () => {
        const originalError = new Error('Original error');
        const wrappedError = ErrorUtils.wrapError(originalError);

        expect(wrappedError).toBeInstanceOf(GoogleAdsError);
        expect(wrappedError.message).toBe('Original error');
        expect(wrappedError.code).toBe('UNKNOWN_ERROR');
        expect(wrappedError.details.originalError).toBe(originalError);
      });

      it('should add context to wrapped errors', () => {
        const originalError = new Error('Original error');
        const wrappedError = ErrorUtils.wrapError(originalError, 'API call');

        expect(wrappedError.message).toBe('API call: Original error');
      });
    });

    describe('fromHttpResponse method', () => {
      it('should create GoogleAdsApiError for API error responses', () => {
        const response = {
          status: 400,
          data: {
            error: {
              message: 'Invalid request',
              details: [{ errors: [{ errorCode: 'INVALID_REQUEST' }] }],
            },
          },
        };

        const error = ErrorUtils.fromHttpResponse(response);

        expect(error).toBeInstanceOf(GoogleAdsApiError);
      });

      it('should create AuthenticationError for 401 responses', () => {
        const response = {
          status: 401,
          data: { message: 'Unauthorized' },
          statusText: 'Unauthorized',
        };

        const error = ErrorUtils.fromHttpResponse(response);

        expect(error).toBeInstanceOf(AuthenticationError);
      });

      it('should create PermissionDeniedError for 403 responses', () => {
        const response = {
          status: 403,
          data: { message: 'Forbidden' },
        };

        const error = ErrorUtils.fromHttpResponse(response);

        expect(error).toBeInstanceOf(PermissionDeniedError);
      });

      it('should create ResourceNotFoundError for 404 responses', () => {
        const response = {
          status: 404,
          data: { message: 'Not found' },
        };

        const error = ErrorUtils.fromHttpResponse(response);

        expect(error).toBeInstanceOf(ResourceNotFoundError);
      });

      it('should create RateLimitError for 429 responses', () => {
        const response = {
          status: 429,
          data: { message: 'Too many requests' },
        };

        const error = ErrorUtils.fromHttpResponse(response);

        expect(error).toBeInstanceOf(RateLimitError);
      });

      it('should create generic GoogleAdsError for other status codes', () => {
        const response = {
          status: 500,
          data: { message: 'Internal server error' },
        };

        const error = ErrorUtils.fromHttpResponse(response);

        expect(error).toBeInstanceOf(GoogleAdsError);
        expect(error.statusCode).toBe(500);
      });

      it('should add context to error message', () => {
        const response = {
          status: 400,
          data: { message: 'Bad request' },
        };

        const error = ErrorUtils.fromHttpResponse(response, 'API call');

        expect(error.message).toBe('API call: Bad request');
      });
    });

    describe('logError method', () => {
      let consoleSpy: jest.SpyInstance;

      beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      });

      afterEach(() => {
        consoleSpy.mockRestore();
      });

      it('should log to console when no logger provided', () => {
        const error = new GoogleAdsError('Test error');
        ErrorUtils.logError(error);

        expect(consoleSpy).toHaveBeenCalledWith('[SERVER] Test error', error.toJSON());
      });

      it('should use custom logger when provided', () => {
        const mockLogger = {
          error: jest.fn(),
          warn: jest.fn(),
        };

        const error = new GoogleAdsError('Test error', 400, 'ERROR', {}, false, 'client');
        ErrorUtils.logError(error, mockLogger);

        expect(mockLogger.warn).toHaveBeenCalledWith('Client error occurred', error.toJSON());
      });

      it('should log different categories at appropriate levels', () => {
        const mockLogger = {
          error: jest.fn(),
          warn: jest.fn(),
        };

        // Test auth error
        const authError = new AuthenticationError('Auth failed');
        ErrorUtils.logError(authError, mockLogger);
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Authentication error occurred',
          authError.toJSON()
        );

        // Test rate limit error
        const rateLimitError = new RateLimitError('Rate limited');
        ErrorUtils.logError(rateLimitError, mockLogger);
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'Rate limit error occurred',
          rateLimitError.toJSON()
        );

        // Test quota error
        const quotaError = new ApiQuotaError('Quota exceeded');
        ErrorUtils.logError(quotaError, mockLogger);
        expect(mockLogger.error).toHaveBeenCalledWith('Quota error occurred', quotaError.toJSON());
      });
    });
  });

  describe('Error Inheritance Chain', () => {
    it('should maintain proper inheritance for OAuth2Error', () => {
      const error = new OAuth2Error('OAuth error');

      expect(error).toBeInstanceOf(OAuth2Error);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should maintain proper inheritance for ServiceAccountError', () => {
      const error = new ServiceAccountError('Service account error');

      expect(error).toBeInstanceOf(ServiceAccountError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should maintain proper inheritance for GoogleAdsApiError', () => {
      const error = new GoogleAdsApiError('API error', 'ERROR_CODE');

      expect(error).toBeInstanceOf(GoogleAdsApiError);
      expect(error).toBeInstanceOf(GoogleAdsError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('Error Serialization and Deserialization', () => {
    it('should serialize and preserve error information', () => {
      const error = new RateLimitError('Rate limited', 100, 25, new Date(), 60000);
      const serialized = JSON.stringify(error.toJSON());
      const parsed = JSON.parse(serialized);

      expect(parsed.name).toBe('RateLimitError');
      expect(parsed.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(parsed.statusCode).toBe(429);
      expect(parsed.category).toBe('rate_limit');
    });

    it('should handle circular references in error details', () => {
      const circularObj: any = { prop: 'value' };
      circularObj.self = circularObj;

      // Should not throw when creating error with circular reference
      expect(() => {
        new GoogleAdsError('Test error', 500, 'ERROR', { circular: circularObj });
      }).not.toThrow();
    });
  });
});
