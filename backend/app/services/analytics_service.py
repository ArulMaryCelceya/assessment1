import sqlite3
from typing import Dict, Any, List, Optional
from app.database.database import get_db

def build_filter_clause(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    outlet: Optional[str] = None,
    brand: Optional[str] = None,
    group: Optional[str] = None,
    order_type: Optional[str] = None,
    settlement: Optional[str] = None
) -> tuple[str, dict]:
    conditions = []
    params = {}

    if start_date:
        conditions.append("date >= :start_date")
        params["start_date"] = start_date
    if end_date:
        conditions.append("date <= :end_date")
        params["end_date"] = end_date
    if outlet and outlet.lower() != 'all':
        conditions.append("Outlet_Name = :outlet")
        params["outlet"] = outlet
    if brand and brand.lower() != 'all':
        conditions.append("Brand = :brand")
        params["brand"] = brand
    if group and group.lower() != 'all':
        conditions.append("\"Group\" = :group")
        params["group"] = group
    if order_type and order_type.lower() != 'all':
        conditions.append("Order_Type = :order_type")
        params["order_type"] = order_type
    if settlement and settlement.lower() != 'all':
        conditions.append("Settlement = :settlement")
        params["settlement"] = settlement

    where_clause = ("WHERE " + " AND ".join(conditions)) if conditions else ""
    return where_clause, params

