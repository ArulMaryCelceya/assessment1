import pandas as pd
import numpy as np
import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

excel_path = r'C:\Users\REENA\.gemini\antigravity-ide\scratch\business-analytics-dashboard\data\data (1).xlsx'
output_dir = r'C:\Users\REENA\.gemini\antigravity-ide\scratch\business-analytics-dashboard\frontend\data\processed'

os.makedirs(output_dir, exist_ok=True)

print("Loading dataset from Excel...")
df = pd.read_excel(excel_path)

# Cleaning & Standardizing
df['Price'] = pd.to_numeric(df['Price'], errors='coerce').fillna(0)
df['Quantity'] = pd.to_numeric(df['Quantity'], errors='coerce').fillna(0)
df['Revenue'] = df['Price'] * df['Quantity']
df['Order_Datetime'] = pd.to_datetime(df['Order_Datetime'], errors='coerce')
df['Date'] = df['Order_Datetime'].dt.strftime('%Y-%m-%d')
df['Month'] = df['Order_Datetime'].dt.strftime('%Y-%m')
df['Week'] = df['Order_Datetime'].dt.strftime('%Y-W%U')

df['Outlet_Name'] = df['Outlet_Name'].astype(str).str.strip()
df['Brand'] = df['Brand'].astype(str).str.strip()
df['Group'] = df['Group'].astype(str).str.strip()
df['Order_Type'] = df['Order_Type'].astype(str).str.strip()
df['Settlement'] = df['Settlement'].astype(str).str.strip()
df['Item'] = df['Item'].astype(str).str.strip()

total_rows = len(df)
total_revenue = float(df['Revenue'].sum())
unique_orders = int(df['BillNo'].nunique())
total_quantity = float(df['Quantity'].sum())
aov = total_revenue / unique_orders if unique_orders > 0 else 0
avg_item_price = float(df['Price'].mean())

min_date = str(df['Date'].min())
max_date = str(df['Date'].max())

outlets = sorted(df['Outlet_Name'].unique().tolist())
brands = sorted(df['Brand'].unique().tolist())
categories = sorted(df['Group'].unique().tolist())
order_types = sorted(df['Order_Type'].unique().tolist())
settlements = sorted(df['Settlement'].unique().tolist())
items = sorted(df['Item'].unique().tolist())

# Summary JSON
summary_data = {
    "totalRows": total_rows,
    "totalRevenue": round(total_revenue, 2),
    "uniqueOrders": unique_orders,
    "totalQuantity": int(total_quantity),
    "aov": round(aov, 2),
    "avgItemPrice": round(avg_item_price, 2),
    "dateRange": { "min": min_date, "max": max_date },
    "outlets": outlets,
    "brands": brands,
    "categories": categories,
    "orderTypes": order_types,
    "settlements": settlements,
    "totalItems": len(items)
}

with open(os.path.join(output_dir, 'summary.json'), 'w', encoding='utf-8') as f:
    json.dump(summary_data, f, indent=2)

print("Generated summary.json")

# Analytics JSON (Time series, Outlets, Categories, Order Types, Settlements, Items)
daily_df = df.groupby('Date').agg(
    revenue=('Revenue', 'sum'),
    orders=('BillNo', 'nunique'),
    quantity=('Quantity', 'sum')
).reset_index()
daily_data = [
    { "date": row['Date'], "revenue": round(float(row['revenue']), 2), "orders": int(row['orders']), "quantity": int(row['quantity']) }
    for _, row in daily_df.iterrows()
]

monthly_df = df.groupby('Month').agg(
    revenue=('Revenue', 'sum'),
    orders=('BillNo', 'nunique'),
    quantity=('Quantity', 'sum')
).reset_index()
monthly_data = [
    { "month": row['Month'], "revenue": round(float(row['revenue']), 2), "orders": int(row['orders']), "quantity": int(row['quantity']) }
    for _, row in monthly_df.iterrows()
]

weekly_df = df.groupby('Week').agg(
    revenue=('Revenue', 'sum'),
    orders=('BillNo', 'nunique'),
    quantity=('Quantity', 'sum')
).reset_index()
weekly_data = [
    { "week": row['Week'], "revenue": round(float(row['revenue']), 2), "orders": int(row['orders']), "quantity": int(row['quantity']) }
    for _, row in weekly_df.iterrows()
]

outlet_df = df.groupby('Outlet_Name').agg(
    revenue=('Revenue', 'sum'),
    orders=('BillNo', 'nunique'),
    quantity=('Quantity', 'sum')
).reset_index().sort_values(by='revenue', ascending=False)
by_outlet = [
    {
        "outlet": row['Outlet_Name'],
        "revenue": round(float(row['revenue']), 2),
        "orders": int(row['orders']),
        "quantity": int(row['quantity']),
        "percentage": round((float(row['revenue']) / total_revenue) * 100, 2)
    }
    for _, row in outlet_df.iterrows()
]

category_df = df.groupby('Group').agg(
    revenue=('Revenue', 'sum'),
    orders=('BillNo', 'nunique'),
    quantity=('Quantity', 'sum')
).reset_index().sort_values(by='revenue', ascending=False)
by_category = [
    {
        "category": row['Group'],
        "revenue": round(float(row['revenue']), 2),
        "orders": int(row['orders']),
        "quantity": int(row['quantity']),
        "percentage": round((float(row['revenue']) / total_revenue) * 100, 2)
    }
    for _, row in category_df.iterrows()
]

