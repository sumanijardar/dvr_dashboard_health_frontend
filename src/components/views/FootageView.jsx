import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Download, RefreshCw, Search, X, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Filter, Calendar, Wifi, WifiOff,
  VideoOff, Database, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { fetchFootageList, fetchFootageCounts, fetchFootageStatusTypes } from '../../services';

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PRESENT: { label: 'Present', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400', icon: CheckCircle2 },
  NO_RECORDING: { label: 'No Recording', color: 'bg-amber-500/15  text-amber-400  border-amber-500/30', dot: 'bg-amber-400', icon: VideoOff },
  DVR_DOWN: { label: 'DVR Down', color: 'bg-rose-500/15   text-rose-400   border-rose-500/30', dot: 'bg-rose-400', icon: WifiOff },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    color: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    dot: 'bg-slate-400',
    icon: AlertCircle,
  };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function CountCard({ label, value, color, icon: Icon, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-1 px-4 py-3 rounded-xl border transition-all duration-200 text-left w-full
        ${active
          ? 'border-emerald-500/60 shadow-[0_0_16px_-4px_rgba(74,222,128,0.4)] bg-emerald-500/10'
          : 'border-slate-700/50 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-800'
        }`}
    >
      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        {label}
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>
        {value?.toLocaleString() ?? '—'}
      </div>
    </button>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}
        className="p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-sm font-mono min-w-[80px] text-center">
        {currentPage} / {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
        <ChevronRight className="w-4 h-4" />
      </button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function FootageView() {
  const { isDark } = useTheme();

  // ─── Counts state ─────────────────────────────────────────────────────────
  const [counts, setCounts] = useState({ total: 0, status_counts: {} });
  const [statusTypes, setStatusTypes] = useState([]);
  const [countsLoading, setCountsLoading] = useState(true);

  // ─── Filter state ─────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // ─── Table state ──────────────────────────────────────────────────────────
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchTimer = useRef(null);

  // ─── Load counts + status types once ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      setCountsLoading(true);
      try {
        const [c, s] = await Promise.all([fetchFootageCounts(), fetchFootageStatusTypes()]);
        setCounts(c);
        setStatusTypes(s);
      } catch (e) {
        console.error('[FootageView] counts error:', e);
      } finally {
        setCountsLoading(false);
      }
    })();
  }, []);

  // ─── Load table data ───────────────────────────────────────────────────────
  const loadData = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFootageList({
        page,
        limit: rowsPerPage,
        status,
        from_date: fromDate,
        to_date: toDate,
        search,
      });
      if (res?.Code === 200) {
        setRows(res.data || []);
        setTotalCount(res.total_count || 0);
        setTotalPages(res.total_pages || 1);
        setCurrentPage(res.current_page || page);
      } else {
        setError(res?.message || 'Failed to load data');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [status, fromDate, toDate, search, rowsPerPage]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
    loadData(1);
  }, [status, fromDate, toDate, rowsPerPage]); // eslint-disable-line

  // Debounce search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      loadData(1);
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [search]); // eslint-disable-line

  const handlePageChange = (p) => {
    setCurrentPage(p);
    loadData(p);
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setFromDate('');
    setToDate('');
    setRowsPerPage(25);
    setCurrentPage(1);
  };

  const handleStatusQuickFilter = (s) => {
    setStatus(prev => prev === s ? '' : s);
  };

  const hasFilters = search || status || fromDate || toDate;

  // ─── Formatting helpers ────────────────────────────────────────────────────
  const fmtDt = (dt) => {
    if (!dt) return '—';
    return dt.replace('T', ' ').slice(0, 16);
  };

  // ─── Theme classes ─────────────────────────────────────────────────────────
  const bg = isDark ? 'bg-[#0a0f15]' : 'bg-slate-50';
  const card = isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white border-slate-200';
  const text = isDark ? 'text-slate-100' : 'text-slate-900';
  const sub = isDark ? 'text-slate-400' : 'text-slate-500';
  const tblHdr = isDark
    ? 'bg-slate-800/70 text-slate-400 border-slate-700/50'
    : 'bg-slate-100 text-slate-600 border-slate-200';
  const tblRow = isDark
    ? 'border-slate-800/60 hover:bg-slate-800/40'
    : 'border-slate-100 hover:bg-slate-50';
  const inputCls = isDark
    ? 'bg-slate-800/60 border-slate-700/60 text-slate-200 placeholder-slate-500 focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30';

  return (
    <div className={`min-h-screen ${bg} ${text} p-4 sm:p-6 lg:p-8`}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Footage Downloader</h1>
            <p className={`text-xs ${sub} mt-0.5`}>
              Availability report — {totalCount.toLocaleString()} records
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => loadData(currentPage)}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Count Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <CountCard
          label="Total Records"
          value={countsLoading ? null : counts.total}
          color="text-sky-400"
          icon={Database}
          onClick={() => setStatus('')}
          active={!status}
        />
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <CountCard
            key={key}
            label={cfg.label}
            value={countsLoading ? null : (counts.status_counts?.[key] ?? 0)}
            color={cfg.color.match(/text-[\w-]+/)?.[0] || 'text-slate-400'}
            icon={cfg.icon}
            onClick={() => handleStatusQuickFilter(key)}
            active={status === key}
          />
        ))}
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────────── */}
      <div className={`${card} border rounded-2xl p-4 mb-5`}>
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search IP or status…"
              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm transition-all ${inputCls}`}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative min-w-[160px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm appearance-none cursor-pointer transition-all ${inputCls}`}
            >
              <option value="">All Statuses</option>
              {statusTypes.map(s => (
                <option key={s.status} value={s.status}>
                  {STATUS_CONFIG[s.status]?.label || s.status} ({s.count})
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div className="relative min-w-[150px]">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm transition-all ${inputCls}`}
            />
          </div>

          {/* To Date */}
          <div className="relative min-w-[150px]">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm transition-all ${inputCls}`}
            />
          </div>

          {/* Rows per page */}
          <select
            value={rowsPerPage}
            onChange={e => setRowsPerPage(Number(e.target.value))}
            className={`px-3 py-2 rounded-xl border text-sm cursor-pointer transition-all ${inputCls}`}
          >
            {[25, 50, 100, 500].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>

          {/* Reset */}
          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium transition-all"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className={`${card} border rounded-2xl overflow-hidden`}>

        {/* Table Header (pagination + count) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-slate-700/40">
          <span className={`text-sm ${sub}`}>
            {loading ? 'Loading…' : `Showing ${rows.length} of ${totalCount.toLocaleString()} records`}
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 px-6 py-4 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Table scroll wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wide ${tblHdr}`}>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    IP Address
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Footage From
                  </div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Footage To
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Last Updated
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: rowsPerPage > 10 ? 10 : rowsPerPage }).map((_, i) => (
                  <tr key={i} className={`border-b ${tblRow}`}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className={`h-4 rounded animate-pulse ${isDark ? 'bg-slate-700/60' : 'bg-slate-200'}`}
                          style={{ width: j === 0 ? '2rem' : j === 4 ? '5rem' : '80%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <VideoOff className="w-10 h-10 opacity-30" />
                      <span>No footage records found</span>
                      {hasFilters && (
                        <button onClick={handleReset}
                          className="text-xs text-emerald-400 hover:underline">
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => {
                  const rowNum = (currentPage - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr key={row.id} className={`border-b transition-colors ${tblRow}`}>
                      {/* # */}
                      <td className={`px-4 py-3 font-mono text-xs ${sub}`}>{rowNum}</td>

                      {/* IP */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20 select-all">
                          {row.ip}
                        </span>
                      </td>

                      {/* Footage From */}
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs ${sub}`}>{fmtDt(row.footage_dt_from)}</span>
                      </td>

                      {/* Footage To */}
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs ${sub}`}>{fmtDt(row.footage_dt_to)}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>

                      {/* Last Updated */}
                      <td className="px-4 py-3">
                        <span className={`font-mono text-xs ${sub} whitespace-nowrap`}>{fmtDt(row.udate)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer pagination */}
        {!loading && rows.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-slate-700/40">
            <span className={`text-xs ${sub}`}>
              Page {currentPage} of {totalPages} · {totalCount.toLocaleString()} total records
            </span>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}

