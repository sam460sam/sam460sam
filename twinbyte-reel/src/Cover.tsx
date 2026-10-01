import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { FilmGrain } from "./components/FilmGrain";
import { KineticHeadline } from "./components/KineticHeadline";
import { LightLines } from "./components/LightLines";
import { ModernSiteMobile } from "./components/ModernSite";
import { PhoneMockup } from "./components/PhoneMockup";
import { SafeZoneOverlay } from "./components/SafeZoneOverlay";
import { Vignette } from "./components/Vignette";

// Static cover; headline sits inside the centered 1080x1440 grid crop (y 240–1680).
export const Cover: React.FC<{ showSafeZones: boolean }> = ({ showSafeZones }) => (
  <AbsoluteFill>
    <Backdrop />
    <LightLines count={4} seed="cover" opacity={0.6} />
    <KineticHeadline lines={["Your website is", "*costing you*", "*customers.*"]} delay={-60} size={112} style={{ position: "absolute", top: 330 }} />
    <PhoneMockup width={460} glow={0.6} style={{ position: "absolute", left: 310, top: 790, rotate: "-3deg" }}>
      <ModernSiteMobile />
    </PhoneMockup>
    <FilmGrain />
    <Vignette />
    <SafeZoneOverlay show={showSafeZones} />
  </AbsoluteFill>
);
