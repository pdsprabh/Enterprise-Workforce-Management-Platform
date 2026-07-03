import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import AuthLayout from './components/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import AddEmployeePage from './pages/employees/AddEmployeePage';

// Placeholder Pages for now
function Placeholder({ title }) {
  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <h1>{title}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
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
          <BrowserRouter>
            <Routes>
              {/* Public Routes (Auth) */}
              <Route element={<PublicRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>
              </Route>

              {/* Protected Routes (Dashboard) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  
                  <Route path="/employees" element={<EmployeeListPage />} />
                  <Route path="/employees/add" element={<AddEmployeePage />} />
                  <Route path="/employees/:id" element={<EmployeeDetailPage />} />
                  
                  <Route path="/attendance" element={<Placeholder title="Attendance" />} />
                  <Route path="/leave" element={<Placeholder title="Leave" />} />
                  <Route path="/payroll" element={<Placeholder title="Payroll" />} />
                  <Route path="/recruitment" element={<Placeholder title="Recruitment" />} />
                  <Route path="/performance" element={<Placeholder title="Performance" />} />
                  <Route path="/projects" element={<Placeholder title="Projects" />} />
                  <Route path="/assets" element={<Placeholder title="Assets" />} />
                  <Route path="/helpdesk" element={<Placeholder title="Helpdesk" />} />
                  <Route path="/documents" element={<Placeholder title="Documents" />} />
                  <Route path="/analytics" element={<Placeholder title="Analytics" />} />
                  <Route path="/ai-assistant" element={<Placeholder title="AI Assistant" />} />
                </Route>
              </Route>

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
