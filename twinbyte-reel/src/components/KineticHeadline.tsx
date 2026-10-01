import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";
import { SPRING } from "../timing";

type Token = { text: string; accent: boolean };

// "*word*" segments render in Instrument Serif Italic, mint.
const parse = (line: string): Token[] => {
  const out: Token[] = [];
  const re = /\*([^*]+)\*|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) m[1].split(" ").forEach((w) => out.push({ text: w, accent: true }));
    else out.push({ text: m[2], accent: false });
  }
  return out;
};

export const KineticHeadline: React.FC<{
  lines: string[];
  delay?: number;
  stagger?: number;
  size?: number;
  align?: "left" | "center";
  color?: string;
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({ lines, delay = 0, stagger = 3, size = 96, align = "center", color = colors.white, lineHeight = 1.02, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let i = 0;
  return (
    <div style={{ textAlign: align, width: "100%", ...style }}>
      {lines.map((line, li) => (
        <div key={li} style={{ lineHeight, whiteSpace: "nowrap" }}>
          {parse(line).map((t, ti) => {
            const p = spring({ frame: frame - delay - i++ * stagger, fps, config: SPRING });
            return (
              <span
                key={ti}
                style={{
                  display: "inline-block",
                  marginRight: "0.24em",
                  fontFamily: t.accent ? fonts.serif : fonts.headline,
                  fontStyle: t.accent ? "italic" : "normal",
                  fontWeight: t.accent ? 400 : 800,
                  fontSize: t.accent ? size * 1.12 : size,
                  letterSpacing: t.accent ? "-0.01em" : "-0.045em",
                  color: t.accent ? colors.mint : color,
                  textShadow: t.accent ? `0 0 40px ${colors.mint}55` : "0 4px 30px rgba(0,0,0,0.35)",
                  opacity: interpolate(p, [0, 1], [0, 1]),
                  translate: `0px ${interpolate(p, [0, 1], [24, 0])}px`,
                  filter: `blur(${interpolate(p, [0, 1], [8, 0])}px)`,
                }}
              >
                {t.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
