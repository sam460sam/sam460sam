import React from "react";
import { colors, fonts } from "../theme";
import { IconCall, IconDrop, IconFlame, IconWrench, IconPin, IconCheck, IconMenu } from "./Icons";

// Fallback "after" site (twinbyte.online could not be captured): the same fictional
// Mike's Plumbing, rebuilt modern. Laid out at real viewport widths (390 / 1440 px).
const ink = "#0B1B24";
const sub = "#51636D";

const HeroArt: React.FC<{ w: number; h: number; r?: number }> = ({ w, h, r = 20 }) => (
  <div style={{ width: w, height: h, borderRadius: r, position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${colors.surface} 0%, ${colors.navy} 100%)` }}>
    <div style={{ position: "absolute", width: w * 0.9, height: w * 0.9, left: w * 0.35, top: -h * 0.25, borderRadius: "50%", background: `radial-gradient(circle, ${colors.mint}55 0%, transparent 65%)` }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: `${w / 9}px ${w / 9}px`, transform: "perspective(400px) rotateX(55deg) translateY(30%)", transformOrigin: "bottom" }} />
    <div style={{ position: "absolute", left: "50%", top: "42%", translate: "-50% -50%", color: colors.mintSoft, filter: `drop-shadow(0 0 24px ${colors.mint})` }}>
      <IconDrop size={w * 0.22} stroke={1.4} />
    </div>
  </div>
);

const Logo: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 * s }}>
    <div style={{ width: 30 * s, height: 30 * s, borderRadius: 9 * s, background: ink, color: colors.mint, display: "grid", placeItems: "center" }}>
      <IconDrop size={18 * s} stroke={2.2} />
    </div>
    <span style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 17 * s, letterSpacing: "-0.03em", color: ink }}>Mike's Plumbing</span>
  </div>
);

const services = [
  { icon: IconWrench, t: "Repairs", d: "Leaks, taps, pipes and drains." },
  { icon: IconFlame, t: "Boilers & heating", d: "Installs, servicing and fixes." },
  { icon: IconDrop, t: "Bathrooms", d: "From first sketch to last tile." },
];

const Btn: React.FC<{ primary?: boolean; children: React.ReactNode; s?: number }> = ({ primary, children, s = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 * s, padding: `${13 * s}px ${20 * s}px`, borderRadius: 999, fontFamily: fonts.body, fontWeight: 700, fontSize: 15 * s, background: primary ? colors.mint : "transparent", color: ink, border: primary ? "none" : `1.5px solid ${ink}22` }}>
    {children}
  </div>
);

export const ModernSiteMobile: React.FC<{ scrollY?: number }> = ({ scrollY = 0 }) => (
  <div style={{ width: 390, background: "#F6F8F8", fontFamily: fonts.body, color: ink, translate: `0px ${-scrollY}px` }}>
    <div style={{ height: 54 }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
      <Logo />
      <IconMenu size={24} color={ink} />
    </div>
    <div style={{ padding: "18px 20px 0" }}>
      <div style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12, fontWeight: 600, color: colors.surface, background: `${colors.mint}26`, padding: "6px 10px", borderRadius: 999 }}>
        <IconPin size={13} /> Local plumbing, done properly
      </div>
      <div style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 44, lineHeight: 1, letterSpacing: "-0.045em", marginTop: 14 }}>
        Plumbing done right. <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, color: colors.logoTeal }}>First time.</span>
      </div>
      <div style={{ fontSize: 15, color: sub, marginTop: 12, lineHeight: 1.45 }}>Repairs, boilers and bathrooms. Clear quotes before we start.</div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <Btn primary><IconCall size={16} /> Call now</Btn>
        <Btn>Get a quote</Btn>
      </div>
    </div>
    <div style={{ padding: "22px 20px" }}><HeroArt w={350} h={230} /></div>
    <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
      {services.map(({ icon: I, t, d }) => (
        <div key={t} style={{ background: "#fff", borderRadius: 18, padding: 16, display: "flex", gap: 14, alignItems: "center", boxShadow: "0 6px 20px rgba(11,27,36,0.06)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${colors.mint}22`, color: colors.logoTeal, display: "grid", placeItems: "center" }}><I size={22} /></div>
          <div><div style={{ fontWeight: 700, fontSize: 16 }}>{t}</div><div style={{ fontSize: 13, color: sub }}>{d}</div></div>
        </div>
      ))}
    </div>
    <div style={{ margin: "24px 20px", padding: 22, borderRadius: 22, background: ink, color: "#fff" }}>
      <div style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 26, letterSpacing: "-0.04em", lineHeight: 1.05 }}>Need a plumber <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, color: colors.mint }}>today?</span></div>
      {["Clear, upfront quotes", "Tidy, careful work", "Easy to reach"].map((t) => (
        <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, fontSize: 14, color: colors.mintSoft }}><IconCheck size={16} color={colors.mint} /> {t}</div>
      ))}
      <div style={{ marginTop: 16 }}><Btn primary><IconCall size={16} /> Call now</Btn></div>
    </div>
    <div style={{ padding: "0 20px 40px", fontSize: 12, color: sub }}>Mike's Plumbing · Mon–Sat</div>
  </div>
);

