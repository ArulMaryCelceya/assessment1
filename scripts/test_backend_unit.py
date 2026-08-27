import sys
import os
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.services.analytics_service import AnalyticsService

def test_service():
    print("=" * 60)
    print("TESTING ANALYTICS SERVICE DIRECTLY ON DATABASE")
    print("=" * 60)
    sys.stdout.flush()

    filters = {}
    
    print("\n1. Summary Data:")
    summary = AnalyticsService.get_summary(filters)
    print(summary)
    sys.stdout.flush()

    print("\n2. Revenue Trend Points (first 5):")
    trend = AnalyticsService.get_revenue_trend(filters)
    print(f"Total trend points: {len(trend)}, sample: {trend[:5]}")
    sys.stdout.flush()

    print("\n3. Outlet Performance:")
    outlets = AnalyticsService.get_outlet_performance(filters)
    print(f"Total outlets: {len(outlets)}, sample: {outlets[:3]}")
    sys.stdout.flush()

    print("\n4. Group Performance:")
    groups = AnalyticsService.get_group_performance(filters)
    print(f"Total groups: {len(groups)}, sample: {groups[:3]}")
    sys.stdout.flush()

    print("\n5. Order Types:")
    order_types = AnalyticsService.get_order_type_distribution(filters)
    print(f"Order types: {order_types}")
    sys.stdout.flush()

    print("\n6. Top Products (Limit 5):")
    prods = AnalyticsService.get_top_products(filters, limit=5)
    print(f"Top products: {prods}")
    sys.stdout.flush()

    print("\n7. Settlements:")
    settlements = AnalyticsService.get_settlement_distribution(filters)
    print(f"Settlements: {settlements}")
    sys.stdout.flush()

    print("\n8. Filter Options:")
    filter_opts = AnalyticsService.get_filter_options()
    print(f"Outlets count: {len(filter_opts['outlets'])}, Brands count: {len(filter_opts['brands'])}, Groups count: {len(filter_opts['groups'])}, Date range: {filter_opts['min_date']} to {filter_opts['max_date']}")
    sys.stdout.flush()

    print("\n9. Paginated Orders (Page 1, size 5):")
    orders = AnalyticsService.get_orders_paginated(filters, page=1, page_size=5)
    print(f"Total records: {orders['total_records']}, Total pages: {orders['total_pages']}, Sample order: {orders['orders'][0] if orders['orders'] else 'None'}")
    sys.stdout.flush()

    print("\n" + "=" * 60)
    print("ALL ANALYTICS SERVICE TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    sys.stdout.flush()

if __name__ == '__main__':
    test_service()
