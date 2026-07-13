export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://enterpriseworkforcemanagementplatform-0kdu.onrender.com/api';

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Organization Admin',
  HR_MANAGER: 'HR Manager',
  IT_ADMIN: 'IT Administrator',
  EMPLOYEE: 'Employee',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ORG_ADMIN]: 'Organization Admin',
  [ROLES.HR_MANAGER]: 'HR Manager',
  [ROLES.IT_ADMIN]: 'IT Administrator',
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

// ── Leave ─────────────────────────────────────────────────
export const LEAVE_TYPES = {
  CASUAL: 'casual',
  SICK: 'sick',
  EARNED: 'earned',
  COMP_OFF: 'comp_off',
  UNPAID: 'unpaid',
};

export const LEAVE_TYPE_LABELS = {
  [LEAVE_TYPES.CASUAL]: 'Casual Leave',
  [LEAVE_TYPES.SICK]: 'Sick Leave',
  [LEAVE_TYPES.EARNED]: 'Earned Leave',
  [LEAVE_TYPES.COMP_OFF]: 'Comp Off',
  [LEAVE_TYPES.UNPAID]: 'Unpaid Leave',
};

export const LEAVE_TYPE_COLORS = {
  [LEAVE_TYPES.CASUAL]: '#4F46E5',
  [LEAVE_TYPES.SICK]: '#EF4444',
  [LEAVE_TYPES.EARNED]: '#10B981',
  [LEAVE_TYPES.COMP_OFF]: '#F59E0B',
  [LEAVE_TYPES.UNPAID]: '#6B7280',
};

// ── Attendance ────────────────────────────────────────────
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  HOLIDAY: 'holiday',
  WEEKEND: 'weekend',
};

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.HALF_DAY]: 'Half Day',
  [ATTENDANCE_STATUS.HOLIDAY]: 'Holiday',
  [ATTENDANCE_STATUS.WEEKEND]: 'Weekend',
};

// ── Payroll ───────────────────────────────────────────────
export const SALARY_COMPONENTS = {
  BASIC: 'basic',
  HRA: 'hra',
  DA: 'da',
  SPECIAL_ALLOWANCE: 'special_allowance',
  TRANSPORT: 'transport',
};

export const DEDUCTION_TYPES = {
  PF: 'pf',
  ESI: 'esi',
  PROFESSIONAL_TAX: 'professional_tax',
  TDS: 'tds',
};

// ── Performance ───────────────────────────────────────────
export const GOAL_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OVERDUE: 'overdue',
  COMPLETED: 'completed',
};

export const GOAL_STATUS_LABELS = {
  [GOAL_STATUS.ON_TRACK]: 'On Track',
  [GOAL_STATUS.AT_RISK]: 'At Risk',
  [GOAL_STATUS.OVERDUE]: 'Overdue',
  [GOAL_STATUS.COMPLETED]: 'Completed',
};

export const REVIEW_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

// ── Recruitment ───────────────────────────────────────────
export const CANDIDATE_STAGES = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
};

export const CANDIDATE_STAGE_LABELS = {
  [CANDIDATE_STAGES.APPLIED]: 'Applied',
  [CANDIDATE_STAGES.SCREENING]: 'Screening',
  [CANDIDATE_STAGES.INTERVIEW]: 'Interview',
  [CANDIDATE_STAGES.OFFER]: 'Offer',
  [CANDIDATE_STAGES.HIRED]: 'Hired',
  [CANDIDATE_STAGES.REJECTED]: 'Rejected',
};

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
};

export const EMPLOYMENT_TYPE_LABELS = {
  [EMPLOYMENT_TYPES.FULL_TIME]: 'Full Time',
  [EMPLOYMENT_TYPES.PART_TIME]: 'Part Time',
  [EMPLOYMENT_TYPES.CONTRACT]: 'Contract',
  [EMPLOYMENT_TYPES.INTERNSHIP]: 'Internship',
};

// ── Projects ──────────────────────────────────────────────
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.ACTIVE]: 'Active',
  [PROJECT_STATUS.ON_HOLD]: 'On Hold',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.CANCELLED]: 'Cancelled',
};

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.IN_REVIEW]: 'In Review',
  [TASK_STATUS.DONE]: 'Done',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
  [TASK_PRIORITY.CRITICAL]: 'Critical',
};

