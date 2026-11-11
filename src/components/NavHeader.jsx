import React from 'react';

/**
 * NavHeader Component
 * Brand Logo & Console Tag
 */
export default function NavHeader({ isCollapsed = false, isMobile = false }) {
  return (
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
      {(!isCollapsed || isMobile) && (
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
  );
}
