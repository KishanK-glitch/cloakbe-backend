import sqlite3

conn = sqlite3.connect('cloakbe.db')
c = conn.cursor()

# Nuke existing boxes and terminals for a clean slate
c.execute("DELETE FROM boxes")
c.execute("DELETE FROM terminals")

# Create Terminal 1 so the Foreign Key doesn't fail
c.execute("INSERT INTO terminals (id, name, location, layout_rows, layout_cols, status) VALUES (1, 'Main Demo Terminal', 'Hackathon Floor', 4, 2, 'ACTIVE')")

# The EXACT order matters for CSS Grid Dense Packing
demo_boxes = [
    ("B-1", "Medium", "EMPTY_CLOSED"),
    ("A-1", "Small", "EMPTY_CLOSED"),
    ("A-2", "Small", "EMPTY_CLOSED"),
    ("B-2", "Medium", "EMPTY_CLOSED"),
    ("A-3", "Small", "EMPTY_CLOSED"),
    ("A-4", "Small", "EMPTY_CLOSED"),
    ("C-1", "Large", "EMPTY_CLOSED"),
    ("C-2", "Large", "EMPTY_CLOSED")
]

for name, size, status in demo_boxes:
    # Notice the corrected column names here matching your models.py
    c.execute("INSERT INTO boxes (identifier, box_type, status, terminal_id) VALUES (?, ?, ?, 1)", (name, size, status))

conn.commit()
conn.close()
print("Database seeded successfully with Terminal 1 and exact Demo Layout.")