import { useState, useMemo, useEffect, useCallback } from 'react';
import { MOCK_DVR_SITES, DVR_METRICS_SUMMARY } from '../data/mockDvrData';
import {
  fetchDashboardMetricCounts,
  fetchSitesByCategory,
  fetchDropdownLists,
  clearSitesCache,
  triggerDvrRefresh
} from '../services/dvrApiService';

/**
 * Custom hook for DVR Site Management
 * Integrates live REST API polling for dashboard metrics, category filtering, and dropdown options
 */
export function useDvrSites() {
  const [sites, setSites] = useState(MOCK_DVR_SITES);
  const [metricsSummary, setMetricsSummary] = useState(DVR_METRICS_SUMMARY);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [isLoadingSites, setIsLoadingSites] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [lastSyncedTime, setLastSyncedTime] = useState(null);
  const [refreshingSiteId, setRefreshingSiteId] = useState(null);
  const [refreshToast, setRefreshToast] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [customerFilter, setCustomerFilter] = useState('');
  const [bankFilter, setBankFilter] = useState('');
  const [dvrNameFilter, setDvrNameFilter] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Dynamic dropdown lists fetched from API
  const [apiDropdowns, setApiDropdowns] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // CMD Modal state
  const [cmdModalOpen, setCmdModalOpen] = useState(false);
  const [selectedSiteForCmd, setSelectedSiteForCmd] = useState(null);

  /**
   * Refreshes all 7 dashboard metric counts from the backend API
   */
  const refreshMetrics = useCallback(async () => {
    setIsLoadingMetrics(true);
    setApiError(null);

    try {
      const result = await fetchDashboardMetricCounts();
      if (result.success && Array.isArray(result.metrics) && result.metrics.length > 0) {
        setMetricsSummary(result.metrics);
        setLastSyncedTime(result.timestamp);
      } else if (result.error) {
        setApiError(result.error);
      }
    } catch (err) {
      console.error('Failed to load DVR metrics:', err);
      setApiError(err.message || 'API connection failed');
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  /**
   * Loads the exact sites list for the current active category from the backend API:
   * ALL: fetch_all_sites=1 (1,199)
   * ONLINE: fetch_online_sites=1 (334)
   * OFFLINE: fetch_offline_sites=1 (865)
   * LOGIN_FAILED: fetch_login_failed=1 (45)
   * HDD_ISSUES: fetch_hdd_not_working=1 (26)
   * PING_OK: fetch_ping_ok=1 (396)
   * PING_FAIL: fetch_ping_failed=1 (803)
   * TIME_DIFF_ONLINE: fetch_time_diff_online=1
   */
  const loadCategorySites = useCallback(async (category = activeFilter, force = false) => {
    setIsLoadingSites(true);
    try {
      const result = await fetchSitesByCategory(category, force);
      if (result.success && Array.isArray(result.sites)) {
        setSites(result.sites);
      }
    } catch (err) {
      console.warn(`Failed to load sites for category ${category}:`, err);
    } finally {
      setIsLoadingSites(false);
    }
  }, [activeFilter]);

  /**
   * Loads distinct dropdown options (customers, banks, dvrnames) from the backend API
   */
  const loadDropdowns = useCallback(async () => {
    try {
      const dropdowns = await fetchDropdownLists();
      if (dropdowns) {
        setApiDropdowns(dropdowns);
      }
    } catch (err) {
      console.warn('Failed to fetch API dropdown options:', err);
    }
  }, []);

  // On mount: load metrics & dropdown options
  useEffect(() => {
    refreshMetrics();
    loadDropdowns();
  }, [refreshMetrics, loadDropdowns]);

  // When activeFilter changes: load exact matching records from the dedicated backend API endpoint
  useEffect(() => {
    loadCategorySites(activeFilter);
    setCurrentPage(1);
  }, [activeFilter, loadCategorySites]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeFilter !== 'ALL') count++;
    if (customerFilter) count++;
    if (bankFilter) count++;
    if (dvrNameFilter) count++;
    return count;
  }, [activeFilter, customerFilter, bankFilter, dvrNameFilter]);

  // Unique dropdown options for filters (merging API dropdowns with site data)
  const filterOptions = useMemo(() => {
    const customers = apiDropdowns?.customers?.length
      ? apiDropdowns.customers
      : Array.from(new Set(sites.map(s => s.customer))).filter(Boolean).sort();

    const banks = apiDropdowns?.banks?.length
      ? apiDropdowns.banks
      : Array.from(new Set(sites.map(s => s.bank))).filter(Boolean).sort();

    const dvrNames = apiDropdowns?.dvrNames?.length
      ? apiDropdowns.dvrNames
      : Array.from(new Set(sites.map(s => s.dvrName))).filter(Boolean).sort();

    return { customers, banks, dvrNames };
  }, [sites, apiDropdowns]);

  // Filtered sites based on search and dropdown filters
  // (Note: The active category itself is already accurately fetched from the backend API!)
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      // Local fallback filtering for mock data mode (when API is offline)
      if (sites === MOCK_DVR_SITES && activeFilter !== 'ALL') {
        if (activeFilter === 'ONLINE' && site.status !== 'ONLINE') return false;
        if (activeFilter === 'OFFLINE' && site.status !== 'OFFLINE') return false;
        if (activeFilter === 'LOGIN_FAILED' && site.loginStatus !== 'FAILED') return false;
        if (activeFilter === 'HDD_ISSUES' && site.hddStatus !== 'ISSUES') return false;
        if (activeFilter === 'PING_OK' && site.pingStatus !== 'OK') return false;
        if (activeFilter === 'PING_FAIL' && site.pingStatus !== 'FAIL') return false;
        if (activeFilter === 'TIME_DIFF_ONLINE') {
          const hasTimeDiff = site.time_diff && site.time_diff !== '-' && site.time_diff !== '00:00:00' && site.time_diff !== 'N/A';
          if (!hasTimeDiff || site.status !== 'ONLINE') return false;
        }
      }

      // Dropdown filters
      if (customerFilter && site.customer !== customerFilter) return false;
      if (bankFilter && site.bank !== bankFilter) return false;
      if (dvrNameFilter && (site.dvrName || '').toLowerCase() !== dvrNameFilter.toLowerCase()) return false;

      // Global Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesAtmId = (site.atmId || '').toLowerCase().includes(query);
        const matchesIp = (site.ipAddress || '').toLowerCase().includes(query);
        const matchesCity = (site.city || '').toLowerCase().includes(query);
        const matchesState = (site.state || '').toLowerCase().includes(query);
        const matchesLocation = (site.location || '').toLowerCase().includes(query);
        const matchesBank = (site.bank || '').toLowerCase().includes(query);
        const matchesCustomer = (site.customer || '').toLowerCase().includes(query);
        const matchesDvr = (site.dvrName || '').toLowerCase().includes(query);
        const matchesTimeDiff = (site.time_diff || '').toLowerCase().includes(query);

        return matchesAtmId || matchesIp || matchesCity || matchesState || matchesLocation || matchesBank || matchesCustomer || matchesDvr || matchesTimeDiff;
      }

      return true;
    });
  }, [sites, searchQuery, activeFilter, customerFilter, bankFilter, dvrNameFilter]);

  // Paginated sites
  const totalSitesCount = filteredSites.length;
  const totalPages = Math.max(1, Math.ceil(totalSitesCount / rowsPerPage));

  const paginatedSites = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredSites.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSites, currentPage, rowsPerPage]);

  // Handlers
  const openCmdConsole = (site) => {
    setSelectedSiteForCmd(site);
    setCmdModalOpen(true);
  };

  const closeCmdConsole = () => {
    setCmdModalOpen(false);
    setSelectedSiteForCmd(null);
  };

  const resetFilters = () => {
    setActiveFilter('ALL');
    setCustomerFilter('');
    setBankFilter('');
    setDvrNameFilter('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const refreshSiteStatus = async (siteOrId, siteIp) => {
    // Resolve site object whether caller passed whole site object or (siteId, ip)
    const site = (typeof siteOrId === 'object' && siteOrId !== null)
      ? siteOrId
      : sites.find(s => s.id === siteOrId || s.atmId === siteOrId) || { id: siteOrId, IPAddress: siteIp };

    const ip = site.IPAddress || site.ipAddress || siteIp;
    const siteId = site.id;

    if (!ip) {
      console.warn('Cannot refresh site without IP address');
      return;
    }

    setRefreshingSiteId(siteId);
    setRefreshToast({
      type: 'loading',
      ip,
      message: `Polling live DVR status for ${ip} via ${site.refresh_url || site.refreshUrl || 'microservice'}...`
    });

    try {
      const res = await triggerDvrRefresh(site);

      if (res && (res.success || res.ping || res.login)) {
        const isOnline = String(res.ping || '').toLowerCase() === 'online';
        const isPingOk = isOnline || String(res.ping || '').toLowerCase() === 'ok';
        const isLoginWorking = String(res.login || '').toLowerCase() === 'working';
        const isHddWorking = String(res.hdd || '').toLowerCase().includes('working') && !String(res.hdd || '').toLowerCase().includes('not');

        setSites(prev =>
          prev.map(s => {
            const matches = s.id === siteId ||
              (site.atmId && (s.atmId === site.atmId || s.atmid === site.atmId)) ||
              (site.atmid && (s.atmId === site.atmid || s.atmid === site.atmid)) ||
              (ip && (s.IPAddress === ip || s.ipAddress === ip));
            if (matches) {
              return {
                ...s,
                status: isOnline ? 'ONLINE' : 'OFFLINE',
                pingStatus: isPingOk ? 'OK' : 'FAIL',
                raw_status: isPingOk ? '1' : '0',
                loginStatus: isLoginWorking ? 'SUCCESS' : 'FAILED',
                login_status: isLoginWorking ? '0' : '1',
                hdd: res.hdd || s.hdd,
                hddStatus: isHddWorking ? 'OK' : 'ISSUES',
                capacity: res.hdd_total_mb ? `${res.hdd_total_mb} MB` : s.capacity,
                freespace: res.hdd_free_mb ? `${res.hdd_free_mb} MB` : s.freespace,
                recording_from: res.rec_start || s.recording_from,
                recording_to: res.rec_end || s.recording_to,
                dvr_time: res.dvr_time || s.dvr_time,
                cam1: res.camera_detail?.['1'] || s.cam1,
                cam2: res.camera_detail?.['2'] || s.cam2,
                cam3: res.camera_detail?.['3'] || s.cam3,
                cam4: res.camera_detail?.['4'] || s.cam4,
                cam5: res.camera_detail?.['5'] || s.cam5,
                lastScanned: 'Just now',
                last_communication: res.timestamp || 'Just now'
              };
            }
            return s;
          })
        );

        setRefreshToast({
          type: 'success',
          ip,
          message: `${res.message || 'Live DVR check completed'} (Ping: ${res.ping || 'N/A'}, Login: ${res.login || 'N/A'})`
        });

        // Trigger background metric counters refresh to stay synced with DB
        refreshMetrics().catch(err => console.warn('[useDvrSites] Error syncing metrics after site refresh:', err));
      } else {
        throw new Error(res?.message || 'Invalid response from refresh API');
      }
    } catch (err) {
      console.error(`[useDvrSites] Error refreshing DVR ${ip}:`, err);
      setRefreshToast({
        type: 'error',
        ip,
        message: `Failed to refresh ${ip}: ${err.message || 'Microservice unreachable'}`
      });
    } finally {
      setRefreshingSiteId(null);
      setTimeout(() => {
        setRefreshToast(prev => (prev?.ip === ip ? null : prev));
      }, 5000);
    }
  };

  const handleFullRefresh = async () => {
    clearSitesCache();
    await Promise.all([
      refreshMetrics(),
      loadCategorySites(activeFilter, true),
      loadDropdowns()
    ]);
  };

  return {
    sites,
    setSites,
    metricsSummary,
    isLoadingMetrics,
    isLoadingSites,
    apiError,
    lastSyncedTime,
    refreshMetrics: handleFullRefresh,
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
    dismissRefreshToast: () => setRefreshToast(null)
  };
}
