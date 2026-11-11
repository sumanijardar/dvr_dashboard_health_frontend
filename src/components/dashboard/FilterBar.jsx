import React, { useMemo } from 'react';
import { Search, Download, Filter, X, SlidersHorizontal } from 'lucide-react';
import { exportSitesToCsv } from '../../utils/excelExport';
import { useTheme } from '../../context/ThemeContext';

export default function FilterBar({
  totalCount,
  filteredSites = [],
  searchQuery,
  onSearchChange,
  isFilterPanelOpen,
  onToggleFilterPanel,
  activeFiltersCount,
  customerFilter,
  onCustomerChange,
  bankFilter,
  onBankChange,
  dvrNameFilter = '',
  onDvrNameChange = () => { },
  // Fallbacks for compatibility
  stateFilter,
  onStateChange,
  filterOptions = { customers: [], banks: [], dvrNames: [] },
  onResetFilters,
  activeFilter,
  onSelectFilter,
  metricsSummary = []
}) {
  const { isDark } = useTheme();

  const handleExport = () => {
    exportSitesToCsv(filteredSites, `DVR_Sites_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // Map metric counts from metricsSummary array for pills
  const counts = useMemo(() => {
    const map = {};
    (metricsSummary || []).forEach((m) => {
      map[m.id] = m.value;
    });
    return {
      total: map.total || totalCount || '1,199',
      online: map.online || '334',
      offline: map.offline || '865',
      loginFailed: map.login_failed || '45',
      pingOk: map.ping_ok || '396',
      timeDiffOnline: map.time_diff_online || map.time_diff || '0'
    };
  }, [metricsSummary, totalCount]);

  const effectiveDvrChange = onDvrNameChange || onStateChange;
  const currentDvrVal = dvrNameFilter || stateFilter || '';

  return (
    <div
      className={`rounded-t-2xl border overflow-hidden transition-colors duration-200 ${
        isDark ? 'glass-panel border-slate-800/90 shadow-card-glass' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Table Toolbar & Filters */}
      <div
        className={`p-4 sm:p-5 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors duration-200 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200 bg-white'
        }`}
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className={`text-base font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-950 font-black'}`}>
              DVR Surveillance Inventory
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-mono border ${
                isDark
                  ? 'font-bold bg-slate-800 text-slate-300 border-slate-700'
                  : 'font-extrabold bg-slate-100 text-slate-950 border-slate-300'
              }`}
            >
              {filteredSites.length} sites Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5" />
        </div>

        {/* Filter Badges / Quick toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* 1. All */}
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter('ALL')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs ${
              activeFilter === 'ALL'
                ? isDark
                  ? 'bg-slate-200 text-slate-950 border-white font-black shadow-[0_0_14px_rgba(255,255,255,0.25)]'
                  : 'bg-slate-900 text-white border-slate-950 font-black shadow-md ring-2 ring-slate-400/40'
                : isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700 font-semibold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-bold'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'ALL'
                  ? isDark ? 'bg-slate-950' : 'bg-white'
                  : isDark ? 'bg-slate-400' : 'bg-slate-500'
              }`}
            />
            <span>All ({counts.total})</span>
          </button>

          {/* 2. Online (ALWAYS GREEN) */}
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter('ONLINE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs ${
              activeFilter === 'ONLINE'
                ? isDark
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-[0_0_14px_rgba(16,185,129,0.45)]'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 font-black shadow-md ring-2 ring-emerald-400/50'
                : isDark
                ? 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-400 border-emerald-800/70 font-semibold'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-400 font-black'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'ONLINE'
                  ? isDark ? 'bg-slate-950' : 'bg-white animate-pulse'
                  : 'bg-emerald-500'
              }`}
            />
            <span>Online ({counts.online})</span>
          </button>

          {/* 3. Offline (ALWAYS RED) */}
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter('OFFLINE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs ${
              activeFilter === 'OFFLINE'
                ? isDark
                  ? 'bg-rose-600 text-white border-rose-500 font-black shadow-[0_0_14px_rgba(244,63,94,0.45)]'
                  : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 font-black shadow-md ring-2 ring-rose-400/50'
                : isDark
                ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border-rose-800/70 font-semibold'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-400 font-black'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'OFFLINE'
                  ? 'bg-white animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span>Offline ({counts.offline})</span>
          </button>

          {/* 4. Login Failed (ALWAYS AMBER / ORANGE) */}
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter('LOGIN_FAILED')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs ${
              activeFilter === 'LOGIN_FAILED'
                ? isDark
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-[0_0_14px_rgba(245,158,11,0.45)]'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600 font-black shadow-md ring-2 ring-amber-400/50'
                : isDark
                ? 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-400 border-amber-800/70 font-semibold'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-400 font-black'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'LOGIN_FAILED'
                  ? 'bg-slate-950 animate-pulse'
                  : 'bg-amber-500'
              }`}
            />
            <span>Login Failed ({counts.loginFailed})</span>
          </button>

          {/* 5. Ping OK (ALWAYS TEAL / CYAN) */}
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter('PING_OK')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs ${
              activeFilter === 'PING_OK'
                ? isDark
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-[0_0_14px_rgba(20,184,166,0.45)]'
                  : 'bg-teal-600 hover:bg-teal-700 text-white border-teal-700 font-black shadow-md ring-2 ring-teal-400/50'
                : isDark
                ? 'bg-teal-950/40 hover:bg-teal-900/50 text-teal-300 border-teal-800/70 font-semibold'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-400 font-black'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'PING_OK'
                  ? isDark ? 'bg-slate-950' : 'bg-white animate-pulse'
                  : 'bg-teal-500'
              }`}
            />
            <span>Ping OK ({counts.pingOk})</span>
          </button>

          {/* 6. Time Diff Online (ALWAYS SKY / BLUE) */}
          <button
            type="button"
            onClick={() => onSelectFilter && onSelectFilter('TIME_DIFF_ONLINE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs ${
              activeFilter === 'TIME_DIFF_ONLINE'
                ? isDark
                  ? 'bg-sky-500 text-slate-950 border-sky-400 font-black shadow-[0_0_14px_rgba(56,189,248,0.45)]'
                  : 'bg-sky-600 hover:bg-sky-700 text-white border-sky-700 font-black shadow-md ring-2 ring-sky-400/50'
                : isDark
                ? 'bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 border-sky-800/70 font-semibold'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-400 font-black'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeFilter === 'TIME_DIFF_ONLINE'
                  ? isDark ? 'bg-slate-950' : 'bg-white animate-pulse'
                  : 'bg-sky-400'
              }`}
            />
            <span>Time Diff ({counts.timeDiffOnline})</span>
          </button>

          {/* Advanced Filter Toggle Pill */}
          <button
            type="button"
            onClick={onToggleFilterPanel}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ml-1 transition cursor-pointer text-xs ${
              isFilterPanelOpen
                ? isDark
                  ? 'bg-[#182330] border-emerald-500/40 text-emerald-400 font-semibold'
                  : 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-sm ring-1 ring-emerald-400'
                : isDark
                ? 'bg-[#111923] hover:bg-[#16212d] border-slate-700 text-slate-300 font-medium'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900 font-bold'
            }`}
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span
                className={`text-[10px] px-1.5 rounded-full font-mono ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-emerald-600 text-white font-bold'
                }`}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Secondary Search & Export Row */}
      <div
        className={`px-4 sm:px-5 py-3 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors duration-200 ${
          isDark ? 'bg-[#0a0f16]/90 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}
      >
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ATM ID, IP, Bank, Customer, City, DVR Name..."
            className={`w-full pl-10 pr-10 py-2 text-xs border rounded-xl transition-all font-mono focus:outline-none focus:ring-1 ${
              isDark
                ? 'bg-[#121922] border-slate-700/80 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500'
                : 'bg-white border-slate-300 text-slate-950 font-bold placeholder-slate-500 focus:border-emerald-600 focus:ring-emerald-600 shadow-2xs'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Download Excel Button */}
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-neon-green transition active:scale-95 shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Excel</span>
          <span className="bg-emerald-700/60 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
            {filteredSites.length}
          </span>
        </button>
      </div>

      {/* Collapsible Advanced Filters Drawer */}
      {isFilterPanelOpen && (
        <div
          className={`p-4 border-b grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs transition-colors duration-200 ${
            isDark ? 'bg-[#0a0f16] border-slate-800/80' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Customer Dropdown */}
          <div>
            <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-950 font-black'}`}>
              Customer
            </label>
            <select
              value={customerFilter}
              onChange={(e) => onCustomerChange(e.target.value)}
              className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#121922] border-slate-700 text-slate-200 focus:border-emerald-500'
                  : 'bg-white border-slate-300 text-slate-950 font-bold focus:border-emerald-600 shadow-2xs'
              }`}
            >
              <option value="">All Customers</option>
              {(filterOptions.customers || []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Bank Dropdown */}
          <div>
            <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-950 font-black'}`}>
              Bank
            </label>
            <select
              value={bankFilter}
              onChange={(e) => onBankChange(e.target.value)}
              className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#121922] border-slate-700 text-slate-200 focus:border-emerald-500'
                  : 'bg-white border-slate-300 text-slate-950 font-bold focus:border-emerald-600 shadow-2xs'
              }`}
            >
              <option value="">All Banks</option>
              {(filterOptions.banks || []).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* DVR Name Dropdown */}
          <div>
            <label className={`block text-[11px] font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-950 font-black'}`}>
              DVR Name
            </label>
            <select
              value={currentDvrVal}
              onChange={(e) => effectiveDvrChange(e.target.value)}
              className={`w-full border rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#121922] border-slate-700 text-slate-200 focus:border-emerald-500'
                  : 'bg-white border-slate-300 text-slate-950 font-bold focus:border-emerald-600 shadow-2xs'
              }`}
            >
              <option value="">All DVR Names</option>
              {(filterOptions.dvrNames || []).map((dvr) => (
                <option key={dvr} value={dvr}>{dvr}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={onResetFilters}
              className={`w-full font-semibold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-950 border-slate-300 font-extrabold'
              }`}
            >
              <Filter className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-700'}`} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
