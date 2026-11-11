import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Toast / Popbar notification state
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string, title?: string }

  // Redirect destination after successful login
  const from = location.state?.from?.pathname || '/dashboard';

  const showToast = (type, message, title = '') => {
    setToast({ type, message, title });
    if (type === 'error') {
      // Auto-hide error popbar after 6s
      setTimeout(() => {
        setToast((curr) => (curr?.message === message ? null : curr));
      }, 6000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('error', 'Username and password are required to access Sentinel.', 'Authentication Required');
      return;
    }

    setIsLoading(true);
    setToast(null);

    try {
      const result = await login(username.trim(), password);
      const operatorName = result?.user?.name || username.trim();

      // Show success popbar
      showToast('success', `Welcome back, ${operatorName}! Redirecting to fleet console...`, 'Access Granted');

      // Short delay so operator sees the success popbar animation
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1200);
    } catch (err) {
      showToast('error', err.message || 'Invalid operator credentials. Access denied.', 'Login Failed');
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setToast(null);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden ${isDark ? 'bg-[#060a0f] text-slate-100' : 'bg-slate-100 text-slate-800'
      }`}>
      {/* ============================================================== */}
      {/* Floating Top Popbar Notification Banner */}
      {/* ============================================================== */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top-6 duration-300">
          <div className={`rounded-2xl p-4 shadow-2xl backdrop-blur-xl border flex items-start gap-3.5 transition-all ${toast.type === 'success'
            ? isDark
              ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-[0_10px_35px_-5px_rgba(16,185,129,0.4)]'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-[0_10px_35px_-5px_rgba(16,185,129,0.25)]'
            : isDark
              ? 'bg-rose-950/90 border-rose-500/60 text-rose-200 shadow-[0_10px_35px_-5px_rgba(244,63,94,0.4)]'
              : 'bg-rose-50 border-rose-300 text-rose-900 shadow-[0_10px_35px_-5px_rgba(244,63,94,0.25)]'
            }`}>
            {/* Icon */}
            <div className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${toast.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/20 text-rose-400'
              }`}>
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 animate-bounce" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>

            {/* Message Body */}
            <div className="flex-1 min-w-0 pr-1">
              {toast.title && (
                <div className={`font-bold text-xs uppercase tracking-wider mb-0.5 ${toast.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                  {toast.title}
                </div>
              )}
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                {toast.message}
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Background Neon Grid / Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-emerald-400/10 border border-emerald-500/30 shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)] mb-4">
            <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-cyan-300 to-white bg-clip-text text-transparent">
            DVR DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            Enterprise CCTV & DVR Security Gateway
          </p>
        </div>

        {/* Login Card */}
        <div className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 ${isDark
          ? 'bg-slate-900/80 border-slate-800/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)]'
          : 'bg-white/95 border-slate-200/90 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]'
          }`}>
          <div className="mb-6">
            <h2 className="text-lg font-bold">Sign In to Fleet Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your authorized operator credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400">
                Operator Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  autoFocus
                  required
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${isDark
                    ? 'bg-slate-800/70 border-slate-700/70 text-white placeholder-slate-500 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none ${isDark
                    ? 'bg-slate-800/70 border-slate-700/70 text-white placeholder-slate-500 focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-0.5 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Fill Pill */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline font-mono cursor-pointer transition-colors"
              >
                Use default (admin / admin123)
              </button>
              <span className="text-[11px] text-slate-500 font-mono">v2.5 SSL</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-900 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-200 shadow-[0_0_20px_-3px_rgba(52,211,153,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          {/* <span>Protected by Hardware Token & AES-256 Protocol</span> */}
        </div>
      </div>
    </div>
  );
}
