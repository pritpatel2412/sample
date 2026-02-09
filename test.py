import sqlite3
import requests

# ----------------------------
# ⚠️ FAKE / PUBLIC TEST KEYS (DO NOT USE REAL KEYS HERE)
# ----------------------------
API_KEY = "PUBLIC_TEST_API_KEY_123456"
API_URL = "https://api.example.com/test-endpoint"

# ----------------------------
# Example: Using the API key in a request (FAKE CALL)
# ----------------------------
def call_test_api():
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    print("Calling API with headers:", headers)
    print("This is a mock call. No real request is sent.\n")

# ----------------------------
# Database setup (SQLite for testing)
# ----------------------------
def setup_db():
    conn = sqlite3.connect("test.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT
        )
    """)

    # Insert some dummy data
    cursor.execute("INSERT INTO users (name) VALUES ('Alice')")
    cursor.execute("INSERT INTO users (name) VALUES ('Bob')")
    conn.commit()
    conn.close()

# ----------------------------
# ⚠️ SAFE DELETE (DRY RUN MODE)
# ----------------------------
def delete_user(user_id, dry_run=True):
    conn = sqlite3.connect("test.db")
    cursor = conn.cursor()

    delete_query = "DELETE FROM users WHERE id = ?"

    if dry_run:
        print(f"[DRY RUN] This would execute: {delete_query} with id={user_id}")
    else:
        cursor.execute(delete_query, (user_id,))
        conn.commit()
        print(f"[REAL DELETE] User with id={user_id} deleted!")

    conn.close()

# ----------------------------
# Main
# ----------------------------
if __name__ == "__main__":
    print("=== Setting up test DB ===")
    setup_db()

    print("\n=== Testing API call ===")
    call_test_api()

    print("\n=== Testing DELETE query (SAFE MODE) ===")
    delete_user(user_id=1, dry_run=True)

    # ⚠️ Uncomment this ONLY if you really want to delete:
    # delete_user(user_id=1, dry_run=False)
