import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody } from '../ui/Card';
import Dock from '../ui/Dock';
import './Dashboard.css';

// Icon components — sized to fit inside the dock item
const UserPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const HeadphonesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const DollarSignIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

// Color map matching the existing action colors
const colorMap = {
  primary:   'rgba(79, 70, 229, 0.9)',
  success:   'rgba(16, 185, 129, 0.9)',
  warning:   'rgba(245, 158, 11, 0.9)',
  danger:    'rgba(239, 68, 68, 0.9)',
  secondary: 'rgba(107, 114, 128, 0.9)',
  info:      'rgba(59, 130, 246, 0.9)',
};

const iconMap = {
  'user-plus':    <UserPlusIcon />,
  'check-circle': <CheckCircleIcon />,
  'calendar':     <CalendarIcon />,
  'headphones':   <HeadphonesIcon />,
  'dollar-sign':  <DollarSignIcon />,
  'bar-chart-2':  <BarChartIcon />,
};

export default function QuickActions({ actions }) {
  const navigate = useNavigate();

  const dockItems = actions.map(action => ({
    label: action.label,
    icon: (
      <span style={{ color: colorMap[action.color] || 'currentColor' }}>
        {iconMap[action.icon]}
      </span>
    ),
    onClick: () => navigate(action.path),
  }));

  return (
    <Card className="h-full">
      <CardHeader>Quick Actions</CardHeader>
      <CardBody>
        <div className="quick-actions-dock-wrapper">
          <Dock
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            distance={180}
          />
        </div>
      </CardBody>
    </Card>
  );
}
