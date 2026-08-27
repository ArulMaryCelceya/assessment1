# Assessment1 — Business Analytics Dashboard

**Subtitle**: Restaurant Sales & Performance Intelligence  
**Developer**: Celceya  
**Project Name**: assessment1  

Live Demo: [ADD VERCEL URL]  
GitHub Repository: https://github.com/ArulMaryCelceya/assessment1  

---

## Overview

**Assessment1 — Business Analytics Dashboard** is an enterprise-grade, high-performance web application designed to analyze restaurant sales performance across multiple outlets, menu categories, order types, and payment channels.

Built specifically for the Software Developer Intern technical assessment, the application processes a real-world dataset of approximately **300,000 order line items** and transforms raw transactional data into actionable business intelligence metrics, interactive visualization charts, dynamic insights, and a searchable, paginated data explorer table.

---

## Key Features

* **Instant Executive KPIs**:
  * **Total Revenue**: `SUM(Price × Quantity)` formatted in Indian Rupees (₹).
  * **Total Orders**: Calculated using unique `BillNo` identifiers (`COUNT(DISTINCT BillNo)`).
  * **Total Records**: Total dataset row count (300,000 line items).
  * **Total Quantity Sold**: Sum of all unit quantities sold.
  * **Average Order Value (AOV)**: `Total Revenue / Unique Orders`.
  * **Average Item Price**: Average unit price per item.

* **Dynamic Global Filtering System**:
  * Date Range picker (Min & Max derived automatically from actual dataset).
  * Multi-select / dropdown filters for Outlets, Brands, Categories (Groups), Order Types (Dine-In, Takeaway, Delivery), and Settlement Methods.
  * Searchable item selector & active filter chips with one-click clear.
  * Friendly zero-result state handling when filters match no data.

* **Interactive Visualization Suite**:
  * **Revenue Trend Chart**: Area chart with Daily, Weekly, and Monthly grouping options.
  * **Revenue by Outlet**: Bar chart ranking outlets by revenue with Top 10 / Top 20 selector.
  * **Revenue by Category**: Donut chart displaying category revenue contribution and percentage share.
  * **Orders by Order Type**: Donut chart detailing order volumes across Dine-In, Takeaway, and Delivery.
  * **Top Performing Items**: Horizontal bar chart ranking menu items by revenue with Top 10 / Top 20 / Top 50 selector.
  * **Revenue by Settlement**: Bar chart breaking down revenue by payment methods (Cash/Card/Coupon, SwiggyPay, ZomatoPay, Dineout).

* **Auto-Calculated Business Insights**:
  * Dynamically computes top-performing outlets, categories, best-selling items, most frequent order types, peak revenue days, and overall AOV.

* **Data Explorer Table**:
  * Displays line-item records (`BillNo`, `Order Date`, `Outlet`, `Brand`, `Category`, `Item`, `Order Type`, `Price`, `Quantity`, `Revenue`, `Settlement`).
  * Supports column sorting, global debounced search, configurable pagination (20/25/50 per page), and one-click **CSV Export**.

---

## Dataset Architecture & Pipeline

### Raw Dataset Characteristics
* **Total Rows**: 300,000 line items
* **File Size**: ~15.7 MB (`data.xlsx`)
* **Key Business Rules**:
  * A single order contains multiple line items sharing the same `BillNo`.
  * `Revenue` is computed as `Price × Quantity`.
  * `Total Orders` represents unique `BillNo` instances (110,478 unique orders).

### Data Pipeline Architecture

```
data.xlsx (300,000 raw rows)
       │
       ▼
scripts/preprocess_data.py (Clean, Validate, Calculate Revenue & Unique BillNo)
       │
       ├─────────────────────────────────┬────────────────────────────────┐
       ▼                                 ▼                                ▼
data/processed/summary.json     data/processed/analytics.json    data/processed/matrix.json
(Global KPIs & Meta)          (Aggregated Time Series,           (Granular Filter Matrix)
                               Outlets, Items, Categories)
       │                                 │                                │
       └─────────────────────────────────┴────────────────────────────────┘
                                         │
                                         ▼
                            Next.js API & Data Layer (/api/analytics)
                                         │
                                         ▼
                    React Dashboard UI (Recharts + Tailwind CSS)
```

---

## Why This Architecture?

### The 300,000 Row Performance Challenge
Sending 300,000 raw JSON rows (~15-20 MB uncompressed) directly to client browsers introduces major performance flaws:
1. **Initial Page Load Lag**: High network bandwidth consumption and browser parsing delay (>5-10 seconds).
2. **Client Memory Overhead**: Storing 300K JavaScript objects consumes hundreds of megabytes of client RAM.
3. **UI Freeze on Filter Changes**: Recalculating aggregations over 300,000 rows on every keystroke or filter toggle causes UI stuttering and unresponsiveness.
4. **Vercel Serverless Limits**: Serverless functions have memory and execution time boundaries.

### Solution: Precomputed Analytics Matrix & Incremental Filtering
To solve this, a data preprocessing pipeline precalculates:
1. **Summary & Categorical Aggregates**: Instant executive metrics and chart datasets (<100 KB payload).
2. **Multi-Dimensional Filter Matrix**: Pre-grouped metric cells aggregated across Date, Outlet, Group, Order Type, and Settlement (reduces 300K rows down to ~69K compact aggregate matrix cells).
3. **Sub-100ms Query Times**: Filter operations evaluate in < 5 milliseconds in memory, providing instantaneous UI transitions without client-side lag or server load.

---

## Technical Stack & Dependencies

* **Framework**: Next.js 14+ (App Router)
* **Library**: React 18 & TypeScript
* **Styling**: Tailwind CSS & PostCSS
* **Charts**: Recharts
* **Icons**: Lucide React
* **Data Processing**: Python 3 / Pandas & Node.js Scripts

---

## Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Celceya/assessment1.git
   cd assessment1
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Preprocess Dataset**:
   *(If modifying `data.xlsx` or generating fresh processed JSON files)*
   ```bash
   npm run preprocess
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Deployment

1. **Verify Production Build**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

3. **Vercel Deployment**:
   * Connect repository to Vercel.
   * Vercel will automatically run `npm run build`.
   * Preprocessed JSON files in `data/processed/` are bundled with the deployment for sub-100ms server response globally.

---

## Quality Control & Verification

* ✅ **Data Accuracy**: `Revenue = Price × Quantity`, Unique `BillNo` counting verified against raw dataset metrics.
* ✅ **Zero Lint / Type Errors**: Strict TypeScript checking and ESLint rules applied.
* ✅ **Vercel Compatibility**: Fully optimized for edge & serverless deployments without local binary dependencies.
* ✅ **Responsive Layout**: Designed for Desktop, Laptop, Tablet, and Mobile screens.

---

**Developed by Celceya** for **Assessment1**.
