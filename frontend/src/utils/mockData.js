import { STATUS, PROJECT_STATUS, TASK_STATUS, TASK_PRIORITY, TICKET_STATUS, TICKET_PRIORITY, TICKET_CATEGORY, NOTIFICATION_TYPES, DOCUMENT_TYPES } from './constants';

// ── Employees ─────────────────────────────────────────────
export const mockEmployees = [
  {
    id: '1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@workforce.io',
    phone: '9876543210',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    status: STATUS.ACTIVE,
    joinDate: '2023-03-15',
    salary: 1200000,
    avatar: null,
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@workforce.io',
    phone: '9876543211',
    department: 'Human Resources',
    designation: 'HR Manager',
    status: STATUS.ACTIVE,
    joinDate: '2022-07-01',
    salary: 950000,
    avatar: null,
  },
  {
    id: '3',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@workforce.io',
    phone: '9876543212',
    department: 'Marketing',
    designation: 'Marketing Analyst',
    status: STATUS.ON_LEAVE,
    joinDate: '2024-01-10',
    salary: 750000,
    avatar: null,
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@workforce.io',
    phone: '9876543213',
    department: 'Design',
    designation: 'UI/UX Designer',
    status: STATUS.ACTIVE,
    joinDate: '2023-09-20',
    salary: 850000,
    avatar: null,
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.singh@workforce.io',
    phone: '9876543214',
    department: 'Engineering',
    designation: 'Tech Lead',
    status: STATUS.ACTIVE,
    joinDate: '2021-11-05',
    salary: 1800000,
    avatar: null,
  },
  {
    id: '6',
    name: 'Ananya Mishra',
    email: 'ananya.mishra@workforce.io',
    phone: '9876543215',
    department: 'Finance',
    designation: 'Finance Analyst',
    status: STATUS.ACTIVE,
    joinDate: '2024-02-14',
    salary: 700000,
    avatar: null,
  },
  {
    id: '7',
    name: 'Karan Mehta',
    email: 'karan.mehta@workforce.io',
    phone: '9876543216',
    department: 'Sales',
    designation: 'Sales Executive',
    status: STATUS.INACTIVE,
    joinDate: '2022-05-30',
    salary: 650000,
    avatar: null,
  },
  {
    id: '8',
    name: 'Divya Nair',
    email: 'divya.nair@workforce.io',
    phone: '9876543217',
    department: 'Product',
    designation: 'Product Manager',
    status: STATUS.ACTIVE,
    joinDate: '2023-06-18',
    salary: 1400000,
    avatar: null,
  },
  {
    id: '9',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@workforce.io',
    phone: '9876543218',
    department: 'Engineering',
    designation: 'DevOps Engineer',
    status: STATUS.ACTIVE,
    joinDate: '2024-04-01',
    salary: 1100000,
    avatar: null,
  },
  {
    id: '10',
    name: 'Meera Joshi',
    email: 'meera.joshi@workforce.io',
    phone: '9876543219',
    department: 'Customer Support',
    designation: 'QA Engineer',
    status: STATUS.ACTIVE,
    joinDate: '2023-12-01',
    salary: 800000,
    avatar: null,
  },
  {
    id: '11',
    name: 'Rahul Verma',
    email: 'rahul.verma@workforce.io',
    phone: '9876543220',
    department: 'Engineering',
    designation: 'Software Engineer',
    status: STATUS.ACTIVE,
    joinDate: '2024-06-15',
    salary: 900000,
    avatar: null,
  },
  {
    id: '12',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@workforce.io',
    phone: '9876543221',
    department: 'Legal',
    designation: 'Business Analyst',
    status: STATUS.ON_LEAVE,
    joinDate: '2022-10-10',
    salary: 780000,
    avatar: null,
  },
  {
    id: '13',
    name: 'Nishant Rao',
    email: 'nishant.rao@workforce.io',
    phone: '9876543222',
    department: 'Operations',
    designation: 'Engineering Manager',
    status: STATUS.ACTIVE,
    joinDate: '2021-08-22',
    salary: 2000000,
    avatar: null,
  },
  {
    id: '14',
    name: 'Tanya Kapoor',
    email: 'tanya.kapoor@workforce.io',
    phone: '9876543223',
    department: 'Marketing',
    designation: 'Data Analyst',
    status: STATUS.ACTIVE,
    joinDate: '2024-03-05',
    salary: 720000,
    avatar: null,
  },
  {
    id: '15',
    name: 'Siddharth Bose',
    email: 'siddharth.bose@workforce.io',
    phone: '9876543224',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    status: STATUS.ACTIVE,
    joinDate: '2023-01-25',
    salary: 1300000,
    avatar: null,
  },
];

