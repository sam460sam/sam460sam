import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Thin glowing teal lines sweeping across frame. mode "converge" pulls them toward the center.
export const LightLines: React.FC<{ count?: number; angle?: number; speed?: number; opacity?: number; seed?: string; mode?: "sweep" | "converge"; progress?: number; target?: number }> = ({
  count = 5,
  angle = -18,
  speed = 14,
  opacity = 0.7,
  seed = "ll",
  mode = "sweep",
  progress = 0,
  target = 960,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const y = random(`${seed}-y-${i}`) * 1920;
        const len = 300 + random(`${seed}-l-${i}`) * 700;
        const off = random(`${seed}-o-${i}`) * 3000;
        const sp = speed * (0.6 + random(`${seed}-s-${i}`) * 0.8);
        const x = mode === "sweep" ? ((frame * sp + off) % 3200) - 1600 : 0;
        const conv = mode === "converge" ? y + (target - y) * progress : y;
        const thick = 1.5 + random(`${seed}-t-${i}`) * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: mode === "sweep" ? x : -200,
              top: conv,
              width: mode === "sweep" ? len : 1480,
              height: thick,
              borderRadius: thick,
              rotate: `${mode === "sweep" ? angle : angle * (1 - progress)}deg`,
              background: `linear-gradient(90deg, rgba(61,224,176,0) 0%, ${colors.mint} 50%, rgba(61,224,176,0) 100%)`,
              boxShadow: `0 0 12px ${colors.mint}, 0 0 30px ${colors.mint}88`,
              opacity: mode === "converge" ? 0.4 + 0.6 * progress : 1,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