order_type_df = df.groupby('Order_Type').agg(
    revenue=('Revenue', 'sum'),
    orders=('BillNo', 'nunique'),
    quantity=('Quantity', 'sum')
).reset_index().sort_values(by='revenue', ascending=False)
by_order_type = [
    {
        "orderType": row['Order_Type'],
        "revenue": round(float(row['revenue']), 2),
        "orders": int(row['orders']),
        "quantity": int(row['quantity']),
        "percentage": round((float(row['orders']) / unique_orders) * 100, 2)
    }
    for _, row in order_type_df.iterrows()
]

settlement_df = df.groupby('Settlement').agg(
    revenue=('Revenue', 'sum'),
    orders=('BillNo', 'nunique'),
    quantity=('Quantity', 'sum')
).reset_index().sort_values(by='revenue', ascending=False)
by_settlement = [
    {
        "settlement": row['Settlement'],
        "revenue": round(float(row['revenue']), 2),
        "orders": int(row['orders']),
        "quantity": int(row['quantity']),
        "percentage": round((float(row['revenue']) / total_revenue) * 100, 2)
    }
    for _, row in settlement_df.iterrows()
]

item_df = df.groupby(['Item', 'Group']).agg(
    revenue=('Revenue', 'sum'),
    quantity=('Quantity', 'sum'),
    orders=('BillNo', 'nunique'),
    avgPrice=('Price', 'mean')
).reset_index().sort_values(by='revenue', ascending=False)
by_item = [
    {
        "item": row['Item'],
        "category": row['Group'],
        "revenue": round(float(row['revenue']), 2),
        "quantity": int(row['quantity']),
        "orders": int(row['orders']),
        "avgPrice": round(float(row['avgPrice']), 2)
    }
    for _, row in item_df.iterrows()
]

# Business Insights calculation
top_outlet = by_outlet[0]
top_category = by_category[0]
best_item = by_item[0]
top_order_type = sorted(by_order_type, key=lambda x: x['orders'], reverse=True)[0]
peak_day = sorted(daily_data, key=lambda x: x['revenue'], reverse=True)[0]

insights = {
    "topOutlet": { "name": top_outlet['outlet'], "revenue": top_outlet['revenue'], "percentage": top_outlet['percentage'] },
    "topCategory": { "name": top_category['category'], "revenue": top_category['revenue'], "percentage": top_category['percentage'] },
    "bestSellingItem": { "name": best_item['item'], "category": best_item['category'], "revenue": best_item['revenue'], "quantity": best_item['quantity'] },
    "mostUsedOrderType": { "name": top_order_type['orderType'], "orders": top_order_type['orders'], "percentage": top_order_type['percentage'] },
    "peakRevenuePeriod": { "date": peak_day['date'], "revenue": peak_day['revenue'], "orders": peak_day['orders'] },
    "aov": round(aov, 2)
}

analytics_data = {
    "daily": daily_data,
    "monthly": monthly_data,
    "weekly": weekly_data,
    "byOutlet": by_outlet,
    "byCategory": by_category,
    "byOrderType": by_order_type,
    "bySettlement": by_settlement,
    "byItem": by_item,
    "insights": insights
}

with open(os.path.join(output_dir, 'analytics.json'), 'w', encoding='utf-8') as f:
    json.dump(analytics_data, f, indent=2)

print("Generated analytics.json")

# High performance multi-dimensional granular aggregate matrix for ultra-fast filtering
# Group by Date, Outlet, Group, Order_Type, Settlement
matrix_df = df.groupby(['Date', 'Outlet_Name', 'Brand', 'Group', 'Order_Type', 'Settlement']).agg(
    revenue=('Revenue', 'sum'),
    orders=('BillNo', 'nunique'),
    quantity=('Quantity', 'sum'),
    records=('Price', 'count')
).reset_index()

matrix_data = [
    {
        "d": row['Date'],
        "o": row['Outlet_Name'],
        "b": row['Brand'],
        "g": row['Group'],
        "t": row['Order_Type'],
        "s": row['Settlement'],
        "r": round(float(row['revenue']), 2),
        "n": int(row['orders']),
        "q": int(row['quantity']),
        "c": int(row['records'])
    }
    for _, row in matrix_df.iterrows()
]

with open(os.path.join(output_dir, 'matrix.json'), 'w', encoding='utf-8') as f:
    json.dump(matrix_data, f, separators=(',', ':'))

print(f"Generated matrix.json ({len(matrix_data)} aggregated filter cells)")

# Create a clean sample of records for Data Explorer table (e.g. 5,000 recent line items)
# And save as compact JSON for fast instant table rendering
records_sample = []
for idx, row in df.head(10000).iterrows():
    records_sample.append({
        "billNo": int(row['BillNo']),
        "orderDate": str(row['Order_Datetime']),
        "outlet": row['Outlet_Name'],
        "brand": row['Brand'],
        "category": row['Group'],
        "item": row['Item'],
        "orderType": row['Order_Type'],
        "price": float(row['Price']),
        "quantity": int(row['Quantity']),
        "revenue": round(float(row['Revenue']), 2),
        "settlement": row['Settlement']
    })

with open(os.path.join(output_dir, 'records.json'), 'w', encoding='utf-8') as f:
    json.dump(records_sample, f, separators=(',', ':'))

print(f"Generated records.json ({len(records_sample)} line items)")
print("Preprocessing complete!")
