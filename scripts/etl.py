import pandas as pd
import sqlite3
import os
import time

def run_etl():
    start_time = time.time()
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    excel_path = os.path.join(project_root, 'data', 'data (1).xlsx')
    db_dir = os.path.join(project_root, 'database')
    db_path = os.path.join(db_dir, 'analytics.db')

    os.makedirs(db_dir, exist_ok=True)

    print(f"Reading dataset from: {excel_path}")
    if not os.path.exists(excel_path):
        raise FileNotFoundError(f"Excel file not found at {excel_path}")

    # Read Excel dataset
    df = pd.read_excel(excel_path)
    print(f"Loaded {len(df):,} raw rows in {time.time() - start_time:.2f}s")

    # Column Mapping / Validation
    expected_cols = {
        'BillNo': 'BillNo',
        'Outlet_Name': 'Outlet_Name',
        'Brand': 'Brand',
        'Order_Datetime': 'Order_Datetime',
        'Group': 'Group',
        'Item': 'Item',
        'Price': 'Price',
        'Quantity': 'Quantity',
        'Order_Type': 'Order_Type',
        'Settlement': 'Settlement'
    }

    # Verify matching columns
    missing = [c for c in expected_cols if c not in df.columns]
    if missing:
        print(f"Warning: Columns missing from dataset: {missing}")

    # Standardize column names
    df = df.rename(columns={c: expected_cols[c] for c in expected_cols if c in df.columns})

    # Data Cleaning & Transformation
    df['BillNo'] = df['BillNo'].astype(str).str.strip()
    df['Outlet_Name'] = df['Outlet_Name'].fillna('Unknown Outlet').astype(str).str.strip()
    df['Brand'] = df['Brand'].fillna('Unknown Brand').astype(str).str.strip()
    df['Group'] = df['Group'].fillna('Uncategorized').astype(str).str.strip()
    df['Item'] = df['Item'].fillna('Unknown Item').astype(str).str.strip()
    df['Order_Type'] = df['Order_Type'].fillna('Standard').astype(str).str.strip()
    df['Settlement'] = df['Settlement'].fillna('Unspecified').astype(str).str.strip()

    # Numeric conversion
    df['Price'] = pd.to_numeric(df['Price'], errors='coerce').fillna(0.0)
    df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce').fillna(0.0)
    
    # Calculate Revenue
    df['Revenue'] = df['Price'] * df['Quantity']

    # Date parsing
    df['parsed_datetime'] = pd.to_datetime(df['Order_Datetime'], errors='coerce')
    
    # Fill missing dates if any
    valid_dates = df['parsed_datetime'].dropna()
    default_date = valid_dates.min() if not valid_dates.empty else pd.Timestamp('2025-01-01')
    df['parsed_datetime'] = df['parsed_datetime'].fillna(default_date)

    # Derived date fields for optimized filtering & aggregation
    df['Order_Datetime'] = df['parsed_datetime'].dt.strftime('%Y-%m-%d %H:%M:%S')
    df['date'] = df['parsed_datetime'].dt.strftime('%Y-%m-%d')
    df['year_month'] = df['parsed_datetime'].dt.strftime('%Y-%m')
    df['hour'] = df['parsed_datetime'].dt.hour
    df['day_of_week'] = df['parsed_datetime'].dt.day_name()

    # Select columns for SQLite table
    export_cols = [
        'BillNo', 'Outlet_Name', 'Brand', 'Order_Datetime', 'date', 'year_month', 
        'hour', 'day_of_week', 'Group', 'Item', 'Price', 'Quantity', 'Revenue', 
        'Order_Type', 'Settlement'
    ]
    df_clean = df[export_cols]

    print("Writing to SQLite database...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Drop existing table if exists
    cursor.execute("DROP TABLE IF EXISTS sales")
    
    # Create sales table schema explicitly
    cursor.execute("""
    CREATE TABLE sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        BillNo TEXT NOT NULL,
        Outlet_Name TEXT NOT NULL,
        Brand TEXT NOT NULL,
        Order_Datetime TEXT NOT NULL,
        date TEXT NOT NULL,
        year_month TEXT NOT NULL,
        hour INTEGER NOT NULL,
        day_of_week TEXT NOT NULL,
        "Group" TEXT NOT NULL,
        Item TEXT NOT NULL,
        Price REAL NOT NULL,
        Quantity REAL NOT NULL,
        Revenue REAL NOT NULL,
        Order_Type TEXT NOT NULL,
        Settlement TEXT NOT NULL
    )
    """)

    # Insert cleaned records
    df_clean.to_sql('sales', conn, if_exists='append', index=False)

    print("Creating database indexes...")
    index_queries = [
        "CREATE INDEX idx_billno ON sales(BillNo)",
        "CREATE INDEX idx_order_datetime ON sales(Order_Datetime)",
        "CREATE INDEX idx_date ON sales(date)",
        "CREATE INDEX idx_year_month ON sales(year_month)",
        "CREATE INDEX idx_outlet ON sales(Outlet_Name)",
        "CREATE INDEX idx_brand ON sales(Brand)",
        "CREATE INDEX idx_group ON sales(\"Group\")",
        "CREATE INDEX idx_item ON sales(Item)",
        "CREATE INDEX idx_order_type ON sales(Order_Type)",
        "CREATE INDEX idx_settlement ON sales(Settlement)",
        "CREATE INDEX idx_combo ON sales(date, Outlet_Name, Brand)"
    ]

    for q in index_queries:
        cursor.execute(q)

    conn.commit()

    # Verification Queries
    cursor.execute("SELECT COUNT(*) FROM sales")
    total_rows = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT BillNo) FROM sales")
    total_orders = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(Revenue), SUM(Quantity), COUNT(DISTINCT Outlet_Name), COUNT(DISTINCT Item) FROM sales")
    total_revenue, total_quantity, total_outlets, total_products = cursor.fetchone()

    cursor.execute("SELECT MIN(date), MAX(date) FROM sales")
    min_date, max_date = cursor.fetchone()

    conn.close()

    aov = total_revenue / total_orders if total_orders > 0 else 0

    print("\n" + "="*50)
    print("ETL & DATABASE CREATION COMPLETE")
    print("="*50)
    print(f"Database Path:      {db_path}")
    print(f"Total Rows:         {total_rows:,}")
    print(f"Total Orders:       {total_orders:,} (COUNT DISTINCT BillNo)")
    print(f"Total Revenue:      ${total_revenue:,.2f}")
    print(f"Total Items Sold:   {total_quantity:,.0f}")
    print(f"Average Order Val:  ${aov:,.2f}")
    print(f"Total Outlets:      {total_outlets:,}")
    print(f"Total Products:     {total_products:,}")
    print(f"Date Range:         {min_date} to {max_date}")
    print(f"Total ETL Duration: {time.time() - start_time:.2f}s")
    print("="*50 + "\n")

if __name__ == '__main__':
    run_etl()
