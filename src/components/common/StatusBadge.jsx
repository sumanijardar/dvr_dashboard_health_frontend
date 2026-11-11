import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

/**
 * StatusBadge Component
 * DRY component for rendering consistent status indicators across tables, cards, and modals.
 */
export default function StatusBadge({ status, type = 'dvr' }) {
  const norm = (status || '').toUpperCase();

  if (type === 'dvr') {
    switch (norm) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
            <CheckCircle2 className="w-3 h-3" />
            <span>ONLINE</span>
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fef2f2] text-[#e11d48] border border-[#fecdd3]">
            <XCircle className="w-3 h-3" />
            <span>OFFLINE</span>
          </span>
        );
      case 'N/A':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            <span>N/A</span>
          </span>
        );
    }
  }

  // Network / Ping badge
  if (type === 'ping') {
    return norm === 'OK' ? (
      <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Ping OK</span>
      </span>
    ) : (
      <span className="text-rose-600 text-xs font-semibold flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        <span>Ping Fail</span>
      </span>
    );
  }

  // Storage / HDD badge
  if (type === 'hdd') {
    return norm === 'OK' ? (
      <span className="text-emerald-700 bg-emerald-50 text-[10px] px-1.5 py-0.5 rounded font-mono">
        SMART: OK
      </span>
    ) : (
      <span className="text-amber-700 bg-amber-50 text-[10px] px-1.5 py-0.5 rounded font-mono border border-amber-200">
        HDD ISSUES
      </span>
    );
  }

  return <span>{status}</span>;
}
