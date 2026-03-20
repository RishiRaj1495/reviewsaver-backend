import psycopg2
import csv
import os
import time

DATABASE_URL = "postgresql://reviewdb_3p90_user:p2mUQpgKIVfKiONVLZWtulJMz1gpwbST@dpg-d6p5bd95pdvs739s23lg-a.singapore-postgres.render.com/reviewdb_3p90"

import urllib.parse
parts = DATABASE_URL.split('://')[1].split('@')
auth = parts[0].split(':')
user = auth[0]
password = auth[1] if len(auth) > 1 else ''
host_port_db = parts[1].split('/')
host_port = host_port_db[0].split(':')
host = host_port[0]
port = host_port[1] if len(host_port) > 1 else '5432'
dbname = host_port_db[1] if len(host_port_db) > 1 else ''

def get_current_count():
    conn = psycopg2.connect(
        host=host, port=port, dbname=dbname,
        user=user, password=password, sslmode='require',
        connect_timeout=60
    )
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM reviews")
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return count

def import_batch(start_row, batch_size):
    try:
        conn = psycopg2.connect(
            host=host, port=port, dbname=dbname,
            user=user, password=password, sslmode='require',
            connect_timeout=60
        )
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE email = 'import_user@render.com'")
        user_id = cur.fetchone()[0]
        
        csv_path = r'C:\Users\ACER\Desktop\reviewsaver\backend\data\synthetic_reviews.csv'
        added = 0
        
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for i, row in enumerate(reader):
                if i < start_row:
                    continue
                if i >= start_row + batch_size:
                    break
                try:
                    cur.execute("""
                        INSERT INTO reviews 
                        (user_id, product_name, category, rating, review_text, upvotes, downvotes, created_at) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        user_id,
                        row['product'],
                        row['category'],
                        int(row['rating']),
                        row['reviewText'],
                        0, 0,
                        row['date']
                    ))
                    added += 1
                    if added % 500 == 0:
                        print(f"      Added {added} in this batch...")
                        conn.commit()
                except Exception as e:
                    print(f"      Error at row {i}: {e}")
                    continue
            conn.commit()
        cur.close()
        conn.close()
        return added
    except Exception as e:
        print(f"Batch connection error: {e}")
        return 0

print("="*50)
print("📦 IMPORTING REMAINING REVIEWS")
print("="*50)

# Get current count
current = get_current_count()
print(f"Current reviews: {current}")

# Total rows in CSV = 25000
TOTAL_ROWS = 25000
remaining = TOTAL_ROWS - current
print(f"Remaining to import: {remaining}")

if remaining <= 0:
    print("All reviews already imported!")
    exit()

# Import in smaller batches (2000 at a time)
BATCH_SIZE = 2000
start_row = current
total_added = 0

while start_row < TOTAL_ROWS:
    batch_size = min(BATCH_SIZE, TOTAL_ROWS - start_row)
    print(f"\n📦 Batch: importing rows {start_row} to {start_row + batch_size}")
    added = import_batch(start_row, batch_size)
    total_added += added
    start_row += batch_size
    
    print(f"   ✅ Added {added} reviews in this batch")
    print(f"   Total so far: {current + total_added}")
    
    # Wait a bit between batches to avoid timeout
    if start_row < TOTAL_ROWS:
        print("   ⏳ Waiting 5 seconds before next batch...")
        time.sleep(5)

print(f"\n{'='*50}")
print(f"✅ IMPORT COMPLETE!")
print(f"{'='*50}")
print(f"   Total reviews now: {get_current_count()}")
print("\n🎉 Done!")
