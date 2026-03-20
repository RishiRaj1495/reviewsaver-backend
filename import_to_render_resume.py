import psycopg2
import csv
import os

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

print("="*50)
print("📦 RESUMING IMPORT - ADDING MISSING REVIEWS")
print("="*50)

try:
    conn = psycopg2.connect(
        host=host,
        port=port,
        dbname=dbname,
        user=user,
        password=password,
        sslmode='require',
        connect_timeout=60
    )
    print("✅ Connected to Render PostgreSQL!")
except Exception as e:
    print(f"❌ Connection failed: {e}")
    exit()

cur = conn.cursor()

# Get import user
cur.execute("SELECT id FROM users WHERE email = 'import_user@render.com'")
user_id = cur.fetchone()[0]
print(f"Using user ID: {user_id}")

# Check current count
cur.execute("SELECT COUNT(*) FROM reviews")
current_count = cur.fetchone()[0]
print(f"Current reviews in database: {current_count}")

# CSV path
csv_path = r'C:\Users\ACER\Desktop\reviewsaver\backend\data\synthetic_reviews.csv'

reviews_added = 0
errors = 0

with open(csv_path, 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    
    # Skip already imported rows
    rows_to_skip = current_count
    print(f"\n🔄 Skipping first {rows_to_skip} rows (already imported)")
    print(f"   Importing remaining reviews...")
    
    for row in reader:
        if rows_to_skip > 0:
            rows_to_skip -= 1
            continue
        
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
            reviews_added += 1
            if reviews_added % 500 == 0:
                print(f"   ✅ Added {reviews_added} new reviews...")
                conn.commit()
        except Exception as e:
            errors += 1
            if errors <= 5:
                print(f"   ⚠️ Error: {e}")
            continue

conn.commit()

print(f"\n{'='*50}")
print(f"✅ IMPORT COMPLETE!")
print(f"{'='*50}")
print(f"   New reviews added: {reviews_added}")
print(f"   Errors: {errors}")

cur.execute("SELECT COUNT(*) FROM reviews")
final_count = cur.fetchone()[0]
print(f"   Total reviews in database: {final_count}")

cur.close()
conn.close()
print("\n🎉 Done!")
