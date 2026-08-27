export interface FilterState {
  startDate: string;
  endDate: string;
  outlets: string[];
  brands: string[];
  categories: string[];
  orderTypes: string[];
  settlements: string[];
  searchTerm: string;
}

export interface SummaryMetrics {
  totalRows: number;
  totalRevenue: number;
  uniqueOrders: number;
  totalQuantity: number;
  aov: number;
  avgItemPrice: number;
  dateRange: {
    min: string;
    max: string;
  };
  outlets: string[];
  brands: string[];
  categories: string[];
  orderTypes: string[];
  settlements: string[];
  totalItems: number;
}

export interface DailyTrend {
  date: string;
  revenue: number;
  orders: number;
  quantity: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  orders: number;
  quantity: number;
}

export interface WeeklyTrend {
  week: string;
  revenue: number;
  orders: number;
  quantity: number;
}

export interface OutletMetric {
  outlet: string;
  revenue: number;
  orders: number;
  quantity: number;
  percentage: number;
}

export interface CategoryMetric {
  category: string;
  revenue: number;
  orders: number;
  quantity: number;
  percentage: number;
}

export interface OrderTypeMetric {
  orderType: string;
  revenue: number;
  orders: number;
  quantity: number;
  percentage: number;
}

export interface SettlementMetric {
  settlement: string;
  revenue: number;
  orders: number;
  quantity: number;
  percentage: number;
}

export interface ItemMetric {
  item: string;
  category: string;
  revenue: number;
  quantity: number;
  orders: number;
  avgPrice: number;
}

export interface BusinessInsightsData {
  topOutlet: { name: string; revenue: number; percentage: number };
  topCategory: { name: string; revenue: number; percentage: number };
  bestSellingItem: { name: string; category: string; revenue: number; quantity: number };
  mostUsedOrderType: { name: string; orders: number; percentage: number };
  peakRevenuePeriod: { date: string; revenue: number; orders: number };
  aov: number;
}

export interface AnalyticsData {
  daily: DailyTrend[];
  monthly: MonthlyTrend[];
  weekly: WeeklyTrend[];
  byOutlet: OutletMetric[];
  byCategory: CategoryMetric[];
  byOrderType: OrderTypeMetric[];
  bySettlement: SettlementMetric[];
  byItem: ItemMetric[];
  insights: BusinessInsightsData;
}

export interface OrderRecord {
  billNo: number;
  orderDate: string;
  outlet: string;
  brand: string;
  category: string;
  item: string;
  orderType: string;
  price: number;
  quantity: number;
  revenue: number;
  settlement: string;
}

export interface AggregatedMatrixCell {
  d: string; // Date
  o: string; // Outlet
  b: string; // Brand
  g: string; // Category / Group
  t: string; // Order Type
  s: string; // Settlement
  r: number; // Revenue
  n: number; // Unique Orders count
  q: number; // Quantity
  c: number; // Line item count (Records)
}
