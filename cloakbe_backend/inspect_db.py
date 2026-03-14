import sqlite3
import glob
import sys

# Find any SQLite database in the current or app directory
db_files = glob.glob('*.db') + glob.glob('app/*.db')

if not db_files:
    print("CRITICAL ERROR: No .db file found. Your application isn't creating a database.")
    sys.exit()

for db in db_files:
    print(f"\n--- Inspecting Database: {db} ---")
    conn = sqlite3.connect(db)
    c = conn.cursor()
    
    # Get all tables
    c.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in c.fetchall()]
    print(f"Tables found: {tables}")
    
    if not tables:
        print("  -> WARNING: This database is completely empty. No tables exist.")
    
    # Get schema for each table
    for table in tables:
        c.execute(f"PRAGMA table_info({table});")
        cols = [col[1] for col in c.fetchall()]
        print(f"  -> Table '{table}' columns: {cols}")
        
    conn.close()