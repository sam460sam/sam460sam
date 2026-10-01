#!/usr/bin/env bash
# Render key-frame stills with the safe-zone overlay ON. Usage: scripts/stills.sh A "0 50 100" [overlay:true|false]
set -e
cd "$(dirname "$0")/.."
V=${1:-A}; FRAMES=${2:-"0 60 160 260 400 560 700 775"}; OV=${3:-true}
mkdir -p out/stills
for f in $FRAMES; do
  npx remotion still build "Twinbyte$V" "out/stills/${V}$(printf %04d "$f").png" --frame="$f" --log=error \
    --props="{\"variant\":\"$V\",\"showSafeZones\":$OV,\"showCaptions\":true,\"previewAudio\":false}" &
done
wait
