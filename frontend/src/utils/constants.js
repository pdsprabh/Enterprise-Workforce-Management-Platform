export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HR_MANAGER: 'hr_manager',
  TEAM_LEAD: 'team_lead',
  EMPLOYEE: 'employee',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.HR_MANAGER]: 'HR Manager',
  [ROLES.TEAM_LEAD]: 'Team Lead',
  [ROLES.EMPLOYEE]: 'Employee',
};

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const STATUS_LABELS = {
  [STATUS.ACTIVE]: 'Active',
  [STATUS.INACTIVE]: 'Inactive',
  [STATUS.ON_LEAVE]: 'On Leave',
  [STATUS.PENDING]: 'Pending',
  [STATUS.APPROVED]: 'Approved',
  [STATUS.REJECTED]: 'Rejected',
};

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Product',
  'Design',
  'Customer Support',
  'Legal',
];

export const DESIGNATIONS = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Engineering Manager',
  'HR Executive',
  'HR Manager',
  'Marketing Analyst',
  'Sales Executive',
  'Finance Analyst',
  'Product Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Data Analyst',
  'Business Analyst',
];

export const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'grid' },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Employees', path: '/employees', icon: 'users' },
      { label: 'Attendance', path: '/attendance', icon: 'clock' },
      { label: 'Leave', path: '/leave', icon: 'calendar' },
      { label: 'Recruitment', path: '/recruitment', icon: 'user-plus' },
    ],
  },
  {
    title: 'Organization',
    items: [
      { label: 'Payroll', path: '/payroll', icon: 'dollar-sign' },
      { label: 'Performance', path: '/performance', icon: 'trending-up' },
      { label: 'Projects', path: '/projects', icon: 'briefcase' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Assets', path: '/assets', icon: 'monitor' },
      { label: 'Helpdesk', path: '/helpdesk', icon: 'headphones' },
      { label: 'Documents', path: '/documents', icon: 'file-text' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analytics', path: '/analytics', icon: 'bar-chart-2' },
      { label: 'AI Assistant', path: '/ai-assistant', icon: 'cpu' },
    ],
  },
];
