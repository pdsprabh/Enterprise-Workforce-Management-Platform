# Ayush's Day 1 & Day 2 — Frontend UI Implementation Plan

## Project Context

The **Enterprise Workforce Management Platform** is a monorepo with:
- **Frontend**: React 19 + Vite 8 + Tailwind CSS 4 + React Router 7 + Axios
- **Backend**: Node.js + Express 5 + MongoDB (Mongoose) + JWT + Socket.io
- **Your Branch**: `ayush-frontend`
- **Your Role**: Frontend UI (per `docs/module-ownership.md`)

---

## Current State of the Codebase

The project is at a **very early scaffold stage**:

| Area | Status |
|------|--------|
| `frontend/src/App.jsx` | Bare skeleton — 2 placeholder routes (`/` and `/login`), no real components |
| `frontend/src/main.jsx` | Standard React entry point |
| `frontend/src/index.css` | Tailwind directives + basic root styles |
| `frontend/src/App.css` | Vite template default styles (unused) |
| Frontend `src/` | No subdirectories created yet — `setup_structure.ps1` defined the plan but directories are missing |
| Backend models | All 15 models are **empty stubs** (no schema fields defined) |
| Backend `src/app.js` | Basic Express server with CORS, JSON parsing, error handler — no routes connected |

---

## Planned Frontend Directory Structure

```
frontend/src/
├── api/                    # Axios service layer
│   ├── axiosInstance.js    # Configured Axios with JWT interceptors
│   ├── authApi.js          # Auth endpoints (login, register, logout, me)
│   └── employeeApi.js      # Employee CRUD endpoints
├── assets/                 # Images, icons, fonts
├── components/             # Reusable UI components
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── Topbar.jsx          # Top navigation bar
│   ├── AuthLayout.jsx      # Layout wrapper for auth pages
│   ├── ui/
│   │   ├── Button.jsx      # Button with variants, sizes, loading state
│   │   ├── Input.jsx       # Form input with label, error, icon support
│   │   ├── Card.jsx        # Card container with header/body/footer
│   │   ├── LoadingSpinner.jsx
│   │   ├── Toast.jsx       # Notification toasts
│   │   ├── Badge.jsx       # Status badges (Active, Inactive, etc.)
│   │   ├── Modal.jsx       # Reusable modal dialog
│   │   ├── Avatar.jsx      # User avatar with initials fallback
│   │   ├── SearchBar.jsx   # Debounced search input
│   │   ├── Pagination.jsx  # Page navigation
│   │   └── DataTable.jsx   # Full-featured data table
│   └── dashboard/
│       ├── StatCard.jsx    # Metric card with icon + change indicator
│       ├── RecentActivity.jsx  # Activity timeline
│       ├── QuickActions.jsx    # Action shortcut grid
│       └── ChartCard.jsx      # Chart visualization wrapper
├── context/                # React Context providers
│   ├── AuthContext.jsx     # Authentication state (user, token, login/logout)
│   └── ThemeContext.jsx    # Light/dark mode toggle
├── hooks/                  # Custom hooks
│   ├── useAuth.js          # Convenience hook wrapping AuthContext
│   └── useDebounce.js      # Debounce hook for search inputs
├── layouts/
│   └── DashboardLayout.jsx # Main layout (Sidebar + Topbar + Outlet)
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ForgotPasswordPage.jsx
│   ├── dashboard/
│   │   └── DashboardPage.jsx
│   ├── employees/
│   │   ├── EmployeeListPage.jsx
│   │   ├── EmployeeDetailPage.jsx
│   │   └── AddEmployeePage.jsx
│   ├── attendance/         # Placeholder
│   ├── leave/              # Placeholder
│   ├── payroll/            # Placeholder
│   ├── recruitment/        # Placeholder
│   ├── performance/        # Placeholder
│   ├── projects/           # Placeholder
│   ├── assets/             # Placeholder
│   ├── helpdesk/           # Placeholder
│   ├── documents/          # Placeholder
│   ├── analytics/          # Placeholder
│   └── ai-assistant/       # Placeholder
├── routes/
│   ├── ProtectedRoute.jsx  # Auth guard — redirects to /login
│   └── PublicRoute.jsx     # Redirects logged-in users to /dashboard
└── utils/
    ├── constants.js        # API URL, roles, departments, nav config
    ├── formatters.js       # Date, currency, name formatting helpers
    └── mockData.js         # Dummy data for employees, dashboard, activities
```

---

## Day 1: Project Foundation, Auth UI & Layout System

### Task 1.1 — Create Frontend Directory Structure
Create all directories listed above under `frontend/src/`.

### Task 1.2 — Design System & Global Styles

**Files:** `src/index.css` (modify), `src/App.css` (overwrite)