// ── Dashboard stats ───────────────────────────────────────
export const mockDashboardStats = [
  {
    id: 'total-employees',
    label: 'Total Employees',
    value: 156,
    change: +4.2,
    icon: 'users',
    color: 'primary',
  },
  {
    id: 'present-today',
    label: 'Present Today',
    value: 142,
    change: -1.8,
    icon: 'check-circle',
    color: 'success',
  },
  {
    id: 'pending-leaves',
    label: 'Pending Leaves',
    value: 8,
    change: +12.5,
    icon: 'calendar',
    color: 'warning',
  },
  {
    id: 'open-tickets',
    label: 'Open Tickets',
    value: 23,
    change: -6.3,
    icon: 'headphones',
    color: 'danger',
  },
];

// ── Recent activities ─────────────────────────────────────
export const mockRecentActivities = [
  {
    id: '1',
    action: 'New employee onboarded',
    description: 'Rahul Verma joined the Engineering team',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'success',
  },
  {
    id: '2',
    action: 'Leave approved',
    description: "Pooja Iyer's casual leave has been approved",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'info',
  },
  {
    id: '3',
    action: 'Payroll processed',
    description: 'June 2026 payroll has been processed for 156 employees',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    type: 'success',
  },
  {
    id: '4',
    action: 'Helpdesk ticket raised',
    description: 'Karan Mehta raised a ticket for laptop replacement',
    time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    type: 'warning',
  },
  {
    id: '5',
    action: 'Performance review due',
    description: 'Q2 performance reviews are due in 3 days',
    time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    type: 'danger',
  },
  {
    id: '6',
    action: 'New candidate shortlisted',
    description: 'Meghna Das shortlisted for Senior Designer role',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: 'info',
  },
];

// ── Attendance trend (7 days) ─────────────────────────────
export const mockAttendanceTrend = [
  { day: 'Mon', present: 148, absent: 8 },
  { day: 'Tue', present: 151, absent: 5 },
  { day: 'Wed', present: 142, absent: 14 },
  { day: 'Thu', present: 145, absent: 11 },
  { day: 'Fri', present: 138, absent: 18 },
  { day: 'Sat', present: 52, absent: 0 },
  { day: 'Sun', present: 0, absent: 0 },
];

// ── Department distribution ───────────────────────────────
export const mockDepartmentDistribution = [
  { department: 'Engineering', count: 48, color: '#4F46E5' },
  { department: 'Human Resources', count: 12, color: '#7C3AED' },
  { department: 'Marketing', count: 18, color: '#EC4899' },
  { department: 'Sales', count: 22, color: '#F59E0B' },
  { department: 'Finance', count: 14, color: '#10B981' },
  { department: 'Operations', count: 16, color: '#3B82F6' },
  { department: 'Product', count: 10, color: '#6366F1' },
  { department: 'Design', count: 8, color: '#F97316' },
  { department: 'Customer Support', count: 6, color: '#14B8A6' },
  { department: 'Legal', count: 2, color: '#8B5CF6' },
];

// ── Quick actions ─────────────────────────────────────────
export const mockQuickActions = [
  { label: 'Add Employee', path: '/employees/add', icon: 'user-plus', color: 'primary' },
  { label: 'Mark Attendance', path: '/attendance', icon: 'check-circle', color: 'success' },
  { label: 'Apply Leave', path: '/leave', icon: 'calendar', color: 'warning' },
  { label: 'Create Ticket', path: '/helpdesk', icon: 'headphones', color: 'danger' },
  { label: 'Run Payroll', path: '/payroll', icon: 'dollar-sign', color: 'secondary' },
  { label: 'View Reports', path: '/analytics', icon: 'bar-chart-2', color: 'info' },
];

// ── Attendance ────────────────────────────────────────────
// Generate 30 days of attendance records ending today
function generateAttendanceLog() {
  const records = [];
  const statuses = ['present', 'present', 'present', 'present', 'late', 'absent', 'half_day'];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      records.push({
        id: `att-${i}`,
        date: date.toISOString().split('T')[0],
        clockIn: null,
        clockOut: null,
        totalMinutes: 0,
        status: 'weekend',
        notes: '',
      });
      continue;
    }
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const clockInHour = status === 'late' ? 10 : 9;
    const clockInMin = Math.floor(Math.random() * 30);
    const clockIn = new Date(date);
    clockIn.setHours(clockInHour, clockInMin, 0);
    let clockOut = null;
    let totalMinutes = 0;
    if (status !== 'absent') {
      clockOut = new Date(clockIn);
      const workHours = status === 'half_day' ? 4 : 8 + Math.floor(Math.random() * 2);
      clockOut.setHours(clockIn.getHours() + workHours, Math.floor(Math.random() * 60), 0);
      totalMinutes = (clockOut - clockIn) / 60000;
    }
    records.push({
      id: `att-${i}`,
      date: date.toISOString().split('T')[0],
      clockIn: status !== 'absent' ? clockIn.toISOString() : null,
      clockOut: clockOut ? clockOut.toISOString() : null,
      totalMinutes: Math.round(totalMinutes),
      status,
      notes: status === 'late' ? 'Traffic delay' : '',
    });
  }
  return records;
}
export const mockAttendanceLog = generateAttendanceLog();

