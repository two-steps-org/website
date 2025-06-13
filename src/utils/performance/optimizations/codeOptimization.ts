// Optimize heavy calculations with memoization
export function memoizeCalculation<T>(
  calculation: () => T,
  dependencies: any[]
): T {
  const cache = new WeakMap();
  const key = JSON.stringify(dependencies);
  
  if (!cache.has(key)) {
    cache.set(key, calculation());
  }
  
  return cache.get(key);
}

// Batch DOM updates using requestAnimationFrame
export function batchDOMUpdates(updates: (() => void)[]) {
  if (typeof window === 'undefined') return;
  
  let scheduled = false;
  const batch: (() => void)[] = [];

  updates.forEach(update => {
    batch.push(update);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        batch.forEach(fn => fn());
        batch.length = 0;
        scheduled = false;
      });
    }
  });
}

// Debounce events with proper cleanup
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Throttle expensive operations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastResult: ReturnType<T>;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
    return lastResult;
  };
}

// Optimize event listeners with passive flag
export function addPassiveEventListener(
  element: HTMLElement | Window,
  event: string,
  handler: EventListenerOrEventListenerObject
) {
  element.addEventListener(event, handler, { passive: true });
  return () => element.removeEventListener(event, handler);
}