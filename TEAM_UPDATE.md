# Frontend UI Update — Ayush (Days 1 & 2)

Team, 

I have completed the foundation and the first major modules for the **Enterprise Workforce Management Platform** frontend. The architecture is now scalable, fully themed, and ready for API integration once the backend is finalized.

Here is a high-level summary of what has been implemented so far:

## 1. Architecture & Design System
- **Folder Structure Organized:** Established a clean, modular pattern within `src/` (`api/`, `components/`, `context/`, `hooks/`, `layouts/`, `pages/`, `utils/`).
- **Tailwind v4 Integration:** Upgraded and configured the project to use `@tailwindcss/postcss` per the latest v4 standards.
- **Enterprise Theming (`index.css`):** Built a scalable design system using CSS variables, fully supporting seamless **Light & Dark Mode**.

## 2. Global Contexts & API Layer
- **`axiosInstance.js`:** Pre-configured Axios with automatic JWT bearer token interception and global error handling for `401 Unauthorized` responses.
- **`AuthContext.jsx`:** Robust React Context to manage authentication state globally (login, register, logout) with auto-persistence in `localStorage`.
- **`ThemeContext.jsx`:** Global context managing the UI theme toggles.

## 3. Reusable Component Library (`src/components/ui/`)
To ensure consistency across the application, I built a library of foundational components:
- `Button` & `Input` (with loading states, validation, and password toggling)
- `Card`, `Badge`, and `Avatar` (for structured data presentation)
- `DataTable`, `Pagination`, and `SearchBar` (for robust list management)
- `Toast` (custom notification system)
- `Modal` (reusable pop-ups and dialogs)

## 4. Application Shell (`src/layouts/`)
- **`DashboardLayout.jsx`:** The core wrapper for the authenticated experience.
- **`Sidebar.jsx`:** A fully responsive, collapsible navigation menu with custom SVG iconography mapped to all planned platform modules.
- **`Topbar.jsx`:** A persistent header featuring global search, theme toggling, notifications, and user profile management.

## 5. Completed Pages
All pages are currently wired to use rich mock data (`src/utils/mockData.js`), meaning the UI is fully interactive and testable immediately.

### Authentication (`src/pages/auth/`)
- `LoginPage`, `RegisterPage`, and `ForgotPasswordPage` have been designed and hooked up to the `AuthContext` and route guards (`ProtectedRoute` / `PublicRoute`).

### Dashboard (`src/pages/dashboard/`)
- Developed a comprehensive **Dashboard Overview** populated with KPI widgets (`StatCard`), analytical charts (`ChartCard`), a live event timeline (`RecentActivity`), and navigation shortcuts (`QuickActions`).

### Employee Management (`src/pages/employees/`)
- **Directory (`EmployeeListPage`):** A paginated, filterable grid displaying the entire workforce.
- **Profiles (`EmployeeDetailPage`):** A detailed, tabbed view (Personal, Employment, Documents, Attendance) for individual employee records.
- **Onboarding (`AddEmployeePage`):** A multi-section form layout for HR to securely add new staff.

---

### Next Steps for the Team
- **Backend (Nimar):** The frontend Axios service (`src/api/employeeApi.js` & `authApi.js`) is ready. Once the Express endpoints are live, we simply swap out the mock data arrays for the API calls.
- **Frontend:** Moving on to Day 3 & 4 tasks (Attendance and Leave modules).

---

## Dashboard UI Enhancement — Ayush (Day 5 / Day 6)

### Quick Actions — Dock Component Integration
Replaced the static 2×3 grid of Quick Action buttons on the dashboard with an interactive **macOS-style Dock** component sourced from [React Bits](https://reactbits.dev/).

**What changed:**
- Created `src/components/ui/Dock.jsx` — a self-contained animated dock using `motion/react` (already a project dependency). Supports spring-physics magnification, keyboard navigation, and accessible tooltips.
- Created `src/components/ui/Dock.css` — component styles wired to the app's CSS variable design tokens (`--color-bg-secondary`, `--color-border`, `--color-primary`) so it respects both light and dark themes. Borders are set to **2px** for a bolder, more tactile look.
- Updated `src/components/dashboard/QuickActions.jsx` — the 6 existing actions (Add Employee, Mark Attendance, Apply Leave, Create Ticket, Run Payroll, View Reports) now render as dock items, each carrying their original action color on the icon. Navigation behavior is unchanged.
- Updated `src/components/dashboard/Dashboard.css` — replaced the old `.quick-actions-grid` / `.quick-action-btn` block with a `.quick-actions-dock-wrapper` that centers the dock and provides headroom for the upward hover animation.

**No new dependencies were added** — `motion` was already listed in `package.json`.

---

## Day 3 & Day 4 Plan — Ayush (Frontend UI)

### Day 3: Attendance & Leave Management
- **Attendance Page (`/attendance`):** Clock-in/out card with live timer, monthly CSS calendar grid (color-coded days: green=present, red=absent, yellow=late), daily attendance log table with DataTable.
- **Leave Page (`/leave`):** Tabbed interface — My Leaves history table, Leave Balance with animated progress bars, Team Requests with Approve/Reject (HR/Manager role), Apply Leave modal with date range and validation.
- **New API Services:** `attendanceApi.js`, `leaveApi.js` — pre-wired to expected backend endpoints.
- **New Reusable Components:** `TabNav` (tabbed navigation with animated underline), `DateRangePicker` (native date inputs with business day calculation).

### Day 4: Payroll, Performance & Recruitment
- **Payroll Page (`/payroll`):** Salary summary cards (Gross/Deductions/Net/Tax), CSS horizontal bar chart for salary breakdown, payslip history table with detail modal.
- **Performance Page (`/performance`):** Tabbed — Goals with progress bars and status badges, Review History with star ratings, 360° Feedback cards.
- **Recruitment Page (`/recruitment`):** Tabbed — Open Positions card grid, Kanban-style Candidate Pipeline board (Applied → Screening → Interview → Offer).
- **New API Services:** `payrollApi.js`, `performanceApi.js`, `recruitmentApi.js`.
- **New Reusable Components:** `StarRating`, `KanbanBoard`.

### Backend Dependencies
The following new API endpoints will be needed (currently placeholder in `docs/api-contracts.md`):

| Module | Key Endpoints |
|--------|---------------|
| Attendance | `POST /api/attendance/clock-in`, `POST /api/attendance/clock-out`, `GET /api/attendance/me` |
| Leave | `POST /api/leave/request`, `GET /api/leave/me`, `GET /api/leave/balance`, `PUT /api/leave/:id/approve` |
| Payroll | `GET /api/payroll/summary`, `GET /api/payroll/payslips/me` |
| Performance | `GET /api/performance/goals/me`, `GET /api/performance/reviews/me` |
| Recruitment | `GET /api/recruitment/jobs`, `GET /api/recruitment/jobs/:id/candidates` |