// ── Leave balance ─────────────────────────────────────────
export const mockLeaveBalance = [
  { type: 'casual', label: 'Casual Leave', total: 12, used: 8, color: '#4F46E5' },
  { type: 'sick', label: 'Sick Leave', total: 6, used: 2, color: '#EF4444' },
  { type: 'earned', label: 'Earned Leave', total: 15, used: 5, color: '#10B981' },
  { type: 'comp_off', label: 'Comp Off', total: 2, used: 1, color: '#F59E0B' },
];

// ── My leave requests ─────────────────────────────────────
export const mockLeaveRequests = [
  { id: 'lr-1', type: 'casual', from: '2026-06-10', to: '2026-06-12', days: 3, reason: 'Family function', status: 'approved', appliedOn: '2026-06-05' },
  { id: 'lr-2', type: 'sick', from: '2026-05-22', to: '2026-05-23', days: 2, reason: 'Fever', status: 'approved', appliedOn: '2026-05-22' },
  { id: 'lr-3', type: 'earned', from: '2026-07-14', to: '2026-07-18', days: 5, reason: 'Vacation', status: 'pending', appliedOn: '2026-07-01' },
  { id: 'lr-4', type: 'casual', from: '2026-04-08', to: '2026-04-08', days: 1, reason: 'Personal work', status: 'rejected', appliedOn: '2026-04-07' },
  { id: 'lr-5', type: 'comp_off', from: '2026-03-20', to: '2026-03-20', days: 1, reason: 'Worked on weekend', status: 'approved', appliedOn: '2026-03-18' },
  { id: 'lr-6', type: 'casual', from: '2026-02-14', to: '2026-02-15', days: 2, reason: 'Out of town', status: 'cancelled', appliedOn: '2026-02-10' },
];

// ── Team leave requests (HR/Manager view) ─────────────────
export const mockTeamLeaveRequests = [
  { id: 'tlr-1', employeeName: 'Rohan Gupta', department: 'Marketing', type: 'sick', from: '2026-07-08', to: '2026-07-09', days: 2, reason: 'Cold and fever', status: 'pending', appliedOn: '2026-07-08' },
  { id: 'tlr-2', employeeName: 'Sneha Reddy', department: 'Design', type: 'casual', from: '2026-07-12', to: '2026-07-14', days: 3, reason: 'Travel', status: 'pending', appliedOn: '2026-07-07' },
  { id: 'tlr-3', employeeName: 'Pooja Iyer', department: 'Legal', type: 'earned', from: '2026-07-20', to: '2026-07-25', days: 6, reason: 'Wedding ceremony', status: 'pending', appliedOn: '2026-07-05' },
  { id: 'tlr-4', employeeName: 'Karan Mehta', department: 'Sales', type: 'casual', from: '2026-07-10', to: '2026-07-10', days: 1, reason: 'Personal errand', status: 'pending', appliedOn: '2026-07-09' },
  { id: 'tlr-5', employeeName: 'Arjun Kumar', department: 'Engineering', type: 'comp_off', from: '2026-07-15', to: '2026-07-15', days: 1, reason: 'Compensatory off for weekend work', status: 'pending', appliedOn: '2026-07-08' },
];

// ── Payroll ───────────────────────────────────────────────
export const mockPayrollSummary = {
  month: 'July',
  year: 2026,
  grossSalary: 120000,
  deductions: 18500,
  netSalary: 101500,
  taxYTD: 72000,
  breakdown: [
    { label: 'Basic', amount: 60000, color: '#4F46E5' },
    { label: 'HRA', amount: 30000, color: '#7C3AED' },
    { label: 'DA', amount: 12000, color: '#EC4899' },
    { label: 'Special Allowance', amount: 18000, color: '#F59E0B' },
  ],
  deductionBreakdown: [
    { label: 'Provident Fund', amount: 7200 },
    { label: 'ESI', amount: 1800 },
    { label: 'Professional Tax', amount: 200 },
    { label: 'TDS', amount: 9300 },
  ],
  employerContributions: [
    { label: "Employer's PF", amount: 7200 },
    { label: "Employer's ESI", amount: 3120 },
  ],
};

