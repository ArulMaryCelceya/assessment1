import axios from 'axios';
import { 
  AnalyticsFilters, SummaryData, RevenueTrendPoint, OutletPerformance, 
  GroupPerformance, OrderTypeDistribution, TopProduct, SettlementDistribution, 
  PaginatedOrdersResponse, FilterOptions 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cleanParams = (filters: AnalyticsFilters) => {
  const params: Record<string, string> = {};
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  if (filters.outlet && filters.outlet !== 'all') params.outlet = filters.outlet;
  if (filters.brand && filters.brand !== 'all') params.brand = filters.brand;
  if (filters.group && filters.group !== 'all') params.group = filters.group;
  if (filters.order_type && filters.order_type !== 'all') params.order_type = filters.order_type;
  if (filters.settlement && filters.settlement !== 'all') params.settlement = filters.settlement;
  return params;
};

export const analyticsApi = {
  getSummary: async (filters: AnalyticsFilters): Promise<SummaryData> => {
    const res = await api.get<SummaryData>('/summary', { params: cleanParams(filters) });
    return res.data;
  },

  getRevenueTrend: async (filters: AnalyticsFilters): Promise<RevenueTrendPoint[]> => {
    const res = await api.get<RevenueTrendPoint[]>('/revenue-trend', { params: cleanParams(filters) });
    return res.data;
  },

  getOutletPerformance: async (filters: AnalyticsFilters): Promise<OutletPerformance[]> => {
    const res = await api.get<OutletPerformance[]>('/outlet-performance', { params: cleanParams(filters) });
    return res.data;
  },

  getGroupPerformance: async (filters: AnalyticsFilters): Promise<GroupPerformance[]> => {
    const res = await api.get<GroupPerformance[]>('/group-performance', { params: cleanParams(filters) });
    return res.data;
  },

  getOrderTypeDistribution: async (filters: AnalyticsFilters): Promise<OrderTypeDistribution[]> => {
    const res = await api.get<OrderTypeDistribution[]>('/order-type', { params: cleanParams(filters) });
    return res.data;
  },

  getTopProducts: async (filters: AnalyticsFilters, limit: number = 10): Promise<TopProduct[]> => {
    const params = { ...cleanParams(filters), limit };
    const res = await api.get<TopProduct[]>('/top-products', { params });
    return res.data;
  },

  getSettlementDistribution: async (filters: AnalyticsFilters): Promise<SettlementDistribution[]> => {
    const res = await api.get<SettlementDistribution[]>('/settlement', { params: cleanParams(filters) });
    return res.data;
  },

  getOrders: async (
    filters: AnalyticsFilters,
    page: number = 1,
    pageSize: number = 50,
    search?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<PaginatedOrdersResponse> => {
    const params = {
      ...cleanParams(filters),
      page,
      page_size: pageSize,
      ...(search ? { search } : {}),
      ...(sortBy ? { sort_by: sortBy } : {}),
      ...(sortOrder ? { sort_order: sortOrder } : {})
    };
    const res = await api.get<PaginatedOrdersResponse>('/orders', { params });
    return res.data;
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    const res = await api.get<FilterOptions>('/filters');
    return res.data;
  }
};
