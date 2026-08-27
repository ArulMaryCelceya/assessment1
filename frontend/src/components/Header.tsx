import React from 'react';
import { Menu, RefreshCw, Calendar } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'explorer';
  onToggleSidebar: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onToggleSidebar, 
  onRefresh,
  isRefreshing = false 
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            {activeTab === 'dashboard' ? 'Executive Analytics Dashboard' : 'Transactional Data Explorer'}
          </h2>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            {activeTab === 'dashboard'
              ? 'Real-time sales performance metrics & dimensional breakdown'
              : 'Interactive server-side paginated transactional ledger'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Full Fiscal Year 2025-2026</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>
    </header>
  );
};
