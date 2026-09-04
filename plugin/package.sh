#!/bin/bash
# Assemble the installer from the built .sdPlugin (run `npm run build` and profile/build_profile.py first).
#   bash plugin/package.sh          → dist/com.4xsdev.genetec-sd.streamDeckPlugin        (Marketplace build, no Ko-fi key)
#   bash plugin/package.sh --kofi   → dist/com.4xsdev.genetec-sd-kofi.streamDeckPlugin   (GitHub build, adds the Ko-fi key)
# Elgato's guidelines forbid donation links inside plugins, so only the GitHub build carries the Ko-fi action.
set -euo pipefail
cd "$(dirname "$0")/.."
P=com.4xsdev.genetec-sd.sdPlugin
OUT=com.4xsdev.genetec-sd.streamDeckPlugin
rm -rf dist/$P && mkdir -p dist/$P
cp -R plugin/$P/. dist/$P/
cp profile/*.streamDeckProfile dist/$P/
if [[ "${1:-}" == "--kofi" ]]; then
  OUT=com.4xsdev.genetec-sd-kofi.streamDeckPlugin
  cp -R plugin/kofi/ui/. dist/$P/ui/
  cp -R plugin/kofi/imgs/. dist/$P/imgs/
  python3 - dist/$P/manifest.json plugin/kofi/action.json <<'PY'
import json,sys
m=json.load(open(sys.argv[1])); a=json.load(open(sys.argv[2]))
m["Actions"]=[x for x in m["Actions"] if x["UUID"]!=a["UUID"]]+[a]
json.dump(m,open(sys.argv[1],"w"),indent=2,ensure_ascii=False)
PY
fi
( cd dist && rm -f $OUT && zip -qr $OUT $P -x '*.DS_Store' )
rm -rf dist/$P
echo "dist/$OUT"
