"""Keep historical personality names intact after automatic translation."""

import json
from pathlib import Path


root = Path(__file__).resolve().parents[1] / "backend/src/main/resources/data/i18n"
english = json.loads((root / "en/personalities.json").read_text(encoding="utf-8"))
spanish = json.loads((root / "es/personalities.json").read_text(encoding="utf-8"))
names = {item["id"]: item["name"] for item in english}
for item in spanish:
    item["name"] = names[item["id"]]
(root / "es/personalities.json").write_text(
    json.dumps(spanish, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"Restored {len(spanish)} personality names")
