import React from 'react';
import {
  LayoutGrid,
  CheckCircle2,
  XCircle,
  UserX,
  HardDrive,
  HelpCircle,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ICON_MAP = {
  LayoutGrid,
  CheckCircle2,
  XCircle,
  UserX,
  HardDrive,
  HelpCircle,
  Wifi,
  WifiOff,
  Clock
};

// Dark Mode Theme Styles (Futuristic Cyber Gradients)
const DARK_THEME_STYLES = {
  purple: {
    gradient: 'linear-gradient(135deg, #151829 0%, #0c101b 100%)',
    borderColor: 'rgba(99, 102, 241, 0.25)',
    titleColor: 'text-indigo-300',
    valColor: 'text-white',
    iconBg: 'bg-indigo-500/15 text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/50',
    activeBorder: 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_18px_rgba(99,102,241,0.3)]',
    dotBg: 'bg-indigo-400'
  },
  emerald: {
    gradient: 'linear-gradient(135deg, #0d221c 0%, #091512 100%)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    titleColor: 'text-emerald-400',
    valColor: 'text-emerald-300',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/50',
    activeBorder: 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-neon-green',
    dotBg: 'bg-emerald-400'
  },
  rose: {
    gradient: 'linear-gradient(135deg, #241219 0%, #130a0e 100%)',
    borderColor: 'rgba(244, 63, 94, 0.25)',
    titleColor: 'text-rose-400',
    valColor: 'text-rose-300',
    iconBg: 'bg-rose-500/15 text-rose-400',
    hoverBorder: 'hover:border-rose-500/50',
    activeBorder: 'border-rose-500 ring-1 ring-rose-500/50 shadow-neon-red',
    dotBg: 'bg-rose-500 animate-pulse'
  },
  amber: {
    gradient: 'linear-gradient(135deg, #241a0e 0%, #130f07 100%)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    titleColor: 'text-amber-400',
    valColor: 'text-amber-300',
    iconBg: 'bg-amber-500/15 text-amber-400',
    hoverBorder: 'hover:border-amber-500/50',
    activeBorder: 'border-amber-500 ring-1 ring-amber-500/50 shadow-[0_0_18px_rgba(245,158,11,0.3)]',
    dotBg: 'bg-amber-400'
  },
  yellow: {
    gradient: 'linear-gradient(135deg, #24160b 0%, #140d06 100%)',
    borderColor: 'rgba(249, 115, 22, 0.25)',
    titleColor: 'text-orange-400',
    valColor: 'text-orange-300',
    iconBg: 'bg-orange-500/15 text-orange-400',
    hoverBorder: 'hover:border-orange-500/50',
    activeBorder: 'border-orange-500 ring-1 ring-orange-500/50 shadow-[0_0_18px_rgba(249,115,22,0.3)]',
    dotBg: 'bg-orange-400'
  },
  slate: {
    gradient: 'linear-gradient(135deg, #161e2a 0%, #0d1219 100%)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    titleColor: 'text-slate-400',
    valColor: 'text-slate-200',
    iconBg: 'bg-slate-700/40 text-slate-400',
    hoverBorder: 'hover:border-slate-500',
    activeBorder: 'border-slate-400 ring-1 ring-slate-400/50',
    dotBg: 'bg-slate-400'
  },
  teal: {
    gradient: 'linear-gradient(135deg, #0d2229 0%, #081418 100%)',
    borderColor: 'rgba(6, 182, 212, 0.25)',
    titleColor: 'text-cyan-400',
    valColor: 'text-cyan-300',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    hoverBorder: 'hover:border-cyan-500/50',
    activeBorder: 'border-cyan-500 ring-1 ring-cyan-500/50 shadow-[0_0_18px_rgba(6,182,212,0.3)]',
    dotBg: 'bg-cyan-400'
  },
  red: {
    gradient: 'linear-gradient(135deg, #241219 0%, #130a0e 100%)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
    titleColor: 'text-rose-400',
    valColor: 'text-rose-300',
    iconBg: 'bg-rose-500/15 text-rose-400',
    hoverBorder: 'hover:border-rose-500/50',
    activeBorder: 'border-rose-500 ring-1 ring-rose-500/50 shadow-neon-red',
    dotBg: 'bg-rose-500 animate-pulse'
  },
  blue: {
    gradient: 'linear-gradient(135deg, #0e1e38 0%, #081020 100%)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
    titleColor: 'text-sky-400',
    valColor: 'text-sky-300',
    iconBg: 'bg-sky-500/15 text-sky-400',
    hoverBorder: 'hover:border-sky-500/50',
    activeBorder: 'border-sky-500 ring-1 ring-sky-500/50 shadow-[0_0_18px_rgba(56,189,248,0.3)]',
    dotBg: 'bg-sky-400'
  }
};

