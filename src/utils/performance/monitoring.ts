import { measurePerformance } from './optimizations';

// Performance metrics collector
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)?.push(value);
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.reduce((a, b) => a + b, 0) / values.length || 0;
  }
}

// Export singleton instance
export const monitor = PerformanceMonitor.getInstance();

// Performance markers
export const markStart = (label: string) => {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`${label}-start`);
  }
};

export const markEnd = (label: string) => {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
  }
};