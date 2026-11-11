import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BellRing,
  ShieldAlert,
  AlertTriangle,
  Info,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  HardDrive,
  Eye,
  CheckCircle2,
  Copy,
  Check,
  Network,
  Server,
  Layers,
  SlidersHorizontal,
  X,
  Activity,
  FileText,
  Radio,
  Building2,
  Cpu,
  Filter
} from 'lucide-react';
import { fetchDvrLogs, fetchMajorTypes, fetchLogDvrNames } from '../../services';
import { useTheme } from '../../context/ThemeContext';

export default function AlertsView() {
  const { isDark } = useTheme();

  // Data states
  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic Major Types & DVR Names Lists
  const [majorTypesList, setMajorTypesList] = useState([]);
  const [selectedMajorType, setSelectedMajorType] = useState('ALL');
  const [dvrNamesList, setDvrNamesList] = useState([]);
  const [selectedDvrName, setSelectedDvrName] = useState('ALL');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [atmidFilter, setAtmidFilter] = useState('');

  // UI interaction states
  const [copiedIp, setCopiedIp] = useState(null);
  const [selectedLogForDetails, setSelectedLogForDetails] = useState(null);

  // 1. Fetch Dynamic Dropdown lists on mount (Major Types & DVR Names)
  useEffect(() => {
    let isMounted = true;
    async function loadDropdowns() {
      try {
        const [types, dvrs] = await Promise.all([
          fetchMajorTypes().catch(() => []),
          fetchLogDvrNames().catch(() => [])
        ]);

        if (isMounted) {
          if (Array.isArray(types)) setMajorTypesList(types);
          if (Array.isArray(dvrs)) setDvrNamesList(dvrs);
        }
      } catch (err) {
        console.error('[AlertsView] Failed to fetch dropdown metadata:', err);
      }
    }
    loadDropdowns();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate sum of all alerts across dynamic major types
  const grandTotalAlerts = useMemo(() => {
    if (majorTypesList.length > 0) {
      return majorTypesList.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
    }
    return totalCount;
  }, [majorTypesList, totalCount]);

  // 2. Fetch Logs when filters or pagination change
  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchDvrLogs({
        page: currentPage,
        limit: perPage,
        search: searchQuery,
        major_type: selectedMajorType !== 'ALL' ? selectedMajorType : '',
        dvrname: selectedDvrName !== 'ALL' ? selectedDvrName : '',
        ipaddress: ipFilter,
        atmid: atmidFilter
      });

      if (response && response.Code === 200) {
        setLogs(response.data || []);
        setTotalCount(response.total_count || 0);
        setTotalPages(response.total_pages || 1);
      } else {
        throw new Error(response?.message || 'Failed to fetch DVR alerts.');
      }
    } catch (err) {
      console.error('[AlertsView] Fetch error:', err);
      setError(err.message || 'Error communicating with DVR logs API');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, perPage, searchQuery, selectedMajorType, selectedDvrName, ipFilter, atmidFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Search handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedMajorType('ALL');
    setSelectedDvrName('ALL');
    setIpFilter('');
    setAtmidFilter('');
    setCurrentPage(1);
  };

  const handleCopyIp = (ip, e) => {
    e.stopPropagation();
    if (!ip) return;
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => {
      setCopiedIp(null);
    }, 2000);
  };

  // Determine badge styling based on major / minor type
  const getLogTypeTheme = (majorType, minorType) => {
    const major = (majorType || '').toLowerCase();
    const minor = (minorType || '').toLowerCase();

    if (major.includes('alarm') || minor.includes('tamper') || minor.includes('loss')) {
      return {
        badgeBg: isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200',
        badgeBorder: 'border-rose-500/30',
        cardBorder: isDark ? 'border-rose-900/30 hover:border-rose-500/40' : 'border-rose-200 hover:border-rose-300',
        icon: ShieldAlert,
        iconColor: 'text-rose-500'
      };
    }
    if (major.includes('exception') || minor.includes('broken') || minor.includes('fail') || minor.includes('error')) {
      return {
        badgeBg: isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200',
        badgeBorder: 'border-amber-500/30',
        cardBorder: isDark ? 'border-amber-900/30 hover:border-amber-500/40' : 'border-amber-200 hover:border-amber-300',
        icon: AlertTriangle,
        iconColor: 'text-amber-500'
      };
    }
    if (minor.includes('motion')) {
      return {
        badgeBg: isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200',
        badgeBorder: 'border-orange-500/30',
        cardBorder: isDark ? 'border-orange-900/30 hover:border-orange-500/40' : 'border-orange-200 hover:border-orange-300',
        icon: Activity,
        iconColor: 'text-orange-500'
      };
    }
    return {
      badgeBg: isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border-cyan-200',
      badgeBorder: 'border-cyan-500/30',
      cardBorder: isDark ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:border-slate-300',
      icon: Info,
      iconColor: 'text-cyan-500'
    };
  };

  // Dedicated Styling for DVR Brands
  const getDvrBrandStyle = (dvrName) => {
    const name = (dvrName || '').toLowerCase();
    if (name.includes('hikvision_nvr')) {
      return {
        badge: isDark
          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
          : 'bg-rose-50 text-rose-800 border-rose-200',
        accent: 'text-rose-400'
      };
    }
    if (name.includes('hikvision')) {
      return {
        badge: isDark
          ? 'bg-red-500/15 text-red-300 border-red-500/30'
          : 'bg-red-50 text-red-800 border-red-200',
        accent: 'text-red-400'
      };
    }
    if (name.includes('dahuva') || name.includes('dahua')) {
      return {
        badge: isDark
          ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
          : 'bg-blue-50 text-blue-800 border-blue-200',
        accent: 'text-blue-400'
      };
    }
    if (name.includes('unv')) {
      return {
        badge: isDark
          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
          : 'bg-purple-50 text-purple-800 border-purple-200',
        accent: 'text-purple-400'
      };
    }
    if (name.includes('cpplus')) {
      return {
        badge: isDark
          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          : 'bg-amber-50 text-amber-800 border-amber-200',
        accent: 'text-amber-400'
      };
    }
    return {
      badge: isDark
        ? 'bg-slate-800 text-slate-300 border-slate-700'
        : 'bg-slate-100 text-slate-700 border-slate-200',
      accent: 'text-slate-400'
    };
  };

  const hasActiveFilters = searchQuery || selectedMajorType !== 'ALL' || selectedDvrName !== 'ALL' || ipFilter || atmidFilter;

  return (
    <div className="space-y-5 animate-in fade-in duration-300 max-w-full overflow-hidden">
      {/* =========================================================================
          1. HEADER & GLOBAL ALERTS SUMMARY (FULLY RESPONSIVE)
          ========================================================================= */}
      <div
        className={`rounded-2xl border p-4 sm:p-6 shadow-sm relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-[#0d1520] via-[#0b111a] to-[#080d14] border-slate-800'
            : 'bg-gradient-to-r from-white via-slate-50 to-white border-slate-200'
        }`}
      >
        {isDark && (
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          {/* Left Title & Status */}
          <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)] shrink-0">
              <BellRing className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`text-lg sm:text-xl font-extrabold tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Security & Tamper Incident Logs
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Fleet Feed
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Real-time incident audit of motion detection, tampering alerts, video feed loss, and authentication exceptions.
              </p>
            </div>
          </div>

          {/* Right Header Alert Stats & Action */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Total Alerts in Header */}
            <div
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border flex flex-col justify-center min-w-[130px] ${
                isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Total All Alerts
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-rose-500 font-mono tracking-tight">
                  {grandTotalAlerts.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Recorded</span>
              </div>
            </div>

            {/* Filtered Count */}
            <div
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border flex flex-col justify-center min-w-[120px] ${
                isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Results
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono tracking-tight">
                  {totalCount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Matching</span>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={loadLogs}
              disabled={isLoading}
              className={`h-11 sm:h-12 px-3 sm:px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 shrink-0 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
              }`}
              title="Refresh Logs Feed"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DYNAMIC CONTROLS (SEARCH + MAJOR TYPE + DVR NAME DROPDOWNS)
          ========================================================================= */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 shadow-xs ${
          isDark ? 'bg-[#0c1219] border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Main Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ATM ID, Host IP, Minor Type, or Description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`w-full pl-9 pr-20 py-2.5 text-xs rounded-xl border outline-none font-medium transition ${
                isDark
                  ? 'bg-slate-900 border-slate-700/80 text-slate-200 placeholder-slate-500 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-600'
              }`}
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs"
            >
              Filter
            </button>
          </form>

          {/* DYNAMIC MAJOR TYPE DROPDOWN */}
          <div className="md:col-span-3 flex items-center gap-1.5 min-w-0">
            <label
              htmlFor="major-type-select"
              className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Type:</span>
            </label>
            <div className="relative flex-1 min-w-0">
              <select
                id="major-type-select"
                value={selectedMajorType}
                onChange={(e) => {
                  setSelectedMajorType(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-xl border outline-none cursor-pointer transition truncate appearance-none ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:border-emerald-500/50'
                    : 'bg-slate-50 border-slate-300 text-emerald-700 hover:border-emerald-500'
                }`}
              >
                <option value="ALL">All Major Types ({grandTotalAlerts.toLocaleString()})</option>
                {majorTypesList.map((item) => (
                  <option key={item.major_type} value={item.major_type}>
                    {item.major_type} ({item.count.toLocaleString()})
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* DYNAMIC DVR NAME DROPDOWN */}
          <div className="md:col-span-2 flex items-center gap-1.5 min-w-0">
            <label
              htmlFor="dvr-name-select"
              className={`text-xs font-bold flex items-center gap-1 shrink-0 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">DVR:</span>
            </label>
            <div className="relative flex-1 min-w-0">
              <select
                id="dvr-name-select"
                value={selectedDvrName}
                onChange={(e) => {
                  setSelectedDvrName(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-xl border outline-none cursor-pointer transition truncate appearance-none ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-purple-400 hover:border-purple-500/50'
                    : 'bg-slate-50 border-slate-300 text-purple-700 hover:border-purple-500'
                }`}
              >
                <option value="ALL">All DVR Brands</option>
                {dvrNamesList.map((item) => (
                  <option key={item.dvrname} value={item.dvrname}>
                    {item.dvrname} ({item.count.toLocaleString()})
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Rows & Reset Options */}
          <div className="md:col-span-2 flex items-center justify-end gap-2 shrink-0">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`px-2.5 py-2 text-xs font-semibold rounded-xl border outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
              title="Rows per page"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className={`px-2.5 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1 transition ${
                  isDark
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
                title="Clear all active filters"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Filter Pills Row (Horizontal Scroll on Mobile) */}
        {majorTypesList.length > 0 && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/40 overflow-x-auto scrollbar-none pb-1 text-xs">
            <span className={`text-[10px] font-bold uppercase tracking-wider mr-1 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Top Types:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedMajorType('ALL');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium text-xs whitespace-nowrap transition ${
                selectedMajorType === 'ALL'
                  ? 'bg-emerald-500 text-black font-bold shadow-xs'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              All Types
            </button>
            {majorTypesList.slice(0, 6).map((item) => {
              const isSelected = selectedMajorType === item.major_type;
              return (
                <button
                  key={item.major_type}
                  type="button"
                  onClick={() => {
                    setSelectedMajorType(item.major_type);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium text-xs whitespace-nowrap flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-emerald-500 text-black font-bold shadow-xs'
                      : isDark
                      ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <span>{item.major_type}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-black/20 text-black'
                        : isDark
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {item.count > 999 ? `${(item.count / 1000).toFixed(1)}k` : item.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          3. ERROR BANNER (IF ANY)
          ========================================================================= */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            type="button"
            onClick={loadLogs}
            className="px-3 py-1.5 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* =========================================================================
          4. INCIDENT CARDS (FULLY RESPONSIVE WITH DEDICATED DVR & IP SECTIONS)
          ========================================================================= */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-9 h-9 text-emerald-400 animate-spin" />
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Streaming live DVR incidents & log telemetry...
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div
            className={`p-12 rounded-2xl border text-center ${
              isDark ? 'bg-[#0c1219] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <ShieldAlert className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-40" />
            <h3 className="text-base font-bold">No incident records matched your filter</h3>
            <p className="text-xs mt-1 max-w-sm mx-auto">
              Try resetting filters or searching with different keywords.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          logs.map((log) => {
            const theme = getLogTypeTheme(log.major_type, log.minor_type);
            const dvrStyle = getDvrBrandStyle(log.dvrname);
            const IconComponent = theme.icon;
            const isThisIpCopied = copiedIp === log.ipaddress;

            return (
              <div
                key={log.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md space-y-3.5 ${
                  isDark
                    ? `bg-[#0b1017] ${theme.cardBorder}`
                    : `bg-white ${theme.cardBorder}`
                }`}
              >
                {/* ---------------- CARD TOP ROW: TITLE + TIMESTAMP ---------------- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/40">
                  {/* Event Type & Minor Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl border shrink-0 ${theme.badgeBg}`}>
                      <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${theme.iconColor}`} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${theme.badgeBg} ${theme.badgeBorder}`}
                      >
                        {log.major_type || 'Event'}
                      </span>

                      <h4 className={`text-sm sm:text-base font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {log.minor_type || log.major_type || 'Incident Trigger'}
                      </h4>

                      <span className="font-mono text-[10px] text-slate-500">
                        #{log.id}
                      </span>
                    </div>
                  </div>

                  {/* Clean, Non-wrapping Timestamp Pill */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 whitespace-nowrap self-start sm:self-auto shrink-0 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold tracking-tight">{log.log_time || log.created_at}</span>
                  </div>
                </div>

                {/* ---------------- CARD MIDDLE: DESCRIPTION / CHANNEL DETAILS ---------------- */}
                {log.description && (
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {log.description}
                  </p>
                )}

                {/* ---------------- CARD BOTTOM GRID: 5 DEDICATED SECTIONS (FULLY RESPONSIVE) ---------------- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                  {/* 1. DEDICATED ATM ID / SITE SECTION */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-1 transition ${
                      isDark ? 'bg-slate-900/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>ATM ID / Site</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Terminal</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs sm:text-[13px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 truncate">
                        {log.atmid || 'NO_ATM_ID'}
                      </span>
                    </div>
                  </div>

                  {/* 2. DEDICATED DVR NAME SECTION (AS REQUESTED BY USER) */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-1 transition ${
                      isDark ? 'bg-slate-900/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <HardDrive className={`w-3.5 h-3.5 ${dvrStyle.accent} shrink-0`} />
                        <span>DVR Name / Model</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Hardware</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono font-bold text-xs sm:text-[13px] px-2.5 py-0.5 rounded-lg border truncate ${dvrStyle.badge}`}>
                        {log.dvrname || 'Generic DVR'}
                      </span>
                    </div>
                  </div>

                  {/* 3. DEDICATED DVR HOST IP ADDRESS SECTION */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-1 transition ${
                      isDark ? 'bg-slate-900/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>DVR Host IP</span>
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-xs sm:text-[13px] font-bold text-cyan-400 truncate tracking-tight">
                        {log.ipaddress || '0.0.0.0'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyIp(log.ipaddress, e)}
                        className={`p-1 rounded-md transition ${
                          isThisIpCopied
                            ? 'bg-emerald-500 text-black'
                            : isDark
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                        title="Copy IP Address"
                      >
                        {isThisIpCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* 4. DEDICATED SOURCE / USER SECTION */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col justify-between gap-1 transition ${
                      isDark ? 'bg-slate-900/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Source IP / User</span>
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Origin</span>
                    </div>

                    <div className="flex items-center text-xs font-mono text-slate-300 truncate">
                      <span className="truncate">
                        {log.source_ip && log.source_ip !== '0.0.0.0'
                          ? log.source_ip
                          : (log.user_name || 'Daemon')}
                      </span>
                    </div>
                  </div>

                  {/* 5. DEDICATED ACTION BUTTON */}
                  <div className="flex items-center justify-end sm:col-span-2 lg:col-span-1">
                    <button
                      type="button"
                      onClick={() => setSelectedLogForDetails(log)}
                      className={`w-full h-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs border ${
                        isDark
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">Inspect Payload</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================================================================
          5. PAGINATION CONTROLS (RESPONSIVE)
          ========================================================================= */}
      {totalPages > 1 && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium ${
            isDark ? 'bg-[#0c1219] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>
              Page <strong className="text-emerald-400 font-bold">{currentPage}</strong> of{' '}
              <strong>{totalPages.toLocaleString()}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              Showing {((currentPage - 1) * perPage + 1).toLocaleString()} -{' '}
              {Math.min(currentPage * perPage, totalCount).toLocaleString()} of {totalCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage(1)}
              className="px-2.5 py-1.5 rounded-xl border font-bold disabled:opacity-30 hover:bg-slate-800/40 transition"
              title="First Page"
            >
              « First
            </button>
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl border flex items-center gap-1 disabled:opacity-30 hover:bg-slate-800/40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <span className="px-2 font-mono text-emerald-400 font-bold">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-xl border flex items-center gap-1 disabled:opacity-30 hover:bg-slate-800/40 transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage(totalPages)}
              className="px-2.5 py-1.5 rounded-xl border font-bold disabled:opacity-30 hover:bg-slate-800/40 transition"
              title="Last Page"
            >
              Last »
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. PAYLOAD INSPECT MODAL (RAW XML & META DATA)
          ========================================================================= */}
      {selectedLogForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-2xl border p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh] ${
              isDark ? 'bg-[#0c1219] border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm sm:text-base">
                  Incident Payload #{selectedLogForDetails.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogForDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 overflow-y-auto flex-1 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-sans font-bold">ATM ID</span>
                  <span className="font-bold text-emerald-400">{selectedLogForDetails.atmid || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-sans font-bold">DVR Model</span>
                  <span className="font-bold text-purple-400">{selectedLogForDetails.dvrname || 'Generic'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-sans font-bold">Host IP</span>
                  <span className="font-bold text-cyan-400">{selectedLogForDetails.ipaddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-sans font-bold">Timestamp</span>
                  <span className="font-bold text-slate-300">{selectedLogForDetails.log_time}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-sans text-xs font-semibold block mb-1">
                  Raw XML / JSON Meta Payload:
                </span>
                <pre
                  className={`p-3.5 rounded-xl border overflow-x-auto text-[11px] leading-relaxed whitespace-pre-wrap ${
                    isDark ? 'bg-black/80 border-slate-800 text-emerald-400' : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  {selectedLogForDetails.raw_xml || selectedLogForDetails.description || 'No raw payload content available.'}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLogForDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
