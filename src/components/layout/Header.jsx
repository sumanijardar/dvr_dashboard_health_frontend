import React, { useState } from 'react';
import {
  Menu,
  RefreshCw,
  Bell,
  Download,
  Sun,
  Moon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { exportSitesToCsv } from '../../utils/excelExport';
import { useTheme } from '../../context/ThemeContext';

export default function Header({
  pageTitle = 'DVR Dashboard',
  onGlobalRefresh,
  isRefreshing,
  onToggleMobileSidebar,
  filteredSites = []
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    setUserMenuOpen(false);
    alert('Logged out successfully.');
  };

  const handleExport = () => {
    exportSitesToCsv(filteredSites, `DVR_Sites_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <header
      className={`h-18 px-4 sm:px-6 py-3.5 border-b backdrop-blur-md flex items-center justify-between gap-4 z-20 shrink-0 sticky top-0 transition-colors duration-200 ${isDark
        ? 'border-slate-800/80 bg-[#0c1219]/90 text-slate-200'
        : 'border-slate-200 bg-white/95 text-slate-800 shadow-[0_1px_10px_rgba(0,0,0,0.03)]'
        }`}
    >
      {/* Title and Live Sync status */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className={`lg:hidden p-2 rounded-xl border transition ${isDark
            ? 'bg-[#121922] border-slate-700/80 text-slate-300 hover:text-white'
            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1
            className={`text-base sm:text-lg lg:text-xl font-bold tracking-tight flex items-center gap-2 sm:gap-2.5 truncate ${isDark ? 'text-white' : 'text-slate-900'
              }`}
          >
            <span className="truncate">SAR DVR System</span>
            <span
              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${isDark
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              DVR Live Feed
            </span>
          </h1>
          <p
            className={`text-[11px] sm:text-xs flex items-center gap-2 mt-0.5 truncate font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
          >
            {/* <span>SAR DVR System</span> */}
            {/* <span className={isDark ? 'text-slate-600 hidden sm:inline' : 'text-slate-300 hidden sm:inline'}>•</span> */}
            <span className="hidden md:inline">| Real-time sync</span>
          </p>
        </div>
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
        {/* Refresh DVR Polling Stream Button */}
        <button
          type="button"
          onClick={onGlobalRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-xl border transition active:scale-95 disabled:opacity-50 ${isDark
            ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700 shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
            }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh Sync'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`relative p-2 rounded-xl border transition-all duration-200 group ${isDark
            ? 'bg-[#121922] border-slate-700/80 text-slate-300 hover:text-white hover:border-emerald-500/50'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
            }`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </button>

        {/* Download Excel Button */}
        <button
          type="button"
          onClick={handleExport}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Download Excel</span>
          <span className="bg-emerald-700/60 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
            {filteredSites.length || 1129}
          </span>
        </button>

        {/* Notification Bell with Ping Dot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserMenuOpen(false);
            }}
            className={`p-2 rounded-xl border transition relative ${isDark
              ? 'bg-[#121922] border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs'
              }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div
              className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 border ${isDark
                ? 'bg-[#0e141b] border-slate-800 text-slate-300'
                : 'bg-white border-slate-200 text-slate-700 shadow-xl'
                }`}
            >
              <div
                className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
              >
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  System Alerts
                </span>
                <span className="text-[10px] text-rose-500 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                  3 New
                </span>
              </div>
              <div
                className={`divide-y mt-1 max-h-56 overflow-y-auto font-mono text-[11px] ${isDark ? 'divide-slate-800' : 'divide-slate-100'
                  }`}
              >
                <div className="py-2">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    CAM 02 Motion Detected
                  </p>
                  <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Site CPCN01347 • 2 mins ago
                  </p>
                </div>
                <div className="py-2">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    DVR Ping Timeout Alert
                  </p>
                  <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Site 201424490 • 15 mins ago
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Navbar Admin Profile (Strictly with ONLY Logout option) */}
        <div
          className={`relative border-l pl-2 sm:pl-3 ml-1 flex items-center gap-1 sm:gap-2 ${isDark ? 'border-slate-800' : 'border-slate-200'
            }`}
        >
          <button
            type="button"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotifOpen(false);
            }}
            className={`flex items-center gap-2 p-1 rounded-xl transition select-none ${isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100'
              }`}
            title="Admin Account"
          >
            <div className="relative shrink-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner font-mono ${isDark
                  ? 'bg-gradient-to-tr from-slate-700 to-slate-600 text-white'
                  : 'bg-slate-200 text-slate-800 border border-slate-300/80'
                  }`}
              >
                AD
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full ${isDark ? 'border-[#0c1219]' : 'border-white'
                  }`}
              />
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
            />
          </button>

          {/* Admin Dropdown with ONLY Logout */}
          {userMenuOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 border ${isDark
                ? 'bg-[#0e141b] border-slate-800 text-slate-300'
                : 'bg-white border-slate-200 text-slate-700 shadow-xl'
                }`}
            >
              <div
                className={`px-3 py-2 border-b mb-1 ${isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
              >
                <p className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Admin Operator
                </p>
                <p className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  admin@sarsoftware.com
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 hover:bg-rose-500/10 text-rose-500 rounded-lg flex items-center gap-2 font-semibold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
