"""Simple translation utilities for UI strings and content."""

# Language metadata
LANGUAGE_MAP = {
    "en": {"name": "English", "native_name": "English"},
    "hi": {"name": "Hindi", "native_name": "हिन्दी"},
    "te": {"name": "Telugu", "native_name": "తెలుగు"},
}


def get_language_info(code: str) -> dict:
    """Get language display information."""
    info = LANGUAGE_MAP.get(code, LANGUAGE_MAP["en"])
    return {"code": code, **info}


def get_all_languages() -> list[dict]:
    """Get all supported languages."""
    return [{"code": code, **info} for code, info in LANGUAGE_MAP.items()]


def detect_language(text: str) -> str:
    """
    Simple heuristic language detection based on Unicode ranges.
    For production, consider using a library like langdetect or fasttext.
    """
    for char in text:
        # Devanagari range (Hindi)
        if '\u0900' <= char <= '\u097F':
            return "hi"
        # Telugu range
        if '\u0C00' <= char <= '\u0C7F':
            return "te"
    return "en"
