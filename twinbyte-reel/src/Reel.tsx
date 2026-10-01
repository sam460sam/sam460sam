import React from "react";
import { Caption } from "@remotion/captions";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { z } from "zod";
import { Captions } from "./components/Captions";
import { FilmGrain } from "./components/FilmGrain";
import { SafeZoneOverlay } from "./components/SafeZoneOverlay";
import { Vignette } from "./components/Vignette";
import { S1BHook } from "./scenes/S1BHook";
import { PRE, S1Hook } from "./scenes/S1Hook";
import { S2Problem } from "./scenes/S2Problem";
import { S3Metaphor } from "./scenes/S3Metaphor";
import { S4Solution } from "./scenes/S4Solution";
import { S5Trust } from "./scenes/S5Trust";
import { S6CTA } from "./scenes/S6CTA";
import { colors } from "./theme";
import { A, B_HOOK } from "./timing";
import capA from "./captions-a.json";
import capB from "./captions-b.json";

export const reelSchema = z.object({
  variant: z.enum(["A", "B"]),
  showSafeZones: z.boolean(),
  showCaptions: z.boolean(),
  previewAudio: z.boolean(),
});

export const Reel: React.FC<z.infer<typeof reelSchema>> = ({ variant, showSafeZones, showCaptions, previewAudio }) => {
  const hookDur = variant === "A" ? A.s1.dur : B_HOOK;
  const off = hookDur - A.s1.dur; // B shifts S2–S6 by +30
  const total = A.total + off;
  const Hook = variant === "A" ? S1Hook : S1BHook;
  const p = { premountFor: 30 };
  return (
    <AbsoluteFill style={{ background: colors.navy }}>
      <Sequence from={-PRE} durationInFrames={hookDur + PRE} {...p}><Hook /></Sequence>
      <Sequence from={off + A.s2.from} durationInFrames={A.s2.dur} {...p}><S2Problem /></Sequence>
      <Sequence from={off + A.s3.from} durationInFrames={A.s3.dur} {...p}><S3Metaphor /></Sequence>
      <Sequence from={off + A.s4.from} durationInFrames={A.s4.dur} {...p}><S4Solution /></Sequence>
      <Sequence from={off + A.s5.from} durationInFrames={A.s5.dur} {...p}><S5Trust /></Sequence>
      <Sequence from={off + A.s6.from} durationInFrames={A.s6.dur - PRE} {...p}><S6CTA /></Sequence>
      {/* loop tail: hook pre-roll, so the last frame flows into frame 0 */}
      <Sequence from={total - PRE} durationInFrames={PRE} {...p}><Hook /></Sequence>
      <FilmGrain opacity={0.025} />
      <Vignette strength={0.6} />
      {showCaptions ? <Captions captions={(variant === "A" ? capA : capB) as Caption[]} /> : null}
      {previewAudio ? <Html5Audio src={staticFile(variant === "A" ? "audio/vo.wav" : "audio/vo-b.wav")} /> : null}
      <SafeZoneOverlay show={showSafeZones} />
    </AbsoluteFill>
  );
};