- Replace Vite default styles with a professional enterprise design system
- Define CSS custom properties:
  ```
  --color-primary: #4F46E5 (Indigo)
  --color-primary-light, --color-primary-dark
  --color-success: #10B981, --color-warning: #F59E0B, --color-danger: #EF4444
  --color-bg-primary, --color-bg-secondary, --color-bg-sidebar
  --color-text-primary, --color-text-secondary, --color-text-muted
  --font-family-sans (Inter), --font-family-mono
  --spacing-*, --radius-*, --shadow-*
  ```
- Light/dark theme support via CSS variables
- Base reset and typography styles

### Task 1.3 — Axios API Layer

**Files:** `src/api/axiosInstance.js`, `src/api/authApi.js`

| File | Purpose |
|------|---------|
| `axiosInstance.js` | Axios instance with `baseURL: http://localhost:5000/api`, JWT request interceptor, 401 response interceptor |
| `authApi.js` | `login(email, password)`, `register(userData)`, `logout()`, `getCurrentUser()`, `forgotPassword(email)` |

### Task 1.4 — Auth Context & Route Guards

**Files:** `src/context/AuthContext.jsx`, `src/context/ThemeContext.jsx`, `src/routes/ProtectedRoute.jsx`, `src/routes/PublicRoute.jsx`

| File | Purpose |
|------|---------|
| `AuthContext.jsx` | Provides `user`, `token`, `isAuthenticated`, `isLoading`, `login()`, `logout()`, `register()`. Stores JWT in localStorage. Auto-validates token on mount. |
| `ThemeContext.jsx` | Provides `theme` (light/dark), `toggleTheme()`. Persists in localStorage. |
| `ProtectedRoute.jsx` | Wraps authenticated routes. Redirects to `/login` if not logged in. Shows spinner while checking. |
| `PublicRoute.jsx` | Wraps login/register. Redirects to `/dashboard` if already logged in. |

### Task 1.5 — Authentication Pages

**Files:** `src/pages/auth/LoginPage.jsx`, `RegisterPage.jsx`, `ForgotPasswordPage.jsx`

**LoginPage.jsx:**
- Email + Password form with validation
- "Remember Me" checkbox
- "Forgot Password?" link
- Loading state on submit
- Error/success toast feedback
- Responsive, enterprise-grade design

**RegisterPage.jsx:**
- Full Name, Email, Password, Confirm Password fields
- Client-side validation (password match, email format)
- Link to login page

**ForgotPasswordPage.jsx:**
- Email input + submit
- Success/error feedback message

### Task 1.6 — Main Application Layout

**Files:** `src/layouts/DashboardLayout.jsx`, `src/components/Sidebar.jsx`, `src/components/Topbar.jsx`, `src/components/AuthLayout.jsx`

**DashboardLayout.jsx:**
- Sidebar + Topbar + `<Outlet />` content area
- Responsive — sidebar collapses to hamburger on mobile

**Sidebar.jsx:**
- Grouped navigation links (Main, People, Organization, Operations, Insights)
- Active link highlighting with `NavLink`
- Collapsible with toggle button
- SVG icons for each item

**Topbar.jsx:**
- Hamburger toggle, global search input
- Notification bell, user avatar dropdown (Profile, Settings, Logout)
- Theme toggle (light/dark)

**AuthLayout.jsx:**
- Centered card layout for auth pages
- Platform branding/logo

### Task 1.7 — Route Configuration

**File:** `src/App.jsx` (modify)

Full route tree:
```
/login          → LoginPage (PublicRoute)
/register       → RegisterPage (PublicRoute)
/forgot-password → ForgotPasswordPage (PublicRoute)
/               → Redirect to /dashboard
/dashboard      → DashboardPage (ProtectedRoute + DashboardLayout)
/employees      → EmployeeListPage (ProtectedRoute + DashboardLayout)
/employees/:id  → EmployeeDetailPage (ProtectedRoute + DashboardLayout)
/employees/add  → AddEmployeePage (ProtectedRoute + DashboardLayout)
/attendance     → Placeholder (ProtectedRoute + DashboardLayout)
/leave          → Placeholder
/payroll        → Placeholder
/recruitment    → Placeholder
/performance    → Placeholder
/projects       → Placeholder
/assets         → Placeholder
/helpdesk       → Placeholder
/documents      → Placeholder
/analytics      → Placeholder
/ai-assistant   → Placeholder
*               → 404 Not Found
```

### Task 1.8 — Reusable UI Components

**Files:** `src/components/ui/Button.jsx`, `Input.jsx`, `Card.jsx`, `LoadingSpinner.jsx`, `Toast.jsx`

