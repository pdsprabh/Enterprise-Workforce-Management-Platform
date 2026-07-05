# Day 3 & Day 4 — Task Checklist (Ayush — Frontend UI)

> **Branch:** `ayush-frontend`
> **Status:** Ready to implement (Day 1 & 2 complete)

---

## Day 3: Attendance & Leave Management

### Foundation (Utils & API)
- [ ] Update `constants.js` — add `LEAVE_TYPES`, `LEAVE_TYPE_LABELS`, `ATTENDANCE_STATUS`, `ATTENDANCE_STATUS_LABELS`
- [ ] Update `formatters.js` — add `formatTime()`, `formatDuration()`, `getBusinessDays()`
- [ ] Update `mockData.js` — add `mockAttendanceLog`, `mockLeaveBalance`, `mockLeaveRequests`, `mockTeamLeaveRequests`
- [ ] Create `src/api/attendanceApi.js` — clockIn, clockOut, getMyAttendance, getAttendanceSummary
- [ ] Create `src/api/leaveApi.js` — applyLeave, getMyLeaves, getLeaveBalance, approveLeave, rejectLeave, cancelLeave

### Reusable UI Components
- [ ] Create `src/components/ui/TabNav.jsx` + `TabNav.css` — tabbed navigation with animated underline
- [ ] Create `src/components/ui/DateRangePicker.jsx` — start/end date with business day calculation

### Attendance Module
- [ ] Create `src/components/attendance/ClockCard.jsx` — clock-in/out with live timer
- [ ] Create `src/components/attendance/AttendanceCalendar.jsx` — CSS calendar grid with color-coded days
- [ ] Create `src/components/attendance/Attendance.css` — shared attendance component styles
- [ ] Create `src/pages/attendance/AttendancePage.jsx` — full attendance page with clock card, calendar, log table
- [ ] Create `src/pages/attendance/AttendancePage.css` — scoped page styles

### Leave Module
- [ ] Create `src/components/leave/LeaveBalanceCard.jsx` — balance display with progress bar
- [ ] Create `src/components/leave/ApplyLeaveModal.jsx` — apply leave form modal
- [ ] Create `src/components/leave/Leave.css` — shared leave component styles
- [ ] Create `src/pages/leave/LeavePage.jsx` — tabbed leave page (My Leaves, Balance, Team Requests)
- [ ] Create `src/pages/leave/LeavePage.css` — scoped page styles

### Integration
- [ ] Update `App.jsx` — replace `/attendance` placeholder with AttendancePage
- [ ] Update `App.jsx` — replace `/leave` placeholder with LeavePage
- [ ] **Verify:** `npm run build` — zero errors
- [ ] **Verify:** Manual browser test of attendance and leave pages

---

## Day 4: Payroll, Performance & Recruitment

### Foundation (Utils & API)
- [ ] Update `constants.js` — add `SALARY_COMPONENTS`, `DEDUCTION_TYPES`, `GOAL_STATUS`, `REVIEW_STATUS`, `CANDIDATE_STAGES`, `EMPLOYMENT_TYPES`
- [ ] Update `formatters.js` — add `formatSalary()`, `formatPercentage()`
- [ ] Update `mockData.js` — add `mockPayrollSummary`, `mockPayslipHistory`, `mockGoals`, `mockReviews`, `mockFeedback`, `mockJobPostings`, `mockCandidates`
- [ ] Create `src/api/payrollApi.js` — getPayrollSummary, getMyPayslips, getPayslipById, downloadPayslip
- [ ] Create `src/api/performanceApi.js` — getMyReviews, getMyGoals, updateGoalProgress, getReviewCycles
- [ ] Create `src/api/recruitmentApi.js` — getJobPostings, getJobById, getCandidates, updateCandidateStatus

### Reusable UI Components
- [ ] Create `src/components/ui/StarRating.jsx` — 1-5 star rating display with half-star support
- [ ] Create `src/components/ui/KanbanBoard.jsx` + `KanbanBoard.css` — column-based board layout

### Payroll Module
- [ ] Create `src/components/payroll/SalaryBreakdown.jsx` — CSS horizontal bar chart
- [ ] Create `src/components/payroll/PayslipModal.jsx` — detailed payslip view modal
- [ ] Create `src/pages/payroll/PayrollPage.jsx` — salary summary, breakdown, payslip history
- [ ] Create `src/pages/payroll/PayrollPage.css` — scoped page styles

### Performance Module
- [ ] Create `src/components/performance/GoalCard.jsx` — goal with progress bar and status
- [ ] Create `src/components/performance/ReviewCard.jsx` — review with star rating and feedback
- [ ] Create `src/pages/performance/PerformancePage.jsx` — tabbed: Goals, Reviews, Feedback
- [ ] Create `src/pages/performance/PerformancePage.css` — scoped page styles

### Recruitment Module
- [ ] Create `src/components/recruitment/JobCard.jsx` — job posting card
- [ ] Create `src/components/recruitment/CandidateCard.jsx` — candidate card with stage actions
- [ ] Create `src/pages/recruitment/RecruitmentPage.jsx` — tabbed: Open Positions, Candidate Pipeline
- [ ] Create `src/pages/recruitment/RecruitmentPage.css` — scoped page styles

### Integration
- [ ] Update `App.jsx` — replace `/payroll` placeholder with PayrollPage
- [ ] Update `App.jsx` — replace `/performance` placeholder with PerformancePage
- [ ] Update `App.jsx` — replace `/recruitment` placeholder with RecruitmentPage
- [ ] **Verify:** `npm run build` — zero errors
- [ ] **Verify:** Manual browser test of payroll, performance, recruitment pages
- [ ] **Verify:** Dark mode on all 5 new pages
- [ ] **Verify:** Responsive layouts on all 5 new pages

---

## End of Day 4 Deliverables

### Pages Completed (Running Total)
| Day | Pages |
|-----|-------|
| Day 1 | Login, Register, Forgot Password, Dashboard Shell |
| Day 2 | Dashboard, Employee List, Employee Detail, Add Employee |
| **Day 3** | **Attendance, Leave** |
| **Day 4** | **Payroll, Performance, Recruitment** |
| **Total** | **12 pages** |

### Git Push
```bash
git push origin ayush-frontend
git checkout dev
git merge ayush-frontend
git push origin dev
```

### Remaining Placeholders (for Days 5–6)
- `/projects` — Projects & Tasks
- `/assets` — Asset Management
- `/helpdesk` — Helpdesk Tickets
- `/documents` — Document Management
- `/analytics` — Analytics Dashboard
- `/ai-assistant` — AI Assistant
