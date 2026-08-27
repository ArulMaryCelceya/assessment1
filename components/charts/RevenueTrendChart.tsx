import React, { useState } from 'react';
import { DailyTrend, MonthlyTrend, WeeklyTrend } from '../../types/analytics';
import { formatCurrency, formatNumber, formatDate } from '../../lib/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface RevenueTrendChartProps {
  daily: DailyTrend[];
  monthly: MonthlyTrend[];
  weekly: WeeklyTrend[];
}

export function RevenueTrendChart({ daily, monthly, weekly }: RevenueTrendChartProps) {
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const chartData = React.useMemo(() => {
    if (granularity === 'daily') {
      return daily.map((d) => ({
        label: d.date,
        formattedLabel: formatDate(d.date),
        revenue: d.revenue,
        orders: d.orders,
      }));
    }
    if (granularity === 'weekly') {
      return weekly.map((w) => ({
        label: w.week,
        formattedLabel: w.week,
        revenue: w.revenue,
        orders: w.orders,
      }));
    }
    return monthly.map((m) => ({
      label: m.month,
      formattedLabel: m.month,
      revenue: m.revenue,
      orders: m.orders,
    }));
  }, [granularity, daily, monthly, weekly]);

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="h-80 flex flex-col items-center justify-center text-center p-6">
        <TrendingUp className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-300">No Revenue Trend Data Available</p>
        <p className="text-xs text-slate-500">No records found for the selected filter criteria.</p>
      </Card>
    );
  }

  return (
    <Card className="h-[420px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Revenue Trend
          </CardTitle>
          <CardDescription>Track sales performance over time</CardDescription>
        </div>

        {/* Granularity selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setGranularity('daily')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              granularity === 'daily'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setGranularity('weekly')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              granularity === 'weekly'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setGranularity('monthly')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              granularity === 'monthly'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </CardHeader>

      <div className="flex-1 w-full min-h-0 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="formattedLabel"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(value) => formatCurrency(value, true)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
