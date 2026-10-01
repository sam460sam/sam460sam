import React from "react";

// iPhone-style frame. Content is laid out at 390 CSS px wide and scaled to fit.
export const PHONE_VW = 390;
export const PHONE_VH = 844;

export const PhoneMockup: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties; glow?: number }> = ({
  width,
  children,
  style,
  glow = 0.35,
}) => {
  const bezel = width * 0.035;
  const screenW = width - bezel * 2;
  const scale = screenW / PHONE_VW;
  const screenH = PHONE_VH * scale;
  const r = width * 0.15;
  return (
    <div
      style={{
        width,
        height: screenH + bezel * 2,
        borderRadius: r,
        padding: bezel,
        background: "linear-gradient(145deg,#2a3b44 0%,#0b1418 45%,#1c2a31 100%)",
        boxShadow: `0 0 0 2px #3a4c55, 0 60px 120px rgba(0,0,0,0.6), 0 0 120px rgba(61,224,176,${glow * 0.5})`,
        position: "relative",
        ...style,
      }}
    >
      <div style={{ width: screenW, height: screenH, borderRadius: r - bezel, overflow: "hidden", position: "relative", background: "#000" }}>
        <div style={{ width: PHONE_VW, height: PHONE_VH, scale: String(scale), transformOrigin: "0 0", position: "absolute", left: 0, top: 0, overflow: "hidden" }}>
          {children}
        </div>
        <div style={{ position: "absolute", top: 11 * scale, left: "50%", width: 120 * scale, height: 34 * scale, marginLeft: -60 * scale, borderRadius: 20 * scale, background: "#000" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 30%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
};
