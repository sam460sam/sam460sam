#!/usr/bin/env bash
# Contact sheet of stills: scripts/sheet.sh out.jpg a.png b.png ...
out=$1; shift; n=$#
args=(); for f in "$@"; do args+=(-i "$f"); done
ffmpeg -v error -y "${args[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do printf "[$i]scale=432:768[s$i];"; done)$(for i in $(seq 0 $((n-1))); do printf "[s$i]"; done)hstack=inputs=$n" -q:v 3 "$out"
