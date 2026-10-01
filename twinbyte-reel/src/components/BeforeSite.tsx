import React from "react";
import { useCurrentFrame } from "remotion";

// Deliberately dated, fictional "Mike's Plumbing" site (390 px wide mobile viewport).
const tiny: React.CSSProperties = { fontSize: 9, color: "#9a9a9a", fontFamily: "Arial, sans-serif", lineHeight: 1.15 };
const td: React.CSSProperties = { border: "1px solid #8c8c8c", padding: "1px 2px", ...tiny };

const Pixelated: React.FC = () => {
  const cols = 14;
  const rows = 8;
  const pal = ["#6b7b8c", "#8a7a63", "#4f5d4a", "#a59a80", "#5c6e7e", "#7e6f5b", "#3f4a3c", "#9aa3a8"];
  return (
    <svg width={300} height={170} viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="none" shapeRendering="crispEdges">
      {new Array(cols * rows).fill(0).map((_, i) => (
        <rect key={i} x={i % cols} y={Math.floor(i / cols)} width={1} height={1} fill={pal[(i * 7 + Math.floor(i / cols) * 3) % pal.length]} />
      ))}
    </svg>
  );
};

export const BeforeSite: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: 390, height: 844, background: "#d9d6cf", fontFamily: "'Times New Roman', Times, serif", overflow: "hidden", position: "relative" }}>
      <div style={{ height: 54, background: "#e9e9e9", borderBottom: "1px solid #aaa" }} />
      <div style={{ background: "linear-gradient(#1b3fa8,#0d2470)", padding: "8px 6px", borderBottom: "3px ridge #c0c0c0" }}>
        <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: 26, color: "#ffdd00", textShadow: "2px 2px 0 #c00", letterSpacing: 1 }}>MIKE'S PLUMBING</div>
        <div style={{ fontSize: 10, color: "#c7d1ff", fontStyle: "italic" }}>~*~ Welcome to our Web Site!! ~*~</div>
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%", background: "#c0c0c0" }}>
        <tbody>
          <tr>
            {["Home", "About Us", "Services", "Contact", "Links", "Guestbook"].map((t) => (
              <td key={t} style={{ ...td, color: "#00e", textDecoration: "underline", fontSize: 8 }}>{t}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <div style={{ padding: 6, display: "flex", gap: 6 }}>
        <div style={{ border: "2px inset #999", filter: "contrast(0.8) saturate(0.6)" }}>
          <Pixelated />
        </div>
      </div>
      <div style={{ padding: "0 6px" }}>
        <div style={{ fontSize: 13, color: "#a00", fontWeight: 700 }}>*** CALL US TODAY ***</div>
        <p style={{ ...tiny, margin: "3px 0" }}>
          We are a family plumbing company providing services for residential and commercial customers. Please call during office hours. For emergencies please leave a message on the answering machine and we will return your call as soon as possible.
        </p>
        <table style={{ borderCollapse: "collapse", width: "100%", marginTop: 4 }}>
          <tbody>
            {[["Repairs", "call", "see below"], ["Boilers", "call", "n/a"], ["Bathrooms", "ask", "see office"], ["Drains", "call", "-"]].map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j} style={td}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <div style={{ width: 92, height: 70, border: "1px solid #999", background: "#eee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <svg width={22} height={22} viewBox="0 0 24 24"><path d="M3 3h14l4 4v14H3z" fill="#fff" stroke="#888" /><path d="M3 15l5-5 4 4 3-3 6 6" fill="none" stroke="#c33" /><path d="M14 3l-3 8 4 2-2 8" fill="none" stroke="#888" /></svg>
            <span style={{ ...tiny, fontSize: 7 }}>van_photo2.jpg</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, border: "3px solid #bbb", borderTopColor: "#666", rotate: `${frame * 24}deg` }} />
            <span style={{ ...tiny, fontSize: 8 }}>Loading...</span>
          </div>
        </div>
        <p style={{ ...tiny, fontSize: 8, marginTop: 10 }}>Best viewed in Internet Explorer 6 at 800x600. Site last updated 03/2009.</p>
        <p style={{ ...tiny, fontSize: 8, color: "#b0b0b0" }}>Copyright Mike's Plumbing. All rights reserved. Do not copy pictures.</p>
      </div>
    </div>
  );
};
