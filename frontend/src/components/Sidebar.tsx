import React from 'react';
import { LayoutDashboard, Database, BarChart3, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'explorer';
  setActiveTab: (tab: 'dashboard' | 'explorer') => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Overview & KPIs',
    },
    {
      id: 'explorer',
      label: 'Data Explorer',
      icon: Database,
      desc: '300k Record Explorer',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-tight leading-tight">InsightBI</h1>
            <p className="text-xs text-slate-400 font-medium">Business Analytics</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as 'dashboard' | 'explorer');
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-left text-sm font-medium
                  transition-all duration-150 group
                  ${isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{item.desc}</div>
                  </div>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />}
              </button>
            );
          })}
        </nav>

        {/* Dataset Meta Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-300">SQLite Engine Connected</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">300,000 Verified Orders</div>
        </div>
      </aside>
    </>
  );
};
