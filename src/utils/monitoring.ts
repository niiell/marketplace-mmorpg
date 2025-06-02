import * as Sentry from '@sentry/nextjs';

// Performance thresholds
const THRESHOLDS = {
  // Time thresholds in milliseconds
  pageLoad: 3000,
  apiResponse: 1000,
  checkoutFlow: 5000,
  searchResponse: 500,
  
  // Success rate thresholds in percentage
  checkoutSuccess: 95,
  paymentSuccess: 98,
  searchSuccess: 99,
  
  // Resource thresholds
  memoryUsage: 90, // percentage
  cpuUsage: 80, // percentage
};

// Monitor specific performance metrics
export const monitoring = {
  // Page load performance
  trackPageLoad: (route: string, loadTime: number) => {
    if (loadTime > THRESHOLDS.pageLoad) {
      Sentry.captureMessage(`Slow page load on ${route}: ${loadTime}ms`, {
        level: 'warning',
        tags: {
          type: 'performance',
          metric: 'page_load',
          route,
        },
      });
    }
  },

  // API response times
  trackApiPerformance: (endpoint: string, responseTime: number) => {
    if (responseTime > THRESHOLDS.apiResponse) {
      Sentry.captureMessage(`Slow API response from ${endpoint}: ${responseTime}ms`, {
        level: 'warning',
        tags: {
          type: 'performance',
          metric: 'api_response',
          endpoint,
        },
      });
    }
  },

  // Checkout flow timing
  trackCheckoutPerformance: (stepName: string, duration: number) => {
    if (duration > THRESHOLDS.checkoutFlow) {
      Sentry.captureMessage(`Slow checkout step: ${stepName} took ${duration}ms`, {
        level: 'warning',
        tags: {
          type: 'performance',
          metric: 'checkout_flow',
          step: stepName,
        },
      });
    }
  },

  // Search performance
  trackSearchPerformance: (query: string, responseTime: number, resultCount: number) => {
    if (responseTime > THRESHOLDS.searchResponse) {
      Sentry.captureMessage(`Slow search response for "${query}": ${responseTime}ms`, {
        level: 'warning',
        tags: {
          type: 'performance',
          metric: 'search_response',
          resultCount: resultCount.toString(),
        },
      });
    }
  },

  // Success rate monitoring
  trackSuccessRate: (operation: 'checkout' | 'payment' | 'search', success: boolean) => {
    const threshold = THRESHOLDS[`${operation}Success`];
    if (!success) {
      Sentry.captureMessage(`${operation} operation failed`, {
        level: 'warning',
        tags: {
          type: 'success_rate',
          operation,
        },
      });
    }
  },

  // Resource monitoring
  trackResourceUsage: (metrics: { memory: number; cpu: number }) => {
    if (metrics.memory > THRESHOLDS.memoryUsage || metrics.cpu > THRESHOLDS.cpuUsage) {
      Sentry.captureMessage('High resource usage detected', {
        level: 'warning',
        tags: {
          type: 'resource_usage',
        },
        extra: {
          memoryUsage: metrics.memory,
          cpuUsage: metrics.cpu,
        },
      });
    }
  },

  // Custom metric tracking
  trackCustomMetric: (name: string, value: number, threshold: number) => {
    if (value > threshold) {
      Sentry.captureMessage(`Custom metric "${name}" exceeded threshold: ${value}`, {
        level: 'warning',
        tags: {
          type: 'custom_metric',
          metric: name,
        },
        extra: {
          value,
          threshold,
        },
      });
    }
  },

  // Error rate tracking
  trackErrorRate: (context: string, errorCount: number, totalOperations: number) => {
    const errorRate = (errorCount / totalOperations) * 100;
    if (errorRate > 5) { // Alert if error rate exceeds 5%
      Sentry.captureMessage(`High error rate in ${context}: ${errorRate.toFixed(2)}%`, {
        level: 'error',
        tags: {
          type: 'error_rate',
          context,
        },
        extra: {
          errorCount,
          totalOperations,
          errorRate,
        },
      });
    }
  },

  // Performance marks and measures
  startMeasure: (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  },

  endMeasure: (name: string, threshold: number) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name).pop();
      if (measure && measure.duration > threshold) {
        Sentry.captureMessage(`Performance measure "${name}" exceeded threshold: ${measure.duration}ms`, {
          level: 'warning',
          tags: {
            type: 'performance_measure',
            measure: name,
          },
          extra: {
            duration: measure.duration,
            threshold,
          },
        });
      }
    }
  },
};