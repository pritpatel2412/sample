import os

def _get_required_env(name: str) -> str:
    value = os.environ.get(name)
    if value is None or not value.strip():
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value

_CACHED_API_KEY = None

def get_api_key() -> str:
    global _CACHED_API_KEY
    if _CACHED_API_KEY is None:
        _CACHED_API_KEY = _get_required_env("API_KEY")
    return _CACHED_API_KEY

def __getattr__(name: str):
    if name == "API_KEY":
        return get_api_key()
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")