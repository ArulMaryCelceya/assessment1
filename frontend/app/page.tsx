'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, TabType } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { KPISection } from '../components/dashboard/KPISection';
import { FilterToolbar } from '../components/dashboard/FilterToolbar';
import { ActiveFilterChips } from '../components/dashboard/ActiveFilterChips';
import { BusinessInsights } from '../components/dashboard/BusinessInsights';
import { RevenueTrendChart } from '../components/charts/RevenueTrendChart';
import { OutletPerformanceChart } from '../components/charts/OutletPerformanceChart';
import { CategoryPerformanceChart } from '../components/charts/CategoryPerformanceChart';
import { OrderTypeChart } from '../components/charts/OrderTypeChart';
import { TopItemsChart } from '../components/charts/TopItemsChart';
import { SettlementChart } from '../components/charts/SettlementChart';
import { DataExplorer } from '../components/tables/DataExplorer';
import { KPISkeleton, ChartSkeleton } from '../components/ui/Skeleton';

import {
  getInitialSummary,
  getInitialAnalytics,
  getInitialRecords,
  filterAnalytics,
  filterRecords,
} from '../lib/analytics/data-service';

import { FilterState } from '../types/analytics';
import { AlertTriangle, Layers, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initialSummary = useMemo(() => getInitialSummary(), []);
  const initialAnalytics = useMemo(() => getInitialAnalytics(), []);
  const initialRecordsList = useMemo(() => getInitialRecords(), []);

  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    outlets: [],
    brands: [],
    categories: [],
    orderTypes: [],
    settlements: [],
    searchTerm: '',
  });

  useEffect(() => {
    // Simulate crisp initial render state
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const { summary, analytics } = useMemo(() => {
    const hasActiveFilters =
      filters.startDate ||
      filters.endDate ||
      filters.outlets.length > 0 ||
      filters.brands.length > 0 ||
      filters.categories.length > 0 ||
      filters.orderTypes.length > 0 ||
      filters.settlements.length > 0 ||
      filters.searchTerm;

    if (!hasActiveFilters) {
      return { summary: initialSummary, analytics: initialAnalytics };
    }
    return filterAnalytics(filters);
  }, [filters, initialSummary, initialAnalytics]);

  const recordsList = useMemo(() => {
    return filterRecords(filters);
  }, [filters]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setIsRefreshing(true);
    setFilters(newFilters);
    setTimeout(() => setIsRefreshing(false), 200);
  };

  const handleResetFilters = () => {
    setIsRefreshing(true);
    setFilters({
      startDate: '',
      endDate: '',
      outlets: [],
      brands: [],
      categories: [],
      orderTypes: [],
      settlements: [],
      searchTerm: '',
    });
    setTimeout(() => setIsRefreshing(false), 200);
  };

  const handleRemoveSingleFilter = (key: keyof FilterState, value?: string) => {
    if (value && Array.isArray(filters[key])) {
      const arr = filters[key] as string[];
      setFilters({
        ...filters,
        [key]: arr.filter((v) => v !== value),
      });
    } else {
      setFilters({
        ...filters,
        [key]: Array.isArray(filters[key]) ? [] : '',
      });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const hasNoData = summary.totalRows === 0;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          filters={filters}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Global Filters */}
          <FilterToolbar
            summary={initialSummary}
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          {/* Active Filter Chips */}
          <ActiveFilterChips
            filters={filters}
            onRemoveFilter={handleRemoveSingleFilter}
            onClearAll={handleResetFilters}
          />

          {/* Empty Filter State Handling */}
          {hasNoData ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">
                No data found for the selected filters.
              </h3>
              <p className="text-xs text-slate-400 max-w-md mb-6">
                No order transactions match your current combination of date range, outlets, categories, or payment settlements.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Overview Tab Content */}
              {(activeTab === 'overview' || activeTab === 'sales') && (
                <>
                  {/* KPI Cards Section */}
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <KPISkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <KPISection summary={summary} />
                  )}

                  {/* Primary Revenue Trend Chart */}
                  {isLoading ? <ChartSkeleton /> : <RevenueTrendChart daily={analytics.daily} monthly={analytics.monthly} weekly={analytics.weekly} />}

                  {/* 2-Column Row: Outlet Performance & Category Performance */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isLoading ? (
                      <>
                        <ChartSkeleton />
                        <ChartSkeleton />
                      </>
                    ) : (
                      <>
                        <OutletPerformanceChart data={analytics.byOutlet} />
                        <CategoryPerformanceChart data={analytics.byCategory} />
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Product Performance Tab Content */}
              {(activeTab === 'overview' || activeTab === 'products') && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {isLoading ? <ChartSkeleton /> : <TopItemsChart data={analytics.byItem} />}
                  </div>
                  <div>
                    {isLoading ? <ChartSkeleton /> : <CategoryPerformanceChart data={analytics.byCategory} />}
                  </div>
                </div>
              )}

              {/* Orders Analysis Tab Content */}
              {(activeTab === 'overview' || activeTab === 'orders') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {isLoading ? (
                    <>
                      <ChartSkeleton />
                      <ChartSkeleton />
                    </>
                  ) : (
                    <>
                      <OrderTypeChart data={analytics.byOrderType} />
                      <SettlementChart data={analytics.bySettlement} />
                    </>
                  )}
                </div>
              )}

              {/* Business Insights */}
              {isLoading ? null : <BusinessInsights insights={analytics.insights} />}

              {/* Data Explorer Table */}
              {(activeTab === 'overview' || activeTab === 'explorer') && (
                <DataExplorer records={recordsList} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