// ── Helpdesk ──────────────────────────────────────────────
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const TICKET_STATUS_LABELS = {
  [TICKET_STATUS.OPEN]: 'Open',
  [TICKET_STATUS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS.RESOLVED]: 'Resolved',
  [TICKET_STATUS.CLOSED]: 'Closed',
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const TICKET_PRIORITY_LABELS = {
  [TICKET_PRIORITY.LOW]: 'Low',
  [TICKET_PRIORITY.MEDIUM]: 'Medium',
  [TICKET_PRIORITY.HIGH]: 'High',
  [TICKET_PRIORITY.URGENT]: 'Urgent',
};

export const TICKET_CATEGORY = {
  IT: 'it',
  HR: 'hr',
  ADMIN: 'admin',
  FACILITIES: 'facilities',
  OTHER: 'other',
};

export const TICKET_CATEGORY_LABELS = {
  [TICKET_CATEGORY.IT]: 'IT',
  [TICKET_CATEGORY.HR]: 'HR',
  [TICKET_CATEGORY.ADMIN]: 'Admin',
  [TICKET_CATEGORY.FACILITIES]: 'Facilities',
  [TICKET_CATEGORY.OTHER]: 'Other',
};

// ── Notifications ─────────────────────────────────────────
export const NOTIFICATION_TYPES = {
  LEAVE: 'leave',
  ATTENDANCE: 'attendance',
  PAYROLL: 'payroll',
  HELPDESK: 'helpdesk',
  GENERAL: 'general',
  PERFORMANCE: 'performance',
};

// ── Documents ─────────────────────────────────────────────
export const DOCUMENT_TYPES = {
  OFFER_LETTER: 'offer_letter',
  CONTRACT: 'contract',
  PAYSLIP: 'payslip',
  ID_PROOF: 'id_proof',
  POLICY: 'policy',
  OTHER: 'other',
};

export const DOCUMENT_TYPE_LABELS = {
  [DOCUMENT_TYPES.OFFER_LETTER]: 'Offer Letter',
  [DOCUMENT_TYPES.CONTRACT]: 'Contract',
  [DOCUMENT_TYPES.PAYSLIP]: 'Payslip',
  [DOCUMENT_TYPES.ID_PROOF]: 'ID Proof',
  [DOCUMENT_TYPES.POLICY]: 'Policy',
  [DOCUMENT_TYPES.OTHER]: 'Other',
};

export const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'grid', allowedRoles: ['All'], description: 'Overview of your workforce metrics.', imagePath: '/features/dashboard_feature.png' },
    ],
  },
  {
    title: 'People',
    items: [
      { label: 'Employees', path: '/employees', icon: 'users', allowedRoles: ['Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator'], description: 'Manage your workforce directory and profiles.', imagePath: '/features/directory_feature.png' },
      { label: 'Attendance', path: '/attendance', icon: 'clock', allowedRoles: ['Super Admin', 'Organization Admin', 'HR Manager', 'Employee'], description: 'Track time and attendance records.', imagePath: '/features/attendance_feature.png' },
      { label: 'Leave', path: '/leave', icon: 'calendar', allowedRoles: ['Super Admin', 'Organization Admin', 'HR Manager', 'Employee'], description: 'Manage time-off requests and balances.', imagePath: '/features/leave_feature.png' },
      { label: 'Job Openings', path: '/jobs', icon: 'briefcase', allowedRoles: ['Super Admin', 'Organization Admin', 'HR Manager', 'Employee'], description: 'View and apply for internal job openings.', imagePath: '/features/recruitment_feature.png' },
      { label: 'Recruitment', path: '/recruitment', icon: 'user-plus', allowedRoles: ['Super Admin', 'HR Manager'], description: 'Source, track, and hire top talent.', imagePath: '/features/recruitment_feature.png' },
    ],
  },
  {
    title: 'Organization',
    items: [
      { label: 'Payroll', path: '/payroll', icon: 'dollar-sign', allowedRoles: ['Super Admin', 'Organization Admin', 'HR Manager'], description: 'Process salaries and view compensation.', imagePath: '/features/payroll_feature.png' },
      { label: 'Performance', path: '/performance', icon: 'trending-up', allowedRoles: ['Super Admin', 'Organization Admin', 'HR Manager'], description: 'Track goals and employee reviews.', imagePath: '/features/performance_feature.png' },
      { label: 'Projects', path: '/projects', icon: 'briefcase', allowedRoles: ['Super Admin', 'Organization Admin', 'IT Administrator', 'HR Manager'], description: 'Manage teams, projects, and tasks.', imagePath: '/features/tasks_feature.png' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Assets', path: '/assets', icon: 'monitor', allowedRoles: ['Super Admin', 'IT Administrator'], description: 'Track hardware and software inventory.', imagePath: '/features/assets_feature.png' },
      { label: 'Helpdesk', path: '/helpdesk', icon: 'headphones', allowedRoles: ['All'], description: 'IT support and ticket management.', imagePath: '/features/helpdesk_feature.png' },
      { label: 'Documents', path: '/documents', icon: 'file-text', allowedRoles: ['All'], description: 'Secure file and policy repository.', imagePath: '/features/documents_feature.png' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analytics', path: '/analytics', icon: 'bar-chart-2', allowedRoles: ['Super Admin', 'Organization Admin', 'HR Manager'], description: 'Actionable workforce insights and reports.', imagePath: '/features/analytics_feature.png' },
    ],
  },
];
