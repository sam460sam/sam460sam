import React from "react";
import { colors } from "../theme";

// Faithful vector redraw of the Twinbyte logo (source PNG has no transparency).
export const ChatBubbleLogo: React.FC<{ size?: number; eyes?: string; style?: React.CSSProperties }> = ({
  size = 200,
  eyes = colors.logoTeal,
  style,
}) => (
  <svg width={size} height={(size * 720) / 620} viewBox="240 190 620 720" style={style}>
    <rect x={430} y={200} width={420} height={420} rx={132} fill={colors.logoMint} />
    <path d="M382 380 H538 A132 132 0 0 1 670 512 V668 A132 132 0 0 1 538 800 H443 L267 900 L342 800 H382 A132 132 0 0 1 250 668 V512 A132 132 0 0 1 382 380 Z" fill="#fff" />
    <circle cx={401} cy={590} r={46} fill={eyes} />
    <circle cx={518} cy={590} r={46} fill={eyes} />
  </svg>
);
