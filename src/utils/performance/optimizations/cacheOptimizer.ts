// Enhanced caching strategies
export class CacheOptimizer {
  private static instance: CacheOptimizer;
  private cache: Map<string, any>;
  private maxSize: number;

  private constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  static getInstance(): CacheOptimizer {
    if (!CacheOptimizer.instance) {
      CacheOptimizer.instance = new CacheOptimizer();
    }
    return CacheOptimizer.instance;
  }

  set(key: string, value: any, ttl?: number): void {
    // Implement LRU cache eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const item = {
      value,
      timestamp: Date.now(),
      ttl: ttl || Infinity
    };

    this.cache.set(key, item);
  }

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check TTL
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }
}