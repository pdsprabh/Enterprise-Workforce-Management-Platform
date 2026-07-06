import useAuth from '../../hooks/useAuth';
import EmployeeDashboard from '../dashboards/EmployeeDashboard';
import HRDashboard from '../dashboards/HRDashboard';
import ITDashboard from '../dashboards/ITDashboard';
import OrgAdminDashboard from '../dashboards/OrgAdminDashboard';
import SuperAdminDashboard from '../dashboards/SuperAdminDashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  switch (user.role) {
    case 'Employee':
      return <EmployeeDashboard />;
    case 'HR Manager':
      return <HRDashboard />;
    case 'IT Administrator':
      return <ITDashboard />;
    case 'Organization Admin':
      return <OrgAdminDashboard />;
    case 'Super Admin':
      return <SuperAdminDashboard />;
    default:
      return <EmployeeDashboard />;
  }
}
