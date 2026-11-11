import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Surveillance from './pages/Surveillance';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Footage from './pages/Footage';
import Login from './pages/Login';
import Logout from './pages/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import { useDvrSites } from './hooks/useDvrSites';

const PAGE_TITLES = {
  dashboard: 'SENTINEL DVR Fleet Dashboard',
  surveillance: 'DVR Surveillance Inventory',
  alerts: 'Security & Incident Logs',
  analytics: 'Visual Fleet & Storage Analytics',
  footage: 'Footage Downloader',
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derive activePage directly from current URL pathname
  const pathClean = location.pathname.replace(/^\/+/, '').split('/')[0] || 'dashboard';
  const activePage = PAGE_TITLES[pathClean] ? pathClean : 'dashboard';

  // Centralized DVR sites hook — live telemetry, filters, search, pagination, CMD console
  const {
    metricsSummary,
    isLoadingMetrics,
    refreshMetrics,
    lastSyncedTime,
    filteredSites,
    paginatedSites,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    customerFilter,
    setCustomerFilter,
    bankFilter,
    setBankFilter,
    dvrNameFilter,
    setDvrNameFilter,
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    activeFiltersCount,
    filterOptions,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    totalSitesCount,
    cmdModalOpen,
    selectedSiteForCmd,
    openCmdConsole,
    closeCmdConsole,
    resetFilters,
    refreshSiteStatus,
    refreshingSiteId,
    refreshToast,
    dismissRefreshToast
  } = useDvrSites();

  const handleGlobalRefresh = async () => {
    setIsRefreshing(true);
    await refreshMetrics();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Clicking a metric card sets the filter and seamlessly navigates to /surveillance
  const handleSelectMetricFilter = (filterKey) => {
    setActiveFilter(filterKey);
    setCurrentPage(1);
    navigate('/surveillance');
  };

  const handleNavigate = (pageId) => {
    navigate('/' + pageId);
  };

  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Protected App Routes inside Sentinel Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout
              activePage={activePage}
              onNavigate={handleNavigate}
              pageTitle={PAGE_TITLES[activePage] || 'Fleet Sentinel'}
              onGlobalRefresh={handleGlobalRefresh}
              isRefreshing={isRefreshing || isLoadingMetrics}
              filteredSites={filteredSites}
            >
              <Routes>
                {/* 1. Main Dashboard Page */}
                <Route
                  path="/"
                  element={
                    <Dashboard
                      metricsSummary={metricsSummary}
                      activeFilter={activeFilter}
                      onSelectMetricFilter={handleSelectMetricFilter}
                      isLoadingMetrics={isLoadingMetrics}
                      isRefreshing={isRefreshing}
                      openCmdConsole={openCmdConsole}
                      firstSite={paginatedSites[0]}
                    />
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <Dashboard
                      metricsSummary={metricsSummary}
                      activeFilter={activeFilter}
                      onSelectMetricFilter={handleSelectMetricFilter}
                      isLoadingMetrics={isLoadingMetrics}
                      isRefreshing={isRefreshing}
                      openCmdConsole={openCmdConsole}
                      firstSite={paginatedSites[0]}
                    />
                  }
                />

                {/* 2. Dedicated DVR Surveillance Page */}
                <Route
                  path="/surveillance"
                  element={
                    <Surveillance
                      totalSitesCount={totalSitesCount}
                      filteredSites={filteredSites}
                      paginatedSites={paginatedSites}
                      searchQuery={searchQuery}
                      onSearchChange={(query) => {
                        setSearchQuery(query);
                        setCurrentPage(1);
                      }}
                      isFilterPanelOpen={isFilterPanelOpen}
                      onToggleFilterPanel={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                      activeFiltersCount={activeFiltersCount}
                      customerFilter={customerFilter}
                      onCustomerChange={(val) => {
                        setCustomerFilter(val);
                        setCurrentPage(1);
                      }}
                      bankFilter={bankFilter}
                      onBankChange={(val) => {
                        setBankFilter(val);
                        setCurrentPage(1);
                      }}
                      dvrNameFilter={dvrNameFilter}
                      onDvrNameChange={(val) => {
                        setDvrNameFilter(val);
                        setCurrentPage(1);
                      }}
                      filterOptions={filterOptions}
                      onResetFilters={resetFilters}
                      activeFilter={activeFilter}
                      onSelectFilter={setActiveFilter}
                      metricsSummary={metricsSummary}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      rowsPerPage={rowsPerPage}
                      onPageChange={setCurrentPage}
                      onRowsPerPageChange={(newSize) => {
                        setRowsPerPage(newSize);
                        setCurrentPage(1);
                      }}
                      openCmdConsole={openCmdConsole}
                      refreshSiteStatus={refreshSiteStatus}
                      refreshingSiteId={refreshingSiteId}
                      refreshToast={refreshToast}
                      onDismissToast={dismissRefreshToast}
                      selectedSiteForCmd={selectedSiteForCmd}
                      cmdModalOpen={cmdModalOpen}
                      closeCmdConsole={closeCmdConsole}
                    />
                  }
                />

                {/* 3. Alerts & Incident Logs Page */}
                <Route path="/alerts" element={<Alerts />} />

                {/* 4. System & Visual Analytics Page */}
                <Route path="/analytics" element={<Analytics />} />

                {/* 5. Footage Downloader Page */}
                <Route path="/footage" element={<Footage />} />

                {/* Fallback route within authenticated area */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
