import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ChatBubbleLogo } from "../components/ChatBubbleLogo";
import { IconPlane } from "../components/Icons";
import { KineticHeadline } from "../components/KineticHeadline";
import { LightLines } from "../components/LightLines";
import { colors, fonts, glass } from "../theme";
import { S6, SPRING } from "../timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const S6CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // custom transition #2 (in half): blur-zoom
  const inn = interpolate(f, [0, 9], [1, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const conv = interpolate(f, [0, 45], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pill = spring({ frame: f - S6.pill, fps, config: SPRING });
  const hit = spring({ frame: f - S6.planeHit, fps, config: { damping: 14, stiffness: 180 } });
  const pulse = 0.5 + 0.5 * Math.sin(f / 7);
  const fade = (at: number) => spring({ frame: f - at, fps, config: SPRING });
  // paper plane path: bottom-left -> into pill's left slot
  const pp = interpolate(f, [S6.plane, S6.planeHit], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const px = interpolate(pp, [0, 1], [-120, 255]);
  const py = interpolate(pp, [0, 1], [1450, 735]) - Math.sin(pp * Math.PI) * 260;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 50% 35%, ${colors.deepTeal}, ${colors.navy} 70%)`, scale: String(1 + inn * 0.25), filter: `blur(${inn * 24}px)` }}>
      <LightLines mode="converge" progress={conv} target={745} count={7} seed="s6" opacity={interpolate(f, [0, 30, 60], [0.55, 0.55, 0.12], clamp)} angle={-24} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <ChatBubbleLogo size={190} style={{ filter: `drop-shadow(0 0 ${30 + pulse * 40}px ${colors.mint}${pulse > 0.5 ? "aa" : "77"})` }} />
        <div style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 96, letterSpacing: "-0.05em", color: colors.white, lineHeight: 1 }}>twinbyte</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "28px 52px 28px 40px", borderRadius: 999, background: `linear-gradient(135deg, ${colors.mint}, ${colors.mintSoft})`, color: colors.navy, fontFamily: fonts.headline, fontWeight: 800, fontSize: 62, letterSpacing: "-0.03em", boxShadow: `0 0 ${50 + hit * 60}px ${colors.mint}${hit > 0.5 ? "cc" : "88"}`, opacity: pill, scale: String(interpolate(pill, [0, 1], [0.9, 1]) * (1 + 0.05 * Math.sin(Math.min(hit, 1) * Math.PI))) }}>
          <div style={{ width: 52, display: "flex", opacity: f >= S6.planeHit ? 1 : 0 }}><IconPlane size={52} stroke={2.4} /></div>
          DM us "WEBSITE"
        </div>
      </div>
      {f >= S6.plane && f < S6.planeHit ? (
        <div style={{ position: "absolute", left: px, top: py, color: colors.mintSoft, rotate: `${interpolate(pp, [0, 0.5, 1], [-30, 5, 20])}deg`, filter: `drop-shadow(0 0 16px ${colors.mint})` }}>
          <IconPlane size={64} stroke={2.2} />
        </div>
      ) : null}
      <KineticHeadline lines={["Get a *free preview*", "of your new website."]} delay={S6.sub} size={60} lineHeight={1.1} style={{ position: "absolute", top: 860 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", opacity: fade(S6.badge), translate: `0px ${(1 - fade(S6.badge)) * 20}px` }}>
        <div style={{ ...glass, padding: "14px 30px", borderRadius: 999, fontFamily: fonts.body, fontWeight: 600, fontSize: 34, color: colors.mintSoft }}>Launch offer · first 3 businesses</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1112, textAlign: "center", fontFamily: fonts.body, fontWeight: 500, fontSize: 32, color: colors.muted, opacity: fade(S6.handle) }}>
        @twinbyte.services · twinbyte.online
      </div>
    </AbsoluteFill>
  );
};
