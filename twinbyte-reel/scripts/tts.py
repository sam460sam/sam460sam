"""Kokoro-82M (ONNX build, Apache-2.0) voiceover -> public/audio/vo.wav (48 kHz) + public/audio/vo-lines.json.
Usage: .venv/bin/python scripts/tts.py [lines.json out_name] [--measure]"""
import json, subprocess, sys, pathlib
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent
VOICE, SPEED, SR_OUT = "am_michael", 1.05, 48000
# (start_seconds, text) - starts match src/timing.ts scene beats
args = [a for a in sys.argv[1:] if not a.startswith("--")]
LINES_FILE, OUT_NAME = (args + ["vo-lines.json", "vo"])[:2] if len(args) != 1 else (args[0], "vo")
LINES = json.loads((ROOT / "scripts" / LINES_FILE).read_text())
TOTAL_S = 27.0 if OUT_NAME == "vo-b" else 26.0  # variant B hook is 1 s longer

def trim(a, sr, thr=0.01):
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0: return a
    s, e = max(idx[0] - int(0.02 * sr), 0), min(idx[-1] + int(0.06 * sr), len(a))
    return a[s:e]

k = Kokoro(str(ROOT / "models/kokoro-v1.0.onnx"), str(ROOT / "models/voices-v1.0.bin"))
out = np.zeros(int(TOTAL_S * 24000), dtype=np.float32)
meta = []
for i, line in enumerate(LINES):
    samples, sr = k.create(line["text"], voice=VOICE, speed=line.get("speed", SPEED), lang="en-us")
    a = trim(samples.astype(np.float32), sr)
    dur = len(a) / sr
    st = int(line["start"] * sr)
    print(f"{i} start={line['start']:.2f} dur={dur:.2f} end={line['start']+dur:.2f} next={LINES[i+1]['start'] if i+1<len(LINES) else TOTAL_S} | {line['text']}")
    meta.append({"start": line["start"], "end": round(line["start"] + dur, 3), "text": line["text"]})
    out[st:st + len(a)] += a[: len(out) - st]
if "--measure" in sys.argv: sys.exit()
tmp = ROOT / f"public/audio/{OUT_NAME}-24k.wav"
tmp.parent.mkdir(parents=True, exist_ok=True)
sf.write(tmp, out, 24000)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(tmp), "-ar", str(SR_OUT), "-af", "aresample=resampler=soxr", str(ROOT / f"public/audio/{OUT_NAME}.wav")], check=True)
tmp.unlink()
(ROOT / f"public/audio/{OUT_NAME}-lines.json").write_text(json.dumps(meta, indent=1))
