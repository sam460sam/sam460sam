import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, Sequence, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { ChatBubbleLogo } from "../components/ChatBubbleLogo";
import { DMBubbles } from "../components/DMBubbles";
import { KineticHeadline } from "../components/KineticHeadline";
import { colors, fonts } from "../theme";
import { A, S5 } from "../timing";

const Struck: React.FC<{ text: string; at: number; top: number }> = ({ text, at, top }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const s = interpolate(f, [at + 10, at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p, translate: `0px ${(1 - p) * 24}px`, filter: `blur(${(1 - p) * 8}px)` }}>
      <div style={{ position: "relative", fontFamily: fonts.headline, fontWeight: 800, fontSize: 92, letterSpacing: "-0.045em", color: interpolateColors(s, [0, 1], [colors.white, colors.muted]) }}>
        {text}
        <div style={{ position: "absolute", left: -10, right: -10, top: "54%", height: 7, borderRadius: 4, background: colors.white, scale: `${s} 1`, transformOrigin: "0 50%" }} />
      </div>
    </div>
  );
};

// Desk scene: code-only (glowing desk edge + blurred laptop light) with DM conversation.
const Desk: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #050b10 0%, ${colors.navy} 60%, #071a20 100%)` }}>
      <div style={{ position: "absolute", left: -100, right: -100, top: 1420, height: 600, background: `linear-gradient(180deg, ${colors.surface}, #04090c)`, transform: "perspective(900px) rotateX(55deg)", transformOrigin: "top", boxShadow: `0 -2px 60px ${colors.mint}33` }} />
      <div style={{ position: "absolute", left: 140, top: 1150, width: 800, height: 420, borderRadius: 20, background: `radial-gradient(ellipse at 50% 30%, ${colors.mint}44, transparent 70%)`, filter: "blur(40px)", opacity: 0.6 + 0.1 * Math.sin(f / 9) }} />
      <div style={{ position: "absolute", left: 600, top: 120, width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${colors.logoTeal}55, transparent 65%)`, filter: "blur(30px)" }} />
      <DMBubbles q={S5.q} reply={S5.reply} style={{ position: "absolute", left: 90, width: 900, top: 560, scale: String(interpolate(f, [0, 62], [1, 1.04])) }} />
      <Struck text="No call center." at={0} top={262} />
      <Struck text="No big company." at={16} top={366} />
    </AbsoluteFill>
  );
};

const Attention: React.FC = () => {
  const f = useCurrentFrame();
  const dur = A.s5.dur - S5.trustAt;
  // custom transition #2 (out half): blur-zoom
  const out = interpolate(f, [dur - 7, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ scale: String(1 + out * 0.3), filter: `blur(${out * 24}px)` }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 520, borderRadius: 48, background: `${colors.surface}66`, filter: "blur(30px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", opacity: interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" }) }}>
        <ChatBubbleLogo size={130} style={{ filter: `drop-shadow(0 0 30px ${colors.mint}88)` }} />
      </div>
      <KineticHeadline lines={["Just personal", "*attention.*"]} delay={0} size={120} style={{ position: "absolute", top: 640 }} />
    </AbsoluteFill>
  );
};

export const S5Trust: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={S5.trustAt}><Desk /></Sequence>
    <Sequence from={S5.trustAt}><Attention /></Sequence>
  </AbsoluteFill>
);
