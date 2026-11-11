import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#070b10] border-t border-slate-800/80 py-3 px-6 text-xs text-slate-500 mt-auto">
      <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">SAR DVR Monitoring System</span>
          <span>•</span>
          <span className="text-slate-500">Security Operations Command </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
          <span>|</span>
          <span className="text-emerald-400 font-medium">● Real-time Sync Active</span>
        </div>
      </div>
    </footer>
  );
}
