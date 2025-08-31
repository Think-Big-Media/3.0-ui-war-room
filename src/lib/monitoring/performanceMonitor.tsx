/**
 * Performance monitoring for dashboard components
 * Tracks render times, update latency, and WebSocket performance
 */

import React from 'react';
import { useDashboardStore } from '../../store/dashboardStore';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  updateCount: number;
  lastUpdate: Date;
  averageRenderTime: number;
  maxRenderTime: number;
}

interface PerformanceThresholds {
  renderTime: number;
  updateLatency: number;
  websocketLatency: number;
  memoryUsage: number;
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();
  private thresholds: PerformanceThresholds = {
    renderTime: 100, // 100ms max render time
    updateLatency: 2000, // 2s max update latency
    websocketLatency: 500, // 500ms max WebSocket latency
    memoryUsage: 50 * 1024 * 1024, // 50MB memory threshold
  };

  constructor() {
    this.initializeObservers();
    this.startMemoryMonitoring();
  }

  // Initialize performance observers
  private initializeObservers(): void {
    // Long Task Observer
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > this.thresholds.renderTime) {
              console.warn('Long task detected:', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name,
              });
            }
          }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (error) {
        console.error('Failed to initialize long task observer:', error);
      }
    }

    // Paint timing observer
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`${entry.name}: ${entry.startTime}ms`);
          }
        });

        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', paintObserver);
      } catch (error) {
        console.error('Failed to initialize paint observer:', error);
      }
    }
  }

  // Start memory monitoring
  private startMemoryMonitoring(): void {
    if ('performance' in window && 'memory' in performance) {
      setInterval(() => {
        const { memory } = performance as any;
        if (memory.usedJSHeapSize > this.thresholds.memoryUsage) {
          console.warn('High memory usage detected:', {
            used: this.formatBytes(memory.usedJSHeapSize),
            total: this.formatBytes(memory.totalJSHeapSize),
            limit: this.formatBytes(memory.jsHeapSizeLimit),
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Track component render time
  trackComponentRender(componentName: string, renderTime: number): void {
    const existing = this.metrics.get(componentName);

    if (existing) {
      existing.renderTime = renderTime;
      existing.updateCount++;
      existing.lastUpdate = new Date();
      existing.averageRenderTime =
        (existing.averageRenderTime * (existing.updateCount - 1) + renderTime) /
        existing.updateCount;
      existing.maxRenderTime = Math.max(existing.maxRenderTime, renderTime);
    } else {
      this.metrics.set(componentName, {
        componentName,
        renderTime,
        updateCount: 1,
        lastUpdate: new Date(),
        averageRenderTime: renderTime,
        maxRenderTime: renderTime,
      });
    }

    // Update store
    const store = useDashboardStore.getState();
    store.recordPerformance(renderTime, 0);

    // Warn if threshold exceeded
    if (renderTime > this.thresholds.renderTime) {
      console.warn(`Component ${componentName} render time exceeded threshold:`, {
        renderTime: `${renderTime}ms`,
        threshold: `${this.thresholds.renderTime}ms`,
      });
    }
  }

  // Track WebSocket latency
  trackWebSocketLatency(latency: number): void {
    const store = useDashboardStore.getState();
    store.recordPerformance(0, latency);

    if (latency > this.thresholds.websocketLatency) {
      console.warn('WebSocket latency exceeded threshold:', {
        latency: `${latency}ms`,
        threshold: `${this.thresholds.websocketLatency}ms`,
      });
    }
  }

  // Track update latency
  trackUpdateLatency(latency: number): void {
    const store = useDashboardStore.getState();
    store.recordPerformance(0, latency);

    if (latency > this.thresholds.updateLatency) {
      console.warn('Update latency exceeded threshold:', {
        latency: `${latency}ms`,
        threshold: `${this.thresholds.updateLatency}ms`,
      });
    }
  }

  // Get performance report
  getPerformanceReport(): {
    components: Array<PerformanceMetrics>;
    summary: {
      totalComponents: number;
      averageRenderTime: number;
      maxRenderTime: number;
      componentsExceedingThreshold: string[];
    };
  } {
    const components = Array.from(this.metrics.values());
    const componentsExceedingThreshold = components
      .filter((m) => m.averageRenderTime > this.thresholds.renderTime)
      .map((m) => m.componentName);

    const totalRenderTime = components.reduce((sum, m) => sum + m.averageRenderTime, 0);
    const maxRenderTime = Math.max(...components.map((m) => m.maxRenderTime), 0);

    return {
      components,
      summary: {
        totalComponents: components.length,
        averageRenderTime: components.length > 0 ? totalRenderTime / components.length : 0,
        maxRenderTime,
        componentsExceedingThreshold,
      },
    };
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }

  // Set custom thresholds
  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    Object.assign(this.thresholds, thresholds);
  }

  // Utility to format bytes
  private formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // Cleanup
  destroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

// React hook for performance tracking
export function usePerformanceTracking(componentName: string) {
  const monitor = getPerformanceMonitor();

  return {
    trackRender: (renderTime: number) => monitor.trackComponentRender(componentName, renderTime),
    trackUpdate: (latency: number) => monitor.trackUpdateLatency(latency),
    trackWebSocket: (latency: number) => monitor.trackWebSocketLatency(latency),
  };
}

// HOC for automatic performance tracking
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return React.memo((props: P) => {
    const startTime = React.useRef(performance.now());
    const monitor = getPerformanceMonitor();

    React.useEffect(() => {
      const renderTime = performance.now() - startTime.current;
      monitor.trackComponentRender(componentName, renderTime);
    });

    return <Component {...props} />;
  }) as unknown as React.ComponentType<P>;
}
