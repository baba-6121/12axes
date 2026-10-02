"""Generate complete Spanish catalogue overlays with a local Argos model.

The project stores translations as sparse, ID-keyed JSON overlays. This helper
translates only human-facing fields, keeps IDs/vector links untouched, and
writes deterministic UTF-8 JSON.
"""

import json
from pathlib import Path

from argostranslate import translate


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "backend/src/main/resources/data/i18n/en"
TARGET = ROOT / "backend/src/main/resources/data/i18n/es"
TARGET.mkdir(parents=True, exist_ok=True)

HUMAN_FIELDS = {
    "label", "leftPole", "rightPole", "text", "name", "category",
    "description", "phrase", "role",
}


def main():
    cache = {}
    for source_path in sorted(SOURCE.glob("*.json")):
        source_items = json.loads(source_path.read_text(encoding="utf-8"))
        output_items = []
        for index, item in enumerate(source_items, start=1):
            output = {}
            for key, value in item.items():
                # Personality names are proper names. Preserve the source
                # spelling so the local model cannot translate them.
                if source_path.name == "personalities.json" and key == "name":
                    output[key] = value
                    continue
                if key not in HUMAN_FIELDS or not isinstance(value, str) or not value.strip():
                    output[key] = value
                    continue
                if value not in cache:
                    cache[value] = translate.translate(value, "en", "es")
                output[key] = cache[value]
            output_items.append(output)
            if index % 25 == 0 or index == len(source_items):
                print(f"{source_path.name}: {index}/{len(source_items)}", flush=True)
        (TARGET / source_path.name).write_text(
            json.dumps(output_items, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"{source_path.name}: written", flush=True)


if __name__ == "__main__":
    main()
