"""Translate the static English UI dictionary values into an ES override."""

import json
from pathlib import Path

from argostranslate import translate


ROOT = Path(__file__).resolve().parents[1]
source = json.loads((ROOT / "scripts/es-ui-strings.json").read_text(encoding="utf-8"))
cache = {}


def put(root, path, value):
    current = root
    for index, segment in enumerate(path):
        last = index == len(path) - 1
        next_is_array = not last and path[index + 1].isdigit()
        if segment.isdigit():
            while len(current) <= int(segment):
                current.append(None)
            if last:
                current[int(segment)] = value
            elif current[int(segment)] is None:
                current[int(segment)] = [] if next_is_array else {}
            current = current[int(segment)]
        else:
            if last:
                current[segment] = value
            else:
                if segment not in current:
                    current[segment] = [] if next_is_array else {}
                current = current[segment]


overrides = {}
for index, item in enumerate(source, start=1):
    value = item["value"]
    if value not in cache:
        cache[value] = translate.translate(value, "en", "es")
    put(overrides, item["path"], cache[value])
    if index % 50 == 0 or index == len(source):
        print(f"UI strings: {index}/{len(source)}", flush=True)

target = ROOT / "frontend/src/i18n/es-auto.ts"
target.write_text(
    "// Generated from the English UI dictionary with the local en->es model.\n"
    "export const ES_AUTO_OVERRIDES = "
    + json.dumps(overrides, ensure_ascii=False, indent=2)
    + " as const;\n",
    encoding="utf-8",
)
print(f"Wrote {target}")