// Light Mode Theme Styles (Rich Frosted Colored Gradients - replaces flat white)
const LIGHT_THEME_STYLES = {
  purple: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 45%, #ede9fe 100%)',
    borderColor: '#c7d2fe',
    titleColor: 'text-indigo-800',
    valColor: 'text-indigo-950',
    subColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100/90 text-indigo-700 border border-indigo-200/80',
    hoverBorder: 'hover:border-indigo-400 hover:shadow-md',
    activeBorder: 'border-indigo-600 ring-2 ring-indigo-500/30 shadow-[0_8px_20px_rgba(99,102,241,0.25)]',
    dotBg: 'bg-indigo-600'
  },
  emerald: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 45%, #d1fae5 100%)',
    borderColor: '#a7f3d0',
    titleColor: 'text-emerald-800',
    valColor: 'text-emerald-950',
    subColor: 'text-emerald-700',
    iconBg: 'bg-emerald-100/90 text-emerald-700 border border-emerald-200/80',
    hoverBorder: 'hover:border-emerald-400 hover:shadow-md',
    activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-[0_8px_20px_rgba(16,185,129,0.25)]',
    dotBg: 'bg-emerald-600'
  },
  rose: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 45%, #ffe4e6 100%)',
    borderColor: '#fecdd3',
    titleColor: 'text-rose-800',
    valColor: 'text-rose-950',
    subColor: 'text-rose-700',
    iconBg: 'bg-rose-100/90 text-rose-700 border border-rose-200/80',
    hoverBorder: 'hover:border-rose-400 hover:shadow-md',
    activeBorder: 'border-rose-600 ring-2 ring-rose-500/30 shadow-[0_8px_20px_rgba(244,63,94,0.25)]',
    dotBg: 'bg-rose-600 animate-pulse'
  },
  amber: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 45%, #fef3c7 100%)',
    borderColor: '#fde68a',
    titleColor: 'text-amber-800',
    valColor: 'text-amber-950',
    subColor: 'text-amber-700',
    iconBg: 'bg-amber-100/90 text-amber-700 border border-amber-200/80',
    hoverBorder: 'hover:border-amber-400 hover:shadow-md',
    activeBorder: 'border-amber-600 ring-2 ring-amber-500/30 shadow-[0_8px_20px_rgba(245,158,11,0.25)]',
    dotBg: 'bg-amber-600'
  },
  yellow: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 45%, #fed7aa 100%)',
    borderColor: '#fed7aa',
    titleColor: 'text-orange-800',
    valColor: 'text-orange-950',
    subColor: 'text-orange-700',
    iconBg: 'bg-orange-100/90 text-orange-700 border border-orange-200/80',
    hoverBorder: 'hover:border-orange-400 hover:shadow-md',
    activeBorder: 'border-orange-600 ring-2 ring-orange-500/30 shadow-[0_8px_20px_rgba(249,115,22,0.25)]',
    dotBg: 'bg-orange-600'
  },
  slate: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #e2e8f0 100%)',
    borderColor: '#cbd5e1',
    titleColor: 'text-slate-700',
    valColor: 'text-slate-900',
    subColor: 'text-slate-600',
    iconBg: 'bg-slate-200/90 text-slate-700 border border-slate-300/80',
    hoverBorder: 'hover:border-slate-400 hover:shadow-md',
    activeBorder: 'border-slate-600 ring-2 ring-slate-500/30 shadow-[0_8px_20px_rgba(100,116,139,0.2)]',
    dotBg: 'bg-slate-500'
  },
  teal: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #ecfeff 45%, #cffafe 100%)',
    borderColor: '#a5f3fc',
    titleColor: 'text-cyan-800',
    valColor: 'text-cyan-950',
    subColor: 'text-cyan-700',
    iconBg: 'bg-cyan-100/90 text-cyan-700 border border-cyan-200/80',
    hoverBorder: 'hover:border-cyan-400 hover:shadow-md',
    activeBorder: 'border-cyan-600 ring-2 ring-cyan-500/30 shadow-[0_8px_20px_rgba(6,182,212,0.25)]',
    dotBg: 'bg-cyan-600'
  },
  red: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 45%, #fee2e2 100%)',
    borderColor: '#fecdd3',
    titleColor: 'text-rose-800',
    valColor: 'text-rose-950',
    subColor: 'text-rose-700',
    iconBg: 'bg-rose-100/90 text-rose-700 border border-rose-200/80',
    hoverBorder: 'hover:border-rose-400 hover:shadow-md',
    activeBorder: 'border-rose-600 ring-2 ring-rose-500/30 shadow-[0_8px_20px_rgba(239,68,68,0.25)]',
    dotBg: 'bg-rose-600 animate-pulse'
  },
  blue: {
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 45%, #e0f2fe 100%)',
    borderColor: '#bae6fd',
    titleColor: 'text-sky-800',
    valColor: 'text-sky-950',
    subColor: 'text-sky-700',
    iconBg: 'bg-sky-100/90 text-sky-700 border border-sky-200/80',
    hoverBorder: 'hover:border-sky-400 hover:shadow-md',
    activeBorder: 'border-sky-600 ring-2 ring-sky-500/30 shadow-[0_8px_20px_rgba(14,165,233,0.25)]',
    dotBg: 'bg-sky-600'
  }
};

