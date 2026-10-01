import React, { useMemo } from "react";
import { createTikTokStyleCaptions, Caption, TikTokPage } from "@remotion/captions";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// TikTok-style pages. Box spans x 230–850 so it stays clear of the IG button rail (x>850, y>1150).
export const Captions: React.FC<{ captions: Caption[]; top?: number }> = ({ captions, top = 1180 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(() => {
    // Split TikTok pages at sentence ends so a page never spans two sentences.
    const out: TikTokPage[] = [];
    for (const p of createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 900 }).pages) {
      let cur: TikTokPage["tokens"] = [];
      p.tokens.forEach((t, i) => {
        cur.push(t);
        if (/[.?!]$/.test(t.text.trim()) || i === p.tokens.length - 1) {
          const next = p.tokens[i + 1];
          const startMs = cur[0].fromMs;
          out.push({ text: cur.map((x) => x.text).join(""), startMs, tokens: cur, durationMs: (next ? next.fromMs : p.startMs + p.durationMs) - startMs });
          cur = [];
        }
      });
    }
    return out;
  }, [captions]);
  const ms = (frame / fps) * 1000;
  const page = pages.find((p) => {
    const lastEnd = p.tokens[p.tokens.length - 1].toMs;
    return ms >= p.startMs && ms < Math.min(p.startMs + p.durationMs, lastEnd + 350);
  });
  if (!page) return null;
  const local = ms - page.startMs;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 230,
        width: 620,
        textAlign: "center",
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: 56,
        lineHeight: 1.12,
        letterSpacing: "-0.02em",
        color: colors.white,
        textShadow: "0 2px 18px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)",
        opacity: interpolate(local, [0, 120], [0, 1], { extrapolateRight: "clamp" }),
        translate: `0px ${interpolate(local, [0, 160], [10, 0], { extrapolateRight: "clamp" })}px`,
      }}
    >
      <span style={{ display: "inline", padding: "4px 14px", borderRadius: 16, background: "rgba(5,12,18,0.55)", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", lineHeight: 1.3 }}>
      {page.tokens.map((t, i) => {
        const active = ms >= t.fromMs && ms < t.toMs;
        return (
          <span key={i} style={{ whiteSpace: "pre", color: active ? colors.mint : colors.white }}>
            {t.text}
          </span>
        );
      })}
      </span>
    </div>
  );
};
