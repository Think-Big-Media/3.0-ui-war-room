/**
 * Jest Configuration for Google Ads API Tests
 * Optimized for TypeScript, mocking, and comprehensive testing
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Root directory for tests
  rootDir: '../',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts'
  ],
  
  // TypeScript transformation
  preset: 'ts-jest',
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Transform configuration
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        compilerOptions: {
          // Enable ES modules for better testing
          module: 'ESNext',
          target: 'ES2020',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          skipLibCheck: true,
          strict: true,
          // Enable decorators if needed
          experimentalDecorators: true,
          emitDecoratorMetadata: true
        }
      }
    }]
  },
  
  // Module name mapping for absolute imports
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1'
  },
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup.ts'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '<rootDir>/__tests__/coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'clover'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Specific thresholds for core files
    './client.ts': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './rateLimiter.ts': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './errors.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  
  // Files to collect coverage from
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Timeout for tests (30 seconds)
  testTimeout: 30000,
  
  // Verbose output for debugging
  verbose: true,
  
  // Enable fake timers
  fakeTimers: {
    enableGlobally: false // Enable per test when needed
  },
  
  // Error handling
  errorOnDeprecated: true,
  
  // Test results processor for better output
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '<rootDir>/__tests__/coverage',
      outputName: 'junit.xml',
      suiteName: 'Google Ads API Tests'
    }]
  ],
  
  // Global test configuration
  globals: {
    'ts-jest': {
      isolatedModules: true,
      useESM: false
    }
  },
  
  // Mock configuration
  mockPathIgnorePatterns: [
    '/node_modules/(?!(axios|ioredis|jsonwebtoken)/)'
  ],
  
  // Snapshot configuration
  snapshotSerializers: [],
  
  // Watch mode configuration
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],
  
  // Maximum worker processes for parallel testing
  maxWorkers: '75%',
  
  // Cache configuration
  cache: true,
  cacheDirectory: '<rootDir>/__tests__/.jest-cache',
  
  // Bail configuration - stop on first failure in CI
  bail: import.meta.env.CI ? 1 : false,
  
  // Force exit to prevent hanging processes
  forceExit: true,
  
  // Detect open handles to identify memory leaks
  detectOpenHandles: true,
  
  // Detect leaked handles
  detectLeaks: false, // Enable if investigating memory leaks
  
  // Log heap usage
  logHeapUsage: false, // Enable for memory debugging
  
  // Test name pattern for focused testing
  // testNamePattern: import.meta.env.TEST_PATTERN,
  
  // Silent mode for cleaner output in CI
  silent: import.meta.env.CI === 'true',
  
  // Notify mode for development
  notify: import.meta.env.MODE !== 'production' && !import.meta.env.CI,
  notifyMode: 'failure-change'
};