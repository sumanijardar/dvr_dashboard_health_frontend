import React from 'react';
import StatCardsGrid from '../components/dashboard/StatCardsGrid';
import CentralVisualAnalytics from '../components/dashboard/CentralVisualAnalytics';
import './Dashboard.css';

/**
 * Dashboard Page
 * 7 Key Metric Count Cards & Central Visual Analytics (Fleet Trend Graph + Live Preview)
 */
export default function Dashboard({
  metricsSummary,
  activeFilter,
  onSelectMetricFilter,
  isLoadingMetrics,
  isRefreshing,
  openCmdConsole,
  firstSite
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 7 Key Metric Count Cards */}
      <StatCardsGrid
        metrics={metricsSummary}
        activeFilter={activeFilter}
        onSelectFilter={onSelectMetricFilter}
        isLoading={isLoadingMetrics || isRefreshing}
      />

      {/* Central Visual Analytics (Fleet Trend Graph + Live RTSP Stream Preview) */}
      <CentralVisualAnalytics
        onOpenCmd={openCmdConsole}
        firstSite={firstSite}
      />
    </div>
  );
}
