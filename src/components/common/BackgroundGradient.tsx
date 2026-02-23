import React, { memo, Suspense, useEffect, useState } from 'react';

const ParticleBackground = React.lazy(() => import('../ParticleBackground'));

interface BackgroundGradientProps {
  children: React.ReactNode;
}

// Inline GlowEffect component
interface GlowEffectProps {
  color: 'blue' | 'cyan' | 'purple';
  opacity?: number;
  blur?: string;
  className?: string;
}

const GlowEffect: React.FC<GlowEffectProps> = ({
  color,
  opacity = 0.5,
  blur = '200px',
  className = '',
}) => {
  const colorMap = {
    blue: 'rgba(59, 130, 246, 0.8)',
    cyan: 'rgba(34, 211, 238, 0.8)',
    purple: 'rgba(168, 85, 247, 0.8)',
  };

  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(circle, ${colorMap[color]} 0%, transparent 70%)`,
        opacity,
        filter: `blur(${blur})`,
      }}
    />
  );
};

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ children }) => {
  const [shouldRenderParticles, setShouldRenderParticles] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReducedMotion) return;

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const enableParticles = () => setShouldRenderParticles(true);

    if ('requestIdleCallback' in window) {
      idleId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback(enableParticles, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(enableParticles, 1200);
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (idleId !== null && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#030714]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040a18] via-[#060f24] to-[#02040c] opacity-95" />

        {/* Consistent across all screen sizes */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(67,133,247,0.55),rgba(4,7,20,0.18) 52%,transparent_70%)] opacity-[0.95]"
          style={{ filter: 'blur(85px)' }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(30,102,228,0.48),rgba(4,7,20,0.18) 50%,transparent_70%)] opacity-[0.95]"
          style={{ filter: 'blur(85px)' }}
        />

        {/* Glow effects - consistent across all screen sizes */}
        {shouldRenderParticles ? (
          <Suspense fallback={null}>
            <ParticleBackground />
          </Suspense>
        ) : null}
        <GlowEffect
          color="blue"
          opacity={0.6}
          blur="240px"
          className="top-[-60%] left-[-45%] h-[72rem] w-[72rem]"
        />
        <GlowEffect
          color="cyan"
          opacity={0.48}
          blur="250px"
          className="bottom-[-65%] right-[-48%] h-[68rem] w-[68rem]"
        />

        {/* Grid pattern - consistent across all screen sizes */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default memo(BackgroundGradient);
