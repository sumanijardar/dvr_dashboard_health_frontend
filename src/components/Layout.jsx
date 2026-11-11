import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

/**
 * Layout Component
 * Master wrapper: Header + Sidebar + Content + Footer
 */
export default function Layout({
  activePage,
  onNavigate,
  pageTitle,
  onGlobalRefresh,
  isRefreshing,
  filteredSites,
  children
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-[#070a0d] text-slate-200 antialiased font-sans flex flex-col bg-radar-glow selection:bg-emerald-500 selection:text-black app-root relative">
      {/* Light Theme Unique Animated Background Effect */}
      {!isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
          <div className="light-aurora-orb orb-1" />
          <div className="light-aurora-orb orb-2" />
          <div className="light-aurora-orb orb-3" />
          <div className="light-aurora-orb orb-4" />
        </div>
      )}

      {/* 1. Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out pl-0 relative z-10 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header
          pageTitle={pageTitle}
          onGlobalRefresh={onGlobalRefresh}
          isRefreshing={isRefreshing}
          filteredSites={filteredSites}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-[1920px] w-full mx-auto overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
