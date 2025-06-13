import { useState, useEffect, useCallback } from 'react';

interface IntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useIntersectionObserver(options: IntersectionOptions = {}) {
  const [ref, setRef] = useState<Element | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  }, []);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(callback, {
      threshold: options.threshold || 0,
      rootMargin: options.rootMargin || '0px',
      root: options.root || null
    });

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, callback, options.threshold, options.rootMargin, options.root]);

  return [setRef, isVisible] as const;
}