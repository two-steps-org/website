import { useState, useEffect } from 'react';

export function useImagePreload(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!src) return;
    
    const img = new Image();
    img.src = src;
    
    const handleLoad = () => setIsLoaded(true);
    img.addEventListener('load', handleLoad);
    
    return () => img.removeEventListener('load', handleLoad);
  }, [src]);
  
  return isLoaded;
}