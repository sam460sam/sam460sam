import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Google Fonts (OFL), self-hosted in public/fonts: the render browser cannot reach fonts.gstatic.com through the proxy.
const face = (family: string, file: string, weight: string, style = "normal") =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style, format: "woff2" });
face("Inter Tight", "InterTight-800-normal.woff2", "800");
face("Inter", "Inter-variable.woff2", "400 700");
face("Instrument Serif", "InstrumentSerif-400-italic.woff2", "400", "italic");

// twinbyte.online is unreachable from the build environment (proxy policy),
// so UI colors use the brief's fallback palette; logo colors are sampled from the logo PNG.
export const colors = {
  navy: "#0A1420",
  deepTeal: "#0D2B33",
  surface: "#12333D",
  mint: "#3DE0B0",
  mintSoft: "#A7F3D9",
  white: "#FFFFFF",
  muted: "#9FB3BF",
  red: "#E5484D", // only for the "before" site
  logoTeal: "#1F6F8B",
  logoMint: "#7FD3C1",
} as const;

export const fonts = {
  headline: "'Inter Tight', sans-serif",
  body: "'Inter', sans-serif",
  serif: "'Instrument Serif', serif",
};

export const W = 1080;
export const H = 1920;

// Safe zones (see SafeZoneOverlay)
export const safe = { textTop: 250, textBottom: 1350, ctaMax: 1400, side: 65, railX: 850, railY: 1150 };

export const glass: React.CSSProperties = {
  background: "rgba(18, 51, 61, 0.45)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(61, 224, 176, 0.2)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
};

export const bgGradient = `radial-gradient(120% 70% at 50% 30%, ${colors.deepTeal} 0%, ${colors.navy} 70%)`;
