import React, { useEffect, useRef, memo } from 'react';

/**
 * ParticleBackground renders a full-screen animated particle system on a canvas.
 * - Particles move slowly, oscillate in size, and can connect with lines if close.
 * - Canvas is resized dynamically, supporting high DPI screens.
 */
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isLowPowerDevice = (navigator.hardwareConcurrency || 4) <= 4;

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
    window.addEventListener('resize', setCanvasSize, { passive: true });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return () => window.removeEventListener('resize', setCanvasSize);
    }

    /** Particle class definition */
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
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.phase = Math.random() * Math.PI * 2; // random starting offset for the oscillation

        // Random hue between 220-280 => from blue to purple
        const hue = Math.random() * 60 + 220;
        this.color = `hsla(${hue}, 70%, 50%, ${this.opacity})`;
      }

      update(time: number) {
        // Move
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Oscillate size
        const oscillation = Math.sin(time * 0.001 + this.phase) * 0.3;
        const size = Math.max(0.1, this.baseSize + oscillation);

        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Initialize Particles
    const particles: Particle[] = [];
    const particleCount = Math.min(
      isLowPowerDevice ? 50 : 100,
      (window.innerWidth * window.innerHeight) / (isLowPowerDevice ? 16000 : 10000)
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Draw lines between nearby particles
    const connectParticles = (time: number) => {
      const maxDistance = isLowPowerDevice ? 100 : 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let animationFrameId: number;
    const targetFPS = isLowPowerDevice ? 30 : 60;
    const frameDelay = 1000 / targetFPS;
    let lastFrameTime = 0;

    // Animation loop with simple frame skipping
    const animate = (time: number) => {
      if (time - lastFrameTime >= frameDelay) {
        lastFrameTime = time;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          particle.update(time);
        });

        connectParticles(time);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate(0);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate(performance.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default memo(ParticleBackground);
