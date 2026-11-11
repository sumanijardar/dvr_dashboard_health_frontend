import React, { useState } from 'react';
import {
  Video,
  Play,
  RotateCw,
  Zap,
  Activity,
  Maximize2
} from 'lucide-react';

export default function CentralVisualAnalytics({ onOpenCmd, firstSite }) {
  const [activeMetricTab, setActiveMetricTab] = useState('uptime');
  const [isPlaying, setIsPlaying] = useState(true);

  const bars = [
    { time: '00:00', height: '40%', active: false },
    { time: '02:00', height: '55%', active: false },
    { time: '04:00', height: '48%', active: false },
    { time: '06:00', height: '65%', active: false },
    { time: '08:00', height: '70%', active: false },
    { time: '10:00', height: '62%', active: false },
    { time: '12:00', height: '88%', active: true, peak: '308 Active (Peak)' },
    { time: '14:00', height: '58%', active: false },
    { time: '16:00', height: '50%', active: false },
    { time: 'Now', height: '44%', active: false }
  ];

  return (
    <section
      aria-label="Central Visual Analytics"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Fleet Health Trend Chart Panel (2 Cols) */}
      <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col justify-between border border-slate-800/90 shadow-card-glass">
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <span>Fleet Availability & Throughput</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">
                Total verified streams & ping response status over the last 12 hours
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700">
                Interval: 1 hr
              </span>
              <div className="flex items-center gap-1.5 bg-[#0a0f15] p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMetricTab('uptime')}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${activeMetricTab === 'uptime'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Uptime
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetricTab('hdd')}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${activeMetricTab === 'hdd'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  HDD Health
                </button>
              </div>
            </div>
          </div>

          {/* Bar Visualizer */}
          <div className="py-4">
            <div className="h-44 flex items-end justify-between gap-2.5 pt-6 px-2">
              {bars.map((bar, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end relative group"
                >
                  {bar.active && (
                    <div className="absolute -top-7 px-2 py-0.5 rounded bg-emerald-400 text-black font-mono font-bold text-[10px] shadow-neon-green whitespace-nowrap z-10 animate-bounce">
                      {bar.peak}
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${bar.active
                        ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-emerald-300 shadow-neon-green'
                        : 'bg-slate-800/60 group-hover:bg-slate-700'
                      }`}
                    style={{ height: bar.height }}
                  />
                  <span
                    className={`text-[10px] font-mono ${bar.active
                        ? 'font-bold text-emerald-400'
                        : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                  >
                    {bar.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sub Summary */}
        <div className="pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span>Online Feeds (308)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
              <span>Offline / Standby (831)</span>
            </span>
          </div>
          <span className="font-mono text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            System Reliability Index: 88.4%
          </span>
        </div>
      </div>

      {/* Right Camera Quick Peek & Hardware Diagnostics */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 flex flex-col justify-between shadow-card-glass">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Video Stream
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              CH-01 • RTSP
            </span>
          </div>

          {/* Stream Simulation Preview Box */}
          <div className="relative w-full h-36 rounded-xl bg-[#090d12] border border-slate-800 overflow-hidden flex flex-col justify-between p-3 group">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

            {/* Top Overlay */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>LIVE 1080P</span>
              </span>
              <span className="text-slate-300">CAM-ATM-VELLORE-01</span>
            </div>

            {/* Center Play Indicator */}
            <div className="relative z-10 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-full bg-black/60 border border-slate-700 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                title="Toggle Stream"
              >
                <Play className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              </button>
            </div>

            {/* Bottom Overlay */}
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>IP: 172.17.15.189:81</span>
              <span className="text-slate-300">FPS: 25.0 | 2.4 Mb/s</span>
            </div>
          </div>

          {/* Quick Hardware Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="p-2 rounded-xl bg-[#101720] border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Encoder Model</span>
              <span className="font-bold text-white text-xs">Hikvision Turbo-HD</span>
            </div>
            <div className="p-2 rounded-xl bg-[#101720] border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Active Firmware</span>
              <span className="font-mono text-white text-[11px]">v4.21.092_build</span>
            </div>
          </div>
        </div>

        {/* Instant Action Buttons */}
        <div className="pt-3 border-t border-slate-800/70 flex gap-2">
          {/* <button
            type="button"
            onClick={() => onOpenCmd && firstSite && onOpenCmd(firstSite)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ping Host</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenCmd && firstSite && onOpenCmd(firstSite)}
            className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Soft Reboot</span>
          </button> */}
        </div>
      </div>
    </section>
  );
}
