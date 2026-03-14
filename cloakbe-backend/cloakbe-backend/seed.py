import sqlite3

# Connect to the REAL database in the root folder
conn = sqlite3.connect('cloakbe.db')
c = conn.cursor()

try:
    # 1. Inject a Dummy User
    c.execute("INSERT OR IGNORE INTO users (id, phone_number, is_verified) VALUES (1, '9999999999', 1)")
    
    # 2. Inject Terminal 1
    c.execute("INSERT OR IGNORE INTO terminals (id, name, location, layout_rows, layout_cols, status) VALUES (1, 'Utkarsh MVP Terminal', 'Main Hall', 4, 5, 'ACTIVE')")
    
    # 3. Inject Box 1 (Linked to Terminal 1)
    c.execute("INSERT OR IGNORE INTO boxes (id, terminal_id, identifier, box_type, status) VALUES (1, 1, 'B-A1', 'SMALL', 'EMPTY_CLOSED')")
    
    conn.commit()
    print("✅ Success: User 1, Terminal 1, and Box 1 are locked and loaded.")
except Exception as e:
    print(f"❌ Injection failed: {e}")
finally:
    conn.close()