// All timings in frames @ 30 fps.
export const FPS = 30;

export const A = {
  total: 780,
  s1: { from: 0, dur: 75 }, // hook
  s2: { from: 75, dur: 162 }, // problem
  s3: { from: 237, dur: 81 }, // metaphor (van)
  s4: { from: 318, dur: 204 }, // solution
  s5: { from: 522, dur: 114 }, // trust
  s6: { from: 636, dur: 144 }, // CTA (last 10 frames = loop back to frame 0)
} as const;

// Variant B: hook is 30 frames longer, everything after shifts by 30.
export const B_HOOK = 105;
export const B_TOTAL = A.total - A.s1.dur + B_HOOK;

// Inside S1
export const S1 = { wipeAt: 36, wipeDur: 14 };
// Inside S2
export const S2 = { statAt: 54, compAt: 112 };
// Inside S3
export const S3 = { closeAt: 42 };
// Inside S4
export const S4 = { chips: [24, 40, 56], sliderAt: 102, sliderDur: 30, angleAt: 132, angle2At: 168 };
// Inside S5
export const S5 = { q: 6, reply: 30, trustAt: 62 };
// Inside S6
export const S6 = { pill: 18, plane: 30, planeHit: 48, sub: 52, badge: 64, handle: 76, loopAt: 134 };

// Spring presets
export const SPRING = { damping: 20, stiffness: 120, mass: 1 } as const;
