// Performance Test - Validate 10,000 events/minute target

import { UnifiedMonitoringPipeline } from './unifiedPipeline';
import { EventStore } from './eventStore';
import { WebSocketBroadcaster } from './websocketBroadcaster';
import {
  type MonitoringEvent,
  type MonitoringConfig,
  PipelineMetrics,
} from './types';

interface PerformanceTestResults {
  test_name: string;
  target_events_per_minute: number;
  actual_events_per_minute: number;
  processing_latency_ms: number;
  memory_usage_mb: number;
  cpu_usage_percent: number;
  success_rate_percent: number;
  bottlenecks: string[];
  recommendations: string[];
  passed: boolean;
}

interface LoadTestScenario {
  name: string;
  duration_seconds: number;
  events_per_second: number;
  concurrent_sources: number;
  event_types: ('mention' | 'news' | 'social' | 'review' | 'forum')[];
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export class MonitoringPerformanceTest {
  private eventStore: EventStore;
  private broadcaster: WebSocketBroadcaster;
  private pipeline?: UnifiedMonitoringPipeline;
  private testResults: PerformanceTestResults[] = [];
  private isRunning = false;

  constructor() {
    this.eventStore = new EventStore();
    this.broadcaster = new WebSocketBroadcaster(8081); // Different port for testing
  }

  async runFullPerformanceTest(): Promise<PerformanceTestResults[]> {
    console.log('🛠️ Starting comprehensive performance testing...');

    const scenarios: LoadTestScenario[] = [
      {
        name: 'Baseline Load Test',
        duration_seconds: 60,
        events_per_second: 50, // 3,000/minute
        concurrent_sources: 2,
        event_types: ['mention', 'social'],
        sentiment_distribution: { positive: 0.4, negative: 0.3, neutral: 0.3 },
      },
      {
        name: 'Target Load Test',
        duration_seconds: 120,
        events_per_second: 167, // ~10,000/minute
        concurrent_sources: 2,
        event_types: ['mention', 'news', 'social'],
        sentiment_distribution: { positive: 0.3, negative: 0.4, neutral: 0.3 },
      },
      {
        name: 'Peak Load Test',
        duration_seconds: 60,
        events_per_second: 300, // 18,000/minute
        concurrent_sources: 2,
        event_types: ['mention', 'news', 'social', 'review', 'forum'],
        sentiment_distribution: { positive: 0.2, negative: 0.6, neutral: 0.2 },
      },
      {
        name: 'Crisis Simulation',
        duration_seconds: 90,
        events_per_second: 250, // 15,000/minute
        concurrent_sources: 2,
        event_types: ['mention', 'news', 'social'],
        sentiment_distribution: { positive: 0.1, negative: 0.8, neutral: 0.1 },
      },
    ];

    this.testResults = [];

    try {
      // Initialize test environment
      await this.setupTestEnvironment();

      // Run each scenario
      for (const scenario of scenarios) {
        console.log(`
📏 Running scenario: ${scenario.name}`);
        const result = await this.runLoadTestScenario(scenario);
        this.testResults.push(result);

        // Brief pause between tests
        await this.sleep(5000);
      }

      // Generate summary report
      this.generatePerformanceReport();

    } finally {
      await this.teardownTestEnvironment();
    }

    return this.testResults;
  }

  private async setupTestEnvironment(): Promise<void> {
    console.log('🔧 Setting up test environment...');

    // Create test configuration
    const testConfig: MonitoringConfig = {
      keywords: ['test', 'performance', 'load'],
      competitors: ['competitor1', 'competitor2'],
      languages: ['en'],
      platforms: ['twitter', 'facebook', 'news', 'blog'],
      filters: {
        exclude_keywords: ['spam', 'irrelevant'],
        min_followers: 0,
        min_reach: 0,
      },
      crisis_thresholds: {
        mentions_per_hour: 100,
        sentiment_threshold: 0.6,
        reach_multiplier: 3.0,
        duration_minutes: 15,
      },
      alert_settings: {
        email_recipients: ['test@example.com'],
        escalation_delay_minutes: 5,
      },
      deduplication: {
        enabled: true,
        time_window_minutes: 30,
        similarity_threshold: 0.8,
      },
    };

    // Initialize pipeline
    this.pipeline = new UnifiedMonitoringPipeline(
      testConfig,
      this.eventStore,
      this.broadcaster,
    );

    // Start services
    await this.broadcaster.start();
    await this.pipeline.start();

    console.log('✅ Test environment ready');
  }

  private async teardownTestEnvironment(): Promise<void> {
    console.log('🧹 Cleaning up test environment...');

    if (this.pipeline) {
      await this.pipeline.stop();
    }

    await this.broadcaster.stop();

    // Flush any pending data
    await this.eventStore.flush();

    console.log('✅ Test environment cleaned up');
  }

  private async runLoadTestScenario(scenario: LoadTestScenario): Promise<PerformanceTestResults> {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    const startCpuUsage = process.cpuUsage();

    let eventsGenerated = 0;
    let eventsProcessed = 0;
    const errors = 0;
    const processingLatencies: number[] = [];

    this.isRunning = true;

    console.log(`⏱️ Starting ${scenario.name} for ${scenario.duration_seconds}s at ${scenario.events_per_second} events/sec`);

    // Start event generation
    const eventGenerationPromises = Array.from({ length: scenario.concurrent_sources }, (_, sourceIndex) =>
      this.generateEventStream(scenario, sourceIndex, (latency) => {
        processingLatencies.push(latency);
        eventsProcessed++;
      }),
    );

    // Monitor performance during test
    const monitoringInterval = setInterval(() => {
      if (!this.pipeline) {return;}

      const metrics = this.pipeline.getMetrics();
      const currentRate = metrics.events_per_minute;
      const elapsed = (Date.now() - startTime) / 1000;

      console.log(`📊 [${elapsed.toFixed(0)}s] Rate: ${currentRate.toFixed(0)} events/min, Processed: ${eventsProcessed}, Latency: ${metrics.processing_latency_ms}ms`);
    }, 10000); // Every 10 seconds

    // Run for specified duration
    await this.sleep(scenario.duration_seconds * 1000);

    this.isRunning = false;
    clearInterval(monitoringInterval);

    // Wait for all generation promises to complete
    const generationResults = await Promise.allSettled(eventGenerationPromises);
    eventsGenerated = generationResults.reduce((sum, result) => {
      return sum + (result.status === 'fulfilled' ? result.value : 0);
    }, 0);

    // Wait a bit more for processing to complete
    await this.sleep(5000);

    // Calculate results
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    const endCpuUsage = process.cpuUsage(startCpuUsage);

    const actualDuration = (endTime - startTime) / 1000;
    const actualEventsPerMinute = (eventsProcessed / actualDuration) * 60;
    const avgProcessingLatency = processingLatencies.length > 0
      ? processingLatencies.reduce((sum, lat) => sum + lat, 0) / processingLatencies.length
      : 0;

    const memoryUsageMB = (endMemory.heapUsed - startMemory.heapUsed) / (1024 * 1024);
    const cpuUsagePercent = ((endCpuUsage.user + endCpuUsage.system) / (actualDuration * 1000000)) * 100;
    const successRate = eventsGenerated > 0 ? (eventsProcessed / eventsGenerated) * 100 : 0;

    // Analyze bottlenecks
    const bottlenecks = this.identifyBottlenecks({
      processing_latency: avgProcessingLatency,
      success_rate: successRate,
      memory_usage: memoryUsageMB,
      cpu_usage: cpuUsagePercent,
      target_rate: scenario.events_per_second * 60,
      actual_rate: actualEventsPerMinute,
    });

    const recommendations = this.generateRecommendations(bottlenecks);

    return {
      test_name: scenario.name,
      target_events_per_minute: scenario.events_per_second * 60,
      actual_events_per_minute: actualEventsPerMinute,
      processing_latency_ms: avgProcessingLatency,
      memory_usage_mb: memoryUsageMB,
      cpu_usage_percent: cpuUsagePercent,
      success_rate_percent: successRate,
      bottlenecks,
      recommendations,
      passed: actualEventsPerMinute >= 10000 && successRate >= 95 && avgProcessingLatency < 60000,
    };
  }

  private async generateEventStream(
    scenario: LoadTestScenario,
    sourceIndex: number,
    onProcessed: (latency: number) => void,
  ): Promise<number> {
    let eventsGenerated = 0;
    const intervalMs = 1000 / scenario.events_per_second;

    while (this.isRunning) {
      try {
        const event = this.generateMockEvent(scenario, sourceIndex);
        const processingStart = Date.now();

        // Send event to pipeline
        if (this.pipeline) {
          await this.pipeline.processEvents([event]);
          const latency = Date.now() - processingStart;
          onProcessed(latency);
        }

        eventsGenerated++;

        // Control rate
        await this.sleep(intervalMs);

      } catch (error) {
        console.error('Error generating event:', error);
      }
    }

    return eventsGenerated;
  }

  private generateMockEvent(scenario: LoadTestScenario, sourceIndex: number): MonitoringEvent {
    const eventType = scenario.event_types[Math.floor(Math.random() * scenario.event_types.length)];
    const sentimentRand = Math.random();

    let sentimentLabel: 'positive' | 'negative' | 'neutral';
    let sentimentScore: number;

    if (sentimentRand < scenario.sentiment_distribution.positive) {
      sentimentLabel = 'positive';
      sentimentScore = 0.2 + Math.random() * 0.8; // 0.2 to 1.0
    } else if (sentimentRand < scenario.sentiment_distribution.positive + scenario.sentiment_distribution.negative) {
      sentimentLabel = 'negative';
      sentimentScore = -1.0 + Math.random() * 0.8; // -1.0 to -0.2
    } else {
      sentimentLabel = 'neutral';
      sentimentScore = -0.2 + Math.random() * 0.4; // -0.2 to 0.2
    }

    const platforms = ['twitter', 'facebook', 'instagram', 'news', 'blog', 'reddit'];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];

    return {
      id: `test_${sourceIndex}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      source: 'mentionlytics',
      type: eventType,
      timestamp: new Date(),
      title: `Test ${eventType} event ${Math.floor(Math.random() * 1000)}`,
      content: `This is a test ${eventType} with ${sentimentLabel} sentiment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      url: `https://example.com/post/${Math.floor(Math.random() * 10000)}`,
      author: {
        name: `TestUser${Math.floor(Math.random() * 1000)}`,
        handle: `@testuser${Math.floor(Math.random() * 1000)}`,
        followers: Math.floor(Math.random() * 10000),
        verified: Math.random() < 0.1,
      },
      platform,
      sentiment: {
        score: sentimentScore,
        label: sentimentLabel,
        confidence: 0.7 + Math.random() * 0.3,
        emotion: sentimentLabel === 'negative' ? 'anger' : sentimentLabel === 'positive' ? 'joy' : undefined,
      },
      metrics: {
        reach: Math.floor(Math.random() * 100000),
        engagement: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
      },
      keywords: ['test', 'performance', `keyword${Math.floor(Math.random() * 10)}`],
      mentions: ['test_brand', 'competitor'],
      language: 'en',
      location: Math.random() < 0.3 ? {
        country: 'US',
        region: 'California',
        city: 'San Francisco',
      } : undefined,
      influence_score: Math.floor(Math.random() * 100),
      raw_data: { test: true, scenario: scenario.name },
    };
  }

