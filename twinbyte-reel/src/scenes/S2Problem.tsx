import React from "react";
import { AbsoluteFill, Easing, interpolate, random, Sequence, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { LightLines } from "../components/LightLines";
import { PhoneMockup } from "../components/PhoneMockup";
import { SearchResults } from "../components/SearchResults";
import { colors, fonts, glass } from "../theme";
import { S2 } from "../timing";

const Bokeh: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(16).fill(0).map((_, i) => {
        const s = 60 + random(`b-s-${i}`) * 220;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`b-x-${i}`) * 1080 - s / 2 + Math.sin(f / 40 + i) * 12,
              top: random(`b-y-${i}`) * 1920 - s / 2 - f * (0.3 + random(`b-v-${i}`)),
              width: s,
              height: s,
              borderRadius: "50%",
              background: i % 3 === 0 ? colors.mintSoft : i % 3 === 1 ? colors.mint : colors.logoTeal,
              opacity: 0.08 + random(`b-o-${i}`) * 0.18,
              filter: `blur(${8 + random(`b-bl-${i}`) * 18}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Shot A: night phone scroll (code-only: glowing phone + bokeh)
const PhoneScroll: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 60% at 50% 60%, ${colors.deepTeal}, #04080c 80%)` }}>
      <Bokeh />
      <div style={{ position: "absolute", left: 300, top: 660, perspective: 1400, scale: String(interpolate(f, [0, 54], [1, 1.06])) }}>
        <div style={{ transform: "rotateX(14deg) rotateY(-12deg) rotateZ(-6deg)", transformOrigin: "50% 80%", position: "relative" }}>
          <div style={{ position: "absolute", left: -120, top: 260, width: 720, height: 720, borderRadius: "50%", background: `radial-gradient(circle, ${colors.mint}40, transparent 60%)`, filter: "blur(30px)" }} />
          <PhoneMockup width={480} glow={0.7}>
            <div style={{ width: 390, height: 844, background: colors.navy, overflow: "hidden" }}>
              <div style={{ paddingTop: 70, paddingLeft: 12, scale: "0.427", transformOrigin: "0 0", translate: `0px ${-interpolate(f, [0, 54], [0, 220], { easing: Easing.inOut(Easing.cubic) })}px` }}>
                <SearchResults query="plumber near me" width={860} />
                <div style={{ height: 22 }} />
                <SearchResults query="plumber near me" width={860} />
              </div>
            </div>
          </PhoneMockup>
        </div>
      </div>
      <KineticHeadline lines={["They search.", "*They compare.*"]} delay={2} size={104} style={{ position: "absolute", top: 280 }} />
    </AbsoluteFill>
  );
};

// Shot B: 97% glass card over blurred search results
const StatCard: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [2, 30], [0, 97], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const p = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 110, top: 520, filter: "blur(14px)", opacity: 0.6, scale: String(interpolate(f, [0, 58], [1.1, 1.16])) }}>
        <SearchResults query="plumber near me" width={860} />
      </div>
      <div style={{ ...glass, position: "absolute", left: 90, width: 900, top: 560, borderRadius: 48, padding: "56px 60px", opacity: p, translate: `0px ${(1 - p) * 30}px`, filter: `blur(${(1 - p) * 8}px)` }}>
        <div style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 250, lineHeight: 0.9, letterSpacing: "-0.06em", color: colors.mint, textShadow: `0 0 60px ${colors.mint}66` }}>{n}%</div>
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 48, lineHeight: 1.2, color: colors.white, marginTop: 24, letterSpacing: "-0.02em" }}>
          of people read reviews before choosing a local business
        </div>
        <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 26, color: colors.muted, marginTop: 26 }}>Source: BrightLocal 2026</div>
      </div>
    </AbsoluteFill>
  );
};

// Shot C: competitor glows, yours fades
const CallElse: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <LightLines count={3} opacity={0.35} seed="s2c" />
      <div style={{ position: "absolute", left: 110, top: 640, scale: String(interpolate(f, [0, 50], [1, 1.05])) }}>
        <SearchResults query="plumber near me" width={860} compAt={4} />
      </div>
      <KineticHeadline lines={["They call", "*someone else.*"]} delay={0} size={104} style={{ position: "absolute", top: 280 }} />
    </AbsoluteFill>
  );
};

export const S2Problem: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={S2.statAt}><PhoneScroll /></Sequence>
    <Sequence from={S2.statAt} durationInFrames={S2.compAt - S2.statAt}><StatCard /></Sequence>
    <Sequence from={S2.compAt}><CallElse /></Sequence>
  </AbsoluteFill>
);
