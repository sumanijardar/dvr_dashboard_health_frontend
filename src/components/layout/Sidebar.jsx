import {
  LayoutDashboard,
  Video,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null,
    activeDot: true
  },
  {
    id: 'surveillance',
    label: 'DVR Surveillance',
    icon: Video,
    badge: null,
    activeDot: true
  },
  {
    id: 'alerts',
    label: 'Alerts & Incidents',
    icon: AlertTriangle,
    badge: null,
    badgeColor: 'bg-rose-500 text-white shadow-neon-red font-bold text-[11px] px-2 py-0.5 rounded-full'
  }
];

/**
 * Animated Dark Console Sidebar
 * Sleek, dark neon aesthetic in BOTH Sun (light) and Moon (dark) modes
 * Features subtle neon pulse, smooth hover transitions, and traveling edge beam
 */
export default function Sidebar({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) {
  const handleNavClick = (id) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
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

      {/* Sidebar Container — Dark in both Sun and Moon modes */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0a0f15]/95 backdrop-blur-xl border-r border-slate-800/80 text-slate-200 flex flex-col justify-between shrink-0 transition-all duration-300 select-none shadow-2xl overflow-hidden ${isCollapsed ? 'lg:w-20' : 'lg:w-64'
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
        <div className="flex flex-col relative z-10">
          {/* Brand Header */}
          <div className="p-4 lg:p-5 flex items-center justify-between border-b border-slate-800/60 bg-[#070b10]">
            <div className="flex items-center gap-3.5 overflow-hidden">
              {/* Animated Neon Logo */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 p-0.5 shadow-neon-green hover:shadow-[0_0_25px_rgba(74,222,128,0.4)] transition-all duration-300 shrink-0 group">
                <div className="w-full h-full bg-[#080d12] rounded-[10px] flex items-center justify-center transition-transform group-hover:scale-95">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
                </div>
                {/* Ping ring */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#080d12]" />
                </span>
              </div>

              {/* Brand Text */}
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold tracking-wider text-white text-base">SAR</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      DVR
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium truncate">
                    Vision AI Fleet Ops
                  </span>
                </div>
              )}
            </div>

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
          <nav className="px-3 py-6 space-y-2 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const showExpanded = !isCollapsed || isMobileOpen;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`relative w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group text-left overflow-hidden ${isActive
                      ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent text-emerald-400 border border-emerald-500/30 font-semibold shadow-[0_0_20px_-3px_rgba(74,222,128,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 hover:translate-x-1'
                    }`}
                  title={!showExpanded ? item.label : undefined}
                >
                  {/* Active Neon Accent Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_10px_#4ade80] animate-pulse" />
                  )}

                  <Icon
                    className={`w-5 h-5 shrink-0 transition-all duration-200 ${isActive
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
                          className={`ml-auto px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-slate-800 text-slate-400'
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
          {(!isCollapsed || isMobileOpen) ? (
            <div className="flex items-center justify-between">
              <span>SAR DVR System</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Active
              </span>
            </div>
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shadow-[0_0_6px_#4ade80]" />
          )}
        </div>
      </aside>
    </>
  );
}