class AnalyticsService:

    @staticmethod
    def get_summary(filters: dict) -> dict:
        where_clause, params = build_filter_clause(**filters)
        query = f"""
            SELECT 
                COALESCE(SUM(Revenue), 0.0) as total_revenue,
                COUNT(DISTINCT BillNo) as total_orders,
                COALESCE(SUM(Quantity), 0.0) as total_items_sold,
                COUNT(DISTINCT Outlet_Name) as total_outlets,
                COUNT(DISTINCT Item) as total_products
            FROM sales
            {where_clause}
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            row = cursor.fetchone()
            
            total_revenue = float(row['total_revenue'])
            total_orders = int(row['total_orders'])
            total_items = float(row['total_items_sold'])
            total_outlets = int(row['total_outlets'])
            total_products = int(row['total_products'])
            aov = total_revenue / total_orders if total_orders > 0 else 0.0

            return {
                "total_revenue": round(total_revenue, 2),
                "total_orders": total_orders,
                "total_items_sold": round(total_items, 0),
                "average_order_value": round(aov, 2),
                "total_outlets": total_outlets,
                "total_products": total_products
            }

    @staticmethod
    def get_revenue_trend(filters: dict) -> List[dict]:
        where_clause, params = build_filter_clause(**filters)
        # Determine grouping: daily if date range <= 60 days, else monthly
        query = f"""
            SELECT 
                date,
                ROUND(SUM(Revenue), 2) as revenue,
                COUNT(DISTINCT BillNo) as orders
            FROM sales
            {where_clause}
            GROUP BY date
            ORDER BY date ASC
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [{"date": row['date'], "revenue": row['revenue'], "orders": row['orders']} for row in rows]

    @staticmethod
    def get_outlet_performance(filters: dict) -> List[dict]:
        where_clause, params = build_filter_clause(**filters)
        query = f"""
            SELECT 
                Outlet_Name as outlet_name,
                ROUND(SUM(Revenue), 2) as revenue,
                COUNT(DISTINCT BillNo) as orders,
                ROUND(SUM(Quantity), 0) as items_sold
            FROM sales
            {where_clause}
            GROUP BY Outlet_Name
            ORDER BY revenue DESC
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    def get_group_performance(filters: dict) -> List[dict]:
        where_clause, params = build_filter_clause(**filters)
        query = f"""
            SELECT 
                "Group" as "group",
                ROUND(SUM(Revenue), 2) as revenue,
                COUNT(DISTINCT BillNo) as orders,
                ROUND(SUM(Quantity), 0) as items_sold
            FROM sales
            {where_clause}
            GROUP BY "Group"
            ORDER BY revenue DESC
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            total_rev = sum(row['revenue'] for row in rows) if rows else 0
            result = []
            for row in rows:
                item_dict = dict(row)
                item_dict['percentage'] = round((row['revenue'] / total_rev * 100), 2) if total_rev > 0 else 0
                result.append(item_dict)
            return result

    @staticmethod
    def get_order_type_distribution(filters: dict) -> List[dict]:
        where_clause, params = build_filter_clause(**filters)
        query = f"""
            SELECT 
                Order_Type as order_type,
                ROUND(SUM(Revenue), 2) as revenue,
                COUNT(DISTINCT BillNo) as orders
            FROM sales
            {where_clause}
            GROUP BY Order_Type
            ORDER BY revenue DESC
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    def get_top_products(filters: dict, limit: int = 10) -> List[dict]:
        where_clause, params = build_filter_clause(**filters)
        params['limit'] = limit
        query = f"""
            SELECT 
                Item as item,
                "Group" as "group",
                ROUND(SUM(Revenue), 2) as revenue,
                ROUND(SUM(Quantity), 0) as quantity
            FROM sales
            {where_clause}
            GROUP BY Item, "Group"
            ORDER BY revenue DESC
            LIMIT :limit
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    def get_settlement_distribution(filters: dict) -> List[dict]:
        where_clause, params = build_filter_clause(**filters)
        query = f"""
            SELECT 
                Settlement as settlement,
                ROUND(SUM(Revenue), 2) as revenue,
                COUNT(DISTINCT BillNo) as orders
            FROM sales
            {where_clause}
            GROUP BY Settlement
            ORDER BY revenue DESC
        """
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    def get_orders_paginated(
        filters: dict, 
        page: int = 1, 
        page_size: int = 50, 
        search: Optional[str] = None,
        sort_by: Optional[str] = "Order_Datetime",
        sort_order: Optional[str] = "DESC"
    ) -> dict:
        where_clause, params = build_filter_clause(**filters)
        
        # Add search condition if provided
        if search and search.strip():
            search_clause = "(BillNo LIKE :search OR Item LIKE :search OR Outlet_Name LIKE :search OR Brand LIKE :search OR \"Group\" LIKE :search)"
            params['search'] = f"%{search.strip()}%"
            if where_clause:
                where_clause += f" AND {search_clause}"
            else:
                where_clause = f"WHERE {search_clause}"

        # Allowed sort fields to avoid SQL injection
        allowed_sorts = {
            "BillNo": "BillNo",
            "Order_Datetime": "Order_Datetime",
            "Outlet_Name": "Outlet_Name",
            "Brand": "Brand",
            "Group": "\"Group\"",
            "Item": "Item",
            "Price": "Price",
            "Quantity": "Quantity",
            "Revenue": "Revenue",
            "Order_Type": "Order_Type",
            "Settlement": "Settlement"
        }
        
        db_sort = allowed_sorts.get(sort_by, "Order_Datetime")
        db_direction = "ASC" if sort_order and sort_order.upper() == "ASC" else "DESC"

        # Count total records
        count_query = f"SELECT COUNT(*) as total FROM sales {where_clause}"
        
        offset = (page - 1) * page_size
        params['limit'] = page_size
        params['offset'] = offset

        data_query = f"""
            SELECT 
                id, BillNo, Outlet_Name, Brand, Order_Datetime, 
                "Group", Item, Price, Quantity, Revenue, Order_Type, Settlement
            FROM sales
            {where_clause}
            ORDER BY {db_sort} {db_direction}
            LIMIT :limit OFFSET :offset
        """

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(count_query, {k: v for k, v in params.items() if k not in ('limit', 'offset')})
            total_records = cursor.fetchone()['total']

            cursor.execute(data_query, params)
            rows = cursor.fetchall()
            
            total_pages = (total_records + page_size - 1) // page_size if total_records > 0 else 1

            return {
                "total_records": total_records,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "orders": [dict(row) for row in rows]
            }

    @staticmethod
    def get_filter_options() -> dict:
        with get_db() as conn:
            cursor = conn.cursor()
            
            cursor.execute("SELECT DISTINCT Outlet_Name FROM sales ORDER BY Outlet_Name")
            outlets = [row[0] for row in cursor.fetchall()]
            
            cursor.execute("SELECT DISTINCT Brand FROM sales ORDER BY Brand")
            brands = [row[0] for row in cursor.fetchall()]
            
            cursor.execute("SELECT DISTINCT \"Group\" FROM sales ORDER BY \"Group\"")
            groups = [row[0] for row in cursor.fetchall()]
            
            cursor.execute("SELECT DISTINCT Order_Type FROM sales ORDER BY Order_Type")
            order_types = [row[0] for row in cursor.fetchall()]
            
            cursor.execute("SELECT DISTINCT Settlement FROM sales ORDER BY Settlement")
            settlements = [row[0] for row in cursor.fetchall()]

            cursor.execute("SELECT MIN(date), MAX(date) FROM sales")
            min_date, max_date = cursor.fetchone()

            return {
                "outlets": outlets,
                "brands": brands,
                "groups": groups,
                "order_types": order_types,
                "settlements": settlements,
                "min_date": min_date or "2025-01-01",
                "max_date": max_date or "2026-12-31"
            }
