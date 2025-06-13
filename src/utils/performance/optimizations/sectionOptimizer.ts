import { useEffect, useRef } from 'react';

export function optimizeSection(element: HTMLElement | null) {
  if (!element) return;

  // Optimize images
  element.querySelectorAll('img').forEach(img => {
    if (!img.loading) img.loading = 'lazy';
    if (!img.decoding) img.decoding = 'async';
  });

  // Optimize animations
  element.querySelectorAll('[data-animate]').forEach(el => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
  });
}

export function useSectionOptimizer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      optimizeSection(ref.current);
    }
  }, []);

  return ref;
}