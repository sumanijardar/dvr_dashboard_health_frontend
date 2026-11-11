import React from 'react';
import FilterBar from '../dashboard/FilterBar';
import DvrTable from '../dashboard/DvrTable';
import Pagination from '../dashboard/Pagination';
import DvrCmdModal from '../cmd/DvrCmdModal';
import { useTheme } from '../../context/ThemeContext';
import { RefreshCw, CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * DvrSurveillanceView Component
 * Dedicated full-page view for DVR Surveillance Inventory & Fleet Management
 */
export default function DvrSurveillanceView({
  totalSitesCount,
  filteredSites,
  paginatedSites,
  searchQuery,
  onSearchChange,
  isFilterPanelOpen,
  onToggleFilterPanel,
  activeFiltersCount,
  customerFilter,
  onCustomerChange,
  bankFilter,
  onBankChange,
  dvrNameFilter,
  onDvrNameChange,
  // Fallbacks
  stateFilter,
  onStateChange,
  filterOptions,
  onResetFilters,
  activeFilter,
  onSelectFilter,
  metricsSummary,
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  openCmdConsole,
  refreshSiteStatus,
  refreshingSiteId,
  refreshToast,
  onDismissToast,
  selectedSiteForCmd,
  cmdModalOpen,
  closeCmdConsole
}) {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* DVR Surveillance Inventory Container */}
      <section
        aria-label="DVR Inventory Management"
        className={`rounded-2xl border overflow-hidden transition-colors duration-200 ${
          isDark
            ? 'glass-panel border-slate-800/90 shadow-card-glass'
            : 'bg-white border-slate-200 shadow-md'
        }`}
      >
        {/* Table Toolbar & Search Filters */}
        <FilterBar
          totalCount={totalSitesCount}
          filteredSites={filteredSites}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isFilterPanelOpen={isFilterPanelOpen}
          onToggleFilterPanel={onToggleFilterPanel}
          activeFiltersCount={activeFiltersCount}
          customerFilter={customerFilter}
          onCustomerChange={onCustomerChange}
          bankFilter={bankFilter}
          onBankChange={onBankChange}
          dvrNameFilter={dvrNameFilter}
          onDvrNameChange={onDvrNameChange}
          stateFilter={stateFilter}
          onStateChange={onStateChange}
          filterOptions={filterOptions}
          onResetFilters={onResetFilters}
          activeFilter={activeFilter}
          onSelectFilter={onSelectFilter}
          metricsSummary={metricsSummary}
        />

        {/* High-Fidelity Data Table */}
        <DvrTable
          sites={paginatedSites}
          onOpenCmd={openCmdConsole}
          onRefreshSite={refreshSiteStatus}
          refreshingSiteId={refreshingSiteId}
        />

        {/* Pagination Bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={totalSitesCount}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </section>

      {/* Remote DVR Diagnostic Command Console Modal */}
      <DvrCmdModal
        site={selectedSiteForCmd}
        isOpen={cmdModalOpen}
        onClose={closeCmdConsole}
      />

      {/* Floating Live Health Check Status Toast */}
      {refreshToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
        >
          <div
            className={`px-4 py-3 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
              refreshToast.type === 'loading'
                ? isDark
                  ? 'bg-slate-900/95 border-sky-500/50 text-sky-200 shadow-[0_8px_30px_rgba(14,165,233,0.3)]'
                  : 'bg-white/95 border-sky-400 text-sky-950 shadow-xl'
                : refreshToast.type === 'success'
                ? isDark
                  ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-200 shadow-[0_8px_30px_rgba(16,185,129,0.3)]'
                  : 'bg-white/95 border-emerald-400 text-emerald-950 shadow-xl'
                : isDark
                ? 'bg-slate-900/95 border-rose-500/50 text-rose-200 shadow-[0_8px_30px_rgba(244,63,94,0.3)]'
                : 'bg-white/95 border-rose-400 text-rose-950 shadow-xl'
            }`}
          >
            {refreshToast.type === 'loading' ? (
              <RefreshCw className="w-5 h-5 animate-spin text-sky-400 shrink-0 mt-0.5" />
            ) : refreshToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <div className="font-bold flex items-center justify-between gap-2 font-mono">
                <span className="text-white font-bold">{refreshToast.ip}</span>
                <span
                  className={`text-[10px] font-sans px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    refreshToast.type === 'loading'
                      ? 'bg-sky-500/20 text-sky-400'
                      : refreshToast.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {refreshToast.type === 'loading' ? 'Polling...' : refreshToast.type === 'success' ? 'Updated' : 'Error'}
                </span>
              </div>
              <p className="mt-1 leading-relaxed text-[11px] opacity-90">{refreshToast.message}</p>
            </div>
            {onDismissToast && (
              <button
                type="button"
                onClick={onDismissToast}
                className="opacity-60 hover:opacity-100 p-0.5 rounded transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
