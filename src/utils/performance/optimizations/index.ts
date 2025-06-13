// Export all optimizations from a single entry point
export * from './bundleOptimization';
export * from './imageOptimizer';
export * from './cacheOptimizer';
export * from './iconOptimizer';

// Performance monitoring
export const measurePerformance = (label: string, fn: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    console.time(label);
    fn();
    console.timeEnd(label);
  } else {
    fn();
  }
};