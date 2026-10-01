"""Procedural SFX (self-made, no third-party samples) -> public/audio/sfx-a.wav / sfx-b.wav (48 kHz).
Event frames follow src/timing.ts. Usage: .venv/bin/python scripts/sfx.py"""
import json, pathlib
import numpy as np, soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR, FPS = 48000, 30
rng = np.random.default_rng(7)
t = lambda d: np.arange(int(d * SR)) / SR

def env(n, a=0.005, r=0.2):
    e = np.ones(n); ai = int(a * SR); e[:ai] = np.linspace(0, 1, ai); return e * np.exp(-np.arange(n) / (r * SR))

def sub_boom():
    x = t(1.2); f = 55 * np.exp(-x * 2.2) + 32
    return 0.9 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.004, 0.45)

def whoosh(d=0.45, up=True):
    n = int(d * SR); w = rng.standard_normal(n)
    spec = np.fft.rfft(w); fr = np.fft.rfftfreq(n, 1 / SR)
    spec *= np.exp(-((np.log(fr + 1) - np.log(1800)) ** 2) / 1.2)
    y = np.fft.irfft(spec, n); y /= np.abs(y).max()
    shape = np.sin(np.pi * np.linspace(0, 1, n)) ** (1.5 if up else 2.5)
    return 0.35 * y * shape

def glitch():
    n = int(0.12 * SR); y = np.zeros(n)
    for _ in range(6):
        s = rng.integers(0, n - 800); L = rng.integers(200, 800)
        y[s:s + L] += np.sign(np.sin(2 * np.pi * rng.uniform(300, 2500) * np.arange(L) / SR)) * 0.2
    return y + rng.standard_normal(n) * 0.04 * np.exp(-np.arange(n) / (0.04 * SR))

def pop():
    x = t(0.09); return 0.35 * np.sin(2 * np.pi * (900 - 5000 * x) * x) * env(len(x), 0.001, 0.02)

def ding():
    x = t(1.4); y = sum(a * np.sin(2 * np.pi * f * x) for f, a in [(1318.5, 1), (2637, 0.35), (3956, 0.12)])
    return 0.28 * y * env(len(x), 0.002, 0.35)

def build(events, total_frames, name):
    out = np.zeros(int(total_frames / FPS * SR) + SR)
    for frame, snd, gain in events:
        s = int(frame / FPS * SR); y = snd * gain
        out[s:s + len(y)] += y[: len(out) - s]
    out = out[: int(total_frames / FPS * SR)]
    sf.write(ROOT / f"public/audio/{name}.wav", np.stack([out, out], 1).astype(np.float32), SR)

def events(off, hook):
    # off = shift of S2–S6 (B = +30); hook = list of hook events
    e = list(hook)
    for f in (75, 129, 187, 237, 318, 420, 450, 486, 522, 584):  # cuts
        e.append((f + off - 6, whoosh(0.35), 0.6))
    e += [(318 + off + c, pop(), 1) for c in (24, 40, 56)]
    e += [(522 + off + 6, pop(), 0.8), (522 + off + 30, pop(), 0.9)]
    e += [(636 + off - 8, whoosh(0.5), 0.9), (636 + off + 48, ding(), 1)]
    return e

A_HOOK = [(0, glitch(), 0.5), (9, glitch(), 0.35), (22, glitch(), 0.4), (36, sub_boom(), 1), (30, whoosh(0.4), 0.8)]
B_HOOK = [(50, pop(), 0.8), (58, glitch(), 0.5), (68, glitch(), 0.4), (80, sub_boom(), 1), (74, whoosh(0.4), 0.8)]
build(events(0, A_HOOK) + [(772, glitch(), 0.3)], 780, "sfx-a")
build(events(30, B_HOOK), 810, "sfx-b")
print("ok")
