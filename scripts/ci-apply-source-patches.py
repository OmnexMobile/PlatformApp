#!/usr/bin/env python3
"""Apply source hunks from patches/, skipping android/build junk.

Many patch-package files in this repo accidentally include Gradle
intermediates. CI needs the Java/Gradle source edits only.
"""

from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

SKIP_SUBSTRINGS = (
    "/android/build/",
    "/build/intermediates/",
    "/build/.transforms/",
    "/.transforms/",
)


def is_source_path(path: str) -> bool:
    normalized = path.replace("\\", "/")
    if any(skip in normalized for skip in SKIP_SUBSTRINGS):
        return False
    return bool(path) and path != "/dev/null"


def split_file_diffs(text: str) -> list[str]:
    parts: list[list[str]] = []
    current: list[str] = []
    for line in text.splitlines(keepends=True):
        if line.startswith("diff --git ") and current:
            parts.append(current)
            current = [line]
        else:
            current.append(line)
    if current:
        parts.append(current)
    return ["".join(part) for part in parts]


def path_from_diff(diff: str) -> str:
    for line in diff.splitlines():
        if line.startswith("+++ b/"):
            return line[6:]
        if line.startswith("+++ "):
            return line[4:].split("\t", 1)[0]
    return ""


def main() -> int:
    patch_files = sorted(Path("patches").glob("*.patch"))
    applied = 0
    skipped = 0
    for patch_path in patch_files:
        raw = patch_path.read_text(encoding="utf-8", errors="replace")
        kept = [
            part
            for part in split_file_diffs(raw)
            if is_source_path(path_from_diff(part))
        ]
        if not kept:
            print(f"SKIP (no source hunks): {patch_path}")
            skipped += 1
            continue
        with tempfile.NamedTemporaryFile("w", suffix=".patch", delete=False) as tmp:
            tmp.write("".join(kept))
            tmp_name = tmp.name
        dry = subprocess.run(
            ["patch", "-p1", "--forward", "--dry-run", "--batch", "-i", tmp_name],
            capture_output=True,
            text=True,
        )
        if dry.returncode != 0:
            print(f"SKIP (does not apply): {patch_path}")
            if dry.stdout.strip():
                print(dry.stdout.strip())
            if dry.stderr.strip():
                print(dry.stderr.strip())
            skipped += 1
            continue
        apply = subprocess.run(
            ["patch", "-p1", "--forward", "--batch", "-i", tmp_name],
            capture_output=True,
            text=True,
        )
        if apply.returncode != 0:
            print(f"FAIL: {patch_path}")
            print(apply.stdout)
            print(apply.stderr)
            return 1
        print(f"APPLIED: {patch_path}")
        applied += 1
    print(f"applied {applied} patches, skipped {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
