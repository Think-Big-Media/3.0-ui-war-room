# Google Ads API Client Test Suite

A comprehensive test suite for the Google Ads API client built with TestSprite. This suite covers OAuth2 authentication, rate limiting, error handling, and edge cases with extensive mocking and assertions.

## 🎯 Test Coverage Areas

### 1. OAuth2 Flow Testing
- **Service Account JWT Generation**
  - Valid JWT claims structure
  - JWT ID for replay protection
  - Proper token expiration times
  - Algorithm and header validation

- **Token Exchange Process**
  - JWT to access token exchange
  - Token response validation
  - Timeout handling
  - Invalid response handling

- **Token Refresh Logic**  
  - Automatic token refresh on expiry
  - 60-second safety margin
  - Token reuse when valid

- **Invalid Credentials Handling**
  - `invalid_grant` error scenarios
  - Insufficient permissions
  - Service account validation
  - Security validation (email, private key, token URI, project ID)

### 2. Rate Limiting Tests
- **Token Bucket Behavior**
  - Token acquisition before API requests
  - Rate limit exceeded handling
  - Token bucket capacity respect

- **Rate Limit Headers Parsing**
  - Header extraction and processing
  - Graceful handling of missing headers

- **Retry Logic with Backoff**
  - Exponential backoff on rate limits
  - Non-retryable error handling

- **Concurrent Request Handling**
  - Multiple concurrent request management
  - Request queuing when rate limited

### 3. Error Handling Tests
- **Network Failures**
  - Connection timeout (ECONNABORTED)
  - Connection refused (ECONNREFUSED)
  - DNS resolution failures (ENOTFOUND)
  - Socket hang up (ECONNRESET)

- **API Error Responses**
  - 401 Authentication errors
  - 403 Permission denied
  - 403 Quota exceeded
  - 429 Rate limit errors
  - 500 Internal server errors
  - Malformed error responses

- **Timeout Scenarios**
  - Request timeout handling
  - Partial response timeouts

- **Circuit Breaker Activation**
  - Failure threshold triggering
  - State transitions (CLOSED → OPEN → HALF_OPEN)
  - Event emission

### 4. Edge Cases
- **Malformed Responses**
  - Empty response bodies
  - Missing required fields
  - Wrong data types
  - Corrupted JSON

- **Empty Result Sets**
  - Empty customer lists
  - Empty campaign performance results
  - Empty budget recommendations

- **Large Dataset Pagination**
  - Large result set handling
  - Page size limiting (max 10,000)
  - Resource exhaustion prevention

- **Invalid GAQL Queries**
  - SQL injection protection
  - Script tag filtering
  - Query length limits
  - Customer ID validation

- **Memory Management**
  - Large response object handling
  - Sensitive data clearing

## 🧪 Test Structure

### Main Test Files

```
__tests__/
├── GoogleAdsClient.test.ts         # Main client functionality (500+ tests)
├── TokenBucketRateLimiter.test.ts  # Rate limiting logic (200+ tests)
├── errors.test.ts                  # Error handling system (300+ tests)
├── jest.config.js                  # Jest configuration
├── setup.ts                        # Test setup and utilities
├── package.json                    # Test scripts and dependencies
├── tsconfig.test.json              # TypeScript config for tests
└── README.md                       # This documentation
```

### Test Categories

Each test file is organized into logical describe blocks:

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - Component interaction testing  
3. **Error Handling Tests** - Comprehensive error scenarios
4. **Edge Case Tests** - Boundary conditions and unusual inputs
5. **Performance Tests** - Memory usage and timing
6. **Security Tests** - Authentication and validation

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# CI mode (no watch, with coverage)
npm run test:ci

# Debug mode with verbose output
npm run test:debug
```

### Specific Test Categories

```bash
# Test individual components
npm run test:client           # GoogleAdsClient tests
npm run test:rate-limiter     # Rate limiter tests  
npm run test:errors          # Error handling tests

# Test specific functionality
npm run test:oauth           # OAuth2 flow tests
npm run test:rate-limiting   # Rate limiting tests
npm run test:error-handling  # Error handling tests
npm run test:edge-cases      # Edge case tests
npm run test:integration     # Integration tests
npm run test:performance     # Performance tests
npm run test:security        # Security tests
```

### Coverage and Reporting

```bash
# Generate coverage report
npm run test:coverage

# Open coverage report in browser
npm run coverage:open

# Serve coverage report on localhost:8080
npm run coverage:serve

# Update snapshots
npm run test:update-snapshots

# Clear Jest cache
npm run test:clear-cache
```

## 📊 Coverage Targets

### Global Coverage Thresholds
- **Branches**: 80%
- **Functions**: 80%  
- **Lines**: 80%
- **Statements**: 80%

### File-Specific Thresholds
- **client.ts**: 85% (core functionality)
- **rateLimiter.ts**: 90% (critical rate limiting)
- **errors.ts**: 95% (error handling system)

## 🛠 Test Configuration

### Jest Configuration Features
- **TypeScript Support** - Full ts-jest integration
- **Module Mocking** - Comprehensive external dependency mocking
- **Custom Matchers** - Extended Jest matchers for better assertions
- **Coverage Reporting** - Multiple report formats (HTML, LCOV, text)
- **Parallel Testing** - Multi-worker test execution
- **Cache Management** - Intelligent test caching
- **CI/CD Integration** - Optimized for continuous integration

### Mock Strategy
- **External Dependencies**: Axios, Redis, JWT, File System
- **Time-based Operations**: Fake timers for deterministic testing
- **Network Calls**: Complete HTTP request/response mocking
- **Error Scenarios**: Comprehensive error condition simulation

## 🔧 Test Utilities

### Custom Matchers
```typescript
expect(value).toBeWithinRange(min, max)
expect(mockFn).toHaveBeenCalledWithObjectContaining(obj)
```

### Helper Functions
```typescript
// Mock data generators
createMockServiceAccount(overrides)
createMockConfig(overrides)
createMockAxiosResponse(data, status, headers)
createMockAxiosError(message, status, data)