  private identifyBottlenecks(metrics: any): string[] {
    const bottlenecks: string[] = [];

    if (metrics.processing_latency > 30000) {
      bottlenecks.push('High processing latency (>30s)');
    }

    if (metrics.success_rate < 95) {
      bottlenecks.push('Low success rate (<95%)');
    }

    if (metrics.memory_usage > 500) {
      bottlenecks.push('High memory usage (>500MB)');
    }

    if (metrics.cpu_usage > 80) {
      bottlenecks.push('High CPU usage (>80%)');
    }

    if (metrics.actual_rate < metrics.target_rate * 0.9) {
      bottlenecks.push('Throughput below target (>10% deficit)');
    }

    return bottlenecks;
  }

  private generateRecommendations(bottlenecks: string[]): string[] {
    const recommendations: string[] = [];

    if (bottlenecks.some(b => b.includes('processing latency'))) {
      recommendations.push('Optimize event processing pipeline');
      recommendations.push('Implement better batching strategies');
      recommendations.push('Consider async processing for non-critical operations');
    }

    if (bottlenecks.some(b => b.includes('success rate'))) {
      recommendations.push('Improve error handling and retry mechanisms');
      recommendations.push('Add circuit breakers for external API calls');
    }

    if (bottlenecks.some(b => b.includes('memory usage'))) {
      recommendations.push('Implement better memory management');
      recommendations.push('Add memory-based back-pressure');
      recommendations.push('Consider streaming processing');
    }

    if (bottlenecks.some(b => b.includes('CPU usage'))) {
      recommendations.push('Profile CPU-intensive operations');
      recommendations.push('Consider worker thread pools');
      recommendations.push('Optimize hot code paths');
    }

    if (bottlenecks.some(b => b.includes('throughput'))) {
      recommendations.push('Scale horizontally with multiple instances');
      recommendations.push('Implement load balancing');
      recommendations.push('Optimize database operations');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is within acceptable parameters');
    }

    return recommendations;
  }

