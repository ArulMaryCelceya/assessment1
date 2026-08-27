import summaryJson from '../../data/processed/summary.json';
import analyticsJson from '../../data/processed/analytics.json';
import matrixJson from '../../data/processed/matrix.json';
import recordsJson from '../../data/processed/records.json';

import {
  FilterState,
  SummaryMetrics,
  AnalyticsData,
  OrderRecord,
  AggregatedMatrixCell,
  BusinessInsightsData,
} from '../../types/analytics';

const summary: SummaryMetrics = summaryJson as SummaryMetrics;
const analytics: AnalyticsData = analyticsJson as AnalyticsData;
const matrix: AggregatedMatrixCell[] = matrixJson as AggregatedMatrixCell[];
const records: OrderRecord[] = recordsJson as OrderRecord[];

export function getInitialSummary(): SummaryMetrics {
  return summary;
}

export function getInitialAnalytics(): AnalyticsData {
  return analytics;
}

export function getInitialRecords(): OrderRecord[] {
  return records;
}

export interface FilteredResult {
  summary: SummaryMetrics;
  analytics: AnalyticsData;
  insights: BusinessInsightsData;
}

export function filterAnalytics(filters: FilterState): FilteredResult {
  const { startDate, endDate, outlets, brands, categories, orderTypes, settlements, searchTerm } = filters;

  const hasOutletFilter = outlets.length > 0;
  const hasBrandFilter = brands.length > 0;
  const hasCategoryFilter = categories.length > 0;
  const hasOrderTypeFilter = orderTypes.length > 0;
  const hasSettlementFilter = settlements.length > 0;

  let filteredCells = matrix;

  if (startDate) {
    filteredCells = filteredCells.filter((cell) => cell.d >= startDate);
  }
  if (endDate) {
    filteredCells = filteredCells.filter((cell) => cell.d <= endDate);
  }
  if (hasOutletFilter) {
    const outletSet = new Set(outlets);
    filteredCells = filteredCells.filter((cell) => outletSet.has(cell.o));
  }
  if (hasBrandFilter) {
    const brandSet = new Set(brands);
    filteredCells = filteredCells.filter((cell) => brandSet.has(cell.b));
  }
  if (hasCategoryFilter) {
    const categorySet = new Set(categories);
    filteredCells = filteredCells.filter((cell) => categorySet.has(cell.g));
  }
  if (hasOrderTypeFilter) {
    const orderTypeSet = new Set(orderTypes);
    filteredCells = filteredCells.filter((cell) => orderTypeSet.has(cell.t));
  }
  if (hasSettlementFilter) {
    const settlementSet = new Set(settlements);
    filteredCells = filteredCells.filter((cell) => settlementSet.has(cell.s));
  }

  // Calculate Aggregated Metrics
  let totalRevenue = 0;
  let totalOrdersSum = 0;
  let totalQuantity = 0;
  let totalRecords = 0;

  const dailyMap = new Map<string, { revenue: number; orders: number; quantity: number }>();
  const outletMap = new Map<string, { revenue: number; orders: number; quantity: number }>();
  const categoryMap = new Map<string, { revenue: number; orders: number; quantity: number }>();
  const orderTypeMap = new Map<string, { revenue: number; orders: number; quantity: number }>();
  const settlementMap = new Map<string, { revenue: number; orders: number; quantity: number }>();

  filteredCells.forEach((cell) => {
    totalRevenue += cell.r;
    totalOrdersSum += cell.n;
    totalQuantity += cell.q;
    totalRecords += cell.c;

    // Daily
    const d = dailyMap.get(cell.d) || { revenue: 0, orders: 0, quantity: 0 };
    d.revenue += cell.r;
    d.orders += cell.n;
    d.quantity += cell.q;
    dailyMap.set(cell.d, d);

    // Outlet
    const o = outletMap.get(cell.o) || { revenue: 0, orders: 0, quantity: 0 };
    o.revenue += cell.r;
    o.orders += cell.n;
    o.quantity += cell.q;
    outletMap.set(cell.o, o);

    // Category
    const c = categoryMap.get(cell.g) || { revenue: 0, orders: 0, quantity: 0 };
    c.revenue += cell.r;
    c.orders += cell.n;
    c.quantity += cell.q;
    categoryMap.set(cell.g, c);

    // Order Type
    const t = orderTypeMap.get(cell.t) || { revenue: 0, orders: 0, quantity: 0 };
    t.revenue += cell.r;
    t.orders += cell.n;
    t.quantity += cell.q;
    orderTypeMap.set(cell.t, t);

    // Settlement
    const s = settlementMap.get(cell.s) || { revenue: 0, orders: 0, quantity: 0 };
    s.revenue += cell.r;
    s.orders += cell.n;
    s.quantity += cell.q;
    settlementMap.set(cell.s, s);
  });

  const uniqueOrdersEstimated = Math.round(totalOrdersSum * 0.85) || (totalRecords > 0 ? Math.round(totalRecords / 2.7) : 0);
  const aov = uniqueOrdersEstimated > 0 ? totalRevenue / uniqueOrdersEstimated : 0;
  const avgItemPrice = totalQuantity > 0 ? totalRevenue / totalQuantity : 0;

  const summaryResult: SummaryMetrics = {
    ...summary,
    totalRows: totalRecords,
    totalRevenue: round(totalRevenue),
    uniqueOrders: uniqueOrdersEstimated,
    totalQuantity,
    aov: round(aov),
    avgItemPrice: round(avgItemPrice),
  };

  // Daily Trend
  const daily = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      revenue: round(data.revenue),
      orders: data.orders,
      quantity: data.quantity,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Monthly & Weekly Trends derived from Daily
  const monthlyMap = new Map<string, { revenue: number; orders: number; quantity: number }>();
  const weeklyMap = new Map<string, { revenue: number; orders: number; quantity: number }>();

  daily.forEach((d) => {
    const month = d.date.substring(0, 7);
    const m = monthlyMap.get(month) || { revenue: 0, orders: 0, quantity: 0 };
    m.revenue += d.revenue;
    m.orders += d.orders;
    m.quantity += d.quantity;
    monthlyMap.set(month, m);
  });

  const monthly = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      revenue: round(data.revenue),
      orders: data.orders,
      quantity: data.quantity,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const byOutlet = Array.from(outletMap.entries())
    .map(([outlet, data]) => ({
      outlet,
      revenue: round(data.revenue),
      orders: data.orders,
      quantity: data.quantity,
      percentage: totalRevenue > 0 ? round((data.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      revenue: round(data.revenue),
      orders: data.orders,
      quantity: data.quantity,
      percentage: totalRevenue > 0 ? round((data.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const byOrderType = Array.from(orderTypeMap.entries())
    .map(([orderType, data]) => ({
      orderType,
      revenue: round(data.revenue),
      orders: data.orders,
      quantity: data.quantity,
      percentage: totalOrdersSum > 0 ? round((data.orders / totalOrdersSum) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const bySettlement = Array.from(settlementMap.entries())
    .map(([settlement, data]) => ({
      settlement,
      revenue: round(data.revenue),
      orders: data.orders,
      quantity: data.quantity,
      percentage: totalRevenue > 0 ? round((data.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Filter Items
  let byItem = analytics.byItem;
  if (hasCategoryFilter) {
    const catSet = new Set(categories);
    byItem = byItem.filter((item) => catSet.has(item.category));
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    byItem = byItem.filter(
      (item) => item.item.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
    );
  }

  // Calculate dynamic Insights
  const topOutlet = byOutlet.length > 0 ? byOutlet[0] : { outlet: 'N/A', revenue: 0, percentage: 0 };
  const topCategory = byCategory.length > 0 ? byCategory[0] : { category: 'N/A', revenue: 0, percentage: 0 };
  const bestItem = byItem.length > 0 ? byItem[0] : { item: 'N/A', category: 'N/A', revenue: 0, quantity: 0 };
  const topOrderType = byOrderType.length > 0 ? byOrderType[0] : { orderType: 'N/A', orders: 0, percentage: 0 };
  const peakDay = daily.length > 0 ? [...daily].sort((a, b) => b.revenue - a.revenue)[0] : { date: 'N/A', revenue: 0, orders: 0 };

  const insights: BusinessInsightsData = {
    topOutlet: { name: topOutlet.outlet, revenue: topOutlet.revenue, percentage: topOutlet.percentage },
    topCategory: { name: topCategory.category, revenue: topCategory.revenue, percentage: topCategory.percentage },
    bestSellingItem: { name: bestItem.item, category: bestItem.category, revenue: bestItem.revenue, quantity: bestItem.quantity },
    mostUsedOrderType: { name: topOrderType.orderType, orders: topOrderType.orders, percentage: topOrderType.percentage },
    peakRevenuePeriod: { date: peakDay.date, revenue: peakDay.revenue, orders: peakDay.orders },
    aov: round(aov),
  };

  const analyticsResult: AnalyticsData = {
    daily,
    monthly,
    weekly: analytics.weekly,
    byOutlet,
    byCategory,
    byOrderType,
    bySettlement,
    byItem,
    insights,
  };

  return {
    summary: summaryResult,
    analytics: analyticsResult,
    insights,
  };
}

export function filterRecords(filters: FilterState): OrderRecord[] {
  const { startDate, endDate, outlets, brands, categories, orderTypes, settlements, searchTerm } = filters;

  return records.filter((r) => {
    const rDate = r.orderDate.substring(0, 10);
    if (startDate && rDate < startDate) return false;
    if (endDate && rDate > endDate) return false;
    if (outlets.length > 0 && !outlets.includes(r.outlet)) return false;
    if (brands.length > 0 && !brands.includes(r.brand)) return false;
    if (categories.length > 0 && !categories.includes(r.category)) return false;
    if (orderTypes.length > 0 && !orderTypes.includes(r.orderType)) return false;
    if (settlements.length > 0 && !settlements.includes(r.settlement)) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchBill = String(r.billNo).toLowerCase().includes(term);
      const matchItem = r.item.toLowerCase().includes(term);
      const matchOutlet = r.outlet.toLowerCase().includes(term);
      const matchBrand = r.brand.toLowerCase().includes(term);
      if (!matchBill && !matchItem && !matchOutlet && !matchBrand) return false;
    }

    return true;
  });
}

function round(val: number): number {
  return Math.round(val * 100) / 100;
}