// Test utilities
waitFor(ms)
waitCondition(condition, timeout, interval)
timeTest(testFn, name)
logMemoryUsage(label)

// Data generators
generateLargeCampaignData(count)
generateCustomerData(count)
```

### Debug Utilities
```typescript
debugLog(...args)      // Conditional debug logging
debugError(...args)    // Conditional error logging
```

## 🧩 Test Patterns

### Mocking External Dependencies
```typescript
// Redis mocking
const mockRedis = {
  eval: jest.fn(),
  del: jest.fn(),
  ping: jest.fn()
} as any;

// Axios mocking  
mockedAxios.post.mockResolvedValueOnce({
  data: { access_token: 'token' }
});
```

### Error Testing Patterns
```typescript
// Network error simulation
const timeoutError = new Error('timeout of 30000ms exceeded');
timeoutError.name = 'ECONNABORTED';
mockAxiosInstance.get.mockRejectedValueOnce(timeoutError);

await expect(client.getCustomers()).rejects.toThrow(GoogleAdsError);
```

### Async Testing Patterns
```typescript
// Event emission testing
const eventPromise = new Promise(resolve => {
  client.on('authenticated', resolve);
});

await client.initialize();
await eventPromise;
```

### Performance Testing Patterns
```typescript
// Timing tests
const startTime = Date.now();
await client.getCampaignPerformance('1234567890');
const endTime = Date.now();

expect(endTime - startTime).toBeLessThan(1000);
```

## 📈 Metrics and Monitoring

### Test Execution Metrics
- **Total Tests**: 1000+ comprehensive test cases
- **Execution Time**: ~30-60 seconds for full suite
- **Memory Usage**: Monitored and logged in debug mode
- **Coverage Reports**: Generated in multiple formats

### Performance Benchmarks
- **Client Initialization**: < 100ms
- **Token Refresh**: < 200ms  
- **API Calls**: < 1000ms (mocked)
- **Rate Limiter**: < 10ms per operation

## 🔍 Debugging Tests

### Debug Mode
```bash
DEBUG_TESTS=true npm run test:debug
```

This enables:
- Verbose console output
- Memory usage logging
- Execution time tracking
- Stack trace preservation

### Common Debug Scenarios

1. **Async Operation Issues**: Use `waitCondition` helper
2. **Mock Call Verification**: Check `mock.calls` arrays
3. **Error Propagation**: Verify error inheritance chains
4. **Memory Leaks**: Enable `detectOpenHandles` in Jest config

## 🚨 Troubleshooting

### Common Issues

1. **Tests Hanging**: 
   - Check for unresolved promises
   - Ensure proper mock cleanup
   - Use `forceExit: true` in Jest config

2. **Mock Conflicts**:
   - Clear mocks between tests
   - Use `jest.isolateModules()` for module isolation
   - Check mock implementation order

3. **TypeScript Errors**:
   - Verify `tsconfig.test.json` settings
   - Check mock type definitions
   - Ensure proper Jest type imports

4. **Coverage Issues**:
   - Verify `collectCoverageFrom` patterns
   - Check excluded files
   - Review coverage thresholds

### Performance Issues

1. **Slow Test Execution**:
   - Reduce `maxWorkers` if memory constrained
   - Use `--runInBand` for debugging
   - Check for expensive operations in mocks

2. **Memory Usage**:
   - Enable `logHeapUsage` for monitoring
   - Use `detectLeaks` to identify leaks
   - Clear large test data between tests

## 📝 Contributing

### Adding New Tests

1. Follow existing test structure and naming conventions
2. Use appropriate describe/it block organization
3. Include both positive and negative test cases
4. Add comprehensive error scenario coverage
5. Update coverage thresholds if needed

### Test Quality Guidelines

1. **Descriptive Names**: Test names should clearly explain what is being tested
2. **Isolated Tests**: Each test should be independent and not rely on others
3. **Comprehensive Mocking**: Mock all external dependencies appropriately
4. **Error Coverage**: Test both success and failure scenarios
5. **Edge Cases**: Include boundary conditions and unusual inputs

### Code Review Checklist

- [ ] Tests cover new functionality completely
- [ ] Error scenarios are tested
- [ ] Mocks are properly configured and cleaned up
- [ ] Test names are descriptive
- [ ] No hardcoded values or timeouts
- [ ] Performance considerations addressed
- [ ] Coverage thresholds maintained

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest Configuration](https://kulshekhar.github.io/ts-jest/)
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [OAuth2 RFC](https://tools.ietf.org/html/rfc6749)
- [Token Bucket Algorithm](https://en.wikipedia.org/wiki/Token_bucket)

---

**Generated with TestSprite** - Comprehensive test suite generation for TypeScript applications.