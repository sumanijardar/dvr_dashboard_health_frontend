import React, { useState } from 'react';
import {
  RefreshCw,
  Terminal,
  Zap,
  Copy,
  Monitor,
  Eye,
  EyeOff,
  Check,
  HardDrive,
  Calendar,
  Clock,
  Wifi,
  MapPin,
  Hourglass
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DARK_BANK_STYLES = {
  SBI: 'bg-sky-950/60 text-sky-400 border-sky-800/50',
  Axis: 'bg-purple-950/60 text-purple-400 border-purple-800/50',
  HDFC: 'bg-blue-950/60 text-blue-400 border-blue-800/50',
  HDFC_MS: 'bg-blue-950/60 text-blue-400 border-blue-800/50',
  ICICI: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
  WLA: 'bg-indigo-950/60 text-indigo-400 border-indigo-800/50',
  PNB: 'bg-amber-950/60 text-amber-400 border-amber-800/50'
};

const LIGHT_BANK_STYLES = {
  SBI: 'bg-sky-100 text-sky-950 border-sky-300 font-extrabold',
  Axis: 'bg-purple-100 text-purple-950 border-purple-300 font-extrabold',
  HDFC: 'bg-blue-100 text-blue-950 border-blue-300 font-extrabold',
  HDFC_MS: 'bg-blue-100 text-blue-950 border-blue-300 font-extrabold',
  ICICI: 'bg-rose-100 text-rose-950 border-rose-300 font-extrabold',
  WLA: 'bg-indigo-100 text-indigo-950 border-indigo-300 font-extrabold',
  PNB: 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold'
};

export default function DvrTable({
  sites,
  onOpenCmd,
  onRefreshSite,
  refreshingSiteId
}) {
  const { isDark } = useTheme();
  const [copiedIp, setCopiedIp] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const handleCopy = (ip) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 1500);
  };

  const togglePassword = (id) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCamBadge = (val) => {
    if (!val || val === 'null' || val === 'N/A') {
      return <span className={isDark ? 'text-slate-600 font-mono text-[10px]' : 'text-slate-400 font-mono text-[10px]'}>-</span>;
    }
    const isWorking = String(val).toLowerCase().includes('working') && !String(val).toLowerCase().includes('not');
    if (isDark) {
      return (
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${isWorking
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
        >
          <span className={`w-1 h-1 rounded-full mr-1 ${isWorking ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          {val}
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border shadow-2xs ${isWorking
          ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
          : 'bg-rose-100 text-rose-950 border-rose-400'
          }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isWorking ? 'bg-emerald-600' : 'bg-rose-600'}`} />
        {val}
      </span>
    );
  };

  const renderHddBadge = (val) => {
    if (!val || val === 'null' || val === 'N/A') {
      return <span className={isDark ? 'text-slate-600 font-mono text-[10px]' : 'text-slate-400 font-mono text-[10px]'}>-</span>;
    }
    const isOk = String(val).toLowerCase() === 'working' || String(val).toLowerCase() === 'ok';
    if (isDark) {
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${isOk
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
        >
          <HardDrive className="w-3 h-3 mr-1 opacity-70" />
          {val}
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border shadow-2xs ${isOk
          ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
          : 'bg-amber-100 text-amber-950 border-amber-400'
          }`}
      >
        <HardDrive className="w-3 h-3 mr-1 opacity-80" />
        {val}
      </span>
    );
  };

  if (!sites || sites.length === 0) {
    return (
      <div className={`p-12 text-center text-sm ${isDark ? 'text-slate-500 bg-[#0a0f16]' : 'text-slate-600 bg-white'}`}>
        No DVR sites match the current filter or search criteria.
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto transition-colors duration-200 ${isDark ? 'bg-[#0a0f16]' : 'bg-white'}`}>
      <table className="w-full text-left text-xs">
        {/* Table Header */}
        <thead
          className={`text-[11px] uppercase tracking-wider font-semibold border-b select-none sticky top-0 z-10 whitespace-nowrap ${isDark
            ? 'bg-[#0b1016] text-slate-300 border-slate-800'
            : 'bg-slate-100 text-slate-900 font-extrabold border-slate-300 shadow-2xs'
            }`}
        >
          <tr>
            <th
              className={`py-3.5 px-3.5 sticky left-0 z-20 ${isDark
                ? 'bg-[#0b1016] shadow-[1px_0_0_0_#1e293b]'
                : 'bg-slate-100 shadow-[1px_0_0_0_#cbd5e1] text-slate-900 font-extrabold'
                }`}
              scope="col"
            >
              Actions
            </th>
            <th className="py-3.5 px-3.5" scope="col">ATM ID</th>
            <th className="py-3.5 px-3.5" scope="col">Unique ID</th>
            <th className="py-3.5 px-3.5" scope="col">Customer</th>
            <th className="py-3.5 px-3.5" scope="col">Bank</th>
            <th className="py-3.5 px-3.5" scope="col">IP Address</th>
            <th className="py-3.5 px-3 text-center" scope="col">Port</th>
            <th className="py-3.5 px-3.5" scope="col">Username</th>
            <th className="py-3.5 px-3.5" scope="col">Password</th>
            <th className="py-3.5 px-3.5" scope="col">DVR Name</th>
            <th className="py-3.5 px-3.5 text-center" scope="col">DVR Status</th>
            <th className="py-3.5 px-3 text-center" scope="col">Live</th>
            <th className="py-3.5 px-3 text-center" scope="col">Ping (Status)</th>
            <th className="py-3.5 px-3 text-center" scope="col">Login Status</th>
            <th className="py-3.5 px-3 text-center" scope="col">CAM 1</th>
            <th className="py-3.5 px-3 text-center" scope="col">CAM 2</th>
            <th className="py-3.5 px-3 text-center" scope="col">CAM 3</th>
            <th className="py-3.5 px-3 text-center" scope="col">CAM 4</th>
            <th className="py-3.5 px-3 text-center" scope="col">CAM 5</th>
            <th className="py-3.5 px-3.5" scope="col">HDD</th>
            <th className="py-3.5 px-3.5" scope="col">Capacity / Free</th>
            <th className="py-3.5 px-3.5" scope="col">Recording From</th>
            <th className="py-3.5 px-3.5" scope="col">Recording To</th>
            <th className="py-3.5 px-3.5 text-center" scope="col">Aging (Days)</th>
            <th className="py-3.5 px-3.5" scope="col">DVR Time</th>
            <th className="py-3.5 px-3.5" scope="col">Time Diff</th>
            <th className="py-3.5 px-3.5" scope="col">Network Status</th>
            <th className="py-3.5 px-3.5" scope="col">Last Communication</th>
            <th className="py-3.5 px-3.5" scope="col">CDate</th>
            <th className="py-3.5 px-4 min-w-[280px]" scope="col">Address</th>
            <th className="py-3.5 px-3.5" scope="col">City</th>
            <th className="py-3.5 px-3.5" scope="col">State</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className={`divide-y ${isDark ? 'divide-slate-800/60 font-medium' : 'divide-slate-200 font-semibold'}`}>
          {sites.map((site) => {
            const isPasswordShown = showPasswords[site.id];
            const bankClass = isDark
              ? (DARK_BANK_STYLES[site.bank] || 'bg-slate-800 text-slate-300 border-slate-700')
              : (LIGHT_BANK_STYLES[site.bank] || 'bg-slate-100 text-slate-950 border-slate-300 font-extrabold');

            const isLive = String(site.live || 'Y').toUpperCase() === 'Y';
            const isPingSuccess = String(site.raw_status || (site.pingStatus === 'OK' ? '1' : '0')) === '1';
            const isLoginSuccess = String(site.login_status) === '0';

            // Calculate or read aging days
            let agingText = site.recording_aging || '-';
            if ((!agingText || agingText === '-') && site.recording_from && site.recording_to) {
              try {
                const d1 = new Date(String(site.recording_from).split(' ')[0]);
                const d2 = new Date(String(site.recording_to).split(' ')[0]);
                if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
                  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
                  if (diff >= 0) agingText = `${diff} Days`;
                }
              } catch {
                agingText = '-';
              }
            }

            return (
              <tr
                key={site.id}
                className={`transition-colors group ${isDark
                  ? `hover:bg-slate-800/40 ${site.status === 'ONLINE' ? 'bg-emerald-500/[0.02]' : ''}`
                  : `hover:bg-slate-50/90 text-slate-900 ${site.status === 'ONLINE' ? 'bg-emerald-50/30' : 'bg-white'}`
                  }`}
              >
                {/* 1. Actions Column (Sticky) */}
                <td
                  className={`py-3 px-3.5 sticky left-0 transition-colors z-10 whitespace-nowrap ${isDark
                    ? 'bg-[#0a0f16] group-hover:bg-[#121922] shadow-[1px_0_0_0_#1e293b]'
                    : 'bg-white group-hover:bg-slate-50 shadow-[1px_0_0_0_#cbd5e1]'
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={refreshingSiteId === site.id}
                      onClick={() => onRefreshSite(site)}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        isDark
                          ? 'text-slate-400 hover:bg-slate-800 hover:text-emerald-400'
                          : 'text-slate-700 hover:bg-slate-200 hover:text-emerald-600'
                      } ${refreshingSiteId === site.id ? 'opacity-75 pointer-events-none' : ''}`}
                      title={
                        refreshingSiteId === site.id
                          ? 'Polling DVR live status...'
                          : `Poll & Refresh (${site.refresh_url || site.refreshUrl || 'DVR'})`
                      }
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          refreshingSiteId === site.id ? 'animate-spin text-emerald-400' : ''
                        }`}
                      />
                    </button>
                  </div>
                </td>

                {/* 2. ATM ID */}
                <td className={`py-3 px-3.5 font-mono whitespace-nowrap ${isDark ? 'font-bold text-white' : 'font-black text-slate-950 text-xs tracking-tight'}`}>
                  {site.atmid || site.atmId}
                </td>

                {/* 3. Unique ID */}
                <td className="py-3 px-3.5 font-mono whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${isDark ? 'bg-slate-800/70 border-slate-700/80 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-950 font-extrabold'
                    }`}>
                    {site.unique_id || site.uniqueId || '-'}
                  </span>
                </td>

                {/* 4. Customer */}
                <td className={`py-3 px-3.5 whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                  {site.customer}
                </td>

                {/* 5. Bank */}
                <td className="py-3 px-3.5 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border shadow-2xs ${bankClass}`}>
                    {site.bank}
                  </span>
                </td>

                {/* 6. IP Address */}
                <td className={`py-3 px-3.5 font-mono whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                  <div className="flex items-center gap-1.5">
                    <span>{site.IPAddress || site.ipAddress}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(site.IPAddress || site.ipAddress)}
                      className={`p-0.5 rounded transition cursor-pointer ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                        }`}
                      title="Copy IP"
                    >
                      {copiedIp === (site.IPAddress || site.ipAddress) ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </td>

                {/* 7. Port */}
                <td className={`py-3 px-3 font-mono text-center whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-950 font-bold'}`}>
                  {site.port}
                </td>

                {/* 8. Username */}
                <td className={`py-3 px-3.5 font-mono whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                  {site.UserName || site.username}
                </td>

                {/* 9. Password */}
                <td className={`py-3 px-3.5 font-mono whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-950 font-bold'}`}>
                  <div className="flex items-center gap-1.5">
                    <span>{isPasswordShown ? (site.Password || site.password) : '••••••••'}</span>
                    <button
                      type="button"
                      onClick={() => togglePassword(site.id)}
                      className={`p-0.5 rounded transition cursor-pointer ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
                        }`}
                    >
                      {isPasswordShown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </td>

                {/* 10. DVR Name */}
                <td className="py-3 px-3.5 whitespace-nowrap">
                  <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                    <Monitor className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                    <span>{site.dvrname || site.dvrName}</span>
                  </div>
                </td>

                {/* 11. DVR Status (ONLINE / OFFLINE) */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                  {site.status === 'ONLINE' ? (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase border ${isDark
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold shadow-neon-green'
                        : 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black shadow-xs'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                      ONLINE
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase border ${isDark
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold'
                        : 'bg-rose-100 text-rose-950 border-rose-400 font-black shadow-xs'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${isDark ? 'bg-rose-500' : 'bg-rose-600'}`} />
                      OFFLINE
                    </span>
                  )}
                </td>

                {/* 12. Live */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border ${isLive
                      ? isDark
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                        : 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black'
                      : isDark
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold'
                        : 'bg-rose-100 text-rose-950 border-rose-400 font-black'
                      }`}
                  >
                    {site.live || 'Y'}
                  </span>
                </td>

                {/* 13. Ping Status */}
                <td className="py-3 px-3 text-center font-mono whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border ${isPingSuccess
                      ? isDark
                        ? 'bg-teal-500/15 text-teal-300 border-teal-500/30 font-semibold'
                        : 'bg-teal-100 text-teal-950 border-teal-400 font-black'
                      : isDark
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold'
                        : 'bg-rose-100 text-rose-950 border-rose-400 font-black'
                      }`}
                  >
                    {isPingSuccess ? 'OK (1)' : 'FAIL (0)'}
                  </span>
                </td>

                {/* 14. Login Status */}
                <td className="py-3 px-3 text-center font-mono whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] border ${isLoginSuccess
                      ? isDark
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold'
                        : 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black'
                      : isDark
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-semibold'
                        : 'bg-amber-100 text-amber-950 border-amber-400 font-black'
                      }`}
                  >
                    {isLoginSuccess ? 'Success (0)' : 'Failed (1)'}
                  </span>
                </td>

                {/* 15-19. Camera Channels 1-5 */}
                <td className="py-3 px-3 text-center whitespace-nowrap">{renderCamBadge(site.cam1)}</td>
                <td className="py-3 px-3 text-center whitespace-nowrap">{renderCamBadge(site.cam2)}</td>
                <td className="py-3 px-3 text-center whitespace-nowrap">{renderCamBadge(site.cam3)}</td>
                <td className="py-3 px-3 text-center whitespace-nowrap">{renderCamBadge(site.cam4)}</td>
                <td className="py-3 px-3 text-center whitespace-nowrap">{renderCamBadge(site.cam5)}</td>

                {/* 20. HDD */}
                <td className="py-3 px-3.5 whitespace-nowrap">{renderHddBadge(site.hdd)}</td>

                {/* 21. Capacity / Free */}
                <td className="py-3 px-3.5 font-mono text-[11px] whitespace-nowrap">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-950 font-black'}>
                    {site.capacity || '0'}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-700 font-bold'}`}>
                    {' '}/ {site.freespace || '0'} Free
                  </span>
                </td>

                {/* 22. Recording From */}
                <td className={`py-3 px-3.5 font-mono text-[11px] whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-600'}`} />
                    <span>{site.recording_from || '-'}</span>
                  </div>
                </td>

                {/* 23. Recording To */}
                <td className={`py-3 px-3.5 font-mono text-[11px] whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-600'}`} />
                    <span>{site.recording_to || '-'}</span>
                  </div>
                </td>

                {/* 24. Recording Aging (Days) */}
                <td className="py-3 px-3.5 text-center whitespace-nowrap font-mono">
                  {agingText !== '-' ? (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border ${isDark
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 font-bold'
                        : 'bg-indigo-100 text-indigo-950 border-indigo-300 font-black shadow-2xs'
                        }`}
                    >
                      <Hourglass className={`w-3 h-3 mr-1 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`} />
                      {agingText}
                    </span>
                  ) : (
                    <span className={isDark ? 'text-slate-600 text-[11px]' : 'text-slate-400 font-bold text-[11px]'}>-</span>
                  )}
                </td>

                {/* 25. DVR Time */}
                <td className={`py-3 px-3.5 font-mono text-[11px] whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                  <div className="flex items-center gap-1">
                    <Clock className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-600'}`} />
                    <span>{site.dvr_time || '-'}</span>
                  </div>
                </td>

                {/* 26. Time Diff */}
                <td className="py-3 px-3.5 font-mono text-[11px] whitespace-nowrap">
                  {site.time_diff && site.time_diff !== '-' && site.time_diff !== '00:00:00' && site.time_diff !== '0' && site.time_diff !== 'N/A' && site.time_diff !== 'null' ? (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border shadow-2xs ${isDark
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        : 'bg-sky-100 text-sky-950 border-sky-300'
                        }`}
                    >
                      <Clock className={`w-3 h-3 mr-1 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
                      {site.time_diff}
                    </span>
                  ) : (
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400 font-bold'}>
                      {site.time_diff || '-'}
                    </span>
                  )}
                </td>

                {/* 27. Network Status */}
                <td className="py-3 px-3.5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span
                      className={`inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[10px] border ${String(site.network_status).toLowerCase() === 'working'
                        ? isDark
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-semibold'
                          : 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold'
                        : isDark
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold'
                          : 'bg-rose-100 text-rose-950 border-rose-300 font-bold'
                        }`}
                    >
                      <Wifi className="w-2.5 h-2.5 mr-1" />
                      {site.network_status || '-'}
                    </span>
                    {site.network_status_dt && site.network_status_dt !== 'null' && (
                      <span className={`text-[9px] font-mono mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-700 font-bold'}`}>
                        {site.network_status_dt}
                      </span>
                    )}
                  </div>
                </td>

                {/* 28. Last Communication */}
                <td className={`py-3 px-3.5 font-mono text-[11px] whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                  {site.last_communication || '-'}
                </td>

                {/* 29. CDate */}
                <td className={`py-3 px-3.5 font-mono text-[11px] whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-950 font-bold'}`}>
                  {site.cdate || '-'}
                </td>

                {/* 30. Full Address (Clean, wrap-friendly, high contrast) */}
                <td className={`py-3 px-4 min-w-[280px] max-w-md whitespace-normal break-words text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'
                  }`}>
                  <div className="flex items-start gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-600'}`} />
                    <span>{site.address || site.location || '-'}</span>
                  </div>
                </td>

                {/* 31. City */}
                <td className={`py-3 px-3.5 font-medium whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-950 font-bold'}`}>
                  {site.city || '-'}
                </td>

                {/* 32. State */}
                <td className={`py-3 px-3.5 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-900 font-bold'}`}>
                  {site.state || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
