import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import NotificationProvider from './context/NotificationContext';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import AuthLayout from './components/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Day 1–2
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import AddEmployeePage from './pages/employees/AddEmployeePage';

// Day 3
import AttendancePage from './pages/attendance/AttendancePage';
import LeavePage from './pages/leave/LeavePage';

// Day 4
import PayrollPage from './pages/payroll/PayrollPage';
import PerformancePage from './pages/performance/PerformancePage';
import RecruitmentPage from './pages/recruitment/RecruitmentPage';

// Day 5
import ProjectsPage from './pages/projects/ProjectsPage';
import HelpdeskPage from './pages/helpdesk/HelpdeskPage';

// Day 6
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import AIAssistantPage from './pages/ai-assistant/AIAssistantPage';

// Placeholder for modules not yet implemented (e.g., Assets)
function Placeholder({ title }) {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>
        {title}
      </h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        This module is currently under development.
      </p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                {/* ── Public Routes (Auth) ── */}
                <Route element={<PublicRoute />}>
                  {/* Login: full-screen layout — no AuthLayout wrapper */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* Register + Forgot: use the centered card AuthLayout */}
                  <Route element={<AuthLayout />}>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  </Route>
                </Route>

                {/* ── Protected Routes (Dashboard) ── */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Employees */}
                    <Route path="/employees" element={<EmployeeListPage />} />
                    <Route path="/employees/add" element={<AddEmployeePage />} />
                    <Route path="/employees/:id" element={<EmployeeDetailPage />} />

                    {/* Day 3 */}
                    <Route path="/attendance" element={<AttendancePage />} />
                    <Route path="/leave" element={<LeavePage />} />

                    {/* Day 4 */}
                    <Route path="/payroll" element={<PayrollPage />} />
                    <Route path="/performance" element={<PerformancePage />} />
                    <Route path="/recruitment" element={<RecruitmentPage />} />

                    {/* Day 5 */}
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/helpdesk" element={<HelpdeskPage />} />

                    {/* Day 6 */}
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />

                    {/* Still placeholder */}
                    <Route path="/assets" element={<Placeholder title="Assets" />} />
                  </Route>
                </Route>

                {/* ── Redirects ── */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
