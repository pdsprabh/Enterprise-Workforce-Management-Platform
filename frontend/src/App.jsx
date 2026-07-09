import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import NotificationProvider from './context/NotificationContext';
import useAuth from './hooks/useAuth';
import { LinkedInCallback } from 'react-linkedin-login-oauth2';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import RoleRoute from './routes/RoleRoute';

import AuthLayout from './components/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Landing page
import LandingPage from './pages/landing/LandingPage';

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
import InternalJobBoard from './pages/recruitment/InternalJobBoard';

// Day 5
import ProjectsPage from './pages/projects/ProjectsPage';
import HelpdeskPage from './pages/helpdesk/HelpdeskPage';

// Day 6
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import SuperAdminDocumentsPage from './pages/documents/SuperAdminDocumentsPage';
import AIAssistantPage from './pages/ai-assistant/AIAssistantPage';

// Settings
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import AssetsPage from './pages/assets/AssetsPage';

// Role-aware document page switcher
function DocumentsRoute() {
  const { user } = useAuth();
  if (user?.role === 'Super Admin') {
    return <SuperAdminDocumentsPage />;
  }
  return <DocumentsPage />;
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
                  {/* Login & Register: full-screen layout — no AuthLayout wrapper */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Forgot Password: use the centered card AuthLayout */}
                  <Route element={<AuthLayout />}>
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  </Route>
                </Route>

                {/* ── Protected Routes (Dashboard) ── */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Employees - Restricted */}
                    <Route element={<RoleRoute allowedRoles={['Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator']} />}>
                      <Route path="/employees" element={<EmployeeListPage />} />
                      <Route path="/employees/add" element={<AddEmployeePage />} />
                      <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                    </Route>

                    {/* Day 3 */}
                    <Route path="/attendance" element={<AttendancePage />} />
                    <Route path="/leave" element={<LeavePage />} />

                    {/* Day 4 - Restricted */}
                    <Route element={<RoleRoute allowedRoles={['Super Admin', 'Organization Admin', 'HR Manager']} />}>
                      <Route path="/payroll" element={<PayrollPage />} />
                      <Route path="/performance" element={<PerformancePage />} />
                    </Route>
                    
                    {/* Restricted Recruitment Route */}
                    <Route element={<RoleRoute allowedRoles={['Super Admin', 'HR Manager']} />}>
                      <Route path="/recruitment" element={<RecruitmentPage />} />
                    </Route>
                    
                    {/* Internal Job Board (All roles) */}
                    <Route path="/jobs" element={<InternalJobBoard />} />

                    {/* Day 5 */}
                    <Route element={<RoleRoute allowedRoles={['Super Admin', 'Organization Admin', 'IT Administrator', 'HR Manager']} />}>
                      <Route path="/projects" element={<ProjectsPage />} />
                    </Route>
                    <Route path="/helpdesk" element={<HelpdeskPage />} />

                    {/* Day 6 */}
                    {/* Restricted Analytics Route */}
                    <Route element={<RoleRoute allowedRoles={['Super Admin', 'Organization Admin', 'HR Manager']} />}>
                      <Route path="/analytics" element={<AnalyticsPage />} />
                    </Route>
                    
                    <Route path="/documents" element={<DocumentsRoute />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />
                    
                    {/* Settings & Profile - Available to all authenticated users */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    {/* Restricted Assets Route */}
                    <Route element={<RoleRoute allowedRoles={['Super Admin', 'IT Administrator']} />}>
                      <Route path="/assets" element={<AssetsPage />} />
                    </Route>
                  </Route>
                </Route>

                {/* ── Landing Page & Redirects ── */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/linkedin" element={<LinkedInCallback />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
