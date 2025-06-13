// Core performance hooks
export { useAnimationOptimizer } from './hooks/useAnimationOptimizer';
export { useOptimizedScroll } from './hooks/useOptimizedScroll';
export { useIntersectionObserver } from './hooks/useIntersectionObserver';
export { useImagePreload } from './hooks/useImagePreload';

// Image optimization utilities
export { 
  getOptimalImageSize,
  generateSrcSet,
  getImageUrl,
  imageLoadingPriority
} from './optimizations/imageOptimization';

// Code optimization utilities
export {
  debounce,
  throttle,
  batchDOMUpdates
} from './optimizations/codeOptimization';