| Component | Features |
|-----------|----------|
| `Button` | Variants: primary, secondary, outline, ghost, danger. Sizes: sm, md, lg. Loading spinner + disabled state. |
| `Input` | Label, placeholder, error message, icon prefix/suffix, types: text, email, password, number. |
| `Card` | Container with optional header, body, footer slots. Shadow + border radius. |
| `LoadingSpinner` | CSS animated spinner. Fullscreen or inline variants. |
| `Toast` | Success/error/warning/info notifications. Auto-dismiss. Stack support. |

---

## Day 2: Dashboard Page & Employee Management UI

### Task 2.1 — Dashboard Page

**Files:** `src/pages/dashboard/DashboardPage.jsx`, `src/components/dashboard/StatCard.jsx`, `RecentActivity.jsx`, `QuickActions.jsx`, `ChartCard.jsx`

**DashboardPage layout:**
```
┌─────────────────────────────────────────────────────┐
│  Welcome back, {userName}!          Today: Jul 3    │
├────────────┬────────────┬────────────┬──────────────┤
│ Total Emps │ Present    │ Pending    │ Open Tickets │
│    156     │   142      │ Leaves: 8  │     23       │
│  ▲ 4.2%   │  ▼ 1.8%   │  ▲ 12.5%  │   ▼ 6.3%    │
├────────────┴────────────┼────────────┴──────────────┤
│  Attendance Trend       │  Department Distribution  │
│  (Bar Chart - 7 days)   │  (Donut Chart)            │
├─────────────────────────┼───────────────────────────┤
│  Recent Activity Feed   │  Quick Actions Grid       │
│  (Timeline list)        │  (6 shortcut buttons)     │
└─────────────────────────┴───────────────────────────┘
```

- **StatCard:** Icon, label, value, percentage change (green ▲ / red ▼)
- **ChartCard:** CSS-based bar chart for attendance, donut for departments
- **RecentActivity:** Timeline with colored dots per type
- **QuickActions:** Shortcut grid (Add Employee, Mark Attendance, Apply Leave, etc.)
- All powered by **mock data** (swappable with API calls later)

### Task 2.2 — Employee Management Pages

**Files:** `src/pages/employees/EmployeeListPage.jsx`, `EmployeeDetailPage.jsx`, `AddEmployeePage.jsx`, `src/api/employeeApi.js`

**EmployeeListPage:**
- Data table with columns: Avatar, Name, Email, Department, Designation, Status, Join Date, Actions
- Search bar with debounced filtering
- Column sorting (click header)
- Pagination (10 per page)
- "Add Employee" button → navigates to `/employees/add`
- Status badges (Active = green, On Leave = yellow, Inactive = gray)
- Row click → navigates to `/employees/:id`

**EmployeeDetailPage:**
- Profile header: Avatar, name, role, department, email, phone
- Tabbed sections: Personal Info | Employment | Documents | Attendance | Performance | Payroll
- Edit button → opens edit form/modal
- Back button → returns to list

**AddEmployeePage:**
- Form sections: Personal Details, Employment Details
- Fields: Name, Email, Phone, DOB, Address, Department (dropdown), Designation (dropdown), Join Date, Salary
- Client-side validation
- Submit → mock handler (will connect to API later)

**employeeApi.js:**
- `getEmployees(filters)` → `GET /api/employees`
- `getEmployeeById(id)` → `GET /api/employees/:id`
- `createEmployee(data)` → `POST /api/employees`
- `updateEmployee(id, data)` → `PUT /api/employees/:id`
- `deleteEmployee(id)` → `DELETE /api/employees/:id`

### Task 2.3 — Reusable Data Components

**Files:** `src/components/ui/DataTable.jsx`, `Badge.jsx`, `Modal.jsx`, `Avatar.jsx`, `SearchBar.jsx`, `Pagination.jsx`

| Component | Features |
|-----------|----------|
| `DataTable` | Column definitions, sorting, pagination, row selection, empty state, loading skeleton |
| `Badge` | Color-coded status labels (Active, Inactive, Pending, Approved, Rejected) |
| `Modal` | Backdrop overlay, close button, title, content slot, footer actions |
| `Avatar` | Image with fallback initials, sizes: sm, md, lg |
| `SearchBar` | Input with search icon, debounced `onChange` (300ms) |
| `Pagination` | Page numbers, prev/next, current page highlight |

### Task 2.4 — Mock Data & Utilities

**Files:** `src/utils/mockData.js`, `constants.js`, `formatters.js`, `src/hooks/useAuth.js`, `useDebounce.js`

