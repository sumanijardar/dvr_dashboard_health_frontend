# DVR Dashboard — Fleet Surveillance & Monitoring System

A centralized enterprise monitoring and management system for nationwide ATM DVRs, incident logs, telemetry analytics, and footage availability tracking.

Built with **PHP / MySQL (XAMPP)** backend and **React 19 + Vite + Tailwind CSS v4 + Recharts** frontend.

---

## 🚀 Key Features

1. **Dashboard (`/dashboard`):**
   - High-level KPI metric cards (Total Sites, Online, Offline, HDD Not Working, Login Failed, Ping Status).
   - Real-time refresh triggers per site.
   - Quick navigation into filtered surveillance lists.

2. **DVR Surveillance (`/surveillance`):**
   - Live DVR sites inventory with comprehensive hardware telemetry.
   - Filter by customer, bank, DVR brand, and online/offline status.
   - Search by ATM ID, IP Address, site details, and pagination.

3. **Alerts & Incident Logs (`/alerts`):**
   - Real-time security alerts from `dvr_fetched_logs`.
   - Dynamic Major Type dropdown and quick-filter pills (Alarm, Information, Account, Exception, Motion Detection, etc.).
   - DVR name filter with brand-styled badges.
   - Dedicated IP and User details section with copy-to-clipboard.
   - Raw XML payload inspector modal.

4. **Fleet Analytics (`/analytics`):**
   - Real-time telemetry visualized via Recharts.
   - Reachability donut (Online vs Offline ratio).
   - DVR Brand distribution bar charts.
   - Network status and HDD Health breakdown.
   - Login status stacked bar per DVR brand.
   - Footage availability donut and top incident log categories.

5. **Footage Downloader (`/footage`):**
   - Report table from `footage_availability_report`.
   - Total records & status summary cards (`PRESENT`, `NO_RECORDING`, `DVR_DOWN`).
   - Dynamic status filter, IP search, and Date range (`From` / `To`) pickers.

---

## 🛠️ Project Architecture

```
DVRDashboard/
├── api/                            # PHP Backend Endpoints
│   ├── config.php                  # Database connection & CORS configuration
│   ├── dashboard_api.php           # Core sites telemetry & metric counters
│   ├── Dashboard_dropdown_api.php  # Filter dropdown options (Customers, Banks, ATMs)
│   ├── dvr_logs_api.php            # Security & incident logs with dynamic filters
│   ├── footage_api.php             # Footage availability report & status types
│   └── analytics_api.php           # Consolidated metrics for charts & analytics
│
└── DVRDashboard/                   # React Frontend (Vite)
    ├── src/
    │   ├── components/             # Reusable UI components (Sidebar, Header, Layout)
    │   │   └── views/              # View components (AlertsView, AnalyticsView, etc.)
    │   ├── config/apiConfig.js     # Centralized API endpoint URLs & base resolution
    │   ├── context/ThemeContext.jsx# Dark / Light theme provider
    │   ├── hooks/useDvrSites.js    # Telemetry data hook & global state
    │   ├── pages/                  # Route page wrappers (Dashboard, Surveillance, etc.)
    │   ├── services/dvrApiService.js # API communication layer
    │   ├── App.jsx                 # Client-side router & page layout
    │   └── main.jsx                # React app entry point
    ├── vite.config.js              # Vite configuration & proxy settings
    ├── package.json
    └── .env                        # Frontend environment variables
```

---

## ⚙️ Project Setup & Installation

### Prerequisites
- **XAMPP** (Apache + MySQL / MariaDB + PHP 8.x)
- **Node.js** (v18 or higher) & **npm**

---

### Step 1: Database Setup
1. Start **Apache** and **MySQL** in XAMPP Control Panel.
2. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
3. Ensure database `esurv` exists with standard tables:
   - `all_dvr_live`
   - `dvr_fetched_logs`
   - `footage_availability_report`
4. If your MySQL credentials differ, update [`api/config.php`](file:///c:/xampp/htdocs/DVRDashboard/api/config.php):
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'esurv');
   define('DB_PORT', 3306);
   ```

---

### Step 2: Backend Verification
The PHP backend files must reside under `C:\xampp\htdocs\DVRDashboard\api\`.
Verify access by testing in your browser:
- `http://localhost/DVRDashboard/api/dashboard_api.php?fetch_all_sites=1`
- `http://localhost/DVRDashboard/api/analytics_api.php?fetch_all=1`
- `http://localhost/DVRDashboard/api/footage_api.php?fetch_footage_counts=1`

---

### Step 3: Frontend Setup & Running

1. Navigate to the frontend directory:
   ```bash
   cd C:\xampp\htdocs\DVRDashboard\DVRDashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment:
   Ensure `.env` exists in `DVRDashboard/`:
   ```env
   VITE_API_BASE_URL=http://localhost/DVRDashboard
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```
   Open your browser at **`http://localhost:5173`**.

---

### Step 4: Production Build
To generate the production-ready static assets:
```bash
npm run build
```
The output will be created in `DVRDashboard/dist/`.

---

## 🔒 CORS & Reverse Proxy
- **Development:** Vite is pre-configured with a reverse proxy (`/DVRDashboard` -> `http://127.0.0.1`) in `vite.config.js` to ensure zero CORS hurdles during local dev.
- **Backend:** `api/config.php` sends appropriate `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and handles HTTP `OPTIONS` preflight requests automatically.