export const mockPayslipHistory = [
  { id: 'ps-1', month: 'June 2026', gross: 120000, deductions: 18500, net: 101500 },
  { id: 'ps-2', month: 'May 2026', gross: 120000, deductions: 18500, net: 101500 },
  { id: 'ps-3', month: 'April 2026', gross: 118000, deductions: 18200, net: 99800 },
  { id: 'ps-4', month: 'March 2026', gross: 118000, deductions: 18200, net: 99800 },
  { id: 'ps-5', month: 'February 2026', gross: 115000, deductions: 17800, net: 97200 },
  { id: 'ps-6', month: 'January 2026', gross: 115000, deductions: 17800, net: 97200 },
];

// ── Performance ───────────────────────────────────────────
export const mockGoals = [
  { id: 'g-1', title: 'Complete API Integration', description: 'Integrate all backend endpoints with frontend service layer', progress: 80, dueDate: '2026-07-31', status: 'on_track' },
  { id: 'g-2', title: 'Improve Test Coverage', description: 'Raise unit test coverage from 30% to 70%', progress: 45, dueDate: '2026-07-15', status: 'at_risk' },
  { id: 'g-3', title: 'Performance Optimisation', description: 'Achieve Lighthouse score > 90 for all pages', progress: 20, dueDate: '2026-06-30', status: 'overdue' },
  { id: 'g-4', title: 'Documentation Update', description: 'Update technical docs for all new modules', progress: 100, dueDate: '2026-05-31', status: 'completed' },
  { id: 'g-5', title: 'Onboard Two Junior Engineers', description: 'Mentor and onboard 2 new team members', progress: 60, dueDate: '2026-08-15', status: 'on_track' },
];

export const mockReviews = [
  { id: 'r-1', cycle: 'Q2 2026', period: 'Apr – Jun 2026', rating: 4.2, reviewer: 'Vikram Singh', completedOn: '2026-07-02', status: 'completed', feedback: 'Consistently delivers high quality work. Shows strong technical ownership and good collaboration with team. Could improve communication during cross-team projects.' },
  { id: 'r-2', cycle: 'Q1 2026', period: 'Jan – Mar 2026', rating: 3.8, reviewer: 'Nishant Rao', completedOn: '2026-04-05', status: 'completed', feedback: 'Good performance overall. Handled challenging deliverables under tight deadlines. Recommended to take ownership of more independent modules next quarter.' },
  { id: 'r-3', cycle: 'Q3 2026', period: 'Jul – Sep 2026', rating: null, reviewer: 'Vikram Singh', completedOn: null, status: 'in_progress', feedback: '' },
];

export const mockFeedback = [
  { id: 'fb-1', from: 'Aarav Sharma', role: 'Senior Software Engineer', message: 'Great team player, always ready to help others debug issues.', date: '2026-07-01' },
  { id: 'fb-2', from: 'Divya Nair', role: 'Product Manager', message: 'Delivers features on time and communicates blockers proactively.', date: '2026-07-01' },
  { id: 'fb-3', from: 'Meera Joshi', role: 'QA Engineer', message: 'Code quality has improved significantly this quarter.', date: '2026-07-02' },
];

// ── Recruitment ───────────────────────────────────────────
export const mockJobPostings = [
  { id: 'job-1', title: 'Senior React Developer', department: 'Engineering', type: 'full_time', applicants: 12, postedDate: '2026-06-20', status: 'active', location: 'Bangalore' },
  { id: 'job-2', title: 'HR Business Partner', department: 'Human Resources', type: 'full_time', applicants: 8, postedDate: '2026-06-25', status: 'active', location: 'Mumbai' },
  { id: 'job-3', title: 'Data Analyst', department: 'Marketing', type: 'full_time', applicants: 18, postedDate: '2026-07-01', status: 'active', location: 'Remote' },
  { id: 'job-4', title: 'DevOps Engineer', department: 'Engineering', type: 'contract', applicants: 5, postedDate: '2026-07-03', status: 'active', location: 'Hyderabad' },
  { id: 'job-5', title: 'UI/UX Designer', department: 'Design', type: 'full_time', applicants: 22, postedDate: '2026-06-15', status: 'closed', location: 'Pune' },
];

