import os

def _get_secret(name: str, default: str = "") -> str:
    file_var = f"{name}_FILE"
    path = os.environ.get(file_var)
    if path:
        try:
            with open(path, "r", encoding="utf-8") as f:
                return f.read().rstrip("\r\n")
        except Exception:
            pass
    return os.environ.get(name, default)

API_KEY = _get_secret("API_KEY", "")