import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { bgGradient, colors } from "../theme";

// Dark navy/teal gradient with soft drifting mint glows (blurred depth background).
export const Backdrop: React.FC<{ glow?: number }> = ({ glow = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bgGradient, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, left: -250 + Math.sin(f / 60) * 40, top: 200, borderRadius: "50%", background: `radial-gradient(circle, ${colors.mint}2e 0%, transparent 65%)`, filter: "blur(40px)", opacity: glow }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, right: -450, top: 1000 + Math.cos(f / 70) * 40, borderRadius: "50%", background: `radial-gradient(circle, ${colors.logoTeal}55 0%, transparent 65%)`, filter: "blur(50px)", opacity: glow }} />
    </AbsoluteFill>
  );
};
