import React from 'react';

/**
 * Preloader Component
 * Animated tech-grid spinner overlay with neon pulse
 */
export default function Preloader({ message = 'Loading SAR Dashboard...' }) {
  return (
    <div className="preloader-overlay">
      <div className="relative flex flex-col items-center">
        {/* Radar Spinner Ring */}
        <div className="relative mb-4">
          <div className="preloader-spinner" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-ping" />
          </div>
        </div>

        {/* Brand Label */}
        <div className="text-center">
          <h2 className="text-white font-bold text-sm tracking-wider uppercase font-mono">
            SAR <span className="text-emerald-400">DVR</span> SENTINEL
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">{message}</p>
        </div>
      </div>
    </div>
  );
}
