/**
 * Jest Test Setup for Google Ads API Tests
 * Global mocks, polyfills, and test utilities
 */

import { jest } from '@jest/globals';

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    }
    return {
      message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass: false,
    };
  },

  toHaveBeenCalledWithObjectContaining(received: jest.MockedFunction<any>, expected: any) {
    const { calls } = received.mock;
    const pass = calls.some((call: any) =>
      call.some(
        (arg: any) =>
          typeof arg === 'object' &&
          Object.keys(expected).every(
            (key) => arg && typeof arg === 'object' && key in arg && arg[key] === expected[key]
          )
      )
    );

    if (pass) {
      return {
        message: () =>
          `expected function not to have been called with object containing ${JSON.stringify(expected)}`,
        pass: true,
      };
    }
    return {
      message: () =>
        `expected function to have been called with object containing ${JSON.stringify(expected)}`,
      pass: false,
    };
  },
});

// Declare custom matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(floor: number, ceiling: number): R;
      toHaveBeenCalledWithObjectContaining(expected: any): R;
    }
  }
}

// Global test environment setup
beforeAll(() => {
  // Set timezone for consistent date testing
  import.meta.env.TZ = 'UTC';

  // Set test environment
  import.meta.env.MODE = 'test';

  // Mock global crypto if not available (Node.js < 15)
  if (!global.crypto) {
    const crypto = require('crypto');
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: crypto.randomUUID || (() => crypto.randomBytes(16).toString('hex')),
        getRandomValues: (arr: any) => crypto.randomFillSync(arr),
      },
    });
  }

  // Mock global garbage collection for memory tests
  if (!global.gc) {
    global.gc = jest.fn() as any;
  }
});

// Global test cleanup
afterAll(() => {
  // Cleanup any global state
  jest.clearAllTimers();
  jest.useRealTimers();
});

// Setup before each test
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Reset any global state
  jest.clearAllTimers();

  // Ensure clean environment variables
  delete import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  delete import.meta.env.GOOGLE_DEVELOPER_TOKEN;
});

// Cleanup after each test
afterEach(() => {
  // Restore all mocks
  jest.restoreAllMocks();

  // Clear any remaining timers
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  // Don't exit in tests, just log
});

// Suppress console output in tests unless debugging
const originalConsole = console;
if (!import.meta.env.DEBUG_TESTS) {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

// Mock external dependencies that are always mocked
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
  stat: jest.fn(),
}));

// Mock network-related modules
jest.mock('http', () => ({
  createServer: jest.fn(),
  request: jest.fn(),
}));

jest.mock('https', () => ({
  createServer: jest.fn(),
  request: jest.fn(),
}));

// Utility functions for tests
export const createMockServiceAccount = (overrides = {}) => ({
  type: 'service_account',
  project_id: 'test-project-12345',
  private_key_id: 'key123',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n',
  client_email: 'test@test-project-12345.iam.gserviceaccount.com',
  client_id: '123456789',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/test%40test-project-12345.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
  ...overrides,
});

export const createMockConfig = (overrides = {}) => ({
  developerToken: 'test-dev-token',
  serviceAccountKey: createMockServiceAccount(),
  loginCustomerId: '1234567890',
  redisUrl: 'redis://localhost:6379',
  rateLimitConfig: {
    maxRequestsPerDay: 15000,
    tokensPerSecond: 0.173,
    bucketSize: 100,
  },
  cacheConfig: {
    defaultTtl: 300,
    maxMemoryMB: 50,
    compressionEnabled: true,
  },
  circuitBreakerConfig: {
    failureThreshold: 5,
    recoveryTimeout: 60000,
    monitoringWindow: 300000,
  },
  ...overrides,
});

export const createMockAxiosResponse = (data: any, status = 200, headers = {}) => ({
  data,
  status,
  statusText: 'OK',
  headers: {
    'content-type': 'application/json',
    ...headers,
  },
  config: {} as any,
});

export const createMockAxiosError = (message: string, status = 500, data = {}) => {
  const error = new Error(message) as any;
  error.response = {
    status,
    data,
    statusText: status === 500 ? 'Internal Server Error' : 'Error',
    headers: {},
    config: {} as any,
  };
  error.isAxiosError = true;
  return error;
};

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitCondition = async (
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition()) {
      return true;
    }
    await waitFor(interval);
  }
  throw new Error(`Condition not met within ${timeout}ms`);
};

// Mock fetch for Node.js environments without it
if (!global.fetch) {
  global.fetch = jest.fn() as any;
}

// Mock WebSocket for real-time features
if (!global.WebSocket) {
  global.WebSocket = jest.fn() as any;
}

// Mock performance API
if (!global.performance) {
  global.performance = {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
  } as any;
}

// Enhanced console for debugging tests
export const debugLog = (...args: any[]) => {
  if (import.meta.env.DEBUG_TESTS) {
    originalConsole.log('[TEST DEBUG]', ...args);
  }
};

export const debugError = (...args: any[]) => {
  if (import.meta.env.DEBUG_TESTS) {
    originalConsole.error('[TEST ERROR]', ...args);
  }
};

// Test execution timer
export const timeTest = async (testFn: () => Promise<void> | void, name = 'test') => {
  const start = performance.now();
  try {
    await testFn();
  } finally {
    const end = performance.now();
    debugLog(`${name} took ${(end - start).toFixed(2)}ms`);
  }
};

// Memory usage helper
export const logMemoryUsage = (label = 'Memory usage') => {
  if (process.memoryUsage && import.meta.env.DEBUG_TESTS) {
    const usage = process.memoryUsage();
    debugLog(`${label}:`, {
      rss: `${Math.round((usage.rss / 1024 / 1024) * 100) / 100} MB`,
      heapTotal: `${Math.round((usage.heapTotal / 1024 / 1024) * 100) / 100} MB`,
      heapUsed: `${Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100} MB`,
      external: `${Math.round((usage.external / 1024 / 1024) * 100) / 100} MB`,
    });
  }
};

// Test data generators
export const generateLargeCampaignData = (count = 1000) => {
  return Array(count)
    .fill(null)
    .map((_, i) => ({
      campaign: {
        id: i.toString(),
        name: `Campaign ${i}`,
        status: i % 2 === 0 ? 'ENABLED' : 'PAUSED',
        biddingStrategyType: 'TARGET_CPA',
      },
      metrics: {
        impressions: Math.floor(Math.random() * 100000),
        clicks: Math.floor(Math.random() * 10000),
        conversions: Math.floor(Math.random() * 1000),
        costMicros: Math.floor(Math.random() * 1000000000),
      },
      segments: {
        date: new Date().toISOString().split('T')[0],
      },
    }));
};

export const generateCustomerData = (count = 10) => {
  return Array(count)
    .fill(null)
    .map((_, i) => ({
      resourceName: `customers/${1000000000 + i}`,
      id: (1000000000 + i).toString(),
      descriptiveName: `Customer ${i}`,
      currencyCode: 'USD',
      timeZone: 'UTC',
    }));
};

// Export all utilities
export default {
  createMockServiceAccount,
  createMockConfig,
  createMockAxiosResponse,
  createMockAxiosError,
  waitFor,
  waitCondition,
  debugLog,
  debugError,
  timeTest,
  logMemoryUsage,
  generateLargeCampaignData,
  generateCustomerData,
};
