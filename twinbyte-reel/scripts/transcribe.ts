/**
 * VO -> word-level captions (src/captions-a.json, src/captions-b.json).
 * 1) whisper.cpp "small.en" with token timestamps -> toCaptions (preferred).
 * 2) Fallback when the model can't be downloaded (huggingface.co is blocked here):
 *    align the known script to the audio: speech chunks are found by energy/silence
 *    detection inside each VO line, words are spread over chunks by character length.
 * Usage: npx tsx scripts/transcribe.ts
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { Caption } from "@remotion/captions";

const ROOT = path.resolve(__dirname, "..");
const WHISPER_DIR = path.join(ROOT, "whisper.cpp");
const MODEL = "small.en";

type Line = { start: number; end: number; text: string };

const fixBrand = (c: Caption[]) => c.map((x) => ({ ...x, text: x.text.replace(/twin ?bite|twinbite|twin byte/gi, "Twinbyte") }));

async function viaWhisper(wav: string): Promise<Caption[]> {
  const { installWhisperCpp, downloadWhisperModel, transcribe, toCaptions } = await import("@remotion/install-whisper-cpp");
  await installWhisperCpp({ to: WHISPER_DIR, version: "1.7.6" });
  await downloadWhisperModel({ model: MODEL, folder: WHISPER_DIR });
  const wav16 = wav.replace(/\.wav$/, "-16k.wav");
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", wav, "-ar", "16000", "-ac", "1", wav16]);
  const out = await transcribe({ inputPath: wav16, whisperPath: WHISPER_DIR, whisperCppVersion: "1.7.6", model: MODEL, tokenLevelTimestamps: true });
  fs.unlinkSync(wav16);
  return toCaptions({ whisperCppOutput: out }).captions;
}

function viaAlignment(wav: string, lines: Line[]): Caption[] {
  const SR = 16000;
  const raw = execFileSync("ffmpeg", ["-v", "error", "-i", wav, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 1 << 28 });
  const pcm = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4);
  const win = SR / 100; // 10 ms
  const rms = (i: number) => {
    let s = 0;
    for (let k = i * win; k < (i + 1) * win && k < pcm.length; k++) s += pcm[k] * pcm[k];
    return Math.sqrt(s / win);
  };
  const out: Caption[] = [];
  for (const line of lines) {
    const a = Math.floor(line.start * 100), b = Math.ceil(line.end * 100);
    const voiced: boolean[] = [];
    for (let i = a; i < b; i++) voiced.push(rms(i) > 0.012);
    // chunks separated by >= 140 ms of silence
    const chunks: [number, number][] = [];
    let s = -1, gap = 0;
    voiced.forEach((v, i) => {
      if (v) { if (s < 0) s = i; gap = 0; }
      else if (s >= 0 && ++gap >= 14) { chunks.push([s, i - gap + 1]); s = -1; gap = 0; }
    });
    if (s >= 0) chunks.push([s, voiced.length]);
    const words = line.text.split(/\s+/);
    // group words into phrases at punctuation; if phrase count == chunk count, map 1:1
    const phrases: string[][] = [[]];
    words.forEach((w, i) => { phrases[phrases.length - 1].push(w); if (/[.,?!]$/.test(w) && i < words.length - 1) phrases.push([]); });
    const groups: { words: string[]; t0: number; t1: number }[] =
      phrases.length === chunks.length
        ? phrases.map((p, i) => ({ words: p, t0: chunks[i][0], t1: chunks[i][1] }))
        : [{ words, t0: chunks[0]?.[0] ?? 0, t1: chunks[chunks.length - 1]?.[1] ?? voiced.length }];
    for (const g of groups) {
      const weight = g.words.map((w) => w.replace(/[^\w]/g, "").length + 2);
      const tot = weight.reduce((x, y) => x + y, 0);
      let acc = 0;
      g.words.forEach((w, i) => {
        const from = (a + g.t0 + ((g.t1 - g.t0) * acc) / tot) * 10;
        acc += weight[i];
        const to = (a + g.t0 + ((g.t1 - g.t0) * acc) / tot) * 10;
        out.push({ text: ` ${w}`, startMs: Math.round(from), endMs: Math.round(to), timestampMs: Math.round((from + to) / 2), confidence: null });
      });
    }
  }
  return out;
}

// Caption copy fixes: "Ninety-seven percent" -> "97%", DM keyword in caps.
function polish(c: Caption[]): Caption[] {
  const out: Caption[] = [];
  c.forEach((x, i) => {
    const t = x.text.trim().toLowerCase();
    if (t === "percent" && out.length && /97%/.test(out[out.length - 1].text)) {
      out[out.length - 1] = { ...out[out.length - 1], endMs: x.endMs };
      return;
    }
    if (t === "ninety-seven") return out.push({ ...x, text: " 97%" });
    if (t === "website" && c[i - 1]?.text.trim().toLowerCase() === "us") return out.push({ ...x, text: ' "WEBSITE"' });
    out.push(x);
  });
  return out;
}

async function run(name: "a" | "b", wavName: string) {
  const wav = path.join(ROOT, "public/audio", `${wavName}.wav`);
  const lines: Line[] = JSON.parse(fs.readFileSync(path.join(ROOT, "public/audio", `${wavName}-lines.json`), "utf8"));
  let captions: Caption[];
  try {
    if (process.env.SKIP_WHISPER) throw new Error("SKIP_WHISPER set");
    captions = await viaWhisper(wav);
    console.log(`[${name}] whisper.cpp ${MODEL}`);
  } catch (e) {
    console.log(`[${name}] whisper unavailable (${(e as Error).message.split("\n")[0]}) -> script alignment`);
    captions = viaAlignment(wav, lines);
  }
  captions = polish(fixBrand(captions));
  fs.writeFileSync(path.join(ROOT, "src", `captions-${name}.json`), JSON.stringify(captions, null, 1));
}

(async () => {
  await run("a", "vo");
  await run("b", "vo-b");
})();