export const ModernSiteDesktop: React.FC<{ scrollY?: number }> = ({ scrollY = 0 }) => (
  <div style={{ width: 1440, background: "#F6F8F8", fontFamily: fonts.body, color: ink, translate: `0px ${-scrollY}px` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 80px" }}>
      <Logo s={1.3} />
      <div style={{ display: "flex", gap: 36, fontSize: 17, fontWeight: 600, color: sub }}>
        <span>Services</span><span>Areas</span><span>About</span><span>Contact</span>
      </div>
      <Btn primary s={1.1}><IconCall size={18} /> Call now</Btn>
    </div>
    <div style={{ display: "flex", gap: 60, padding: "50px 80px 0", alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "inline-flex", gap: 8, alignItems: "center", fontSize: 15, fontWeight: 600, color: colors.surface, background: `${colors.mint}26`, padding: "8px 14px", borderRadius: 999 }}>
          <IconPin size={16} /> Local plumbing, done properly
        </div>
        <div style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 84, lineHeight: 0.98, letterSpacing: "-0.05em", marginTop: 22 }}>
          Plumbing done right. <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, color: colors.logoTeal }}>First time.</span>
        </div>
        <div style={{ fontSize: 21, color: sub, marginTop: 20, lineHeight: 1.45, maxWidth: 520 }}>Repairs, boilers and bathrooms. Clear quotes before we start.</div>
        <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
          <Btn primary s={1.25}><IconCall size={18} /> Call now</Btn>
          <Btn s={1.25}>Get a free quote</Btn>
        </div>
      </div>
      <HeroArt w={600} h={520} r={28} />
    </div>
    <div style={{ display: "flex", gap: 24, padding: "70px 80px" }}>
      {services.map(({ icon: I, t, d }) => (
        <div key={t} style={{ flex: 1, background: "#fff", borderRadius: 24, padding: 30, boxShadow: "0 10px 30px rgba(11,27,36,0.06)" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${colors.mint}22`, color: colors.logoTeal, display: "grid", placeItems: "center" }}><I size={28} /></div>
          <div style={{ fontWeight: 700, fontSize: 24, marginTop: 18 }}>{t}</div>
          <div style={{ fontSize: 17, color: sub, marginTop: 6 }}>{d}</div>
        </div>
      ))}
    </div>
    <div style={{ margin: "0 80px 80px", padding: 50, borderRadius: 32, background: ink, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: fonts.headline, fontWeight: 800, fontSize: 48, letterSpacing: "-0.04em" }}>Need a plumber <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontWeight: 400, color: colors.mint }}>today?</span></div>
      <Btn primary s={1.3}><IconCall size={20} /> Call now</Btn>
    </div>
  </div>
);
