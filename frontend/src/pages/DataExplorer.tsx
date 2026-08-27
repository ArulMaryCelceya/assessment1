import React, { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../services/api';
import { AnalyticsFilters, OrderRecord, FilterOptions } from '../types';
import { FilterPanel } from '../components/FilterPanel';
import { DataTable } from '../components/DataTable';
import { ErrorState } from '../components/ErrorState';

export const DataExplorer: React.FC = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({});

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(50);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('Order_Datetime');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // reset to page 1 on new search query
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch filter options on mount
  useEffect(() => {
    analyticsApi.getFilterOptions()
      .then((opts) => setFilterOptions(opts))
      .catch((err) => console.error("Failed to load filter options", err));
  }, []);

  // Load paginated records
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsApi.getOrders(
        filters,
        currentPage,
        pageSize,
        debouncedSearch,
        sortBy,
        sortOrder
      );
      setOrders(res.orders);
      setTotalRecords(res.total_records);
      setTotalPages(res.total_pages);
    } catch (err: any) {
      console.error("Orders load error:", err);
      setError(err.message || "Failed to load paginated transaction records.");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleApplyFilters = (newFilters: AnalyticsFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  const handleSortChange = (colKey: string) => {
    if (sortBy === colKey) {
      setSortOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(colKey);
      setSortOrder('DESC');
    }
    setCurrentPage(1);
  };

  if (error) {
    return <ErrorState message={error} onRetry={loadOrders} />;
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

      {/* Paginated Data Table */}
      <DataTable
        orders={orders}
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        loading={loading}
      />
    </div>
  );
};