export const mockCandidates = [
  { id: 'c-1', name: 'Meghna Das', email: 'meghna.das@email.com', role: 'Senior React Developer', stage: 'applied', appliedDate: '2026-06-22', avatar: null },
  { id: 'c-2', name: 'Sameer Khan', email: 'sameer.khan@email.com', role: 'Senior React Developer', stage: 'screening', appliedDate: '2026-06-21', avatar: null },
  { id: 'c-3', name: 'Preethi Rao', email: 'preethi.rao@email.com', role: 'HR Business Partner', stage: 'interview', appliedDate: '2026-06-26', avatar: null },
  { id: 'c-4', name: 'Abhishek Tiwari', email: 'abhishek.t@email.com', role: 'Data Analyst', stage: 'offer', appliedDate: '2026-07-01', avatar: null },
  { id: 'c-5', name: 'Lakshmi Nair', email: 'lakshmi.n@email.com', role: 'DevOps Engineer', stage: 'hired', appliedDate: '2026-07-03', avatar: null },
  { id: 'c-6', name: 'Rohit Sinha', email: 'rohit.sinha@email.com', role: 'Senior React Developer', stage: 'rejected', appliedDate: '2026-06-20', avatar: null },
  { id: 'c-7', name: 'Nandini Kulkarni', email: 'nandini.k@email.com', role: 'Data Analyst', stage: 'screening', appliedDate: '2026-07-02', avatar: null },
  { id: 'c-8', name: 'Tejas Menon', email: 'tejas.menon@email.com', role: 'HR Business Partner', stage: 'applied', appliedDate: '2026-06-28', avatar: null },
];

// ── Projects ──────────────────────────────────────────────
export const mockProjects = [
  {
    id: 'proj-1',
    title: 'Enterprise Platform Rebuild',
    description: 'Full rebuild of the workforce management platform with new tech stack',
    status: PROJECT_STATUS.ACTIVE,
    progress: 80,
    deadline: '2026-08-31',
    department: 'Engineering',
    tasksTotal: 20,
    tasksCompleted: 16,
    teamMembers: [
      { id: '1', name: 'Aarav Sharma' },
      { id: '5', name: 'Vikram Singh' },
      { id: '9', name: 'Arjun Kumar' },
      { id: '11', name: 'Rahul Verma' },
      { id: '15', name: 'Siddharth Bose' },
    ],
  },
  {
    id: 'proj-2',
    title: 'HR Portal Revamp',
    description: 'Redesign and rebuild the employee self-service HR portal',
    status: PROJECT_STATUS.ACTIVE,
    progress: 45,
    deadline: '2026-09-15',
    department: 'Human Resources',
    tasksTotal: 15,
    tasksCompleted: 7,
    teamMembers: [
      { id: '2', name: 'Priya Patel' },
      { id: '4', name: 'Sneha Reddy' },
      { id: '8', name: 'Divya Nair' },
    ],
  },
  {
    id: 'proj-3',
    title: 'Sales Automation Tool',
    description: 'Automate lead tracking and follow-up workflows for sales team',
    status: PROJECT_STATUS.ON_HOLD,
    progress: 30,
    deadline: '2026-10-01',
    department: 'Sales',
    tasksTotal: 12,
    tasksCompleted: 4,
    teamMembers: [
      { id: '7', name: 'Karan Mehta' },
      { id: '14', name: 'Tanya Kapoor' },
    ],
  },
  {
    id: 'proj-4',
    title: 'Analytics Dashboard V2',
    description: 'Build advanced analytics and reporting dashboards for leadership',
    status: PROJECT_STATUS.COMPLETED,
    progress: 100,
    deadline: '2026-06-30',
    department: 'Product',
    tasksTotal: 10,
    tasksCompleted: 10,
    teamMembers: [
      { id: '8', name: 'Divya Nair' },
      { id: '10', name: 'Meera Joshi' },
      { id: '6', name: 'Ananya Mishra' },
    ],
  },
  {
    id: 'proj-5',
    title: 'Mobile App — Employee Self-Service',
    description: 'React Native mobile app for employee attendance, leaves, and payslips',
    status: PROJECT_STATUS.ACTIVE,
    progress: 15,
    deadline: '2026-12-31',
    department: 'Engineering',
    tasksTotal: 30,
    tasksCompleted: 5,
    teamMembers: [
      { id: '1', name: 'Aarav Sharma' },
      { id: '9', name: 'Arjun Kumar' },
    ],
  },
];

