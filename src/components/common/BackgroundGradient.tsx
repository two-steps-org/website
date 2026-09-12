import React, { memo } from 'react';

interface BackgroundGradientProps {
  children: React.ReactNode;
}

/**
 * The site's single ambient layer: two counter-drifting Ember/Ocean tone
 * fields over the base surface, with a Sand lift at the bottom and a scrim to
 * keep text contrast honest.
 *
 * Per the 2026 brief, colour enters the site only through tone fields like
 * this one — never through buttons, text, chips or borders. It is fixed and
 * transform-only, so it costs one composited layer and no layout work.
 */
const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ children }) => (
  <div className="relative w-full">
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
    >
      <div
        className="ts-drift absolute -inset-[20%] opacity-90 motion-reduce:animate-none"
        style={{
          background:
            'radial-gradient(ellipse 45% 40% at 22% 18%, var(--tone-ember-deep), transparent 70%), radial-gradient(ellipse 40% 45% at 80% 12%, var(--tone-ocean-deep), transparent 70%)',
        }}
      />
      <div
        className="ts-drift absolute -inset-[20%] opacity-70 motion-reduce:animate-none"
        style={{
          animationDelay: '-4.5s',
          animationDirection: 'reverse',
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
      {/* Scrim — holds body copy above AA against the brightest part of the drift. */}
      <div className="absolute inset-0 bg-[rgba(10,10,12,0.28)]" />
    </div>

    <div className="relative z-10">{children}</div>
  </div>
);

export default memo(BackgroundGradient);