  private generatePerformanceReport(): void {
    console.log('\n📈 PERFORMANCE TEST REPORT');
    console.log('================================\n');

    const targetMet = this.testResults.some(r =>
      r.actual_events_per_minute >= 10000 && r.passed,
    );

    console.log('🎯 TARGET: 10,000 events/minute');
    console.log(`✅ RESULT: ${targetMet ? 'PASSED' : 'FAILED'}\n`);

    this.testResults.forEach(result => {
      console.log(`📏 ${result.test_name}`);
      console.log(`   Target: ${result.target_events_per_minute.toLocaleString()} events/min`);
      console.log(`   Actual: ${result.actual_events_per_minute.toFixed(0)} events/min`);
      console.log(`   Latency: ${result.processing_latency_ms.toFixed(0)}ms`);
      console.log(`   Success: ${result.success_rate_percent.toFixed(1)}%`);
      console.log(`   Memory: ${result.memory_usage_mb.toFixed(1)}MB`);
      console.log(`   CPU: ${result.cpu_usage_percent.toFixed(1)}%`);
      console.log(`   Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);

      if (result.bottlenecks.length > 0) {
        console.log(`   Bottlenecks: ${result.bottlenecks.join(', ')}`);
      }

      console.log('');
    });

    // Overall recommendations
    const allBottlenecks = [...new Set(this.testResults.flatMap(r => r.bottlenecks))];
    const allRecommendations = [...new Set(this.testResults.flatMap(r => r.recommendations))];

    if (allBottlenecks.length > 0) {
      console.log('🔴 IDENTIFIED BOTTLENECKS:');
      allBottlenecks.forEach(bottleneck => console.log(`   • ${bottleneck}`));
      console.log('');
    }

    console.log('💡 RECOMMENDATIONS:');
    allRecommendations.forEach(rec => console.log(`   • ${rec}`));
    console.log('');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Quick benchmark for specific components
  async benchmarkEventStore(numEvents = 1000): Promise<number> {
    console.log(`📋 Benchmarking EventStore with ${numEvents} events...`);

    const events = Array.from({ length: numEvents }, (_, i) =>
      this.generateMockEvent({
        name: 'benchmark',
        duration_seconds: 60,
        events_per_second: 100,
        concurrent_sources: 1,
        event_types: ['mention'],
        sentiment_distribution: { positive: 0.33, negative: 0.33, neutral: 0.34 },
      }, 0),
    );

    const startTime = Date.now();

    for (const event of events) {
      await this.eventStore.storeEvent(event);
    }

    await this.eventStore.flush();

    const duration = Date.now() - startTime;
    const eventsPerSecond = (numEvents / duration) * 1000;

    console.log(`✅ EventStore benchmark: ${eventsPerSecond.toFixed(0)} events/sec`);

    return eventsPerSecond;
  }

  async benchmarkAlertEngine(numEvents = 500): Promise<number> {
    console.log(`🚨 Benchmarking AlertEngine with ${numEvents} events...`);

    const config: MonitoringConfig = {
      keywords: ['test'],
      competitors: [],
      languages: ['en'],
      platforms: ['twitter'],
      filters: {},
      crisis_thresholds: {
        mentions_per_hour: 50,
        sentiment_threshold: 0.5,
        reach_multiplier: 2.0,
        duration_minutes: 10,
      },
      alert_settings: {
        email_recipients: [],
        escalation_delay_minutes: 5,
      },
      deduplication: {
        enabled: false,
        time_window_minutes: 30,
        similarity_threshold: 0.8,
      },
    };

    const { AlertEngine } = await import('./alertEngine');
    const alertEngine = new AlertEngine(config, this.eventStore);

    const events = Array.from({ length: numEvents }, (_, i) =>
      this.generateMockEvent({
        name: 'benchmark',
        duration_seconds: 60,
        events_per_second: 100,
        concurrent_sources: 1,
        event_types: ['mention'],
        sentiment_distribution: { positive: 0.1, negative: 0.8, neutral: 0.1 }, // High negative for alerts
      }, 0),
    );

    const startTime = Date.now();

    await alertEngine.start();
    await alertEngine.analyzeEvents(events);
    await alertEngine.stop();

    const duration = Date.now() - startTime;
    const eventsPerSecond = (numEvents / duration) * 1000;

    console.log(`✅ AlertEngine benchmark: ${eventsPerSecond.toFixed(0)} events/sec`);

    return eventsPerSecond;
  }

  // Memory leak detection
  async detectMemoryLeaks(duration = 300): Promise<boolean> {
    console.log(`🔍 Running memory leak detection for ${duration}s...`);

    const initialMemory = process.memoryUsage().heapUsed;
    let peakMemory = initialMemory;
    const memorySnapshots: number[] = [];

    const scenario: LoadTestScenario = {
      name: 'Memory Leak Test',
      duration_seconds: duration,
      events_per_second: 100, // Moderate load
      concurrent_sources: 2,
      event_types: ['mention', 'social'],
      sentiment_distribution: { positive: 0.33, negative: 0.33, neutral: 0.34 },
    };

    await this.setupTestEnvironment();

    const memoryMonitor = setInterval(() => {
      const currentMemory = process.memoryUsage().heapUsed;
      memorySnapshots.push(currentMemory);

      if (currentMemory > peakMemory) {
        peakMemory = currentMemory;
      }

      console.log(`Memory: ${(currentMemory / 1024 / 1024).toFixed(1)}MB`);
    }, 10000);

    // Run test
    this.isRunning = true;
    const generationPromise = this.generateEventStream(scenario, 0, () => {});

    await this.sleep(duration * 1000);
    this.isRunning = false;

    await generationPromise;
    clearInterval(memoryMonitor);

    await this.teardownTestEnvironment();

    // Analyze memory usage trend
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryGrowth = finalMemory - initialMemory;
    const memoryGrowthMB = memoryGrowth / 1024 / 1024;

    // Check for concerning trends
    const hasMemoryLeak = memoryGrowthMB > 100 || // >100MB growth
                         (finalMemory / initialMemory) > 2; // >2x initial memory

    console.log('\n📈 Memory Analysis:');
    console.log(`   Initial: ${(initialMemory / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Peak: ${(peakMemory / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Final: ${(finalMemory / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Growth: ${memoryGrowthMB.toFixed(1)}MB`);
    console.log(`   Result: ${hasMemoryLeak ? '⚠️ POTENTIAL LEAK' : '✅ HEALTHY'}`);

    return !hasMemoryLeak;
  }
}

// CLI interface for running tests
if (require.main === module) {
  const test = new MonitoringPerformanceTest();

  async function runTests() {
    try {
      console.log('🚀 Starting monitoring performance tests...');

      // Run full performance test suite
      const results = await test.runFullPerformanceTest();

      // Run component benchmarks
      console.log('\n🛠️ Running component benchmarks...');
      await test.benchmarkEventStore(1000);
      await test.benchmarkAlertEngine(500);

      // Check for memory leaks
      console.log('\n🔍 Checking for memory leaks...');
      const noLeaks = await test.detectMemoryLeaks(120); // 2 minutes

      // Final summary
      const passed = results.some(r => r.passed) && noLeaks;
      console.log(`\n🏁 FINAL RESULT: ${passed ? 'PERFORMANCE TARGETS MET' : 'PERFORMANCE IMPROVEMENTS NEEDED'}`);

      process.exit(passed ? 0 : 1);

    } catch (error) {
      console.error('❌ Performance test failed:', error);
      process.exit(1);
    }
  }

  runTests();
}
