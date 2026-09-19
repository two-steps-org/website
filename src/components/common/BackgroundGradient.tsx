import React, { memo } from 'react';

interface BackgroundGradientProps {
  children: React.ReactNode;
}

/**
 * Fixed ambient tone fields. Static on purpose: anything that moves behind
 * the page forces every backdrop-filter surface above it to re-blur on every
 * frame, which kept the compositor at ~100% even while idle.
 */
const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ children }) => (
  <div className="relative w-full">
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 45% 40% at 22% 18%, var(--tone-ember-deep), transparent 70%), radial-gradient(ellipse 40% 45% at 80% 12%, var(--tone-ocean-deep), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 40% 35% at 75% 55%, var(--tone-ember-deep), transparent 70%), radial-gradient(ellipse 45% 40% at 20% 85%, var(--tone-ocean-deep), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(217,178,124,0.08), transparent 70%)',
        }}
      />
      <div className="absolute inset-0 bg-[rgba(10,10,12,0.28)]" />
    </div>

    <div className="relative z-10">{children}</div>
  </div>
);

export default memo(BackgroundGradient);
