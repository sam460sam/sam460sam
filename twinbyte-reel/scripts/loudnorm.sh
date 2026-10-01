#!/usr/bin/env bash
# Mix VO (+ SFX, + ducked music if present) -> two-pass loudnorm (-14 LUFS, TP <= -1 dBTP)
# -> remux with the silent Remotion render (video stream copied, not re-encoded).
# Usage: scripts/loudnorm.sh <silent.mp4> <out.mp4> <vo.wav> [sfx.wav|-] [music.wav|-] [vo-lines.json]
set -euo pipefail
VIDEO=$1; OUT=$2; VO=$3; SFX=${4:--}; MUSIC=${5:--}; LINES=${6:-}
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

inputs=(-i "$VO"); mix="[0:a]aformat=sample_rates=48000:channel_layouts=stereo[vo]"; labels="[vo]"; n=1
if [[ "$SFX" != "-" ]]; then inputs+=(-i "$SFX"); mix+=";[$n:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=-6dB[sfx]"; labels+="[sfx]"; n=$((n+1)); fi
if [[ "$MUSIC" != "-" ]]; then
  # Ducking: -20 dB under VO, -12 dB in gaps, 6-frame (0.2 s) ramps, from vo-lines.json
  EXPR=$(python3 - "$LINES" <<'PY'
import json, sys
L = json.load(open(sys.argv[1])); r = 0.2
# per-line duck amount d(t) in [0,1]: trapezoid with 0.2 s ramps
terms = [f"clip(min((t-{l['start']-r:.3f})/{r},({l['end']+r:.3f}-t)/{r}),0,1)" for l in L]
d = "max(" * (len(terms) - 1) + terms[0] + "".join(f",{x})" for x in terms[1:])
print(f"pow(10,(-12-8*{d})/20)")
PY
)
  inputs+=(-i "$MUSIC"); mix+=";[$n:a]aformat=sample_rates=48000:channel_layouts=stereo,volume='$EXPR':eval=frame[mus]"; labels+="[mus]"; n=$((n+1))
fi
mix+=";${labels}amix=inputs=$n:normalize=0:duration=first[m]"
ffmpeg -v error -y "${inputs[@]}" -filter_complex "$mix" -map "[m]" -c:a pcm_f32le "$TMP/mix.wav"

# pass 1: measure
M=$(ffmpeg -hide_banner -i "$TMP/mix.wav" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
# pass 2: linear normalisation + true-peak limiter at -1 dBTP (TP target -1.5 leaves margin after AAC)
ffmpeg -v error -y -i "$TMP/mix.wav" -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s24le "$TMP/master.wav"
ffmpeg -v error -y -i "$VIDEO" -i "$TMP/master.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest "$OUT"
ffmpeg -hide_banner -i "$OUT" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' ' | paste -sd' '
