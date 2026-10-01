import React from "react";
import { AbsoluteFill } from "remotion";
import { safe } from "../theme";

const line = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...s });

export const SafeZoneOverlay: React.FC<{ show: boolean }> = ({ show }) =>
  !show ? null : (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 999 }}>
      <div style={line({ left: safe.side, right: safe.side, top: safe.textTop, height: safe.textBottom - safe.textTop, border: "3px dashed #00ff66" })} />
      <div style={line({ left: 0, right: 0, top: safe.ctaMax, height: 0, borderTop: "3px solid #ff3355" })} />
      <div style={line({ left: safe.railX, right: 0, top: safe.railY, bottom: 0, background: "rgba(255,0,80,0.25)" })} />
      <div style={line({ left: 0, right: 0, top: 240, height: 1440, border: "3px dotted #ffcc00" })} />
    </AbsoluteFill>
  );
