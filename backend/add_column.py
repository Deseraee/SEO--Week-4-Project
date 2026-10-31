import sqlite3
from pathlib import Path

DATABASE_PATH = Path('wildfind.db')
conn = sqlite3.connect(DATABASE_PATH)
cursor = conn.cursor()

cursor.execute('PRAGMA table_info(discoveries)')
columns = [col[1] for col in cursor.fetchall()]
print('Existing columns:', columns)

if 'username' not in columns:
    print('Adding username column...')
    cursor.execute('ALTER TABLE discoveries ADD COLUMN username TEXT DEFAULT "guest"')
    conn.commit()
    print('Username column added successfully')
else:
    print('Username column already exists')

conn.close()