| File | Contents |
|------|----------|
| `mockData.js` | 15 mock employees, dashboard stats, recent activities, attendance trend, department distribution, quick actions |
| `constants.js` | `API_BASE_URL`, `ROLES`, `DEPARTMENTS`, `DESIGNATIONS`, `STATUS`, `NAV_SECTIONS` |
| `formatters.js` | `formatDate()`, `formatRelativeTime()`, `formatCurrency()`, `getInitials()`, `capitalize()`, `truncate()` |
| `useAuth.js` | Custom hook wrapping `AuthContext` for convenient consumption |
| `useDebounce.js` | Debounce hook for search inputs |

### Task 2.5 — Update Routes for Employee Pages
Add routes for `/employees`, `/employees/:id`, `/employees/add` in `App.jsx`.

### Task 2.6 — Verification
- `npm run build` — ensure no compilation errors
- `npm run lint` — check code quality
- Manual browser testing of all pages and interactions

---

## File Summary

| Day | New Files | Modified Files | Total |
|-----|-----------|---------------|-------|
| Day 1 | ~20 files | 2 (App.jsx, index.css) | ~22 |
| Day 2 | ~15 files | 1 (App.jsx routes) | ~16 |
| **Total** | **~35** | **3** | **~38** |

---

## Git Workflow

Per `docs/CONTRIBUTING.md` and `docs/branch-workflow.md`:

```bash
# Start of day
git checkout ayush-frontend
git pull origin dev

# During work — commit frequently
git add .
git commit -m "feat(frontend): add login page with auth context"

# End of day
git push origin ayush-frontend
git checkout dev
git merge ayush-frontend
git push origin dev
```

**Commit message convention:** `feat(frontend): <description>`

---

## Notes

