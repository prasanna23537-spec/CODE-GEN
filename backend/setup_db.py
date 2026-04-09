import sqlite3
from pathlib import Path

DB = Path(__file__).parent / 'app.db'
SQL = Path(__file__).parent / 'create_feedback_table.sql'

if __name__ == '__main__':
    if not SQL.exists():
        raise SystemExit('create_feedback_table.sql not found')
    with sqlite3.connect(DB) as conn:
        conn.executescript(SQL.read_text())
    print(f'Initialized DB at {DB}')
