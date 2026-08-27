import pandas as pd
import json
import os

data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'data (1).xlsx')
print(f"Loading {data_path}...")

df = pd.read_excel(data_path)

print("--- DATASET SUMMARY ---")
print(f"Total records (rows): {len(df)}")
print(f"Column names: {list(df.columns)}")
print("\nData Types:")
print(df.dtypes)

print("\nMissing Values:")
print(df.isnull().sum())

print(f"\nDuplicate Rows: {df.duplicated().sum()}")

# Important Columns check
cols = ['BillNo', 'Outlet_Name', 'Brand', 'Order_Datetime', 'Group', 'Item', 'Price', 'Quantity', 'Order_Type', 'Settlement']
existing_cols = [c for c in cols if c in df.columns]
print(f"\nMatched expected columns: {existing_cols}")

if 'Order_Datetime' in df.columns:
    df['parsed_date'] = pd.to_datetime(df['Order_Datetime'], errors='coerce')
    print(f"\nDate Range: {df['parsed_date'].min()} to {df['parsed_date'].max()}")

if 'BillNo' in df.columns:
    print(f"Unique BillNo: {df['BillNo'].nunique()}")

if 'Outlet_Name' in df.columns:
    print(f"Unique Outlets ({df['Outlet_Name'].nunique()}): {df['Outlet_Name'].unique().tolist()[:10]}")

if 'Brand' in df.columns:
    print(f"Unique Brands ({df['Brand'].nunique()}): {df['Brand'].unique().tolist()[:10]}")

if 'Group' in df.columns:
    print(f"Unique Groups ({df['Group'].nunique()}): {df['Group'].unique().tolist()[:10]}")

if 'Item' in df.columns:
    print(f"Unique Items ({df['Item'].nunique()}): {df['Item'].unique().tolist()[:10]}")

if 'Order_Type' in df.columns:
    print(f"Unique Order Types ({df['Order_Type'].nunique()}): {df['Order_Type'].unique().tolist()}")

if 'Settlement' in df.columns:
    print(f"Unique Settlements ({df['Settlement'].nunique()}): {df['Settlement'].unique().tolist()}")

if 'Price' in df.columns and 'Quantity' in df.columns:
    df['Price'] = pd.to_numeric(df['Price'], errors='coerce').fillna(0)
    df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce').fillna(0)
    df['Calculated_Revenue'] = df['Price'] * df['Quantity']
    print(f"\nTotal Revenue: ${df['Calculated_Revenue'].sum():,.2f}")
    print(f"Total Quantity Sold: {df['Quantity'].sum():,.0f}")
