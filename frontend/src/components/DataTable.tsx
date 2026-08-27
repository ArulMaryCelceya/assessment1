import React from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUpDown, ArrowUp, ArrowDown, Search, Download 
} from 'lucide-react';
import { OrderRecord } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { exportOrdersToCsv } from '../utils/exportCsv';

interface DataTableProps {
  orders: OrderRecord[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSortChange: (column: string) => void;
  loading?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  orders,
  totalRecords,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  loading = false,
}) => {
  const columns = [
    { key: 'BillNo', label: 'Bill No' },
    { key: 'Order_Datetime', label: 'Order Datetime' },
    { key: 'Outlet_Name', label: 'Outlet' },
    { key: 'Brand', label: 'Brand' },
    { key: 'Group', label: 'Group / Category' },
    { key: 'Item', label: 'Item Name' },
    { key: 'Price', label: 'Price', align: 'right' },
    { key: 'Quantity', label: 'Qty', align: 'right' },
    { key: 'Revenue', label: 'Revenue', align: 'right' },
    { key: 'Order_Type', label: 'Order Type' },
    { key: 'Settlement', label: 'Settlement' },
  ];

  const renderSortIcon = (colKey: string) => {
    if (sortBy !== colKey) return <ArrowUpDown className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'ASC' 
      ? <ArrowUp className="w-3.5 h-3.5 text-blue-400" /> 
      : <ArrowDown className="w-3.5 h-3.5 text-blue-400" />;
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden border border-slate-800">
      {/* Header controls: Search & Info */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search BillNo, Item, Outlet, Group..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs text-slate-400 font-mono">
            Showing <span className="text-slate-200 font-bold">{((currentPage - 1) * pageSize) + (orders.length ? 1 : 0)}</span> to{' '}
            <span className="text-slate-200 font-bold">{Math.min(currentPage * pageSize, totalRecords)}</span> of{' '}
            <span className="text-blue-400 font-bold">{totalRecords.toLocaleString()}</span> records
          </div>
          <button
            onClick={() => exportOrdersToCsv(orders)}
            disabled={orders.length === 0 || loading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
            title="Export Current Page to CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Data Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800 sticky top-0 backdrop-blur-md">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => onSortChange(col.key)}
                  className={`px-4 py-3 cursor-pointer select-none group hover:bg-slate-800/50 transition-colors ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    <span>{col.label}</span>
                    {renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3">
                      <div className="h-4 bg-slate-800 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-500">
                  No matching records found
                </td>
              </tr>
            ) : (
              orders.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-blue-400 font-medium whitespace-nowrap">{row.BillNo}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">{row.Order_Datetime}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-200">{row.Outlet_Name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">{row.Brand}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {row.Group}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-100">{row.Item}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatCurrency(row.Price)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-mono">{formatNumber(row.Quantity)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-mono font-bold text-emerald-400">
                    {formatCurrency(row.Revenue)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {row.Order_Type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {row.Settlement}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Navigation */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-4 bg-slate-950/40">
        <div className="text-xs text-slate-400">
          Page <span className="font-bold text-slate-200">{currentPage}</span> of{' '}
          <span className="font-bold text-slate-200">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono font-bold text-blue-400">
            {currentPage}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
