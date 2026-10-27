import React, { memo } from 'react';
import {
  AMBIENT_FLOOR,
  AMBIENT_VIGNETTE,
  resolveAmbientPreset,
} from '../../lib/wallpaper/ambient';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Matches blog cover SVG feGaussianBlur (~48) at viewport scale. */
const MESH_BLUR_PX = 56;

interface BackgroundGradientProps {
  children: React.ReactNode;
  pathname: string;
}

/**
 * Flowing ambient field — same recipe as blog cover art: soft tone blobs + blur + vignette.
 * Palette shifts by route (blog slugs use their cover layout).
 */
const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ children, pathname }) => {
  const preset = resolveAmbientPreset(pathname);

  return (
    <div className="relative w-full">
      <div
        aria-hidden="true"
        data-ambient={preset.id}
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
      >
        <div
          className="absolute -inset-[20%]"
          style={{
            background: preset.mesh,
            filter: `blur(${MESH_BLUR_PX}px)`,
            transform: 'translateZ(0)',
          }}
        />
        <div className="absolute inset-0" style={{ background: AMBIENT_FLOOR }} />
        <div className="absolute inset-0" style={{ background: AMBIENT_VIGNETTE }} />
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default memo(BackgroundGradient);
