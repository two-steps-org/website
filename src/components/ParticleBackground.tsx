import { useEffect, useRef, memo } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * ParticleBackground renders a full-screen animated particle system on a canvas.
 * - Particles move slowly, oscillate in size, and can connect with lines if close.
 * - Canvas is resized dynamically, supporting high DPI screens.
 * - In prerender mode (SSG), returns null to avoid canvas creation
 */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!isBrowser) return;
    if (shouldReduceMotion) return;
    
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Sets up the canvas dimensions with support for device pixel ratio
    const setCanvasSize = () => {
      const scale = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      ctx.scale(scale, scale);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initialize Particles
    const particles: Particle[] = [];
    const isMobile = window.innerWidth < 768;
    // Reduce particle count on mobile for performance
    const maxParticles = isMobile ? 15 : 100;
    const particleCount = Math.min(maxParticles, (window.innerWidth * window.innerHeight) / 10000);

    // Use logical width/height for particle positioning since we already scaled the context
    const logicalWidth = window.innerWidth;
    const logicalHeight = window.innerHeight;

    class Particle {
      x: number;
      y: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      phase: number;

      constructor() {
        this.x = Math.random() * logicalWidth;
        this.y = Math.random() * logicalHeight;
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.phase = Math.random() * Math.PI * 2; 

        const hue = Math.random() * 60 + 220;
        this.color = `hsla(${hue}, 70%, 50%, ${this.opacity})`;
      }

      update(time: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen edges using logical dimensions
        if (this.x > logicalWidth) this.x = 0;
        if (this.x < 0) this.x = logicalWidth;
        if (this.y > logicalHeight) this.y = 0;
        if (this.y < 0) this.y = logicalHeight;

        const oscillation = Math.sin(time * 0.001 + this.phase) * 0.3;
        const size = Math.max(0.1, this.baseSize + oscillation);

        ctx!.beginPath();
        ctx!.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Draw lines between nearby particles
    const connectParticles = () => {
      // Skip connections on mobile for performance
      if (isMobile) return;

      const maxDistance = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx!.lineWidth = 1;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    };

    let animationFrameId: number;
    let isVisible = true;
    let isIntersecting = true;

    // Animation loop
    const animate = (time: number) => {
      if (!isVisible || !isIntersecting) return;
      
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((particle) => {
        particle.update(time);
      });

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Handle visibility change to pause animation when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isVisible = true;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Intersection Observer to pause when not in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && isVisible) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animate(0);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBrowser, shouldReduceMotion]);

  // Skip rendering during prerendering (SSG / non-browser environments)
  if (!isBrowser) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default memo(ParticleBackground);
