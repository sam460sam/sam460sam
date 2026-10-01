import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BeforeSite } from "../components/BeforeSite";
import { IconBolt, IconPhone, IconSearch } from "../components/Icons";
import { KineticHeadline } from "../components/KineticHeadline";
import { LaptopMockup } from "../components/LaptopMockup";
import { LightLines } from "../components/LightLines";
import { ModernSiteDesktop, ModernSiteMobile } from "../components/ModernSite";
import { PhoneMockup } from "../components/PhoneMockup";
import { colors, fonts, glass } from "../theme";
import { S4, SPRING } from "../timing";

const ease = Easing.inOut(Easing.cubic);
const scrollAt = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

const Chip: React.FC<{ at: number; icon: React.ReactNode; label: string; top: number }> = ({ at, icon, label, top }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: SPRING });
  return (
    <div style={{ ...glass, position: "absolute", left: 65, top, display: "flex", alignItems: "center", gap: 18, padding: "18px 30px 18px 22px", borderRadius: 999, opacity: p, translate: `${interpolate(p, [0, 1], [-30, 0])}px 0px`, filter: `blur(${interpolate(p, [0, 1], [8, 0])}px)` }}>
      <div style={{ color: colors.mint, display: "flex", filter: `drop-shadow(0 0 10px ${colors.mint})` }}>{icon}</div>
      <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 38, color: colors.white, letterSpacing: "-0.01em" }}>{label}</span>
    </div>
  );
};

const Hero: React.FC = () => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      <LaptopMockup width={940} style={{ position: "absolute", left: 70, top: 560, transform: `rotateY(${-5 + f * 0.02}deg)`, opacity: enter, translate: `0px ${(1 - enter) * 40}px` }}>
        <ModernSiteDesktop scrollY={scrollAt(f, 10, 100, 0, 760)} />
      </LaptopMockup>
      <PhoneMockup width={330} glow={0.5} style={{ position: "absolute", left: 660, top: 780, transform: `rotateY(${6 - f * 0.03}deg)`, translate: `${(1 - enter) * 60}px ${-f * 0.25}px` }}>
        <ModernSiteMobile scrollY={scrollAt(f, 6, 100, 0, 980)} />
      </PhoneMockup>
      <Chip at={S4.chips[0]} top={860} label="Fast" icon={<IconBolt size={40} />} />
      <Chip at={S4.chips[1]} top={958} label="Mobile-first" icon={<IconPhone size={40} />} />
      <Chip at={S4.chips[2]} top={1056} label="Found on Google" icon={<IconSearch size={40} />} />
    </AbsoluteFill>
  );
};

const Slider: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [2, S4.sliderDur - 4], [0.9, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const label = (t: string, right: boolean) => (
    <div style={{ position: "absolute", top: 70, [right ? "right" : "left"]: 14, padding: "6px 12px", borderRadius: 999, fontFamily: fonts.body, fontWeight: 700, fontSize: 13, background: right ? colors.mint : colors.red, color: right ? colors.navy : "#fff" }}>{t}</div>
  );
  return (
    <AbsoluteFill>
      <PhoneMockup width={500} glow={0.6} style={{ position: "absolute", left: 290, top: 540 }}>
        <ModernSiteMobile scrollY={0} />
        {label("After", true)}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - x) * 100}% 0 0)` }}>
          <BeforeSite />
          {label("Before", false)}
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: x * 390 - 1.5, width: 3, background: colors.mintSoft, boxShadow: `0 0 18px ${colors.mint}` }} />
        <div style={{ position: "absolute", top: 400, left: x * 390 - 22, width: 44, height: 44, borderRadius: 22, background: colors.mint, display: "grid", placeItems: "center", fontFamily: fonts.body, fontWeight: 800, fontSize: 18, color: colors.navy, boxShadow: `0 0 24px ${colors.mint}` }}>‹›</div>
      </PhoneMockup>
    </AbsoluteFill>
  );
};

const LaptopClose: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <LaptopMockup width={1320} style={{ position: "absolute", left: -120, top: 600, transform: `rotateY(${8 - f * 0.08}deg) rotateX(4deg)`, scale: String(interpolate(f, [0, 36], [1, 1.04])) }}>
        <ModernSiteDesktop scrollY={scrollAt(f, 0, 36, 760, 1150)} />
      </LaptopMockup>
    </AbsoluteFill>
  );
};

const PhoneClose: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <LightLines count={4} seed="s4d" speed={30} opacity={0.6} />
      <PhoneMockup width={560} glow={0.7} style={{ position: "absolute", left: 260, top: 540, transform: `rotateY(${-6 + f * 0.1}deg)`, scale: String(interpolate(f, [0, 36], [1, 1.05])) }}>
        <ModernSiteMobile scrollY={scrollAt(f, 0, 36, 980, 1350)} />
      </PhoneMockup>
    </AbsoluteFill>
  );
};

export const S4Solution: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [0, 10], [1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Backdrop />
      <Sequence durationInFrames={S4.sliderAt}><Hero /></Sequence>
      <Sequence from={S4.sliderAt} durationInFrames={S4.sliderDur}><Slider /></Sequence>
      <Sequence from={S4.angleAt} durationInFrames={S4.angle2At - S4.angleAt}><LaptopClose /></Sequence>
      <Sequence from={S4.angle2At}><PhoneClose /></Sequence>
      {/* match-cut tail from S3 headlights */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 998, height: 4, background: colors.mintSoft, boxShadow: `0 0 30px ${colors.mint}, 0 0 80px ${colors.mint}`, opacity: line, translate: `${(1 - line) * 600}px 0px` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.navy} 0%, ${colors.navy}cc 14%, transparent 30%)` }} />
      <KineticHeadline lines={["Built for *your*", "customers."]} delay={4} size={104} style={{ position: "absolute", top: 270 }} />
    </AbsoluteFill>
  );
};
