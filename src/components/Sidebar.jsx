import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Download
} from 'lucide-react';
import NavHeader from './NavHeader';
import './Sidebar.css';

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null,
    activeDot: true
  },
  {
    id: 'surveillance',
    path: '/surveillance',
    label: 'DVR Surveillance',
    icon: Video,
    badge: null,
    activeDot: true
  },
  {
    id: 'alerts',
    path: '/alerts',
    label: 'Alerts & Incidents',
    icon: AlertTriangle,
    badge: null,
    badgeColor: 'bg-rose-500 text-white shadow-neon-red font-bold text-[11px] px-2 py-0.5 rounded-full'
  },
  {
    id: 'analytics',
    path: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    badge: null,
    activeDot: false
  },
  {
    id: 'footage',
    path: '/footage',
    label: 'Footage Downloader',
    icon: Download,
    badge: null,
    activeDot: false
  }
];

export default function Sidebar({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    navigate(item.path);
    if (onNavigate) {
      onNavigate(item.id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const isCurrentActive = (item) => {
    const current = location.pathname.toLowerCase();
    if (item.path === '/dashboard' && (current === '/' || current === '/dashboard')) {
      return true;
    }
    return current === item.path.toLowerCase() || activePage === item.id;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0a0f15]/95 backdrop-blur-xl border-r border-slate-800/80 text-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 select-none shadow-2xl overflow-hidden ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Animated Traveling Neon Edge Beam */}
        <div
          className="absolute top-0 right-0 w-[3px] h-full pointer-events-none overflow-hidden z-30"
          aria-hidden="true"
        >
          <span className="sidebar-beam-glow absolute right-0 w-[3px] h-44 bg-gradient-to-b from-transparent via-[#00f7ff] to-transparent" />
        </div>

        {/* Top Brand Header & Navigation */}
        <div className="flex flex-col relative z-10 flex-1 min-h-0">
          <div className="p-4 lg:p-5 flex items-center justify-between border-b border-slate-800/60 bg-[#070b10]">
            <NavHeader isCollapsed={isCollapsed} isMobile={isMobileOpen} />

            {/* Collapse Toggle for Desktop */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-slate-700/60"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Close Toggle for Mobile */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-6 space-y-2 overflow-y-auto sidebar-nav-scroll flex-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentActive(item);
              const showExpanded = !isCollapsed || isMobileOpen;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`relative w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group text-left overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent text-emerald-400 border border-emerald-500/30 font-semibold shadow-[0_0_20px_-3px_rgba(74,222,128,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:translate-x-1'
                  }`}
                  title={!showExpanded ? `${item.label} (${item.path})` : undefined}
                >
                  {/* Active Neon Accent Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_10px_#4ade80] animate-pulse" />
                  )}

                  <Icon
                    className={`w-5 h-5 shrink-0 transition-all duration-200 ${
                      isActive
                        ? 'text-emerald-400 scale-105'
                        : 'text-slate-400 group-hover:text-emerald-400 group-hover:scale-110'
                    }`}
                  />

                  {showExpanded && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {isActive && item.activeDot && (
                        <span className="ml-auto flex items-center justify-center w-2 h-2">
                          <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={`ml-auto px-2 py-0.5 rounded-full shrink-0 ${
                            item.badgeColor || 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Footer */}
        <div className="relative z-10 p-3.5 border-t border-slate-800/70 bg-[#070b10]/60 text-center text-[11px] text-slate-400 font-mono">
          {!isCollapsed || isMobileOpen ? (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
              <span className="text-[10px] text-slate-500">v2.4.0 • Router Active</span>
            </div>
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 mx-auto block shadow-[0_0_6px_#4ade80]" />
          )}
        </div>
      </aside>
    </>
  );
}
