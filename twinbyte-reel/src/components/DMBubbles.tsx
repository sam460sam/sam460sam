import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, glass } from "../theme";
import { SPRING } from "../timing";
import { ChatBubbleLogo } from "./ChatBubbleLogo";

const Bubble: React.FC<{ at: number; mine?: boolean; children: React.ReactNode }> = ({ at, mine, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: SPRING });
  return (
    <div
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: "80%",
        padding: "22px 28px",
        borderRadius: 34,
        borderBottomRightRadius: mine ? 10 : 34,
        borderBottomLeftRadius: mine ? 34 : 10,
        background: mine ? `linear-gradient(135deg, ${colors.mint}, ${colors.mintSoft})` : "rgba(255,255,255,0.10)",
        color: mine ? colors.navy : colors.white,
        fontFamily: fonts.body,
        fontWeight: mine ? 600 : 500,
        fontSize: 38,
        lineHeight: 1.25,
        boxShadow: mine ? `0 0 40px ${colors.mint}55` : "none",
        opacity: p,
        translate: `0px ${interpolate(p, [0, 1], [24, 0])}px`,
        filter: `blur(${interpolate(p, [0, 1], [8, 0])}px)`,
        transformOrigin: mine ? "100% 100%" : "0% 100%",
        scale: String(interpolate(p, [0, 1], [0.94, 1])),
      }}
    >
      {children}
    </div>
  );
};

const Typing: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return (
    <div style={{ alignSelf: "flex-end", display: "flex", gap: 10, padding: "24px 28px", borderRadius: 34, background: `${colors.mint}33` }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: colors.mint, opacity: 0.4 + 0.6 * Math.max(0, Math.sin((frame - i * 4) / 3)) }} />
      ))}
    </div>
  );
};

export const DMBubbles: React.FC<{ q: number; reply: number; style?: React.CSSProperties }> = ({ q, reply, style }) => (
  <div style={{ ...glass, borderRadius: 48, padding: 36, display: "flex", flexDirection: "column", gap: 22, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: colors.logoTeal, display: "grid", placeItems: "center" }}>
        <ChatBubbleLogo size={40} />
      </div>
      <div style={{ fontFamily: fonts.body, color: colors.white, fontWeight: 700, fontSize: 32 }}>twinbyte.services</div>
    </div>
    <Bubble at={q}>Can you make one for my salon?</Bubble>
    <Typing from={q + 10} to={reply} />
    <Bubble at={reply} mine>Of course. Here's your free preview.</Bubble>
  </div>
);
