import sqlite3
import os
from contextlib import contextmanager
from app.config import settings

def get_db_path():
    return settings.DB_PATH

@contextmanager
def get_db():
    db_path = get_db_path()
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"Database file not found at {db_path}. Please run scripts/etl.py first.")
        
    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
