export interface AnalyticsFilters {
  start_date?: string;
  end_date?: string;
  outlet?: string;
  brand?: string;
  group?: string;
  order_type?: string;
  settlement?: string;
}

export interface SummaryData {
  total_revenue: number;
  total_orders: number;
  total_items_sold: number;
  average_order_value: number;
  total_outlets: number;
  total_products: number;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OutletPerformance {
  outlet_name: string;
  revenue: number;
  orders: number;
  items_sold: number;
}

export interface GroupPerformance {
  group: string;
  revenue: number;
  orders: number;
  items_sold: number;
  percentage: number;
}

export interface OrderTypeDistribution {
  order_type: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  item: string;
  group: string;
  revenue: number;
  quantity: number;
}

export interface SettlementDistribution {
  settlement: string;
  revenue: number;
  orders: number;
}

export interface OrderRecord {
  id: number;
  BillNo: string;
  Outlet_Name: string;
  Brand: string;
  Order_Datetime: string;
  Group: string;
  Item: string;
  Price: number;
  Quantity: number;
  Revenue: number;
  Order_Type: string;
  Settlement: string;
}

export interface PaginatedOrdersResponse {
  total_records: number;
  page: number;
  page_size: number;
  total_pages: number;
  orders: OrderRecord[];
}

export interface FilterOptions {
  outlets: string[];
  brands: string[];
  groups: string[];
  order_types: string[];
  settlements: string[];
  min_date: string;
  max_date: string;
}
