/**
 * ==============================================================================
 * DVR Dashboard API Configuration
 * ==============================================================================
 * Central configuration for SAR DVR Dashboard API base URL and all endpoints.
 */

function resolveBaseUrl() {
  const envUrl = (import.meta.env?.VITE_API_BASE_URL || '').trim();
  const isLocalUrl = /localhost|127\.0\.0\.1/.test(envUrl);

  // Development: use Vite's reverse proxy (prevents CORS issues)
  if (import.meta.env?.DEV) {
    if (!envUrl || isLocalUrl) return '/DVRDashboard';
    return envUrl.replace(/\/+$/, '');
  }

  // Production: an explicit, non-local URL in .env wins
  if (envUrl && !isLocalUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  // Production default: API lives in the same folder as the app
  // e.g. http://223.182.122.63:8080/dvr_dashboard/api/...
  return (import.meta.env?.BASE_URL || '/').replace(/\/+$/, '') || '/DVRDashboard';
}

export const API_BASE_URL = resolveBaseUrl();

export const API_ENDPOINTS = {
  // Core Metric & Sites Endpoints (dashboard_api.php)
  FETCH_ALL_SITES: 'api/dashboard_api.php?fetch_all_sites=1',
  FETCH_ONLINE_SITES: 'api/dashboard_api.php?fetch_online_sites=1',
  FETCH_OFFLINE_SITES: 'api/dashboard_api.php?fetch_offline_sites=1',
  FETCH_LOGIN_FAILED: 'api/dashboard_api.php?fetch_login_failed=1',
  FETCH_HDD_NOT_WORKING: 'api/dashboard_api.php?fetch_hdd_not_working=1',
  FETCH_PING_OK: 'api/dashboard_api.php?fetch_ping_ok=1',
  FETCH_PING_FAILED: 'api/dashboard_api.php?fetch_ping_failed=1',
  FETCH_TIME_DIFF_ONLINE: 'api/dashboard_api.php?fetch_time_diff_online=1',
  FETCH_TIME_DIFF_OFFLINE: 'api/dashboard_api.php?fetch_time_diff_offline=1',
  FETCH_ONLINE_NETWORK_COUNT: 'api/dashboard_api.php?fetch_online_network_count=1',
  FETCH_OFFLINE_NETWORK_NOT_WORKING: 'api/dashboard_api.php?fetch_offline_network_not_working=1',
  FETCH_DUPLICATE_SITES: 'api/dashboard_api.php?fetch_duplicate_sites=1',
  FETCH_CAMERA_COUNT_BY_CHANNEL: 'api/dashboard_api.php?fetch_camera_count_by_channel=1',
  FETCH_NETWORK_STATUS_COUNT: 'api/dashboard_api.php?fetch_network_status_count=1',

  // Dropdown Endpoints (Dashboard_dropdown_api.php)
  FETCH_ALL_DROPDOWNS: 'api/Dashboard_dropdown_api.php?fetch_all_dropdowns=1',
  FETCH_CUSTOMERS: 'api/Dashboard_dropdown_api.php?fetch_customer=1',
  FETCH_BANKS: 'api/Dashboard_dropdown_api.php?fetch_bank=1',
  FETCH_DVR_NAMES: 'api/Dashboard_dropdown_api.php?fetch_dvrname=1',
  FETCH_ATM_IDS: 'api/Dashboard_dropdown_api.php?fetch_atmid=1',

  // Incident & Security Logs Endpoint (dvr_logs_api.php)
  FETCH_DVR_LOGS: 'api/dvr_logs_api.php',

  // Footage Availability Report (footage_api.php)
  FETCH_FOOTAGE: 'api/footage_api.php',
  FETCH_FOOTAGE_COUNTS: 'api/footage_api.php?fetch_footage_counts=1',
  FETCH_FOOTAGE_STATUS_TYPES: 'api/footage_api.php?fetch_status_types=1',

  // Analytics (analytics_api.php)
  FETCH_ANALYTICS: 'api/analytics_api.php?fetch_all=1',

  // Authentication Endpoints (auth_api.php)
  AUTH_LOGIN: 'api/auth_api.php?action=login',
  AUTH_VERIFY: 'api/auth_api.php?action=verify',
  AUTH_LOGOUT: 'api/auth_api.php?action=logout',
};

/**
 * Builds the full URL for a given endpoint path or query
 * @param {string} endpoint - The relative endpoint string
 * @returns {string} The normalized full API URL
 */
export function buildApiUrl(endpoint) {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return `${API_BASE_URL}/${cleanEndpoint}`;
}