/**
 * Performance monitoring hook
 * Tracks Core Web Vitals and performance metrics
 */

import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint  
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

}

export const usePerformanceMonitor = () => {
  const logMetric = useCallback((metric: string, value: number) => {
    if (import.meta.env.DEV) {
      const status = value < 100 ? '✅' : value < 300 ? '⚠️' : '🚨';
      console.log(`${status} Performance: ${metric} = ${value.toFixed(2)}ms`);
    }
  }, []);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    try {
      // First Contentful Paint
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            logMetric('FCP', entry.startTime);
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        logMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          logMetric('FID', fidEntry.processingStart - fidEntry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            logMetric('CLS', clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        logMetric('TTFB', navigation.responseStart - navigation.fetchStart);
      }

      // Memory usage monitoring (Chrome only)
      if ('memory' in performance) {
        const checkMemory = () => {
          const memory = (performance as any).memory;
          if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
            console.warn('⚠️ High memory usage detected');
          }
        };
        const memoryInterval = setInterval(checkMemory, 30000);
        
        return () => {
          clearInterval(memoryInterval);
          paintObserver.disconnect();
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      }

      return () => {
        paintObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    } catch (error) {
      // Silently fail if Performance Observer is not supported
      console.debug('Performance monitoring not available:', error);
    }
  }, [logMetric]);

  // Bundle size warning
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Check if bundle is getting too large
      const checkBundleSize = async () => {
        try {
          const response = await fetch('/src/main.tsx');
          const size = response.headers.get('content-length');
          if (size && parseInt(size) > 500000) {
            console.warn('⚠️ Bundle size is getting large. Consider code splitting.');
          }
        } catch {
          // Ignore in production
        }
      };
      checkBundleSize();
    }
  }, []);

  return null;
};

// Export performance utilities
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  if (import.meta.env.DEV) {
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
