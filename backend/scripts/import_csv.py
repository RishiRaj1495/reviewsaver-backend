import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import os

# Database connection
print("Connecting to PostgreSQL...")
conn = psycopg2.connect(
    host="localhost",
    database="reviewdb",
    user="postgres",
    password="postgres"
)
cur = conn.cursor()

# Path to CSV
csv_path = os.path.join('data', 'synthetic_reviews.csv')
print(f"Reading CSV from: {csv_path}")

# Read CSV
df = pd.read_csv(csv_path)
print(f"Found {len(df)} reviews in CSV")

# Dictionary to store created users (deviceHash -> userId)
users_cache = {}
reviews_to_insert = []
users_created = 0
reviews_count = 0

print("\nProcessing CSV data...")

for index, row in df.iterrows():
    device_hash = row['deviceHash']
    email = f"user_{device_hash}@example.com"
    
    # Check if user already exists in our cache
    if device_hash not in users_cache:
        # Check if user exists in database
        cur.execute("SELECT id FROM users WHERE device_hash = %s", (device_hash,))
        result = cur.fetchone()
        
        if result:
            users_cache[device_hash] = result[0]
        else:
            # Create new user
            try:
                cur.execute("""
                    INSERT INTO users (email, device_hash, created_at) 
                    VALUES (%s, %s, %s) 
                    RETURNING id
                """, (email, device_hash, row['date']))
                user_id = cur.fetchone()[0]
                users_cache[device_hash] = user_id
                users_created += 1
                if users_created % 100 == 0:
                    print(f"  Created {users_created} users so far...")
            except Exception as e:
                print(f"  Error creating user: {e}")
                continue
    
    user_id = users_cache[device_hash]
    
    # Prepare review for batch insert
    reviews_to_insert.append((
        user_id,
        row['product'],
        row['category'],
        int(row['rating']),
        row['reviewText'],
        0,  # upvotes (default)
        0,  # downvotes (default)
        row['date']  # created_at
    ))
    
    reviews_count += 1
    if reviews_count % 1000 == 0:
        print(f"  Processed {reviews_count} reviews...")

# Insert all reviews in batch
print(f"\nInserting {len(reviews_to_insert)} reviews into database...")
try:
    execute_values(cur, """
        INSERT INTO reviews 
        (user_id, product_name, category, rating, review_text, upvotes, downvotes, created_at) 
        VALUES %s
    """, reviews_to_insert)
    
    conn.commit()
    print("✅ Reviews inserted successfully!")
except Exception as e:
    print(f"❌ Error inserting reviews: {e}")
    conn.rollback()

# Get final counts
cur.execute("SELECT COUNT(*) FROM users")
user_count = cur.fetchone()[0]
cur.execute("SELECT COUNT(*) FROM reviews")
review_count = cur.fetchone()[0]

print("\n" + "="*50)
print("📊 IMPORT SUMMARY")
print("="*50)
print(f"✅ Users in database: {user_count}")
print(f"✅ New users created: {users_created}")
print(f"✅ Reviews in database: {review_count}")
print(f"✅ Reviews imported: {reviews_count}")
print("="*50)

# Show sample by category
print("\n📊 Reviews by Category:")
cur.execute("""
    SELECT category, COUNT(*) 
    FROM reviews 
    GROUP BY category 
    ORDER BY COUNT(*) DESC
""")
for row in cur.fetchall():
    print(f"   {row[0]}: {row[1]} reviews")

cur.close()
conn.close()
print("\n🎉 Import completed!")