import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { KineticHeadline } from "../components/KineticHeadline";
import { LightLines } from "../components/LightLines";
import { PhoneMockup } from "../components/PhoneMockup";
import { SearchResults } from "../components/SearchResults";
import { colors } from "../theme";
import { B_HOOK } from "../timing";
import { PhoneWipe, PRE } from "./S1Hook";

// Variant B hook: search "plumber near me" -> results -> BeforeSite -> mint wipe.
const B = { results: 34, tap: 50, phone: 58, wipeAt: 80 };

export const S1BHook: React.FC = () => {
  const raw = useCurrentFrame();
  const f = raw - PRE;
  const typed = interpolate(f, [-PRE, 30], [0.25, 1], { extrapolateRight: "clamp" });
  const tap = interpolate(f, [B.tap, B.tap + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ scale: String(interpolate(raw, [0, B_HOOK + PRE], [1, 1.06])) }}>
      <Backdrop />
      <LightLines count={4} seed="s1b" speed={24} opacity={interpolate(f, [B.wipeAt - 2, B.wipeAt + 6, B.wipeAt + 25], [0.25, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      {f < B.phone ? (
        <div style={{ position: "absolute", left: 110, top: 640 }}>
          <SearchResults query="plumber near me" typed={typed} dim={interpolate(f, [B.results, B.tap], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          <div style={{ position: "absolute", left: 60, top: 196, width: 80, height: 80, borderRadius: 40, border: `3px solid ${colors.mint}`, opacity: tap > 0 ? 1 - tap : 0, scale: String(0.6 + tap * 1.4) }} />
        </div>
      ) : (
        <PhoneMockup width={440} style={{ position: "absolute", left: 320, top: 640, rotate: "-2deg" }} glow={interpolate(f, [B.wipeAt, B.wipeAt + 20], [0.1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <PhoneWipe f={f} at={B.wipeAt} />
        </PhoneMockup>
      )}
      <Sequence durationInFrames={PRE + B.phone} layout="none">
        <KineticHeadline lines={["I Googled", "your business."]} delay={-14} size={104} style={{ position: "absolute", top: 270 }} />
      </Sequence>
      <Sequence from={PRE + B.phone} layout="none">
        <KineticHeadline lines={["*Here's what your*", "*customers see.*"]} delay={0} size={104} style={{ position: "absolute", top: 270 }} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const S1B_WIPE = B.wipeAt;
