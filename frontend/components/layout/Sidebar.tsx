import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Receipt,
  Database,
  UtensilsCrossed,
  X,
  Code2,
  Sparkles,
} from 'lucide-react';

export type TabType = 'overview' | 'sales' | 'products' | 'orders' | 'explorer';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'products', label: 'Product Performance', icon: ShoppingBag },
    { id: 'orders', label: 'Orders Analysis', icon: Receipt },
    { id: 'explorer', label: 'Data Explorer', icon: Database },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-indigo-500/20">
              A1
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-lg leading-tight tracking-wide flex items-center gap-1.5">
                Assessment1
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h1>
              <p className="text-xs text-slate-400 font-medium">Business Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-200 lg:hidden rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Developer Branding Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 font-medium">Developer</p>
              <p className="text-xs font-bold text-slate-200 truncate">Developed by Celceya</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
