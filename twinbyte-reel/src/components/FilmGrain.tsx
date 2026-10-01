import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// Animated grain: SVG turbulence with a per-frame seed (deterministic).
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.025 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: opacity * 4, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${frame}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 97} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};