// ── Tasks ─────────────────────────────────────────────────
export const mockTasks = [
  { id: 't-1', projectId: 'proj-1', title: 'Complete API integration', description: 'Integrate all backend endpoints', status: TASK_STATUS.IN_PROGRESS, priority: TASK_PRIORITY.HIGH, assignee: 'Aarav Sharma', dueDate: '2026-07-31', createdAt: '2026-07-01' },
  { id: 't-2', projectId: 'proj-1', title: 'Fix login redirect bug', description: 'Token expiry causes broken redirect loop', status: TASK_STATUS.TODO, priority: TASK_PRIORITY.CRITICAL, assignee: 'Aarav Sharma', dueDate: '2026-07-10', createdAt: '2026-07-08' },
  { id: 't-3', projectId: 'proj-1', title: 'Update component documentation', description: 'Add JSDoc to all reusable components', status: TASK_STATUS.DONE, priority: TASK_PRIORITY.LOW, assignee: 'Rahul Verma', dueDate: '2026-06-30', createdAt: '2026-06-15' },
  { id: 't-4', projectId: 'proj-1', title: 'Write unit tests for auth module', description: 'Coverage target: 80%', status: TASK_STATUS.IN_REVIEW, priority: TASK_PRIORITY.MEDIUM, assignee: 'Siddharth Bose', dueDate: '2026-07-20', createdAt: '2026-07-05' },
  { id: 't-5', projectId: 'proj-2', title: 'Design new leave request form', description: 'UX redesign with better validation UX', status: TASK_STATUS.IN_PROGRESS, priority: TASK_PRIORITY.HIGH, assignee: 'Sneha Reddy', dueDate: '2026-07-25', createdAt: '2026-07-10' },
  { id: 't-6', projectId: 'proj-2', title: 'Implement employee onboarding flow', description: 'Multi-step onboarding wizard', status: TASK_STATUS.TODO, priority: TASK_PRIORITY.MEDIUM, assignee: 'Divya Nair', dueDate: '2026-08-05', createdAt: '2026-07-12' },
  { id: 't-7', projectId: 'proj-3', title: 'Setup CRM integration webhook', description: 'Connect to Salesforce webhook endpoint', status: TASK_STATUS.TODO, priority: TASK_PRIORITY.HIGH, assignee: 'Karan Mehta', dueDate: '2026-10-10', createdAt: '2026-07-01' },
  { id: 't-8', projectId: 'proj-5', title: 'Scaffold React Native project', description: 'Initialize project with Expo', status: TASK_STATUS.DONE, priority: TASK_PRIORITY.MEDIUM, assignee: 'Arjun Kumar', dueDate: '2026-07-05', createdAt: '2026-07-01' },
  { id: 't-9', projectId: 'proj-5', title: 'Implement biometric clock-in', description: 'Use device biometric API for attendance marking', status: TASK_STATUS.TODO, priority: TASK_PRIORITY.HIGH, assignee: 'Aarav Sharma', dueDate: '2026-09-30', createdAt: '2026-07-08' },
  { id: 't-10', projectId: 'proj-1', title: 'Performance audit and optimisation', description: 'Achieve Lighthouse > 90', status: TASK_STATUS.TODO, priority: TASK_PRIORITY.MEDIUM, assignee: 'Vikram Singh', dueDate: '2026-08-15', createdAt: '2026-07-10' },
];

// ── Helpdesk Tickets ──────────────────────────────────────
export const mockTickets = [
  { id: 'tkt-1', ticketNo: 'TKT-001', title: 'Laptop not charging', category: TICKET_CATEGORY.IT, priority: TICKET_PRIORITY.HIGH, status: TICKET_STATUS.OPEN, description: 'My laptop battery stopped charging. Tried different chargers, issue persists.', raisedBy: 'Karan Mehta', assignedTo: 'IT Support', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), comments: [] },
  { id: 'tkt-2', ticketNo: 'TKT-002', title: 'VPN access issue after password reset', category: TICKET_CATEGORY.IT, priority: TICKET_PRIORITY.URGENT, status: TICKET_STATUS.IN_PROGRESS, description: 'Cannot connect to VPN after resetting company password. Getting authentication error.', raisedBy: 'Rohan Gupta', assignedTo: 'IT Support', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), comments: [] },
  { id: 'tkt-3', ticketNo: 'TKT-003', title: 'Leave policy clarification', category: TICKET_CATEGORY.HR, priority: TICKET_PRIORITY.LOW, status: TICKET_STATUS.RESOLVED, description: 'Need clarification on carry-forward policy for earned leave at year end.', raisedBy: 'Ananya Mishra', assignedTo: 'HR Team', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), comments: [] },
  { id: 'tkt-4', ticketNo: 'TKT-004', title: 'Office chair replacement request', category: TICKET_CATEGORY.FACILITIES, priority: TICKET_PRIORITY.MEDIUM, status: TICKET_STATUS.OPEN, description: 'My ergonomic chair is broken and causing back pain. Requesting replacement.', raisedBy: 'Meera Joshi', assignedTo: 'Facilities', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), comments: [] },
  { id: 'tkt-5', ticketNo: 'TKT-005', title: 'Software license renewal', category: TICKET_CATEGORY.ADMIN, priority: TICKET_PRIORITY.HIGH, status: TICKET_STATUS.IN_PROGRESS, description: 'Adobe Creative Cloud license expires in 3 days. Need urgent renewal for design work.', raisedBy: 'Sneha Reddy', assignedTo: 'Admin', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), comments: [] },
  { id: 'tkt-6', ticketNo: 'TKT-006', title: 'Internet connectivity issues in Cabin 3B', category: TICKET_CATEGORY.IT, priority: TICKET_PRIORITY.MEDIUM, status: TICKET_STATUS.RESOLVED, description: 'Intermittent Wi-Fi drops in cabin 3B throughout the day.', raisedBy: 'Rahul Verma', assignedTo: 'IT Support', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), comments: [] },
  { id: 'tkt-7', ticketNo: 'TKT-007', title: 'Payslip discrepancy for May 2026', category: TICKET_CATEGORY.HR, priority: TICKET_PRIORITY.HIGH, status: TICKET_STATUS.CLOSED, description: 'Deductions in May payslip do not match the salary structure on file.', raisedBy: 'Pooja Iyer', assignedTo: 'HR Team', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(), comments: [] },
  { id: 'tkt-8', ticketNo: 'TKT-008', title: 'Request for standing desk', category: TICKET_CATEGORY.FACILITIES, priority: TICKET_PRIORITY.LOW, status: TICKET_STATUS.OPEN, description: 'Would like to request a height-adjustable standing desk for health reasons.', raisedBy: 'Arjun Kumar', assignedTo: 'Facilities', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), comments: [] },
];