/**
 * StatCard Component
 * Features vibrant themed gradients for light mode and futuristic cyber gradients for dark mode
 */
export default function StatCard({ item, isActive, onClick, isLoading = false }) {
  const { isDark } = useTheme();
  const title = item.title || item.label || '';
  const value = item.value || item.count || '';
  const iconKey = item.icon || 'LayoutGrid';
  const IconComponent = ICON_MAP[iconKey] || LayoutGrid;
  const themeKey = item.theme || item.color || 'purple';

  const theme = isDark
    ? (DARK_THEME_STYLES[themeKey] || DARK_THEME_STYLES.purple)
    : (LIGHT_THEME_STYLES[themeKey] || LIGHT_THEME_STYLES.purple);

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: theme.gradient,
        borderColor: isActive ? undefined : theme.borderColor
      }}
      className={`glass-card p-3.5 rounded-2xl flex flex-col justify-between border text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
        theme.hoverBorder
      } ${isActive ? theme.activeBorder : ''}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2 w-full">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${theme.titleColor}`}>
          {title}
        </span>
        <span className={`p-1 rounded-lg ${theme.iconBg}`}>
          <IconComponent className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* Metric Count & Percentage */}
      <div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className={`text-2xl font-bold font-mono tracking-tight ${theme.valColor} ${isLoading ? 'opacity-50 animate-pulse' : ''}`}>
            {value}
          </span>
          {item.percentage && (
            <span
              className={`text-xs font-semibold font-mono ${
                isDark ? 'opacity-90 text-slate-300' : 'text-slate-600 font-bold'
              }`}
            >
              {item.percentage}
            </span>
          )}
        </div>

        {/* Subtext with dot indicator if applicable */}
        {item.subtext && (
          <p
            className={`text-[10px] mt-0.5 font-medium flex items-center gap-1.5 ${
              isDark ? 'text-slate-400' : (theme.subColor || 'text-slate-600')
            }`}
          >
            {theme.dotBg && <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />}
            <span>{item.subtext}</span>
          </p>
        )}
      </div>
    </button>
  );
}
