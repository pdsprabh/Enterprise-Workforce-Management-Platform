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
