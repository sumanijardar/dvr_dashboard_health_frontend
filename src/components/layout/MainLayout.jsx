import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';

/**
 * MainLayout Component
 * Fully Responsive Dark Neon Stitch Architecture Shell
 * Supports Unique Animated Aurora Lighting & Tech Grid in Light Mode
 */
export default function MainLayout({
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
          {/* Subtle Cyber Blueprint Dot Matrix Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

          {/* Floating Ambient Aurora Glow Orbs */}
          <div className="light-aurora-orb orb-1" />
          <div className="light-aurora-orb orb-2" />
          <div className="light-aurora-orb orb-3" />
          <div className="light-aurora-orb orb-4" />
        </div>
      )}

      {/* 1. Sidebar (Responsive: drawer on mobile, static on desktop) */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Area (pl-0 on mobile, lg:pl-64 or lg:pl-20 on desktop) */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out pl-0 relative z-10 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar Header with Mobile Hamburger & Admin profile (Only Logout) */}
        <Header
          pageTitle={pageTitle}
          onGlobalRefresh={onGlobalRefresh}
          isRefreshing={isRefreshing}
          filteredSites={filteredSites}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Content View Container with responsive padding */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-[1920px] w-full mx-auto overflow-x-hidden">
          {children}
        </main>

        {/* Unified Bottom Footer */}
        <Footer />
      </div>
    </div>
  );
}
