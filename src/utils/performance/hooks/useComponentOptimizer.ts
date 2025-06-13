import { useCallback, useMemo, useRef, useEffect } from 'react';

export function useComponentOptimizer<T>(
  value: T,
  deps: any[] = []
): {
  memoizedValue: T;
  memoizedCallback: (...args: any[]) => T;
} {
  // Memoize value
  const memoizedValue = useMemo(() => value, deps);

  // Memoize callback
  const memoizedCallback = useCallback((...args: any[]) => {
    if (typeof value === 'function') {
      return (value as Function)(...args);
    }
    return value;
  }, deps);

  // Track renders
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current++;
    
    // Log excessive renders in development
    if (process.env.NODE_ENV === 'development' && renderCount.current > 5) {
      console.warn('Component is re-rendering frequently. Consider optimizing.');
    }
  });

  return {
    memoizedValue,
    memoizedCallback
  };
}