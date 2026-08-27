import sqlite3
import os
import time

db_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'analytics.db')

print(f"Connecting to {db_path}...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

indexes = [
    "CREATE INDEX IF NOT EXISTS idx_date_rev ON sales(date, Revenue, BillNo)",
    "CREATE INDEX IF NOT EXISTS idx_outlet_rev ON sales(Outlet_Name, Revenue, BillNo)",
    "CREATE INDEX IF NOT EXISTS idx_group_rev ON sales(\"Group\", Revenue, BillNo)",
    "CREATE INDEX IF NOT EXISTS idx_order_type_rev ON sales(Order_Type, Revenue, BillNo)",
    "CREATE INDEX IF NOT EXISTS idx_settlement_rev ON sales(Settlement, Revenue, BillNo)"
]

print("Adding covering indexes to accelerate aggregations...")
start = time.time()
for idx_sql in indexes:
    cursor.execute(idx_sql)

conn.commit()
print(f"Indexes created in {time.time() - start:.2f}s!")

# Benchmark query
print("\nBenchmarking Revenue Trend Query speed:")
t0 = time.time()
cursor.execute("SELECT date, ROUND(SUM(Revenue), 2) as revenue, COUNT(DISTINCT BillNo) as orders FROM sales GROUP BY date ORDER BY date ASC")
rows = cursor.fetchall()
print(f"Query returned {len(rows)} trend rows in {(time.time() - t0)*1000:.1f}ms!")

conn.close()
