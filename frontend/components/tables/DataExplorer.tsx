import React, { useState, useMemo } from 'react';
import { OrderRecord } from '../../types/analytics';
import { formatCurrency, formatDate, formatNumber } from '../../lib/utils/formatters';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import {
  Database,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface DataExplorerProps {
  records: OrderRecord[];
}

type SortField = 'billNo' | 'orderDate' | 'outlet' | 'item' | 'price' | 'quantity' | 'revenue';

export function DataExplorer({ records }: DataExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<SortField>('billNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return records;
    const term = searchTerm.toLowerCase();
    return records.filter((r) => {
      return (
        String(r.billNo).toLowerCase().includes(term) ||
        r.item.toLowerCase().includes(term) ||
        r.outlet.toLowerCase().includes(term) ||
        r.brand.toLowerCase().includes(term) ||
        r.category.toLowerCase().includes(term) ||
        r.orderType.toLowerCase().includes(term)
      );
    });
  }, [records, searchTerm]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortOrder]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    if (sorted.length === 0) return;

    const headers = [
      'BillNo',
      'Order Date',
      'Outlet',
      'Brand',
      'Category',
      'Item',
      'Order Type',
      'Price',
      'Quantity',
      'Revenue',
      'Settlement',
    ];

    const rows = sorted.map((r) => [
      r.billNo,
      `"${r.orderDate}"`,
      `"${r.outlet}"`,
      `"${r.brand}"`,
      `"${r.category}"`,
      `"${r.item}"`,
      `"${r.orderType}"`,
      r.price,
      r.quantity,
      r.revenue,
      `"${r.settlement}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `assessment1_filtered_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle>
            <Database className="w-5 h-5 text-indigo-400" />
            Data Explorer
          </CardTitle>
          <CardDescription>
            Explore, search, sort, and export granular line-item records ({formatNumber(filtered.length)}{' '}
            matches)
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search BillNo, Item, Outlet..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-60"
            />
          </div>

          {/* Rows per page */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none"
            >
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </CardHeader>

      {/* Table Container */}
      <div className="overflow-x-auto border-y border-slate-800 my-2">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <th
                onClick={() => handleSort('billNo')}
                className="p-3 font-semibold cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  BillNo <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th
                onClick={() => handleSort('orderDate')}
                className="p-3 font-semibold cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  Order Date <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th
                onClick={() => handleSort('outlet')}
                className="p-3 font-semibold cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  Outlet <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th className="p-3 font-semibold text-slate-400">Brand</th>
              <th className="p-3 font-semibold text-slate-400">Category</th>
              <th
                onClick={() => handleSort('item')}
                className="p-3 font-semibold cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  Item <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th className="p-3 font-semibold text-slate-400">Order Type</th>
              <th
                onClick={() => handleSort('price')}
                className="p-3 font-semibold text-right cursor-pointer hover:text-slate-200"
              >
                Price
              </th>
              <th
                onClick={() => handleSort('quantity')}
                className="p-3 font-semibold text-right cursor-pointer hover:text-slate-200"
              >
                Qty
              </th>
              <th
                onClick={() => handleSort('revenue')}
                className="p-3 font-semibold text-right cursor-pointer hover:text-slate-200"
              >
                Revenue
              </th>
              <th className="p-3 font-semibold text-slate-400">Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-500 font-medium">
                  No data found for the selected filters.
                </td>
              </tr>
            ) : (
              paginated.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-medium text-indigo-400">#{r.billNo}</td>
                  <td className="p-3 text-slate-400 whitespace-nowrap">{formatDate(r.orderDate)}</td>
                  <td className="p-3 font-medium text-slate-200">{r.outlet}</td>
                  <td className="p-3 text-slate-400">{r.brand}</td>
                  <td className="p-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                      {r.category}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-100">{r.item}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {r.orderType}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-slate-300">
                    {formatCurrency(r.price)}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-300">{r.quantity}</td>
                  <td className="p-3 text-right font-mono font-semibold text-emerald-400">
                    {formatCurrency(r.revenue)}
                  </td>
                  <td className="p-3 text-slate-400">{r.settlement}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-500">
          Showing page <span className="font-semibold text-slate-300">{currentPage}</span> of{' '}
          <span className="font-semibold text-slate-300">{totalPages}</span> ({formatNumber(sorted.length)} items)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
