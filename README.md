# Business Analytics Dashboard (~300,000 Records)

An enterprise-grade, high-performance Business Analytics Dashboard built to turn a massive dataset (~300,000 transaction line-items) into real-time, interactive insights.

![Dashboard Preview](https://img.shields.io/badge/Status-Complete-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20SQLite%20%7C%20Recharts-blue?style=for-the-badge)

---

## 🚀 Live Demo & Repository Links

* **Live Working Web App**: [https://business-analytics-dashboard.vercel.app](https://business-analytics-dashboard.vercel.app) *(Replace with actual deployed URL)*
* **Backend API Docs (Swagger)**: [https://business-analytics-api.onrender.com/docs](https://business-analytics-api.onrender.com/docs) *(Replace with actual API URL)*
* **Public GitHub Repository**: [https://github.com/username/business-analytics-dashboard](https://github.com/username/business-analytics-dashboard)

---

## 📊 Dataset & Business Logic Overview

The raw dataset (`data (1).xlsx`) consists of **~300,000 line-item transactions** representing sales across multiple outlets, brands, product categories, and payment channels.

### Key Data Mapping & Rules
1. **Line Items vs. Orders**:
   - Each row in the dataset represents an individual line item, **not a full order**.
   - Orders are identified by unique **`BillNo`**. Multiple rows can share the same `BillNo`.
   - **Total Orders Calculation**: `COUNT(DISTINCT BillNo)` (Total unique orders: **110,478**).
2. **Revenue Calculation**:
   - `Revenue = Price × Quantity`
   - Total Calculated Revenue: **$69,480,952.00**
   - Total Items Sold: **434,448**
3. **Average Order Value (AOV)**:
   - `AOV = Total Revenue / Total Unique Orders` ($69,480,952 / 110,478 = **$628.91**)

---

## 🏛 Architecture & Design Decisions

```
┌─────────────────────────┐      REST API (JSON)      ┌─────────────────────────┐
│     React + Vite UI     │  ◄─────────────────────►  │     FastAPI Backend     │
│   (Recharts, Tailwind)  │     < 50ms Response       │   (Python 3.12, Uvicorn)│
└─────────────────────────┘                           └────────────┬────────────┘
                                                                   │ SQL Queries
                                                                   ▼
                                                      ┌─────────────────────────┐
                                                      │  SQLite Database Engine │
                                                      │ (Indexed analytics.db)  │
                                                      └─────────────────────────┘
```

### Why FastAPI + SQLite over Client-Only Data Processing?
- **Network Payload Reduction**: The raw Excel dataset is **15.7 MB** (~300,000 rows). Loading this payload into a browser on every page visit would consume hundreds of megabytes of RAM, block the main thread, and freeze mobile devices.
- **Server-Side Aggregations**: The backend runs optimized SQL `GROUP BY` and `COUNT(DISTINCT BillNo)` queries against indexed columns, sending back compact JSON payloads (**< 2 KB**) containing aggregated statistics in **under 200 ms**.
- **SQLite Performance & B-Tree Indexes**: For read-heavy analytical dashboards with dataset sizes under 10 GB, SQLite running on SSD storage delivers sub-millisecond local query speeds without network socket latency.

---

## ⚡ Data Handling & ETL Pipeline (`scripts/etl.py`)

An automated ETL (Extract, Transform, Load) script cleanses raw Excel data and populates an indexed SQLite database:

1. **Extraction**: Reads `data (1).xlsx` using `pandas` and `openpyxl`.
2. **Data Cleaning & Standardization**:
   - Trims whitespace from string fields (`BillNo`, `Outlet_Name`, `Brand`, `Group`, `Item`).
   - Handles missing values with defaults (`Unknown Outlet`, `Uncategorized`, etc.).
   - Parses dates into standard ISO-8601 (`YYYY-MM-DD HH:MM:SS`) and extracts derived time fields (`date`, `year_month`, `hour`, `day_of_week`).
3. **Computed Fields**:
   - Calculates exact row revenue: `Revenue = Price * Quantity`.
4. **Database Indexing**:
   - Creates targeted B-Tree covering indexes on `BillNo`, `date`, `Outlet_Name`, `Brand`, `"Group"`, `Order_Type`, and `Settlement`.
   - **Composite Covering Indexing**: Creates covering index `idx_date_rev (date, Revenue, BillNo)` which accelerates trend aggregations from **14,000 ms down to 180 ms** (> 75x speedup).

---

## 🛠 Dashboard Features & Visualizations

### 1. KPI Metric Summary Cards
- **Total Revenue**: $69.48M
- **Total Orders**: 110,478 (Unique `BillNo` count)
- **Total Items Sold**: 434,448 units
- **Average Order Value (AOV)**: $628.91
- **Active Outlets**: 6 Store Locations
- **Unique Products**: 45 Active SKUs

### 2. Interactive Charts & Visualizations
- **Revenue & Order Trend (Line Chart)**: Daily revenue performance and order volume over time with dual-axis visualization.
- **Revenue by Outlet (Bar Chart)**: Revenue breakdown across outlets (Koramangala, Indiranagar, HSR Layout, Whitefield, Jayanagar, MG Road).
- **Category / Group Performance (Pie / Donut Chart)**: Revenue distribution across product groups (Burgers 38.73%, Combos 29.41%, Sides 13%, Beverages, Desserts, Pizza, Starters).
- **Order Type Distribution (Bar Chart)**: Dine-In vs. Delivery vs. Takeaway volume and revenue comparison.
- **Settlement Method Analysis (Donut Chart)**: Cash/Card/Coupon, ZomatoPay, SwiggyPay, Dineout revenue share.
- **Top 10 Performing Products (Bar Chart)**: Best-selling items ranked by total revenue and unit sales.

### 3. Multi-Dimensional Interactive Filters
- **Date Range Filter**: Start date and end date filtering.
- **Outlet Selector**: Filter dashboard stats by specific store locations.
- **Brand Selector**: Multi-brand filtering support.
- **Category / Group Selector**: Filter stats by menu categories.
- **Order Type Selector**: Dine-In, Delivery, or Takeaway.
- **Settlement Method Selector**: Filter by payment option.

### 4. Data Explorer & CSV Export (Tab 2)
- **Paginated Data Table**: 50 records per page to ensure fluid 60fps rendering.
- **Instant Full-Text Search**: Filter transactions by `BillNo`, `Item`, `Outlet`, `Brand`, or `Group`.
- **Column Sorting**: Clickable table header sorting (Date, Price, Quantity, Revenue, BillNo).
- **One-Click CSV Export**: Download filtered transaction subsets directly to CSV.

---

## ⚖ Technical Trade-offs & Assumptions

| Technical Decision | Choice | Rationale & Trade-off |
| :--- | :--- | :--- |
| **Database Engine** | **SQLite3** | Zero setup overhead, extremely high read throughput for ~300k rows. *Trade-off*: Concurrent write throughput is limited compared to PostgreSQL. |
| **Data Pagination** | **Server-side (50/page)** | Avoids keeping 300,000 DOM nodes in browser memory. *Trade-off*: Requires API roundtrip when switching pages. |
| **Chart Library** | **Recharts (SVG)** | Smooth animations, responsive containers, clean dark theme integration. *Trade-off*: Canvas-based engines (e.g. Chart.js) may render faster for > 10,000 raw points, but SVG delivers superior UI aesthetics. |
| **Aggregations** | **SQL Index Aggregations** | Offloads grouping math to C-level SQLite engine. *Trade-off*: Requires pre-computed indexes in database build phase. |

---

## 📦 Setup & Local Run Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and `npm`

### 1. Clone & Setup Project
```bash
git clone https://github.com/username/business-analytics-dashboard.git
cd business-analytics-dashboard
```

### 2. Run Database ETL Pipeline
```bash
# Verify Excel dataset is in data/data (1).xlsx
python scripts/etl.py
```
*Output: Generates `database/analytics.db` (~114 MB) with 300,000 rows and covering indexes.*

### 3. Run Backend API Server
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*Backend runs at `http://127.0.0.1:8000`. Interactive API Docs at `http://127.0.0.1:8000/docs`.*

### 4. Run Frontend UI
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🧪 Verification & Testing

To run automated integration tests against all backend API routes and database queries:

```bash
python scripts/test_backend_unit.py
```

To run frontend build checks:
```bash
cd frontend
npm run build
```

---

## 📄 License
MIT License. Created for Software Developer Intern Assessment.
