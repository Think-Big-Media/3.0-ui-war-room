/**
 * Custom Error Classes for Google Ads API
 * Hierarchical error structure with detailed context
 * Follows Google Ads API error response patterns
 */

/**
 * Base Google Ads error class
 */
export class GoogleAdsError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: Record<string, any>;
  public readonly timestamp: Date;
  public readonly requestId?: string;
  public readonly retryable: boolean;
  public readonly category: 'client' | 'server' | 'rate_limit' | 'auth' | 'quota';

  constructor(
    message: string,
    statusCode = 500,
    code = 'GOOGLE_ADS_ERROR',
    details: Record<string, any> = {},
    retryable = false,
    category: 'client' | 'server' | 'rate_limit' | 'auth' | 'quota' = 'server'
  ) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date();
    this.retryable = retryable;
    this.category = category;

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging/monitoring (production-safe)
   */
  toJSON(): Record<string, any> {
    const isProduction = import.meta.env.PROD;

    const baseData = {
      name: this.name,
      message: isProduction ? this.getUserMessage() : this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId,
      retryable: this.retryable,
      category: this.category,
    };

    // Only include sensitive data in development
    if (!isProduction) {
      return {
        ...baseData,
        details: this.details,
        stack: this.stack,
      };
    }

    return baseData;
  }

  /**
   * Get user-friendly error message (safe for public display)
   */
  getUserMessage(): string {
    switch (this.category) {
      case 'auth':
        return 'Authentication failed. Please verify your API credentials.';
      case 'rate_limit':
        return 'Request rate limit exceeded. Please try again later.';
      case 'quota':
        return 'API quota exceeded. Please contact support if this persists.';
      case 'client':
        return 'Invalid request parameters. Please check your input.';
      case 'server':
        return 'Service temporarily unavailable. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Check if error should trigger a retry
   */
  shouldRetry(): boolean {
    return this.retryable && this.category !== 'client' && this.category !== 'auth';
  }

  /**
   * Get recommended retry delay in milliseconds
   */
  getRetryDelay(): number {
    switch (this.category) {
      case 'rate_limit':
        return Math.min(this.details.retryAfter || 60000, 300000); // Max 5 minutes
      case 'server':
        return Math.min(1000 * Math.pow(2, this.details.attemptCount || 0), 30000); // Exponential backoff, max 30s
      default:
        return 0;
    }
  }
}

/**
 * Authentication related errors
 */
export class AuthenticationError extends GoogleAdsError {
  constructor(message: string, details: Record<string, any> = {}, code = 'AUTHENTICATION_ERROR') {
    super(message, 401, code, details, false, 'auth');
  }
}

/**
 * OAuth2 specific errors
 */
export class OAuth2Error extends AuthenticationError {
  public readonly grantType?: string;
  public readonly scope?: string;

  constructor(
    message: string,
    grantType?: string,
    scope?: string,
    details: Record<string, any> = {}
  ) {
    super(message, { ...details, grantType, scope }, 'OAUTH2_ERROR');
    this.grantType = grantType;
    this.scope = scope;
  }
}

/**
 * Service account configuration errors
 */
export class ServiceAccountError extends AuthenticationError {
  public readonly configField?: string;

  constructor(message: string, configField?: string, details: Record<string, any> = {}) {
    super(message, { ...details, configField }, 'SERVICE_ACCOUNT_ERROR');
    this.configField = configField;
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends GoogleAdsError {
  public readonly limit: number;
  public readonly remaining: number;
  public readonly resetTime: Date;
  public readonly retryAfter: number;

  constructor(message: string, limit = 0, remaining = 0, resetTime?: Date, retryAfter = 60000) {
    super(
      message,
      429,
      'RATE_LIMIT_EXCEEDED',
      { limit, remaining, resetTime, retryAfter },
      true,
      'rate_limit'
    );

    this.limit = limit;
    this.remaining = remaining;
    this.resetTime = resetTime || new Date(Date.now() + retryAfter);
    this.retryAfter = retryAfter;
  }

  getUserMessage(): string {
    const resetTimeStr = this.resetTime.toLocaleTimeString();
    return `Rate limit exceeded. ${this.remaining} requests remaining. Resets at ${resetTimeStr}.`;
  }
}

/**
 * API quota exceeded errors
 */
export class ApiQuotaError extends GoogleAdsError {
  public readonly quotaType: 'daily' | 'monthly' | 'concurrent';
  public readonly quotaLimit: number;
  public readonly quotaUsed: number;
  public readonly quotaResetTime?: Date;

  constructor(
    message: string,
    quotaType: 'daily' | 'monthly' | 'concurrent' = 'daily',
    quotaLimit = 0,
    quotaUsed = 0,
    quotaResetTime?: Date
  ) {
    super(
      message,
      403,
      'API_QUOTA_EXCEEDED',
      { quotaType, quotaLimit, quotaUsed, quotaResetTime },
      quotaType !== 'monthly', // Monthly quotas typically don't reset quickly
      'quota'
    );

    this.quotaType = quotaType;
    this.quotaLimit = quotaLimit;
    this.quotaUsed = quotaUsed;
    this.quotaResetTime = quotaResetTime;
  }

  getUserMessage(): string {
    const resetInfo = this.quotaResetTime
      ? ` Quota resets at ${this.quotaResetTime.toLocaleDateString()}.`
      : '';
    return `${this.quotaType} API quota exceeded (${this.quotaUsed}/${this.quotaLimit}).${resetInfo}`;
  }
}

/**
 * Validation errors for request parameters
 */
export class ValidationError extends GoogleAdsError {
  public readonly field: string;
  public readonly value: any;
  public readonly constraint: string;

  constructor(
    message: string,
    field: string,
    value: any,
    constraint: string,
    details: Record<string, any> = {}
  ) {
    super(
      message,
      400,
      'VALIDATION_ERROR',
      { ...details, field, value, constraint },
      false,
      'client'
    );

    this.field = field;
    this.value = value;
    this.constraint = constraint;
  }
}

/**
 * Resource not found errors
 */
export class ResourceNotFoundError extends GoogleAdsError {
  public readonly resourceType: string;
  public readonly resourceId: string;

  constructor(resourceType: string, resourceId: string, details: Record<string, any> = {}) {
    const message = `${resourceType} with ID '${resourceId}' not found`;
    super(
      message,
      404,
      'RESOURCE_NOT_FOUND',
      { ...details, resourceType, resourceId },
      false,
      'client'
    );

    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }
}

/**
 * Permission denied errors
 */
export class PermissionDeniedError extends GoogleAdsError {
  public readonly resource: string;
  public readonly action: string;
  public readonly customerId?: string;

  constructor(
    message: string,
    resource: string,
    action: string,
    customerId?: string,
    details: Record<string, any> = {}
  ) {
    super(
      message,
      403,
      'PERMISSION_DENIED',
      { ...details, resource, action, customerId },
      false,
      'client'
    );

    this.resource = resource;
    this.action = action;
    this.customerId = customerId;
  }
}

/**
 * Network related errors
 */
export class NetworkError extends GoogleAdsError {
  public readonly operation: string;
  public readonly timeout: boolean;

  constructor(
    message: string,
    operation: string,
    timeout = false,
    details: Record<string, any> = {}
  ) {
    super(
      message,
      timeout ? 408 : 500,
      timeout ? 'REQUEST_TIMEOUT' : 'NETWORK_ERROR',
      { ...details, operation, timeout },
      true,
      'server'
    );

    this.operation = operation;
    this.timeout = timeout;
  }
}

/**
 * Circuit breaker errors
 */
export class CircuitBreakerError extends GoogleAdsError {
  public readonly state: 'OPEN' | 'HALF_OPEN';
  public readonly failureCount: number;
  public readonly nextAttemptTime: Date;

  constructor(
    message: string,
    state: 'OPEN' | 'HALF_OPEN',
    failureCount: number,
    nextAttemptTime: Date,
    details: Record<string, any> = {}
  ) {
    super(
      message,
      503,
      'CIRCUIT_BREAKER_OPEN',
      { ...details, state, failureCount, nextAttemptTime },
      false, // Circuit breaker manages retries internally
      'server'
    );

    this.state = state;
    this.failureCount = failureCount;
    this.nextAttemptTime = nextAttemptTime;
  }

  getUserMessage(): string {
    const nextAttemptStr = this.nextAttemptTime.toLocaleTimeString();
    return `Service temporarily unavailable due to multiple failures. Next attempt at ${nextAttemptStr}.`;
  }
}

/**
 * Cache related errors
 */
export class CacheError extends GoogleAdsError {
  public readonly operation: 'get' | 'set' | 'delete' | 'invalidate';
  public readonly cacheKey?: string;

  constructor(
    message: string,
    operation: 'get' | 'set' | 'delete' | 'invalidate',
    cacheKey?: string,
    details: Record<string, any> = {}
  ) {
    super(
      message,
      500,
      'CACHE_ERROR',
      { ...details, operation, cacheKey },
      true, // Cache errors are usually temporary
      'server'
    );

    this.operation = operation;
    this.cacheKey = cacheKey;
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends GoogleAdsError {
  public readonly configKey: string;
  public readonly expectedType?: string;

  constructor(
    message: string,
    configKey: string,
    expectedType?: string,
    details: Record<string, any> = {}
  ) {
    super(
      message,
      500,
      'CONFIGURATION_ERROR',
      { ...details, configKey, expectedType },
      false,
      'client'
    );

    this.configKey = configKey;
    this.expectedType = expectedType;
  }
}

/**
 * API response parsing errors
 */
export class ResponseParsingError extends GoogleAdsError {
  public readonly responseData: any;
  public readonly expectedFormat: string;

  constructor(
    message: string,
    responseData: any,
    expectedFormat: string,
    details: Record<string, any> = {}
  ) {
    super(
      message,
      500,
      'RESPONSE_PARSING_ERROR',
      { ...details, responseData, expectedFormat },
      false,
      'server'
    );

    this.responseData = responseData;
    this.expectedFormat = expectedFormat;
  }
}

/**
 * Google Ads API specific errors
 */
export class GoogleAdsApiError extends GoogleAdsError {
  public readonly errorCode: string;
  public readonly trigger?: string;
  public readonly location?: string;

  constructor(
    message: string,
    errorCode: string,
    statusCode = 400,
    trigger?: string,
    location?: string,
    details: Record<string, any> = {}
  ) {
    super(
      message,
      statusCode,
      'GOOGLE_ADS_API_ERROR',
      { ...details, errorCode, trigger, location },
      false,
      'client'
    );

    this.errorCode = errorCode;
    this.trigger = trigger;
    this.location = location;
  }

  /**
   * Parse Google Ads API error response
   */
  static fromApiResponse(response: any): GoogleAdsApiError {
    const { error } = response || {};
    const details = error?.details?.[0];

    return new GoogleAdsApiError(
      error?.message || 'Unknown Google Ads API error',
      details?.errors?.[0]?.errorCode || 'UNKNOWN_ERROR',
      response.status || 400,
      details?.errors?.[0]?.trigger,
      details?.errors?.[0]?.location?.field,
      {
        requestId: error?.metadata?.requestId,
        errors: details?.errors || [],
        rawResponse: response,
      }
    );
  }
}

/**
 * Batch operation errors
 */
export class BatchOperationError extends GoogleAdsError {
  public readonly partialResults: Array<{ success: boolean; error?: any; result?: any }>;
  public readonly successCount: number;
  public readonly failureCount: number;

  constructor(
    message: string,
    partialResults: Array<{ success: boolean; error?: any; result?: any }>,
    details: Record<string, any> = {}
  ) {
    const successCount = partialResults.filter((r) => r.success).length;
    const failureCount = partialResults.length - successCount;

    super(
      message,
      207, // Multi-status
      'BATCH_OPERATION_ERROR',
      { ...details, partialResults, successCount, failureCount },
      false,
      'client'
    );

    this.partialResults = partialResults;
    this.successCount = successCount;
    this.failureCount = failureCount;
  }

  getUserMessage(): string {
    return `Batch operation completed with ${this.successCount} successes and ${this.failureCount} failures.`;
  }
}

/**
 * Error utility functions
 */
export class ErrorUtils {
  /**
   * Check if error is retryable
   */
  static isRetryable(error: Error): boolean {
    if (error instanceof GoogleAdsError) {
      return error.shouldRetry();
    }

    // Network errors are generally retryable
    return (
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('ENOTFOUND')
    );
  }

  /**
   * Get retry delay for error
   */
  static getRetryDelay(error: Error, attemptCount = 0): number {
    if (error instanceof GoogleAdsError) {
      return error.getRetryDelay();
    }

    // Default exponential backoff
    return Math.min(1000 * Math.pow(2, attemptCount), 30000);
  }

  /**
   * Wrap unknown errors in GoogleAdsError
   */
  static wrapError(error: any, context?: string): GoogleAdsError {
    if (error instanceof GoogleAdsError) {
      return error;
    }

    const message = context ? `${context}: ${error.message}` : error.message;
    return new GoogleAdsError(message, 500, 'UNKNOWN_ERROR', { originalError: error });
  }

  /**
   * Create error from HTTP response
   */
  static fromHttpResponse(response: any, context?: string): GoogleAdsError {
    const status = response.status || 500;
    const data = response.data || {};

    if (data.error) {
      return GoogleAdsApiError.fromApiResponse({ ...data, status });
    }

    const message = data.message || response.statusText || 'HTTP Error';
    const contextualMessage = context ? `${context}: ${message}` : message;

    switch (status) {
      case 401:
        return new AuthenticationError(contextualMessage);
      case 403:
        return new PermissionDeniedError(contextualMessage, 'unknown', 'unknown');
      case 404:
        return new ResourceNotFoundError('resource', 'unknown');
      case 429:
        return new RateLimitError(contextualMessage);
      default:
        return new GoogleAdsError(contextualMessage, status);
    }
  }

  /**
   * Log error with appropriate level
   */
  static logError(error: GoogleAdsError, logger?: any): void {
    const logData = error.toJSON();

    if (!logger) {
      console.error(`[${error.category.toUpperCase()}] ${error.message}`, logData);
      return;
    }

    switch (error.category) {
      case 'client':
        logger.warn('Client error occurred', logData);
        break;
      case 'auth':
        logger.error('Authentication error occurred', logData);
        break;
      case 'rate_limit':
        logger.warn('Rate limit error occurred', logData);
        break;
      case 'quota':
        logger.error('Quota error occurred', logData);
        break;
      default:
        logger.error('Server error occurred', logData);
    }
  }
}

export default {
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
};
