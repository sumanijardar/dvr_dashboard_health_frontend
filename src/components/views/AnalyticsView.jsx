import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar
} from 'recharts';
import {
  BarChart3, RefreshCw, Wifi, WifiOff, Server, HardDrive,
  AlertTriangle, Users, Camera, Activity, TrendingUp,
  CheckCircle2, XCircle, Download, Layers
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { buildApiUrl } from '../../config/apiConfig';

// ─── Color palettes ────────────────────────────────────────────────────────────
const BRAND_COLORS   = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
const STATUS_COLORS  = { online: '#10b981', offline: '#ef4444', ping_ok: '#3b82f6', ping_failed: '#f97316' };
const PIE_COLORS     = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'];
const HDD_COLORS     = { 'Working': '#10b981', 'Not Working': '#ef4444', 'N/A': '#64748b', 'Other': '#f59e0b' };
const NETWORK_COLORS = { 'Working': '#10b981', 'Not Working': '#ef4444', 'Unknown': '#64748b' };
const FOOTAGE_COLORS = { 'PRESENT': '#10b981', 'NO_RECORDING': '#f59e0b', 'DVR_DOWN': '#ef4444' };

// ─── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl border px-3 py-2 text-xs shadow-xl ${
      isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      {label && <p className="font-bold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color || p.fill }} />
          <span className="font-medium">{p.name}:</span>
          <span className="font-mono font-bold">{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Custom Pie label ──────────────────────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub, isDark }) {
  return (
    <div className={`rounded-2xl border p-4 flex items-center gap-4 ${
      isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white border-slate-200'
    }`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}
        style={{ background: color + '22', border: `1px solid ${color}44` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-black font-mono" style={{ color }}>
          {value != null ? Number(value).toLocaleString() : '—'}
        </div>
        <div className={`text-xs font-semibold truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {label}
        </div>
        {sub && (
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</div>
        )}
      </div>
    </div>
  );
}

// ─── Chart Card wrapper ────────────────────────────────────────────────────────
function ChartCard({ title, icon: Icon, iconColor = '#10b981', children, isDark, badge }) {
  const bg   = isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white border-slate-200';
  const text = isDark ? 'text-slate-100' : 'text-slate-800';
  return (
    <div className={`rounded-2xl border p-5 ${bg}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`flex items-center gap-2 font-bold text-sm ${text}`}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
          {title}
        </h3>
        {badge && (
          <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Horizontal bar (custom, no recharts) ──────────────────────────────────────
function HBar({ label, value, total, color, isDark }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className={`flex justify-between text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        <span className="truncate max-w-[180px]">{label}</span>
        <span className="font-mono shrink-0 ml-2">{Number(value).toLocaleString()} <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>({pct}%)</span></span>
      </div>
      <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700/60' : 'bg-slate-100'}`}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AnalyticsView() {
  const { isDark } = useTheme();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const bg   = isDark ? 'bg-[#0a0f15]'           : 'bg-slate-50';
  const text = isDark ? 'text-slate-100'           : 'text-slate-900';
  const sub  = isDark ? 'text-slate-400'           : 'text-slate-500';
  const gridColor = isDark ? '#1e293b'             : '#e2e8f0';
  const axisColor = isDark ? '#64748b'             : '#94a3b8';

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = buildApiUrl('api/analytics_api.php?fetch_all=1');
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.Code === 200) {
        setData(json.data);
        setLastSync(new Date().toLocaleTimeString());
      } else {
        setError(json.error || 'API error');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const fleet     = data?.fleet_overview || {};
  const total     = Number(fleet.total     || 0);
  const online    = Number(fleet.online    || 0);
  const offline   = Number(fleet.offline   || 0);
  const pingOk    = Number(fleet.ping_ok   || 0);
  const pingFail  = Number(fleet.ping_failed || 0);
  const loginFail = Number(fleet.login_failed || 0);
  const netOk     = Number(fleet.network_working || 0);
  const netFail   = Number(fleet.network_not_working || 0);
  const onlinePct = total ? ((online / total) * 100).toFixed(1) : 0;

  // Stacked bar data for login-by-brand
  const loginBrandData = (data?.login_by_brand || []).map(r => ({
    name: r.brand,
    'Login OK':     Number(r.login_ok),
    'Login Failed': Number(r.login_failed),
  }));

  // Fleet health donut data
  const fleetDonut = [
    { name: 'Online',  value: online  },
    { name: 'Offline', value: offline },
  ];

  // Network donut
  const netDonut = (data?.network_status || []).map((r, i) => ({
    name: r.name,
    value: Number(r.value || 0),
    fill: NETWORK_COLORS[r.name] || PIE_COLORS[i % PIE_COLORS.length]
  }));

  // HDD Status data normalized with number values
  const hddStatusData = (data?.hdd_status || []).map((r, i) => ({
    name: r.name,
    value: Number(r.value || 0),
    fill: HDD_COLORS[r.name] || PIE_COLORS[i % PIE_COLORS.length]
  }));

  // Footage Status data normalized with number values
  const footageStatusData = (data?.footage_status || []).map((r, i) => ({
    name: r.name,
    value: Number(r.value || 0),
    fill: FOOTAGE_COLORS[r.name] || PIE_COLORS[i % PIE_COLORS.length]
  }));

  // Skeleton
  if (loading && !data) {
    return (
      <div className={`min-h-screen ${bg} ${text} p-6 flex flex-col gap-6`}>
        <div className={`h-10 w-72 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-24 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-72 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} ${text} p-4 sm:p-6 lg:p-8 space-y-6`}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Fleet Analytics</h1>
            <p className={`text-xs ${sub}`}>
              Live telemetry across {total.toLocaleString()} DVR sites
              {lastSync && <span className="ml-2 opacity-60">· Synced {lastSync}</span>}
            </p>
          </div>
        </div>
        <button
          onClick={loadData} disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-sm font-medium transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Error banner ────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── KPI Stat Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total DVR Sites"      value={total}     icon={Server}       color="#3b82f6" sub="live=Y"               isDark={isDark} />
        <StatCard label="Online Today"         value={online}    icon={Wifi}         color="#10b981" sub={`${onlinePct}% online`} isDark={isDark} />
        <StatCard label="Offline"              value={offline}   icon={WifiOff}      color="#ef4444" sub="Not reachable"         isDark={isDark} />
        <StatCard label="Ping OK"              value={pingOk}    icon={CheckCircle2} color="#06b6d4" sub="ICMP reachable"        isDark={isDark} />
        <StatCard label="Ping Failed"          value={pingFail}  icon={XCircle}      color="#f97316" sub="ICMP unreachable"      isDark={isDark} />
        <StatCard label="Login Failed DVRs"    value={loginFail} icon={AlertTriangle} color="#f59e0b" sub="login_status=1"       isDark={isDark} />
        <StatCard label="Network Working"      value={netOk}     icon={Activity}     color="#8b5cf6" sub="network_status=working" isDark={isDark} />
        <StatCard label="Footage Records"      value={1000}      icon={Download}     color="#ec4899" sub="PRESENT / NO_REC / DOWN" isDark={isDark} />
      </div>

      {/* ── Row 1: Fleet Health Donut + DVR Brand Bar ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Fleet Online/Offline Donut */}
        <ChartCard title="Fleet Reachability" icon={TrendingUp} iconColor="#10b981" isDark={isDark}
          badge={`${onlinePct}% Online`}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={fleetDonut} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                dataKey="value" labelLine={false} label={renderPieLabel}>
                {fleetDonut.map((entry, i) => (
                  <Cell key={i} fill={i === 0 ? '#10b981' : '#ef4444'} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className={`rounded-xl p-3 text-center ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
              <div className="text-xl font-black text-emerald-400">{online.toLocaleString()}</div>
              <div className="text-xs font-semibold text-emerald-500 mt-0.5">Online</div>
            </div>
            <div className={`rounded-xl p-3 text-center ${isDark ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-200'}`}>
              <div className="text-xl font-black text-rose-400">{offline.toLocaleString()}</div>
              <div className="text-xs font-semibold text-rose-500 mt-0.5">Offline</div>
            </div>
          </div>
        </ChartCard>

        {/* DVR Brand Distribution Bar */}
        <ChartCard title="DVR Brand Distribution" icon={Server} iconColor="#3b82f6" isDark={isDark}
          badge={`${(data?.dvr_brands || []).length} brands`}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.dvr_brands || []} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="value" name="Sites" radius={[6, 6, 0, 0]}>
                {(data?.dvr_brands || []).map((_, i) => (
                  <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Row 2: Network Status Pie + HDD Status Bars ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Network Status Pie */}
        <ChartCard title="Network Status" icon={Wifi} iconColor="#8b5cf6" isDark={isDark}
          badge={`${total.toLocaleString()} sites`}>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={netDonut} cx="50%" cy="50%" outerRadius={85}
                  dataKey="value" labelLine={false} label={renderPieLabel}>
                  {netDonut.map((entry, i) => (
                    <Cell key={`net-cell-${i}`} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {netDonut.map((r, i) => (
              <HBar key={i} label={r.name} value={r.value} total={total}
                color={r.fill} isDark={isDark} />
            ))}
          </div>
        </ChartCard>

        {/* HDD Status Breakdown */}
        <ChartCard title="HDD Health Breakdown" icon={HardDrive} iconColor="#f59e0b" isDark={isDark}>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hddStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {hddStatusData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {hddStatusData.map((r, i) => (
              <HBar key={i} label={r.name} value={r.value} total={total}
                color={r.fill} isDark={isDark} />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 3: Login by Brand (stacked bar) + Customers ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Login Status per DVR Brand — Stacked Bar */}
        <ChartCard title="Login Status by DVR Brand" icon={AlertTriangle} iconColor="#f97316" isDark={isDark}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={loginBrandData} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Login OK"     stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Login Failed" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Customers */}
        <ChartCard title="Top Customers by Sites" icon={Users} iconColor="#06b6d4" isDark={isDark}
          badge={`${(data?.customers || []).length} orgs`}>
          <div className="space-y-3 pt-1">
            {(data?.customers || []).map((r, i) => {
              const totalCust = (data?.customers || []).reduce((s, c) => s + Number(c.value), 0);
              return (
                <HBar key={i} label={r.name} value={Number(r.value)} total={totalCust}
                  color={PIE_COLORS[i % PIE_COLORS.length]} isDark={isDark} />
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 4: DVR Log Types Bar + Footage Status ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* DVR Log Event Types */}
        <ChartCard title="DVR Incident Log Types (Top 10)" icon={Layers} iconColor="#ec4899" isDark={isDark}
          badge="dvr_fetched_logs">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.log_types || []} layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fill: axisColor, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fill: axisColor, fontSize: 10 }} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="value" name="Events" radius={[0, 6, 6, 0]}>
                {(data?.log_types || []).map((_, i) => (
                  <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Footage Availability */}
        <ChartCard title="Footage Availability Report" icon={Download} iconColor="#10b981" isDark={isDark}
          badge={`${footageStatusData.reduce((s, c) => s + c.value, 0).toLocaleString()} records`}>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={footageStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {footageStatusData.map((entry, i) => (
                    <Cell key={`footage-cell-${i}`} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-3">
            {footageStatusData.map((r, i) => {
              const totalF = footageStatusData.reduce((s, c) => s + c.value, 0);
              return (
                <HBar key={i} label={r.name.replace(/_/g, ' ')} value={r.value} total={totalF}
                  color={r.fill} isDark={isDark} />
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 5: DVR Brands in Log Events ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4">
        <ChartCard title="DVR Brand Activity in Incident Logs" icon={Activity} iconColor="#8b5cf6" isDark={isDark}
          badge="log events by brand">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.log_brands || []} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="value" name="Log Events" radius={[6, 6, 0, 0]}>
                {(data?.log_brands || []).map((_, i) => (
                  <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

    </div>
  );
}
