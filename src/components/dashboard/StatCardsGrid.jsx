import React from 'react';
import StatCard from './StatCard';
import { DVR_METRICS_SUMMARY } from '../../data/mockDvrData';

/**
 * StatCardsGrid Component
 * Maps over metrics into a responsive 7-col grid matching the 7 API endpoints
 */
export default function StatCardsGrid({
  activeFilter,
  onSelectFilter,
  metrics = DVR_METRICS_SUMMARY,
  isLoading = false
}) {
  return (
    <section aria-label="Surveillance Fleet Key Metrics" className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {metrics.map((metric) => {
          const isCurrentActive =
            (metric.filterKey && activeFilter === metric.filterKey) ||
            (!metric.filterKey && activeFilter === 'ALL');

          return (
            <StatCard
              key={metric.id}
              item={metric}
              isActive={isCurrentActive}
              isLoading={isLoading}
              onClick={() => onSelectFilter(metric.filterKey || 'ALL')}
            />
          );
        })}
      </div>
    </section>
  );
}
