import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Logout() {
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    async function performLogout() {
      await logout();
      timer = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 900);
    }
    performLogout();
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark ? 'bg-[#060a0f] text-slate-100' : 'bg-slate-100 text-slate-800'
    }`}>
      <div className={`text-center p-8 rounded-3xl border max-w-sm w-full backdrop-blur-xl shadow-2xl ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
          <LogOut className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold mb-1">Logging Out</h2>
        <p className="text-xs text-slate-400 mb-4 font-mono">
          Terminating secure session & clearing tokens...
        </p>
        <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

