import React from "react";
import { noise2D } from "@remotion/noise";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { KineticHeadline } from "../components/KineticHeadline";
import { colors } from "../theme";
import { A, S3 } from "../timing";

// Source image 1122x1402 (baked headline + front emblem removed with ffmpeg delogo -> van-clean.jpg).
const SRC = staticFile("brand/van-clean.jpg");
const K = 1.15;
const IMG = { left: -155, top: 170, w: 1122 * K, h: 1402 * K };
const map = (x: number, y: number) => ({ x: IMG.left + x * K, y: IMG.top + y * K });
const LED = { a: map(270, 772), b: map(672, 772) };

const Rain: React.FC<{ n: number; speed: number; len: number; op: number; blur: number; seed: string }> = ({ n, speed, len, op, blur, seed }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)`, mixBlendMode: "screen" }}>
      {new Array(n).fill(0).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1180 - 50;
        const y = ((random(`${seed}y${i}`) * 2100 + f * speed * (0.8 + random(`${seed}v${i}`) * 0.4)) % 2100) - 120;
        return <div key={i} style={{ position: "absolute", left: x - y * 0.18, top: y, width: 1.6, height: len, rotate: "10deg", background: "linear-gradient(180deg, transparent, rgba(210,240,235,0.9))", opacity: op * (0.5 + random(`${seed}o${i}`) * 0.5) }} />;
      })}
    </AbsoluteFill>
  );
};

const Layers: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const flick = (s: string, k = 0.08) => 0.5 + 0.5 * noise2D(s, f * k, 0);
  const mask = "radial-gradient(ellipse 48% 22% at 49% 58%, #000 60%, transparent 100%)";
  return (
    <AbsoluteFill>
      {/* far layer: blurred fill, opposite drift */}
      <Img src={SRC} style={{ position: "absolute", width: 1600, left: -260 + t * 14, top: -60, filter: "blur(28px) brightness(0.55)" }} />
      {/* mid layer */}
      <Img src={SRC} style={{ position: "absolute", left: IMG.left - t * 10, top: IMG.top, width: IMG.w, maskImage: "linear-gradient(180deg, transparent 0%, #000 22%, #000 88%, transparent 100%)" }} />
      {/* foreground van layer (parallax) */}
      <Img src={SRC} style={{ position: "absolute", left: IMG.left - t * 26, top: IMG.top - t * 4, width: IMG.w, scale: String(1 + t * 0.012), maskImage: mask }} />
      {/* wet-ground reflections flicker */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, height: 560, mixBlendMode: "screen", opacity: 0.25 + 0.35 * flick("r1"), background: `radial-gradient(ellipse 35% 60% at 42% 40%, ${colors.mint}66, transparent 70%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, height: 520, mixBlendMode: "screen", opacity: 0.2 + 0.3 * flick("r2", 0.12), background: "radial-gradient(ellipse 18% 50% at 8% 60%, rgba(255,190,110,0.55), transparent 70%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1280, height: 600, mixBlendMode: "overlay", opacity: 0.35, backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0px, transparent 3px, transparent 14px)", backgroundPositionY: f * 1.5 }} />
      {/* headlight bloom */}
      <div style={{ position: "absolute", left: LED.a.x - 80 - t * 26, top: LED.a.y - 90, width: LED.b.x - LED.a.x + 160, height: 180, borderRadius: "50%", mixBlendMode: "screen", opacity: 0.45 + 0.2 * flick("hl", 0.2), background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${colors.mintSoft}aa, ${colors.mint}33 45%, transparent 70%)`, filter: "blur(8px)" }} />
    </AbsoluteFill>
  );
};

export const S3Metaphor: React.FC = () => {
  const f = useCurrentFrame();
  const close = f >= S3.closeAt;
  const t = interpolate(f, [0, A.s3.dur], [0, 1]);
  const dolly = close ? interpolate(f, [S3.closeAt, A.s3.dur], [1.42, 1.5]) : interpolate(f, [0, S3.closeAt], [1, 1.05]);
  const origin = close ? `${LED.a.x + 40}px ${LED.a.y}px` : "540px 1000px";
  // match cut: headlight line stretches across frame in the last 10 frames
  const exit = interpolate(f, [A.s3.dur - 10, A.s3.dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: colors.navy, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(dolly), transformOrigin: origin }}>
        <Layers t={t} />
      </AbsoluteFill>
      <Rain n={70} speed={60} len={70} op={0.35} blur={0.6} seed="far" />
      <Rain n={18} speed={95} len={160} op={0.25} blur={2.5} seed="near" />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.navy} 0%, ${colors.navy}ee 20%, transparent 40%, transparent 78%, ${colors.navy}cc 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000 - 2, height: 4, background: colors.mintSoft, boxShadow: `0 0 30px ${colors.mint}, 0 0 80px ${colors.mint}`, opacity: exit, scale: `${exit} 1` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 8% at 50% 52%, ${colors.mintSoft}, transparent)`, opacity: exit * 0.9, mixBlendMode: "screen" }} />
      <KineticHeadline lines={["Your website is your", "*work van.*"]} delay={2} size={92} style={{ position: "absolute", top: 280 }} />
    </AbsoluteFill>
  );
};
