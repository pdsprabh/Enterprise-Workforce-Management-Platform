import useAuth from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import QuickActions from '../../components/dashboard/QuickActions';
import ChartCard from '../../components/dashboard/ChartCard';
import { formatDate } from '../../utils/formatters';
import { mockDashboardStats, mockRecentActivities, mockQuickActions } from '../../utils/mockData';
import '../../components/dashboard/Dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p>Today is {formatDate(new Date(), { weekday: 'long' })}</p>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        {mockDashboardStats.map((stat, idx) => (
          <div key={idx} style={{ gridColumn: 'span 3' }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div style={{ gridColumn: 'span 8' }}>
          <ChartCard title="Attendance Trend" type="Bar Chart" />
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <ChartCard title="Department Distribution" type="Donut Chart" />
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 7' }}>
          <RecentActivity activities={mockRecentActivities} />
        </div>
        <div style={{ gridColumn: 'span 5' }}>
          <QuickActions actions={mockQuickActions} />
        </div>
      </div>
    </div>
  );
}
