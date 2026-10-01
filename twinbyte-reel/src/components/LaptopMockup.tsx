import React from "react";

// Laptop frame. Content is laid out at 1440 CSS px wide (16:10 viewport) and scaled to fit.
export const LAPTOP_VW = 1440;
export const LAPTOP_VH = 900;

export const LaptopMockup: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, children, style }) => {
  const bezel = width * 0.022;
  const screenW = width * 0.84 - bezel * 2;
  const scale = screenW / LAPTOP_VW;
  const screenH = LAPTOP_VH * scale;
  return (
    <div style={{ width, position: "relative", ...style }}>
      <div
        style={{
          width: width * 0.84,
          margin: "0 auto",
          padding: bezel,
          borderRadius: width * 0.025,
          background: "linear-gradient(180deg,#1d2a30,#0a1114)",
          boxShadow: "0 0 0 2px #33444c, 0 50px 100px rgba(0,0,0,0.55)",
        }}
      >
        <div style={{ width: screenW, height: screenH, overflow: "hidden", position: "relative", borderRadius: 4, background: "#fff" }}>
          <div style={{ width: LAPTOP_VW, height: LAPTOP_VH, scale: String(scale), transformOrigin: "0 0", position: "absolute", overflow: "hidden" }}>{children}</div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 35%)" }} />
        </div>
      </div>
      <div
        style={{
          width,
          height: width * 0.03,
          marginTop: -2,
          borderRadius: `0 0 ${width * 0.04}px ${width * 0.04}px`,
          background: "linear-gradient(180deg,#3b4b53 0%,#1a2429 60%,#0c1316 100%)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
};
