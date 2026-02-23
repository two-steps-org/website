import React, { useEffect, useRef, useState, useCallback } from 'react';

// Global observer instance shared across components
let globalObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, (isIntersecting: boolean) => void>();

/**
 * Get or create the global IntersectionObserver instance
 * This reduces memory usage by sharing one observer across all components
 */
function getGlobalObserver(): IntersectionObserver {
  if (!globalObserver) {
    globalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = observedElements.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting);
          }
        });
      },
      {
        root: null,
        // Keep lazy chunks off the critical path: load close to viewport.
        rootMargin: '50px',
        threshold: 0.01,
      }
    );
  }
  return globalObserver;
}

/**
 * Hook that uses a shared IntersectionObserver for better performance
 * Instead of creating a new observer per component, this shares one global instance
 * 
 * @param options - Configuration options
 * @returns [ref, isIntersecting, hasIntersected]
 */
interface UseSharedIntersectionObserverOptions {
  /** Only trigger once (for lazy loading) */
  triggerOnce?: boolean;
  /** Initial visibility state */
  initialVisible?: boolean;
}

export function useSharedIntersectionObserver(
  options: UseSharedIntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement>, boolean, boolean] {
  const { triggerOnce = false, initialVisible = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(initialVisible);
  const [hasIntersected, setHasIntersected] = useState(initialVisible);

  const handleIntersection = useCallback(
    (visible: boolean) => {
      setIsIntersecting(visible);
      if (visible) {
        setHasIntersected(true);
      }
    },
    []
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = getGlobalObserver();
    observedElements.set(element, handleIntersection);
    observer.observe(element);

    return () => {
      observedElements.delete(element);
      observer.unobserve(element);

      // Clean up global observer if no more elements
      if (observedElements.size === 0 && globalObserver) {
        globalObserver.disconnect();
        globalObserver = null;
      }
    };
  }, [handleIntersection]);

  // If triggerOnce is true, always return true for hasIntersected after first intersection
  const effectiveHasIntersected = triggerOnce ? hasIntersected : isIntersecting;

  return [ref, isIntersecting, effectiveHasIntersected];
}

export default useSharedIntersectionObserver;
