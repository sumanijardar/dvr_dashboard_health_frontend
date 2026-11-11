import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Server,
  Activity,
  HardDrive,
  Wifi,
  Clock,
  Shield,
  Trash2
} from 'lucide-react';
import { DVR_COMMAND_PRESETS } from '../../data/mockDvrData';

/**
 * DvrCmdModal Component
 * Reusable Remote Command Runner & Diagnostic Console
 * Fully responsive on mobile, tablet, and desktop
 */
export default function DvrCmdModal({ site, isOpen, onClose }) {
  const [customCmd, setCustomCmd] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [copied, setCopied] = useState(false);
  const consoleBottomRef = useRef(null);

  // Initialize terminal when modal opens for a site
  useEffect(() => {
    if (isOpen && site) {
      setLogs([
        {
          type: 'system',
          text: `[SYSTEM] Connected to Remote DVR Session: ${site.atmId} (${site.ipAddress}:${site.port})`,
          timestamp: new Date().toLocaleTimeString()
        },
        {
          type: 'info',
          text: `[INFO] Hardware: ${site.dvrName} | Firmware: ${site.firmware} | Channels: ${site.channels}`,
          timestamp: new Date().toLocaleTimeString()
        },
        {
          type: 'info',
          text: `[INFO] Type a command or select a preset below to execute.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      setCustomCmd('');
    }
  }, [isOpen, site]);

  // Auto-scroll terminal
  useEffect(() => {
    consoleBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen || !site) return null;

  // Execute a command
  const handleExecute = (commandString) => {
    if (!commandString.trim() || isExecuting) return;

    const time = new Date().toLocaleTimeString();
    setIsExecuting(true);

    setLogs((prev) => [
      ...prev,
      {
        type: 'cmd',
        text: `admin@${site.ipAddress}:~$ ${commandString}`,
        timestamp: time
      }
    ]);

    setTimeout(() => {
      let outputLines = [];

      if (commandString.includes('ping')) {
        outputLines = [
          `PING ${site.ipAddress} (${site.ipAddress}) 56(84) bytes of data.`,
          `64 bytes from ${site.ipAddress}: icmp_seq=1 ttl=54 time=18.4 ms`,
          `64 bytes from ${site.ipAddress}: icmp_seq=2 ttl=54 time=19.1 ms`,
          `64 bytes from ${site.ipAddress}: icmp_seq=3 ttl=54 time=18.8 ms`,
          `--- ${site.ipAddress} ping statistics ---`,
          `3 packets transmitted, 3 received, 0% packet loss, avg 18.7ms`
        ];
      } else if (commandString.includes('--reboot')) {
        outputLines = [
          `[AUTH] Authenticating session user: admin... [OK]`,
          `[ACTION] Sending ACPI power reset sequence to DVR mainboard...`,
          `[SYSTEM] System going down for reboot NOW!`,
          `[RECONNECT] DVR reboot packet dispatched. Estimated reboot time: 45s.`
        ];
      } else if (commandString.includes('--get-channels')) {
        outputLines = [
          `[CHANNELS] Polling camera video feeds (Max: ${site.channels}):`,
          `  -> CH01: ONLINE | 1920x1080 @ 25fps | Bitrate: 4096kbps`,
          `  -> CH02: ONLINE | 1920x1080 @ 25fps | Bitrate: 3980kbps`,
          `  -> CH03: ONLINE | 1920x1080 @ 25fps | Bitrate: 4120kbps`,
          `  -> CH04: STANDBY | No video signal on port BNC-4`,
          `[OK] 3 active feeds streaming.`
        ];
      } else if (commandString.includes('smartctl')) {
        outputLines = [
          `=== START OF READ SMART DATA SECTION ===`,
          `SMART overall-health test result: ${site.hddStatus === 'OK' ? 'PASSED' : 'WARNING'}`,
          `Reallocated_Sector_Ct: ${site.hddStatus === 'OK' ? '0' : '48 (Bad Sectors detected)'}`,
          `Temperature_Celsius: 38 C`
        ];
      } else {
        outputLines = [
          `[EXEC] Process started with PID ${Math.floor(1000 + Math.random() * 9000)}`,
          `Return code: 0 (SUCCESS)`,
          `Command completed successfully.`
        ];
      }

      setLogs((prev) => [
        ...prev,
        ...outputLines.map((line) => ({
          type: line.includes('WARNING') || line.includes('STANDBY') ? 'warning' : 'output',
          text: line,
          timestamp: new Date().toLocaleTimeString()
        }))
      ]);

      setIsExecuting(false);
      setCustomCmd('');
    }, 600);
  };

  const copyTerminalOutput = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#0e1726] border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="px-3 sm:px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-[#0a1120] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                  DVR Console
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 truncate">
                  {site.atmId}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${
                  site.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {site.status}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-0.5 truncate">
                Host: {site.ipAddress}:{site.port} • {site.bank} • {site.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={copyTerminalOutput}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy Output"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLogs([])}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear Terminal Logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command Presets Toolbar */}
        <div className="px-3 sm:px-5 py-2 bg-[#0c1424] border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap hidden sm:inline">
            Quick Actions:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap sm:flex-wrap">
            {DVR_COMMAND_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleExecute(preset.cmd)}
                disabled={isExecuting}
                className="px-2 py-1 rounded bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1 whitespace-nowrap disabled:opacity-50 shrink-0"
              >
                <Play className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Screen Output */}
        <div className="flex-1 p-3 sm:p-4 bg-[#060a12] font-mono text-[11px] sm:text-xs overflow-y-auto space-y-1 min-h-[220px] sm:min-h-[280px] select-text">
          {logs.map((log, idx) => {
            let textColor = 'text-slate-300';
            if (log.type === 'system') textColor = 'text-indigo-400 font-semibold';
            if (log.type === 'cmd') textColor = 'text-emerald-400 font-bold';
            if (log.type === 'warning') textColor = 'text-amber-400';
            if (log.type === 'info') textColor = 'text-sky-400';

            return (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-600 text-[9px] sm:text-[10px] select-none pt-0.5 shrink-0">
                  [{log.timestamp}]
                </span>
                <span className={`${textColor} break-all`}>{log.text}</span>
              </div>
            );
          })}
          {isExecuting && (
            <div className="flex items-center gap-2 text-indigo-400 animate-pulse pt-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              <span>Transmitting to {site.ipAddress}...</span>
            </div>
          )}
          <div ref={consoleBottomRef} />
        </div>

        {/* Custom Command Input Bar */}
        <div className="p-2.5 sm:p-3 bg-[#0a1120] border-t border-slate-800 flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px] sm:text-xs select-none shrink-0">
            <span>$</span>
          </div>
          <input
            type="text"
            value={customCmd}
            onChange={(e) => setCustomCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecute(customCmd);
            }}
            placeholder="Type custom command (e.g. ping, reboot)..."
            className="flex-1 bg-[#060a12] border border-slate-700 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-w-0"
          />
          <button
            type="button"
            onClick={() => handleExecute(customCmd)}
            disabled={!customCmd.trim() || isExecuting}
            className="px-3 sm:px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
