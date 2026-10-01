import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Custom transition #1: mint light-sweep wipe (top -> bottom) between two layers.
export const MintWipe: React.FC<{ at: number; dur: number; before: React.ReactNode; after: React.ReactNode; height: number }> = ({ at, dur, before, after, height }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const band = p * (height + 80) - 40;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0 }}>{before}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` }}>{after}</div>
      {p > 0 && p < 1 ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: band - 60, height: 120, background: `linear-gradient(180deg, transparent, ${colors.mint}66 50%, transparent)`, mixBlendMode: "screen" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: band - 1.5, height: 3, background: colors.mintSoft, boxShadow: `0 0 20px ${colors.mint}, 0 0 50px ${colors.mint}` }} />
        </>
      ) : null}
    </div>
  );
};