// ── Notifications ─────────────────────────────────────────
export const mockNotifications = [
  { id: 'n-1', type: NOTIFICATION_TYPES.LEAVE, title: 'Leave approved', message: 'Your casual leave request for Jul 14–18 has been approved.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), actionUrl: '/leave' },
  { id: 'n-2', type: NOTIFICATION_TYPES.PAYROLL, title: 'Payroll processed', message: 'Your June 2026 payslip is now available for download.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), actionUrl: '/payroll' },
  { id: 'n-3', type: NOTIFICATION_TYPES.HELPDESK, title: 'Ticket updated', message: 'TKT-002 VPN access issue has been assigned to IT Support.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), actionUrl: '/helpdesk' },
  { id: 'n-4', type: NOTIFICATION_TYPES.PERFORMANCE, title: 'Q3 review started', message: 'Your Q3 2026 performance review cycle has begun.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), actionUrl: '/performance' },
  { id: 'n-5', type: NOTIFICATION_TYPES.GENERAL, title: 'Team outing scheduled', message: 'The quarterly team outing is scheduled for July 20, 2026.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), actionUrl: null },
  { id: 'n-6', type: NOTIFICATION_TYPES.ATTENDANCE, title: 'Attendance reminder', message: 'You have not clocked in today. Please mark your attendance.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), actionUrl: '/attendance' },
  { id: 'n-7', type: NOTIFICATION_TYPES.LEAVE, title: 'Leave rejected', message: 'Your casual leave request for Apr 8 was not approved.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), actionUrl: '/leave' },
  { id: 'n-8', type: NOTIFICATION_TYPES.HELPDESK, title: 'Ticket resolved', message: 'TKT-003 Leave policy clarification has been resolved.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), actionUrl: '/helpdesk' },
  { id: 'n-9', type: NOTIFICATION_TYPES.GENERAL, title: 'Company policy updated', message: 'The remote work policy has been updated. Please review.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), actionUrl: '/documents' },
  { id: 'n-10', type: NOTIFICATION_TYPES.PERFORMANCE, title: 'New feedback received', message: 'Divya Nair left you peer feedback for Q2 2026.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), actionUrl: '/performance' },
];

// ── Analytics ─────────────────────────────────────────────
export const mockAnalyticsData = {
  headcountTrend: [
    { month: 'Jan', count: 142 },
    { month: 'Feb', count: 143 },
    { month: 'Mar', count: 145 },
    { month: 'Apr', count: 148 },
    { month: 'May', count: 150 },
    { month: 'Jun', count: 152 },
    { month: 'Jul', count: 154 },
    { month: 'Aug', count: 155 },
    { month: 'Sep', count: 156 },
    { month: 'Oct', count: 156 },
    { month: 'Nov', count: 157 },
    { month: 'Dec', count: 158 },
  ],
  attritionRate: [
    { month: 'Jan', rate: 6.2 },
    { month: 'Feb', rate: 5.8 },
    { month: 'Mar', rate: 7.1 },
    { month: 'Apr', rate: 8.4 },
    { month: 'May', rate: 9.0 },
    { month: 'Jun', rate: 8.2 },
    { month: 'Jul', rate: 7.5 },
    { month: 'Aug', rate: 7.0 },
    { month: 'Sep', rate: 8.0 },
    { month: 'Oct', rate: 8.5 },
    { month: 'Nov', rate: 7.8 },
    { month: 'Dec', rate: 6.5 },
  ],
  leaveStats: [
    { type: 'Casual', days: 182, color: '#4F46E5' },
    { type: 'Sick', days: 78, color: '#EF4444' },
    { type: 'Earned', days: 145, color: '#10B981' },
    { type: 'Comp Off', days: 22, color: '#F59E0B' },
    { type: 'Unpaid', days: 12, color: '#6B7280' },
  ],
  payrollTrend: [
    { month: 'Feb', gross: 1820000, net: 1540000 },
    { month: 'Mar', gross: 1845000, net: 1560000 },
    { month: 'Apr', gross: 1860000, net: 1580000 },
    { month: 'May', gross: 1870000, net: 1590000 },
    { month: 'Jun', gross: 1880000, net: 1600000 },
    { month: 'Jul', gross: 1900000, net: 1620000 },
  ],
  genderSplit: [
    { label: 'Male', value: 97, color: '#4F46E5' },
    { label: 'Female', value: 59, color: '#EC4899' },
  ],
  topPerformers: [
    { name: 'Vikram Singh', department: 'Engineering', rating: 4.8 },
    { name: 'Divya Nair', department: 'Product', rating: 4.6 },
    { name: 'Aarav Sharma', department: 'Engineering', rating: 4.2 },
    { name: 'Priya Patel', department: 'Human Resources', rating: 4.1 },
    { name: 'Nishant Rao', department: 'Operations', rating: 4.0 },
  ],
};

// ── Documents ─────────────────────────────────────────────
export const mockDocuments = [
  { id: 'doc-1', name: 'offer_letter_2023.pdf', type: DOCUMENT_TYPES.OFFER_LETTER, uploadedBy: 'Priya Patel', uploadedDate: '2023-03-14', size: '240 KB', url: '#' },
  { id: 'doc-2', name: 'employment_contract.pdf', type: DOCUMENT_TYPES.CONTRACT, uploadedBy: 'Priya Patel', uploadedDate: '2023-03-15', size: '180 KB', url: '#' },
  { id: 'doc-3', name: 'payslip_june_2026.pdf', type: DOCUMENT_TYPES.PAYSLIP, uploadedBy: 'System', uploadedDate: '2026-06-30', size: '95 KB', url: '#' },
  { id: 'doc-4', name: 'payslip_may_2026.pdf', type: DOCUMENT_TYPES.PAYSLIP, uploadedBy: 'System', uploadedDate: '2026-05-31', size: '95 KB', url: '#' },
  { id: 'doc-5', name: 'aadhaar_card.pdf', type: DOCUMENT_TYPES.ID_PROOF, uploadedBy: 'Aarav Sharma', uploadedDate: '2023-03-14', size: '320 KB', url: '#' },
  { id: 'doc-6', name: 'pan_card.pdf', type: DOCUMENT_TYPES.ID_PROOF, uploadedBy: 'Aarav Sharma', uploadedDate: '2023-03-14', size: '210 KB', url: '#' },
  { id: 'doc-7', name: 'remote_work_policy_2026.pdf', type: DOCUMENT_TYPES.POLICY, uploadedBy: 'Priya Patel', uploadedDate: '2026-01-10', size: '450 KB', url: '#' },
  { id: 'doc-8', name: 'leave_policy_2026.pdf', type: DOCUMENT_TYPES.POLICY, uploadedBy: 'Priya Patel', uploadedDate: '2026-01-10', size: '380 KB', url: '#' },
  { id: 'doc-9', name: 'nda_agreement.pdf', type: DOCUMENT_TYPES.CONTRACT, uploadedBy: 'Legal Team', uploadedDate: '2023-04-01', size: '125 KB', url: '#' },
  { id: 'doc-10', name: 'training_certificate.pdf', type: DOCUMENT_TYPES.OTHER, uploadedBy: 'Aarav Sharma', uploadedDate: '2026-05-15', size: '560 KB', url: '#' },
];

// ── AI Assistant pre-seeded conversation ──────────────────
export const mockAIMessages = [
  {
    id: 'ai-1',
    role: 'assistant',
    content: "Hello! I'm your HR AI Assistant. I can help you check leave balances, view payslip info, attendance summaries, and more. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];