- All UI uses **mock/dummy data** since backend APIs (Nimar's responsibility) may not be ready yet
- The Axios service layer is pre-wired so swapping to real APIs requires only removing mock data imports
- Design uses Tailwind CSS 4 utility classes with custom CSS variables for theming
- All components are responsive (mobile-first approach)

---
---

# Ayush's Day 3 & Day 4 — Frontend UI Implementation Plan

## Context: What's Done (Days 1–2) vs. What's Next (Days 3–4)

| Completed (Day 1–2) | Planned (Day 3–4) |
|---|---|
| Auth pages (Login, Register, Forgot Password) | **Attendance Management** (clock-in/out, daily log, calendar) |
| Dashboard with KPI stats & charts | **Leave Management** (apply, balance, history, approvals) |
| Employee CRUD (List, Detail, Add) | **Payroll Overview** (salary summary, payslips) |
| UI component library (12 components) | **Performance Reviews** (goals, ratings, review cycles) |
| Layout system (Sidebar, Topbar) | **Recruitment Pipeline** (job postings, candidates) |
| API layer & auth context | New API services, mock data, & reusable components |

**Branch:** `ayush-frontend`
**Pattern:** All pages use **mock data** (backend APIs not ready yet). Axios services are pre-wired for seamless swap later.

---

## Day 3: Attendance Management & Leave Management

### Task 3.1 — Attendance API Service

**File:** `src/api/attendanceApi.js`

| Function | Endpoint |
|----------|----------|
| `clockIn(notes)` | `POST /api/attendance/clock-in` |
| `clockOut(notes)` | `POST /api/attendance/clock-out` |
| `getMyAttendance(params)` | `GET /api/attendance/me` |
| `getAttendanceByEmployee(employeeId, params)` | `GET /api/attendance/:employeeId` |
| `getAttendanceSummary(month, year)` | `GET /api/attendance/summary` |

### Task 3.2 — Leave API Service

**File:** `src/api/leaveApi.js`

| Function | Endpoint |
|----------|----------|
| `applyLeave(leaveData)` | `POST /api/leave/request` |
| `getMyLeaves(params)` | `GET /api/leave/me` |
| `getLeaveBalance()` | `GET /api/leave/balance` |
| `getAllLeaveRequests(params)` | `GET /api/leave` (HR/Manager) |
| `approveLeave(id)` | `PUT /api/leave/:id/approve` |
| `rejectLeave(id, reason)` | `PUT /api/leave/:id/reject` |
| `cancelLeave(id)` | `PUT /api/leave/:id/cancel` |

### Task 3.3 — Reusable UI: TabNav Component

**Files:** `src/components/ui/TabNav.jsx`, `src/components/ui/TabNav.css`

| Feature | Detail |
|---------|--------|
| Props | `tabs=[{ label, key, icon? }]`, `activeTab`, `onTabChange` |
| Active state | Animated underline indicator |
| Accessibility | Keyboard navigation (arrow keys, Enter) |
| Responsive | Horizontal scroll on mobile if tabs overflow |

### Task 3.4 — Reusable UI: DateRangePicker Component

**File:** `src/components/ui/DateRangePicker.jsx`

- Start date and end date using native `<input type="date">`
- Validation: end date ≥ start date
- Auto-calculates business days (excludes weekends)
- Returns `{ startDate, endDate, businessDays }`

### Task 3.5 — Attendance Page Components

**Files:** `src/components/attendance/ClockCard.jsx`, `AttendanceCalendar.jsx`, `Attendance.css`

**ClockCard.jsx:**
- Displays current time (live updating every second)
- Clock-in / Clock-out toggle button based on state
- Running timer showing hours:minutes:seconds since clock-in
- Optional notes input before clocking out
- Status indicator: `Not Started` → `Working` → `Completed`
- Glassmorphism card style with subtle pulse animation when working

**AttendanceCalendar.jsx:**
- CSS-only 7-column grid calendar (Mon–Sun)
- Each day cell color-coded by attendance status:
  - Green = Present, Red = Absent, Yellow = Late, Blue = Half Day, Gray = Weekend/Holiday
- Click a day to highlight and show that day's details
- Month navigation with prev/next arrows
- Legend below the calendar

### Task 3.6 — Attendance Page

**Files:** `src/pages/attendance/AttendancePage.jsx`, `AttendancePage.css`

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Attendance Overview                        July 2026  ◀ ▶  │
├──────────────────┬───────────────────────────────────────────┤
│  CLOCK-IN/OUT    │  MONTHLY SUMMARY                         │
│  ┌────────────┐  │  ┌────────┬────────┬────────┬────────┐   │
│  │  09:12 AM  │  │  │Present │ Absent │ Late   │ Half   │   │
│  │  Clock In  │  │  │  22    │   1    │   3    │   1    │   │
│  │  ────────  │  │  └────────┴────────┴────────┴────────┘   │
│  │  Status:   │  │                                           │
│  │  Working   │  │  CALENDAR VIEW                            │
│  │  5h 23m    │  │  ┌──┬──┬──┬──┬──┬──┬──┐                  │
│  │            │  │  │Mo│Tu│We│Th│Fr│Sa│Su│                  │
│  │ [Clock Out]│  │  │ 1│ 2│ 3│ 4│ 5│ 6│ 7│  ● Present      │
│  └────────────┘  │  │ 8│ 9│10│..│..│..│..│  ○ Absent        │
│                  │  └──┴──┴──┴──┴──┴──┴──┘  ◐ Half Day      │
├──────────────────┴───────────────────────────────────────────┤
│  ATTENDANCE LOG (DataTable)                                  │
│  Date       │ Clock In │ Clock Out │ Hours  │ Status         │
│  Jul 5      │ 09:12    │ 18:30     │ 9h 18m │ Present        │
│  Jul 4      │ 09:45    │ 18:00     │ 8h 15m │ Late           │
│  Jul 3      │ —        │ —         │ —      │ Absent         │
└──────────────────────────────────────────────────────────────┘
```

**Key features:**
- Clock-in/out card with live timer, status indicator, prominent action button
- Monthly summary stats: Present/Absent/Late/Half-Day counts with color-coded stat cards
- CSS calendar grid with color-coded days, month navigation
- Daily attendance log DataTable with date, clock-in, clock-out, total hours, status badge, notes
- Month/year picker for navigating historical attendance

### Task 3.7 — Leave Page Components

**Files:** `src/components/leave/LeaveBalanceCard.jsx`, `ApplyLeaveModal.jsx`, `Leave.css`

**LeaveBalanceCard.jsx:**
- Leave type name + color-coded icon
- Used / Total display (e.g., "8 / 12")
- Animated progress bar (green → yellow → red as balance depletes)

**ApplyLeaveModal.jsx:**
- Uses the reusable `Modal` component
- Leave type selector (Casual, Sick, Earned, Comp Off, Unpaid)
- Start date & end date inputs with validation (end ≥ start, no past dates)
- Auto-calculated business day count
- Reason textarea (required)
- Submit with loading state + toast feedback

### Task 3.8 — Leave Page

**Files:** `src/pages/leave/LeavePage.jsx`, `LeavePage.css`

**Layout (Tabbed):**
```
┌──────────────────────────────────────────────────────────────┐
│  Leave Management                         [+ Apply Leave]    │
├──────────────────────────────────────────────────────────────┤
│  [My Leaves]  [Leave Balance]  [Team Requests*]              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB 1: MY LEAVES — DataTable of leave history               │
│  Type | From | To | Days | Status | Actions                  │
│                                                              │
│  TAB 2: LEAVE BALANCE — 4 visual cards with progress bars    │
│  Casual: 8/12  |  Sick: 5/6  |  Earned: 12/15  |  CompOff   │
│                                                              │
│  TAB 3: TEAM REQUESTS (HR/Manager only)                      │
│  Pending requests with Approve/Reject buttons                │
└──────────────────────────────────────────────────────────────┘
```

**Key features:**
- **My Leaves tab:** DataTable with status badges (Pending=yellow, Approved=green, Rejected=red, Cancelled=gray), cancel button for pending leaves
- **Leave Balance tab:** Visual progress bars for each leave type showing used/total
- **Team Requests tab:** (HR/Manager only) Pending leave requests with Approve/Reject actions and reason input
- **Apply Leave button:** Opens the ApplyLeaveModal

### Task 3.9 — Mock Data & Constants Updates (Day 3)

**Modify:** `src/utils/mockData.js`
- `mockAttendanceLog` — 30 days of attendance records (clockIn, clockOut, status, hours, notes)
- `mockLeaveBalance` — Leave quotas per type (casual: 12, sick: 6, earned: 15, compOff: 2)
- `mockLeaveRequests` — 8–10 leave requests with mixed statuses
- `mockTeamLeaveRequests` — 5 pending requests from other employees (for HR view)

**Modify:** `src/utils/constants.js`
- `LEAVE_TYPES` — `{ CASUAL, SICK, EARNED, COMP_OFF, UNPAID }`
- `LEAVE_TYPE_LABELS` — Display names for each type
- `ATTENDANCE_STATUS` — `{ PRESENT, ABSENT, LATE, HALF_DAY, HOLIDAY, WEEKEND }`
- `ATTENDANCE_STATUS_LABELS` — Display names

**Modify:** `src/utils/formatters.js`
- `formatTime(dateString)` — Returns `"09:12 AM"` format
- `formatDuration(minutes)` — Returns `"8h 15m"` format
- `getBusinessDays(startDate, endDate)` — Calculates working days between two dates

### Task 3.10 — Route Wiring (Day 3)

**Modify:** `src/App.jsx`
- Import `AttendancePage` and `LeavePage`
- Replace placeholder routes `/attendance` and `/leave` with actual page components

---

## Day 4: Payroll, Performance & Recruitment

### Task 4.1 — Payroll API Service

**File:** `src/api/payrollApi.js`

| Function | Endpoint |
|----------|----------|
| `getPayrollSummary(month, year)` | `GET /api/payroll/summary` |
| `getMyPayslips(params)` | `GET /api/payroll/payslips/me` |
| `getPayslipById(id)` | `GET /api/payroll/payslips/:id` |
| `downloadPayslip(id)` | `GET /api/payroll/payslips/:id/download` |

### Task 4.2 — Performance API Service

**File:** `src/api/performanceApi.js`

| Function | Endpoint |
|----------|----------|
| `getMyReviews()` | `GET /api/performance/reviews/me` |
| `getMyGoals()` | `GET /api/performance/goals/me` |
| `updateGoalProgress(goalId, progress)` | `PUT /api/performance/goals/:id` |
| `getReviewCycles()` | `GET /api/performance/cycles` |

### Task 4.3 — Recruitment API Service

**File:** `src/api/recruitmentApi.js`

| Function | Endpoint |
|----------|----------|
| `getJobPostings(params)` | `GET /api/recruitment/jobs` |
| `getJobById(id)` | `GET /api/recruitment/jobs/:id` |
| `getCandidates(jobId)` | `GET /api/recruitment/jobs/:id/candidates` |
| `updateCandidateStatus(candidateId, status)` | `PUT /api/recruitment/candidates/:id` |

### Task 4.4 — Reusable UI: StarRating Component

**File:** `src/components/ui/StarRating.jsx`

- Displays 1–5 stars (supports half-star rendering)
- Read-only display mode
- Props: `rating`, `maxRating=5`, `size="md"`
- CSS-based star rendering (no images/icons needed)

### Task 4.5 — Reusable UI: KanbanBoard Component

**Files:** `src/components/ui/KanbanBoard.jsx`, `KanbanBoard.css`

- Accepts array of columns `[{ title, key, items }]`
- Renders CSS grid columns, each with a header and scrollable card list
- No drag-and-drop (uses action buttons on cards for status changes)
- Color-coded column headers
- Responsive: horizontal scroll on mobile

### Task 4.6 — Payroll Page

**Files:** `src/pages/payroll/PayrollPage.jsx`, `PayrollPage.css`, `src/components/payroll/SalaryBreakdown.jsx`, `PayslipModal.jsx`

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Payroll Overview                          July 2026  ◀ ▶   │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│ Gross Salary │ Deductions   │ Net Salary   │ Tax (YTD)       │
│ ₹1,20,000    │ ₹18,500      │ ₹1,01,500    │ ₹72,000         │
├──────────────┴──────────────┴──────────────┴─────────────────┤
│  SALARY BREAKDOWN (Stacked Bar)                              │
│  Basic ████████████████████  ₹60,000                         │
│  HRA  ██████████             ₹30,000                         │
│  DA   ████                   ₹12,000                         │
│  SA   ██████                 ₹18,000                         │
├──────────────────────────────────────────────────────────────┤
│  PAYSLIP HISTORY                                             │
│  Month     │ Gross    │ Deductions │ Net      │ Action       │
│  Jun 2026  │ 1,20,000 │ 18,500     │ 1,01,500 │ [View]       │
│  May 2026  │ 1,20,000 │ 18,500     │ 1,01,500 │ [View]       │
└──────────────────────────────────────────────────────────────┘
```

**SalaryBreakdown.jsx:** CSS horizontal stacked bar showing Basic, HRA, DA, Special Allowance
**PayslipModal.jsx:** Full breakdown view with earnings, deductions, net pay, employer contributions, print button placeholder

### Task 4.7 — Performance Page

**Files:** `src/pages/performance/PerformancePage.jsx`, `PerformancePage.css`, `src/components/performance/GoalCard.jsx`, `ReviewCard.jsx`

**Layout (Tabbed — reuses TabNav):**
```
┌──────────────────────────────────────────────────────────────┐
│  Performance                                                 │
├──────────────────────────────────────────────────────────────┤
│  [My Goals]  [Reviews]  [Feedback]                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB 1: MY GOALS — Progress bars with due dates & status     │
│  ● Complete API integration  80% ████████░░  On Track        │
│  ● Improve test coverage     45% ████░░░░░░  At Risk         │
│                                                              │
│  TAB 2: REVIEWS — Past review cycles with star ratings       │
│  Q2 2026: 4.2/5 ★★★★☆  by Vikram Singh   Completed          │
│                                                              │
│  TAB 3: FEEDBACK — 360° peer feedback cards (read-only)      │
└──────────────────────────────────────────────────────────────┘
```

**GoalCard.jsx:** Goal name, progress bar, due date, status badge (On Track / At Risk / Overdue / Completed)
**ReviewCard.jsx:** Review cycle name, star rating, reviewer, expandable feedback text

### Task 4.8 — Recruitment Page

**Files:** `src/pages/recruitment/RecruitmentPage.jsx`, `RecruitmentPage.css`, `src/components/recruitment/JobCard.jsx`, `CandidateCard.jsx`

**Layout (Tabbed — reuses TabNav):**
```
┌──────────────────────────────────────────────────────────────┐
│  Recruitment                              [+ Post Job]       │
├──────────────────────────────────────────────────────────────┤
│  [Open Positions]  [Candidate Pipeline]                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB 1: OPEN POSITIONS — Card grid of active job postings    │
│  Senior React Developer  |  Engineering  |  12 applicants    │
│                                                              │
│  TAB 2: CANDIDATE PIPELINE — Kanban-style board              │
│  Applied → Screening → Interview → Offer → Hired/Rejected   │
└──────────────────────────────────────────────────────────────┘
```

**JobCard.jsx:** Job title, department, applicant count, posted date, status badge
**CandidateCard.jsx:** Avatar, name, applied role, current stage badge, action buttons (Advance / Reject)

### Task 4.9 — Mock Data & Constants Updates (Day 4)

**Modify:** `src/utils/mockData.js`
- `mockPayrollSummary` — Monthly salary breakdown (basic, HRA, DA, SA, deductions, net)
- `mockPayslipHistory` — 6 months of payslip records
- `mockGoals` — 4–5 performance goals with progress percentages
- `mockReviews` — 2–3 past review cycles with ratings and feedback
- `mockFeedback` — 3–4 peer feedback entries
- `mockJobPostings` — 4–5 open positions with applicant counts
- `mockCandidates` — 10–12 candidates across pipeline stages

**Modify:** `src/utils/constants.js`
- `SALARY_COMPONENTS` — `{ BASIC, HRA, DA, SPECIAL_ALLOWANCE }`
- `DEDUCTION_TYPES` — `{ PF, ESI, PROF_TAX, INCOME_TAX }`
- `GOAL_STATUS` — `{ ON_TRACK, AT_RISK, OVERDUE, COMPLETED }`
- `REVIEW_STATUS` — `{ PENDING, IN_PROGRESS, COMPLETED }`
- `CANDIDATE_STAGES` — `{ APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED }`
- `EMPLOYMENT_TYPES` — `{ FULL_TIME, PART_TIME, CONTRACT, INTERN }`

**Modify:** `src/utils/formatters.js`
- `formatSalary(amount)` — Returns `"₹1,20,000"` Indian currency format
- `formatPercentage(value)` — Returns `"80%"` with proper rounding

### Task 4.10 — Route Wiring (Day 4)

**Modify:** `src/App.jsx`
- Import `PayrollPage`, `PerformancePage`, `RecruitmentPage`
- Replace placeholder routes `/payroll`, `/performance`, `/recruitment` with actual page components

---

## Day 3–4 File Summary

| Day | New Files | Modified Files | Total |
|-----|-----------|----------------|-------|
| Day 3 | ~14 files (6 JSX + 4 CSS + 2 API + 2 UI) | 4 (mockData, constants, formatters, App.jsx) | ~18 |
| Day 4 | ~16 files (8 JSX + 4 CSS + 3 API + 1 UI) | 4 (mockData, constants, formatters, App.jsx) | ~20 |
| **Total** | **~30** | **4 unique files** | **~34** |

### New Directory Structure (Day 3–4 additions)
```
frontend/src/
├── api/
│   ├── attendanceApi.js       [NEW - Day 3]
│   ├── leaveApi.js            [NEW - Day 3]
│   ├── payrollApi.js          [NEW - Day 4]
│   ├── performanceApi.js      [NEW - Day 4]
│   └── recruitmentApi.js      [NEW - Day 4]
├── components/
│   ├── attendance/
│   │   ├── ClockCard.jsx      [NEW - Day 3]
│   │   ├── AttendanceCalendar.jsx [NEW - Day 3]
│   │   └── Attendance.css     [NEW - Day 3]
│   ├── leave/
│   │   ├── LeaveBalanceCard.jsx   [NEW - Day 3]
│   │   ├── ApplyLeaveModal.jsx    [NEW - Day 3]
│   │   └── Leave.css          [NEW - Day 3]
│   ├── payroll/
│   │   ├── SalaryBreakdown.jsx    [NEW - Day 4]
│   │   └── PayslipModal.jsx       [NEW - Day 4]
│   ├── performance/
│   │   ├── GoalCard.jsx       [NEW - Day 4]
│   │   └── ReviewCard.jsx     [NEW - Day 4]
│   ├── recruitment/
│   │   ├── JobCard.jsx        [NEW - Day 4]
│   │   └── CandidateCard.jsx  [NEW - Day 4]
│   └── ui/
│       ├── TabNav.jsx         [NEW - Day 3]
│       ├── TabNav.css         [NEW - Day 3]
│       ├── DateRangePicker.jsx    [NEW - Day 3]
│       ├── StarRating.jsx     [NEW - Day 4]
│       ├── KanbanBoard.jsx    [NEW - Day 4]
│       └── KanbanBoard.css    [NEW - Day 4]
├── pages/
│   ├── attendance/
│   │   ├── AttendancePage.jsx     [NEW - Day 3]
│   │   └── AttendancePage.css     [NEW - Day 3]
│   ├── leave/
│   │   ├── LeavePage.jsx          [NEW - Day 3]
│   │   └── LeavePage.css          [NEW - Day 3]
│   ├── payroll/
│   │   ├── PayrollPage.jsx        [NEW - Day 4]
│   │   └── PayrollPage.css        [NEW - Day 4]
│   ├── performance/
│   │   ├── PerformancePage.jsx    [NEW - Day 4]
│   │   └── PerformancePage.css    [NEW - Day 4]
│   └── recruitment/
│       ├── RecruitmentPage.jsx    [NEW - Day 4]
│       └── RecruitmentPage.css    [NEW - Day 4]
```

---

## Day 3–4 Verification Plan

### Build Checks
```bash
npm run build    # Ensure zero compilation errors
npm run lint     # Check code quality
```

### Manual Browser Testing
- Navigate to `/attendance` — verify clock-in/out, calendar, log table
- Navigate to `/leave` — test all 3 tabs, Apply Leave modal, cancel action
- Navigate to `/payroll` — verify salary cards, breakdown chart, payslip history
- Navigate to `/performance` — test Goals, Reviews, Feedback tabs
- Navigate to `/recruitment` — test Open Positions, Candidate Pipeline Kanban
- Toggle dark mode on all 5 pages — verify theming
- Resize browser to mobile — verify responsive layouts
- Verify Sidebar nav links highlight correctly on each page

---

## Day 3–4 Git Workflow

```bash
# Day 3 commits
git add .
git commit -m "feat(frontend): add attendance management page with clock-in/out and calendar"
git commit -m "feat(frontend): add leave management page with balance, history, and apply modal"
git commit -m "feat(frontend): add TabNav and DateRangePicker reusable components"

# Day 4 commits
git add .
git commit -m "feat(frontend): add payroll overview page with salary breakdown and payslip history"
git commit -m "feat(frontend): add performance page with goals tracking and review history"
git commit -m "feat(frontend): add recruitment page with job postings and candidate pipeline"
git commit -m "feat(frontend): add KanbanBoard and StarRating reusable components"

# End of Day 4
git push origin ayush-frontend
git checkout dev
git merge ayush-frontend
git push origin dev
```
