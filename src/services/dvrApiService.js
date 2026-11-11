/**
 * ==============================================================================
 * SAR DVR Dashboard API Service Layer
 * ==============================================================================
 * Encapsulates all HTTP network interactions, response parsing, data normalization,
 * and error fallbacks for DVR fleet metrics and inventory records.
 */

import { API_ENDPOINTS, buildApiUrl } from '../config/apiConfig';
import { DVR_METRICS_SUMMARY } from '../data/mockDvrData';

/**
 * Generic fetch wrapper with timeout and JSON validation
 * @param {string} endpointUrl - Endpoint relative path or query
 * @param {number} timeoutMs - Timeout limit in milliseconds
 */
async function fetchEndpoint(endpointUrl, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const url = buildApiUrl(endpointUrl);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Normalizes a raw SQL database row from `all_dvr_live` into the UI site schema
 * @param {object} row - Raw DB row
 * @returns {object} Formatted DVR site item
 */
export function mapApiRowToSite(row) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const lastComDate = (row.last_communication || '').slice(0, 10);

  // Exact Online definition matching dashboard_api.php (live='Y', last_communication >= CURDATE(), login_status=0)
  const isOnline = (
    String(row.live || 'Y').toUpperCase() === 'Y' &&
    lastComDate >= todayStr &&
    String(row.login_status) === '0'
  );

  // Ping OK: status = 1 (DVR responds to ping)
  const isPingOk = String(row.status) === '1';

  // Login Failed definition matching dashboard_api.php (live='Y', login_status=1, last_communication < CURDATE() or null, status=1)
  const isLoginFailed = (
    String(row.live || 'Y').toUpperCase() === 'Y' &&
    String(row.login_status) === '1' &&
    (!row.last_communication || lastComDate < todayStr) &&
    isPingOk
  );

  const hddVal = (row.hdd || '').toLowerCase().trim();
  const isHddWorking = hddVal === 'working' || hddVal === 'ok';

  // Compute recording aging (difference in days between recording_to and recording_from)
  let agingDays = '-';
  if (row.recording_from && row.recording_to && row.recording_from !== 'N/A' && row.recording_to !== 'N/A') {
    try {
      const dFrom = new Date(String(row.recording_from).trim().split(' ')[0]);
      const dTo = new Date(String(row.recording_to).trim().split(' ')[0]);
      if (!isNaN(dFrom.getTime()) && !isNaN(dTo.getTime())) {
        const diffDays = Math.round((dTo.getTime() - dFrom.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          agingDays = `${diffDays} Days`;
        }
      }
    } catch {
      agingDays = '-';
    }
  }

  return {
    id: row.id || row.atmid,
    atmId: row.atmid || 'N/A',
    atmid: row.atmid || 'N/A',
    uniqueId: row.unique_id || 'N/A',
    unique_id: row.unique_id || 'N/A',
    customer: row.customer || 'Unknown',
    bank: row.bank || 'Unknown',
    ipAddress: row.IPAddress || '0.0.0.0',
    IPAddress: row.IPAddress || '0.0.0.0',
    dvrName: row.dvrname || 'Unknown',
    dvrname: row.dvrname || 'Unknown',
    port: row.port || '80',
    username: row.UserName || 'admin',
    UserName: row.UserName || 'admin',
    password: row.Password || '',
    Password: row.Password || '',
    live: row.live || 'Y',
    raw_status: row.status !== undefined && row.status !== null ? String(row.status) : '0',
    status: isOnline ? 'ONLINE' : 'OFFLINE',
    pingStatus: isPingOk ? 'OK' : 'FAIL',
    login_status: row.login_status !== undefined && row.login_status !== null ? String(row.login_status) : '0',
    loginStatus: String(row.login_status) === '0' ? 'SUCCESS' : 'FAILED',
    cam1: row.cam1 || 'N/A',
    cam2: row.cam2 || 'N/A',
    cam3: row.cam3 || 'N/A',
    cam4: row.cam4 || 'N/A',
    cam5: row.cam5 || 'N/A',
    hdd: row.hdd || 'N/A',
    hddStatus: isHddWorking ? 'OK' : 'ISSUES',
    capacity: row.capacity || '0',
    freespace: row.freespace || '0',
    recording_from: row.recording_from || 'N/A',
    recording_to: row.recording_to || 'N/A',
    recording_aging: agingDays,
    dvr_time: row.dvr_time || row.dvrtime || 'N/A',
    time_diff: row.time_diff || row.timediff || 'N/A',
    cdate: row.cdate || 'N/A',
    address: row.address || 'N/A',
    location: row.address || 'N/A',
    city: row.city || 'N/A',
    state: row.state || 'N/A',
    network_status: row.network_status || 'N/A',
    network_status_dt: row.network_status_dt || 'N/A',
    last_communication: row.last_communication || 'N/A',
    lastScanned: row.last_communication || row.cdate || 'Recently',
    channels: parseInt(row.no_of_cam, 10) || 4,
    firmware: row.SN || 'V4.0',
    refresh_url: row.refresh_url || getRefreshUrl(row),
    refreshUrl: row.refresh_url || getRefreshUrl(row),
    raw: row
  };
}

/**
 * Calculates percentage string from numerator and total
 * @param {number} count 
 * @param {number} total 
 * @returns {string} e.g. "(27.9%)"
 */
function calculatePercentage(count, total) {
  if (!total || total <= 0) return '(0.0%)';
  const pct = ((count / total) * 100).toFixed(1);
  return `(${pct}%)`;
}

/**
 * Fetches dashboard metric counts from all 7 endpoints in parallel
 * and formats them into the standard metric cards structure.
 * 
 * @returns {Promise<{
 *   success: boolean,
 *   metrics: Array,
 *   rawCounts: object,
 *   timestamp: Date,
 *   error: string|null
 * }>}
 */
export async function fetchDashboardMetricCounts() {
  try {
    // Fire all 8 count requests simultaneously for high performance
    const [
      allRes,
      onlineRes,
      offlineRes,
      loginFailedRes,
      hddRes,
      pingOkRes,
      pingFailedRes,
      timeDiffRes
    ] = await Promise.all([
      fetchEndpoint(API_ENDPOINTS.FETCH_ALL_SITES),
      fetchEndpoint(API_ENDPOINTS.FETCH_ONLINE_SITES),
      fetchEndpoint(API_ENDPOINTS.FETCH_OFFLINE_SITES),
      fetchEndpoint(API_ENDPOINTS.FETCH_LOGIN_FAILED),
      fetchEndpoint(API_ENDPOINTS.FETCH_HDD_NOT_WORKING),
      fetchEndpoint(API_ENDPOINTS.FETCH_PING_OK),
      fetchEndpoint(API_ENDPOINTS.FETCH_PING_FAILED),
      fetchEndpoint(API_ENDPOINTS.FETCH_TIME_DIFF_ONLINE)
    ]);

    const totalCount = Number(allRes?.total_count ?? 0);
    const onlineCount = Number(onlineRes?.total_count ?? 0);
    const offlineCount = Number(offlineRes?.total_count ?? 0);
    const loginFailedCount = Number(loginFailedRes?.total_count ?? 0);
    const hddCount = Number(hddRes?.total_count ?? 0);
    const pingOkCount = Number(pingOkRes?.total_count ?? 0);
    const pingFailCount = Number(pingFailedRes?.total_count ?? 0);
    const timeDiffCount = Number(timeDiffRes?.total_count ?? 0);

    const rawCounts = {
      total: totalCount,
      online: onlineCount,
      offline: offlineCount,
      login_failed: loginFailedCount,
      hdd_issues: hddCount,
      ping_ok: pingOkCount,
      ping_fail: pingFailCount,
      time_diff: timeDiffCount,
      time_diff_online: timeDiffCount
    };

    // Construct the 8 Metric Cards in exact order
    const dynamicMetrics = [
      {
        id: 'total',
        title: 'TOTAL SITES',
        value: totalCount.toLocaleString(),
        rawCount: totalCount,
        percentage: null,
        subtext: '',
        filterKey: 'ALL',
        icon: 'LayoutGrid',
        theme: 'purple'
      },
      {
        id: 'online',
        title: 'ONLINE',
        value: onlineCount.toLocaleString(),
        rawCount: onlineCount,
        percentage: calculatePercentage(onlineCount, totalCount),
        subtext: 'Live Streaming',
        filterKey: 'ONLINE',
        icon: 'CheckCircle2',
        theme: 'emerald'
      },
      {
        id: 'offline',
        title: 'OFFLINE',
        value: offlineCount.toLocaleString(),
        rawCount: offlineCount,
        percentage: calculatePercentage(offlineCount, totalCount),
        subtext: 'Requires Action',
        filterKey: 'OFFLINE',
        icon: 'XCircle',
        theme: 'rose'
      },
      {
        id: 'login_failed',
        title: 'LOGIN FAIL',
        value: loginFailedCount.toLocaleString(),
        rawCount: loginFailedCount,
        percentage: calculatePercentage(loginFailedCount, totalCount),
        subtext: 'Auth / Credential Err',
        filterKey: 'LOGIN_FAILED',
        icon: 'UserX',
        theme: 'amber'
      },
      {
        id: 'hdd_issues',
        title: 'HDD ISSUES',
        value: hddCount.toLocaleString(),
        rawCount: hddCount,
        percentage: calculatePercentage(hddCount, totalCount),
        subtext: 'Storage Corrupted',
        filterKey: 'HDD_ISSUES',
        icon: 'HardDrive',
        theme: 'yellow'
      },
      {
        id: 'ping_ok',
        title: 'PING OK',
        value: pingOkCount.toLocaleString(),
        rawCount: pingOkCount,
        percentage: calculatePercentage(pingOkCount, totalCount),
        subtext: 'Latency Normal',
        filterKey: 'PING_OK',
        icon: 'Wifi',
        theme: 'teal'
      },
      {
        id: 'ping_fail',
        title: 'PING FAIL',
        value: pingFailCount.toLocaleString(),
        rawCount: pingFailCount,
        percentage: calculatePercentage(pingFailCount, totalCount),
        subtext: 'Gateway Timeout',
        filterKey: 'PING_FAIL',
        icon: 'WifiOff',
        theme: 'red'
      },
      {
        id: 'time_diff_online',
        title: 'TIME DIFF',
        value: timeDiffCount.toLocaleString(),
        rawCount: timeDiffCount,
        percentage: calculatePercentage(timeDiffCount, totalCount),
        subtext: 'Online Time Desync',
        filterKey: 'TIME_DIFF_ONLINE',
        icon: 'Clock',
        theme: 'blue'
      }
    ];

    return {
      success: true,
      metrics: dynamicMetrics,
      rawCounts,
      timestamp: new Date(),
      error: null
    };
  } catch (err) {
    console.warn('[dvrApiService] API count fetch failed, falling back to cache/mock:', err);
    return {
      success: false,
      metrics: DVR_METRICS_SUMMARY,
      rawCounts: null,
      timestamp: new Date(),
      error: err.message || 'Unable to connect to DVR Dashboard API'
    };
  }
}

/**
 * Fetches all live sites from the database via the API
 * @returns {Promise<{ success: boolean, sites: Array, error: string|null }>}
 */
export async function fetchLiveSitesList() {
  try {
    const res = await fetchEndpoint(API_ENDPOINTS.FETCH_ALL_SITES, 15000);
    if (res && Array.isArray(res.data)) {
      const sites = res.data.map(mapApiRowToSite);
      return { success: true, sites, total: res.total_count || sites.length, error: null };
    }
    return { success: false, sites: [], error: 'Invalid response format' };
  } catch (err) {
    console.warn('[dvrApiService] Sites fetch error:', err);
    return { success: false, sites: [], error: err.message };
  }
}

/**
 * Fetches distinct dropdown list options (customers, banks, dvrnames) from Dashboard_dropdown_api.php
 * @returns {Promise<{ customers: string[], banks: string[], dvrNames: string[] } | null>}
 */
export async function fetchDropdownLists() {
  try {
    const res = await fetchEndpoint(API_ENDPOINTS.FETCH_ALL_DROPDOWNS, 10000);
    if (res && res.Code === 200 && res.data) {
      return {
        customers: Array.isArray(res.data.customers) ? res.data.customers : [],
        banks: Array.isArray(res.data.banks) ? res.data.banks : [],
        dvrNames: Array.isArray(res.data.dvrnames) ? res.data.dvrnames : [],
        atmIds: Array.isArray(res.data.atmids) ? res.data.atmids : []
      };
    }
  } catch (err) {
    console.warn('[dvrApiService] Dropdown lists fetch failed:', err);
  }
  return null;
}

export const CATEGORY_ENDPOINTS = {
  ALL: API_ENDPOINTS.FETCH_ALL_SITES,
  ONLINE: API_ENDPOINTS.FETCH_ONLINE_SITES,
  OFFLINE: API_ENDPOINTS.FETCH_OFFLINE_SITES,
  LOGIN_FAILED: API_ENDPOINTS.FETCH_LOGIN_FAILED,
  HDD_ISSUES: API_ENDPOINTS.FETCH_HDD_NOT_WORKING,
  PING_OK: API_ENDPOINTS.FETCH_PING_OK,
  PING_FAIL: API_ENDPOINTS.FETCH_PING_FAILED,
  TIME_DIFF_ONLINE: API_ENDPOINTS.FETCH_TIME_DIFF_ONLINE,
  TIME_DIFF: API_ENDPOINTS.FETCH_TIME_DIFF_ONLINE,
};

const sitesCache = new Map();

/**
 * Fetches sites for a specific category endpoint (Online, Offline, Login Failed, Ping OK, etc.)
 * Uses in-memory caching to make tab switching instant while ensuring exact API count accuracy.
 * 
 * @param {string} category - e.g. 'ALL', 'ONLINE', 'OFFLINE', 'LOGIN_FAILED', 'PING_OK'
 * @param {boolean} forceRefresh - If true, bypasses the cache
 */
export async function fetchSitesByCategory(category = 'ALL', forceRefresh = false) {
  const normCategory = (category || 'ALL').toUpperCase();
  const endpoint = CATEGORY_ENDPOINTS[normCategory] || CATEGORY_ENDPOINTS.ALL;

  if (!forceRefresh && sitesCache.has(normCategory)) {
    return sitesCache.get(normCategory);
  }

  try {
    const res = await fetchEndpoint(endpoint, 15000);
    if (res && Array.isArray(res.data)) {
      const sites = res.data.map(mapApiRowToSite);
      const payload = {
        success: true,
        sites,
        total: res.total_count ?? sites.length,
        error: null
      };
      sitesCache.set(normCategory, payload);
      return payload;
    }
    return { success: false, sites: [], total: 0, error: 'Invalid response format' };
  } catch (err) {
    console.warn(`[dvrApiService] Fetch sites for ${category} failed:`, err);
    return { success: false, sites: [], total: 0, error: err.message };
  }
}

export function clearSitesCache() {
  sitesCache.clear();
}

/**
 * Resolves the DVR refresh URL path (e.g. '8005/refresh/cpplus_dahuva')
 * based on dvrname mapping matching dashboard_api.php
 */
export function getRefreshUrl(row) {
  if (row?.refresh_url) return row.refresh_url;
  const dvr_name = String(row?.dvrname || row?.dvrName || '').toLowerCase().trim();
  if (['cpplus', 'cpplus_orange', 'cpplus_indigo', 'dahuva', 'dahua', 'dhaua', 'dhauva'].includes(dvr_name)) {
    return '8005/refresh/cpplus_dahuva';
  }
  if (dvr_name === 'hikvision') {
    return '8006/refresh/hikvision';
  }
  if (dvr_name === 'hikvision_nvr') {
    return '8004/refresh/hikvision_nvr';
  }
  if (['unv', 'uniview'].includes(dvr_name)) {
    return '8003/refresh/unv';
  }
  return '';
}

/**
 * Normalizes full HTTP URL from refresh_url string (e.g. '8003/refresh/unv')
 */
export function buildRefreshApiUrl(refreshUrl) {
  if (!refreshUrl) return null;
  if (refreshUrl.startsWith('http://') || refreshUrl.startsWith('https://')) {
    return refreshUrl;
  }
  const clean = refreshUrl.replace(/^\/+/, '').replace(/^:+/, '');
  const host = window.location.hostname || '127.0.0.1';
  return `http://${host}:${clean}`;
}

/**
 * Calls DVR python refresh microservice API via POST with { ip }
 * @param {object} site - DVR site item
 */
export async function triggerDvrRefresh(site) {
  const ip = site.IPAddress || site.ipAddress;
  if (!ip || ip === '0.0.0.0') {
    throw new Error('Valid IP address is required to refresh DVR');
  }

  const refreshUrl = site.refresh_url || site.refreshUrl || getRefreshUrl(site);
  if (!refreshUrl) {
    throw new Error(`No refresh URL configured for DVR type: ${site.dvrName || site.dvrname || 'Unknown'}`);
  }

  const fullUrl = buildRefreshApiUrl(refreshUrl);

  const controller = new AbortController();
  // DVR check queries hardware, time, HDD and takes parallel ffmpeg snapshots; allow up to 120s
  const timer = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ ip }),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out while connecting to ${fullUrl}`);
    }
    throw err;
  }
}

/**
 * Fetches DVR system & incident logs from dvr_logs_api.php
 * @param {object} params - query parameters (page, limit, search, atmid, ipaddress, dvrname, major_type, from_date, to_date)
 * @returns {Promise<object>} Logs payload with pagination and records
 */
export async function fetchDvrLogs({
  page = 1,
  limit = 20,
  search = '',
  atmid = '',
  ipaddress = '',
  dvrname = '',
  major_type = '',
  from_date = '',
  to_date = ''
} = {}) {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (search) queryParams.append('search', search);
  if (atmid) queryParams.append('atmid', atmid);
  if (ipaddress) queryParams.append('ipaddress', ipaddress);
  if (dvrname) queryParams.append('dvrname', dvrname);
  if (major_type && major_type !== 'ALL') queryParams.append('major_type', major_type);
  if (from_date) queryParams.append('from_date', from_date);
  if (to_date) queryParams.append('to_date', to_date);

  const endpoint = `${API_ENDPOINTS.FETCH_DVR_LOGS}?${queryParams.toString()}`;
  return await fetchEndpoint(endpoint, 15000);
}

/**
 * Fetches distinct major types dynamically with counts from dvr_logs_api.php
 * @returns {Promise<Array>} List of { major_type, count }
 */
export async function fetchMajorTypes() {
  const endpoint = `${API_ENDPOINTS.FETCH_DVR_LOGS}?fetch_major_types=1`;
  const response = await fetchEndpoint(endpoint, 10000);
  return response?.data || [];
}

/**
 * Fetches distinct DVR names dynamically with counts from dvr_logs_api.php
 * @returns {Promise<Array>} List of { dvrname, count }
 */
export async function fetchLogDvrNames() {
  const endpoint = `${API_ENDPOINTS.FETCH_DVR_LOGS}?fetch_dvr_names=1`;
  const response = await fetchEndpoint(endpoint, 10000);
  return response?.data || [];
}

// ============================================================
// Footage Availability Report
// ============================================================

/**
 * Fetches paginated footage availability records with optional filters
 * @param {object} params - page, limit, status, ip, from_date, to_date, search, sort, dir
 */
export async function fetchFootageList({
  page = 1,
  limit = 25,
  status = '',
  ip = '',
  from_date = '',
  to_date = '',
  search = '',
  sort = 'id',
  dir = 'DESC'
} = {}) {
  const q = new URLSearchParams();
  q.append('page', page);
  q.append('limit', limit);
  if (status)    q.append('status', status);
  if (ip)        q.append('ip', ip);
  if (from_date) q.append('from_date', from_date);
  if (to_date)   q.append('to_date', to_date);
  if (search)    q.append('search', search);
  if (sort)      q.append('sort', sort);
  if (dir)       q.append('dir', dir);
  const endpoint = `${API_ENDPOINTS.FETCH_FOOTAGE}?${q.toString()}`;
  return await fetchEndpoint(endpoint, 15000);
}

/**
 * Fetches total and per-status counts for footage availability report
 */
export async function fetchFootageCounts() {
  const response = await fetchEndpoint(API_ENDPOINTS.FETCH_FOOTAGE_COUNTS, 10000);
  return response?.data || { total: 0, status_counts: {} };
}

/**
 * Fetches distinct status values with counts (for filter dropdown)
 */
export async function fetchFootageStatusTypes() {
  const response = await fetchEndpoint(API_ENDPOINTS.FETCH_FOOTAGE_STATUS_TYPES, 10000);
  return response?.data || [];
}





