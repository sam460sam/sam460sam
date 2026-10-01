import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";
import { IconSearch } from "./Icons";

// Generic, unbranded search results. Result 0 = "your business", result 1 = competitor.
export const SearchResults: React.FC<{ query: string; typed?: number; compAt?: number; width?: number; dim?: number }> = ({
  query,
  typed = 1,
  compAt = 99999,
  width = 860,
  dim = 0,
}) => {
  const frame = useCurrentFrame();
  const c = interpolate(frame, [compAt, compAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = query.slice(0, Math.round(query.length * typed));
  const card = (i: number) => {
    const ours = i === 0;
    const comp = i === 1;
    return (
      <div
        key={i}
        style={{
          borderRadius: 28,
          padding: 30,
          background: comp ? `rgba(61,224,176,${0.06 + 0.1 * c})` : "rgba(255,255,255,0.06)",
          border: `1px solid ${comp ? `rgba(61,224,176,${0.15 + 0.6 * c})` : "rgba(255,255,255,0.08)"}`,
          boxShadow: comp ? `0 0 ${60 * c}px rgba(61,224,176,${0.45 * c})` : "none",
          opacity: ours ? 1 - 0.7 * c : 1 - dim,
          filter: ours ? `grayscale(${c}) blur(${c * 2}px)` : "none",
          scale: String(comp ? 1 + 0.04 * c : 1),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: comp ? colors.mint : "rgba(255,255,255,0.18)" }} />
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 28, color: ours ? colors.muted : colors.white }}>{ours ? "Your business" : "Local plumber"}</div>
        </div>
        <div style={{ marginTop: 18, height: 16, width: "78%", borderRadius: 8, background: "rgba(255,255,255,0.16)" }} />
        <div style={{ marginTop: 12, height: 16, width: "56%", borderRadius: 8, background: "rgba(255,255,255,0.10)" }} />
      </div>
    );
  };
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 34px", borderRadius: 999, background: "rgba(255,255,255,0.95)", color: colors.navy, fontFamily: fonts.body, fontWeight: 500, fontSize: 38, boxShadow: `0 0 60px ${colors.mint}33` }}>
        <IconSearch size={40} color={colors.logoTeal} stroke={2.4} />
        <span>{shown}</span>
        <span style={{ width: 3, height: 44, background: colors.logoTeal, opacity: frame % 16 < 8 ? 1 : 0 }} />
      </div>
      {[0, 1, 2].map(card)}
    </div>
  );
};
