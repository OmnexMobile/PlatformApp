#!/usr/bin/env python3
"""Make a clean node_modules tree loadable on Gradle 9 / AGP 8.

CI skips patch-package. Old RN libraries still use jcenter(), compile(), and
ancient Android Gradle Plugin classpaths that Maven Central no longer hosts.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path("node_modules")
GRADLE_SUFFIXES = {".gradle", ".kts"}

OLD_AGP_BUILDSCRIPT = re.compile(
    r"buildscript\s*\{(?:[^{}]|\{[^{}]*\})*classpath\s+['\"]com\.android\.tools\.build:gradle:[23][^'\"]+['\"](?:[^{}]|\{[^{}]*\})*\}",
    re.DOTALL,
)


def rewrite(text: str) -> str:
    text = text.replace("jcenter()", "mavenCentral()")
    text = text.replace(
        "com.github.prscX:photo-editor-android:master",
        "com.github.Rauzon:photo-editor-android:v1.1.0",
    )
    text = OLD_AGP_BUILDSCRIPT.sub("", text)
    # \bcompile\b does not match compileSdkVersion / compileOptions.
    text = re.sub(r"\bandroidTestCompile\b", "androidTestImplementation", text)
    text = re.sub(r"\btestCompile\b", "testImplementation", text)
    text = re.sub(r"\bcompile\b", "implementation", text)
    return text


def main() -> None:
    updated: list[str] = []
    for path in ROOT.rglob("*"):
        if path.suffix not in GRADLE_SUFFIXES:
            continue
        try:
            original = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        rewritten = rewrite(original)
        if rewritten == original:
            continue
        path.write_text(rewritten, encoding="utf-8")
        updated.append(str(path))
    print(f"updated {len(updated)} Gradle files")
    for item in updated:
        print(f"  {item}")


if __name__ == "__main__":
    main()
