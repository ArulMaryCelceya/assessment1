import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingBag, Package, CreditCard, Store, Tag } from 'lucide-react';
import { analyticsApi } from '../services/api';
import { 
  AnalyticsFilters, SummaryData, RevenueTrendPoint, OutletPerformance, 
  GroupPerformance, OrderTypeDistribution, TopProduct, SettlementDistribution, 
  FilterOptions 
} from '../types';
import { formatCurrency, formatNumber, formatCompactCurrency } from '../utils/formatters';
import { FilterPanel } from '../components/FilterPanel';
import { KpiCard } from '../components/KpiCard';
import { RevenueChart } from '../components/RevenueChart';
import { OutletChart } from '../components/OutletChart';
import { GroupChart } from '../components/GroupChart';
import { OrderTypeChart } from '../components/OrderTypeChart';
import { ProductChart } from '../components/ProductChart';
import { SettlementChart } from '../components/SettlementChart';
import { ErrorState } from '../components/ErrorState';

export const Dashboard: React.FC = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({});

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendPoint[]>([]);
  const [outlets, setOutlets] = useState<OutletPerformance[]>([]);
  const [groups, setGroups] = useState<GroupPerformance[]>([]);
  const [orderTypes, setOrderTypes] = useState<OrderTypeDistribution[]>([]);
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [settlements, setSettlements] = useState<SettlementDistribution[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load filter options once
  useEffect(() => {
    analyticsApi.getFilterOptions()
      .then((opts) => setFilterOptions(opts))
      .catch((err) => console.error("Failed to load filter options", err));
  }, []);

  // Fetch all dashboard metrics in parallel
  const loadDashboardData = useCallback(async (currentFilters: AnalyticsFilters) => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, trendRes, outletRes, groupRes, typeRes, prodRes, setRes] = await Promise.all([
        analyticsApi.getSummary(currentFilters),
        analyticsApi.getRevenueTrend(currentFilters),
        analyticsApi.getOutletPerformance(currentFilters),
        analyticsApi.getGroupPerformance(currentFilters),
        analyticsApi.getOrderTypeDistribution(currentFilters),
        analyticsApi.getTopProducts(currentFilters, 10),
        analyticsApi.getSettlementDistribution(currentFilters),
      ]);

      setSummary(sumRes);
      setRevenueTrend(trendRes);
      setOutlets(outletRes);
      setGroups(groupRes);
      setOrderTypes(typeRes);
      setProducts(prodRes);
      setSettlements(setRes);
    } catch (err: any) {
      console.error("Dashboard data load error:", err);
      setError(err.message || "Failed to load analytics dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData(filters);
  }, [filters, loadDashboardData]);

  const handleApplyFilters = (newFilters: AnalyticsFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  if (error) {
    return <ErrorState message={error} onRetry={() => loadDashboardData(filters)} />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Filter Panel */}
      <FilterPanel
        options={filterOptions}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        loading={loading}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Revenue"
          value={summary ? formatCompactCurrency(summary.total_revenue) : "$0"}
          subtitle={summary ? formatCurrency(summary.total_revenue) : undefined}
          icon={DollarSign}
          color="emerald"
          loading={loading}
        />
        <KpiCard
          title="Total Orders"
          value={summary ? formatNumber(summary.total_orders) : "0"}
          subtitle="Distinct BillNo Orders"
          icon={ShoppingBag}
          color="blue"
          loading={loading}
        />
        <KpiCard
          title="Total Items Sold"
          value={summary ? formatNumber(summary.total_items_sold) : "0"}
          subtitle="Total Quantity"
          icon={Package}
          color="indigo"
          loading={loading}
        />
        <KpiCard
          title="Avg Order Value"
          value={summary ? formatCurrency(summary.average_order_value) : "$0"}
          subtitle="Revenue / Distinct Orders"
          icon={CreditCard}
          color="amber"
          loading={loading}
        />
        <KpiCard
          title="Active Outlets"
          value={summary ? formatNumber(summary.total_outlets) : "0"}
          subtitle="Store Locations"
          icon={Store}
          color="violet"
          loading={loading}
        />
        <KpiCard
          title="Total Products"
          value={summary ? formatNumber(summary.total_products) : "0"}
          subtitle="Unique SKUs Sold"
          icon={Tag}
          color="rose"
          loading={loading}
        />
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueTrend} loading={loading} />
        <OutletChart data={outlets} loading={loading} />
      </div>

      {/* Main Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GroupChart data={groups} loading={loading} />
        <OrderTypeChart data={orderTypes} loading={loading} />
        <SettlementChart data={settlements} loading={loading} />
      </div>

      {/* Main Charts Row 3 */}
      <div className="grid grid-cols-1 gap-6">
        <ProductChart data={products} loading={loading} />
      </div>
    </div>
  );
};
