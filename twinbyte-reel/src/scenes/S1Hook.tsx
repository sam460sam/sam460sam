import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BeforeSite } from "../components/BeforeSite";
import { KineticHeadline } from "../components/KineticHeadline";
import { LightLines } from "../components/LightLines";
import { MintWipe } from "../components/MintWipe";
import { ModernSiteMobile } from "../components/ModernSite";
import { PhoneMockup, PHONE_VH } from "../components/PhoneMockup";
import { S1 } from "../timing";

// Pre-roll so the loop tail (last 10 frames of the reel) flows into frame 0.
export const PRE = 10;

export const Glitchy: React.FC<{ f: number; until: number; children: React.ReactNode }> = ({ f, until, children }) => {
  const on = f < until && random(`g-${Math.floor(f / 2)}`) > 0.55;
  const dx = on ? (random(`gx-${f}`) - 0.5) * 22 : 0;
  const slice = on ? random(`gs-${f}`) * 80 : 0;
  return (
    <div style={{ position: "absolute", inset: 0, translate: `${dx}px 0px` }}>
      {children}
      {on ? (
        <>
          <div style={{ position: "absolute", inset: 0, translate: "6px 0px", opacity: 0.45, mixBlendMode: "screen", filter: "sepia(1) saturate(6) hue-rotate(-50deg)" }}>{children}</div>
          <div style={{ position: "absolute", inset: 0, translate: `${-14 + dx}px 0px`, clipPath: `inset(${slice}% 0 ${90 - slice}% 0)`, filter: "hue-rotate(160deg) saturate(3)" }}>{children}</div>
        </>
      ) : null}
    </div>
  );
};

export const PhoneWipe: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <MintWipe
    at={at}
    dur={S1.wipeDur}
    height={PHONE_VH}
    before={<Glitchy f={f} until={at}><BeforeSite /></Glitchy>}
    after={<ModernSiteMobile scrollY={interpolate(f, [at + S1.wipeDur, at + 60], [0, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
  />
);

export const S1Hook: React.FC = () => {
  const raw = useCurrentFrame();
  const f = raw - PRE;
  return (
    <AbsoluteFill style={{ scale: String(interpolate(raw, [0, 85], [1, 1.06])) }}>
      <Backdrop />
      <LightLines count={4} opacity={interpolate(f, [S1.wipeAt - 2, S1.wipeAt + 6, S1.wipeAt + 30], [0.25, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} seed="s1" speed={28} />
      <KineticHeadline lines={["Your website", "*is costing you*", "*customers.*"]} delay={-14} size={100} style={{ position: "absolute", top: 262 }} />
      <PhoneMockup width={440} style={{ position: "absolute", left: 320, top: 640, rotate: "-2deg" }} glow={interpolate(f, [S1.wipeAt, S1.wipeAt + 20], [0.1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
        <PhoneWipe f={f} at={S1.wipeAt} />
      </PhoneMockup>
    </AbsoluteFill>
  );
};
