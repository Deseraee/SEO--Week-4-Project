import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).parent / "wildfind.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def create_database():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS discoveries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT DEFAULT 'guest',
            common_name TEXT NOT NULL,
            scientific_name TEXT,
            description TEXT,
            region_or_origin TEXT,
            fun_fact TEXT,
            hazard_warning TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


def add_discovery(data):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO discoveries (
            username,
            common_name,
            scientific_name,
            description,
            region_or_origin,
            fun_fact,
            hazard_warning
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("username", "guest"),
        data["common_name"],
        data.get("scientific_name", ""),
        data.get("description", ""),
        data.get("region_or_origin", ""),
        data.get("fun_fact", ""),
        data.get("hazard_warning", "")
    ))

    connection.commit()
    new_id = cursor.lastrowid
    connection.close()

    return new_id


def get_discoveries():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM discoveries
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    connection.close()

    return [dict(row) for row in rows]


def get_discoveries_by_username(username):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM discoveries
        WHERE username = ?
        ORDER BY id DESC
    """, (username,))

    rows = cursor.fetchall()
    connection.close()

    return [dict(row) for row in rows]
