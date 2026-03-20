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
print("📦 IMPORTING 25,000 REVIEWS TO RENDER DATABASE")
print("="*50)
print(f"Host: {host}")
print(f"Port: {port}")
print(f"Database: {dbname}")
print(f"User: {user}")

try:
    conn = psycopg2.connect(
        host=host,
        port=port,
        dbname=dbname,
        user=user,
        password=password,
        sslmode='require'
    )
    print("\n✅ Connected to Render PostgreSQL successfully!")
except Exception as e:
    print(f"\n❌ Connection failed: {e}")
    exit()

cur = conn.cursor()

print("\n📋 Setting up import user...")
cur.execute("SELECT id FROM users WHERE email = 'import_user@render.com'")
user_result = cur.fetchone()
if user_result:
    user_id = user_result[0]
    print(f"   Found existing user with ID: {user_id}")
else:
    cur.execute("""
        INSERT INTO users (email, device_hash, created_at) 
        VALUES ('import_user@render.com', 'import_device', NOW()) 
        RETURNING id
    """)
    user_id = cur.fetchone()[0]
    conn.commit()
    print(f"   Created new import user with ID: {user_id}")

# CORRECT PATH - Your CSV is in backend/data
csv_path = r'C:\Users\ACER\Desktop\reviewsaver\backend\data\synthetic_reviews.csv'
print(f"\n📂 Reading CSV from: {csv_path}")

if not os.path.exists(csv_path):
    print(f"❌ CSV file not found!")
    exit()

reviews_added = 0
errors = 0

with open(csv_path, 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    print(f"   CSV columns: {reader.fieldnames}")
    print("\n🔄 Importing 25,000 reviews...")
    print("   This will take about 1-2 minutes...")
    
    for row in reader:
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
            if reviews_added % 1000 == 0:
                print(f"   ✅ Imported {reviews_added} reviews...")
                conn.commit()
        except Exception as e:
            errors += 1
            if errors <= 5:
                print(f"   ⚠️ Error on row {reviews_added + 1}: {e}")
            continue

conn.commit()

print(f"\n{'='*50}")
print(f"✅ IMPORT COMPLETE!")
print(f"{'='*50}")
print(f"   Total reviews imported: {reviews_added}")
print(f"   Errors: {errors}")

cur.execute("SELECT COUNT(*) FROM reviews")
count = cur.fetchone()[0]
print(f"   Total reviews in database: {count}")

# Show category distribution
cur.execute("""
    SELECT category, COUNT(*) 
    FROM reviews 
    GROUP BY category 
    ORDER BY COUNT(*) DESC
""")
print("\n📊 Category Distribution:")
for row in cur.fetchall():
    print(f"   {row[0]}: {row[1]} reviews")

cur.close()
conn.close()
print("\n🎉 Done! Your Render database now has all 25,000 reviews!")
