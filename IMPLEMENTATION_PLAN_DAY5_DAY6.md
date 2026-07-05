# Ayush's Day 5 & Day 6 — Frontend UI Implementation Plan

## Context: What's Done (Days 1–4)

| Module | Route | Status |
|---|---|---|
| Auth (Login, Register, Forgot Password) | `/login` `/register` | ✅ Done |
| Dashboard | `/dashboard` | ✅ Done |
| Employee CRUD | `/employees` | ✅ Done |
| Attendance (Clock-in/out, Calendar, Log) | `/attendance` | ✅ Done |
| Leave (Balance, History, Team Requests) | `/leave` | ✅ Done |
| Payroll (Summary, Breakdown, Payslips) | `/payroll` | ✅ Done |
| Performance (Goals, Reviews, Feedback) | `/performance` | ✅ Done |
| Recruitment (Positions, Pipeline Kanban) | `/recruitment` | ✅ Done |

**Remaining placeholders (Days 5–6):**
`/projects` `/helpdesk` (Day 5) + `/analytics` `/documents` `/ai-assistant` (Day 6)

**Plus:** Notifications Panel (Topbar bell — Day 5)

---

## Day 5: Projects, Helpdesk & Notifications Panel

---

### Task 5.1 — Constants & Mock Data Updates

**Modify:** `src/utils/constants.js`

```js
PROJECT_STATUS   = { ACTIVE, ON_HOLD, COMPLETED, CANCELLED }
TASK_STATUS      = { TODO, IN_PROGRESS, IN_REVIEW, DONE }
TASK_PRIORITY    = { LOW, MEDIUM, HIGH, CRITICAL }
TICKET_STATUS    = { OPEN, IN_PROGRESS, RESOLVED, CLOSED }
TICKET_PRIORITY  = { LOW, MEDIUM, HIGH, URGENT }
TICKET_CATEGORY  = { IT, HR, ADMIN, FACILITIES, OTHER }
NOTIFICATION_TYPES = { LEAVE, ATTENDANCE, PAYROLL, HELPDESK, GENERAL, PERFORMANCE }
```

**Modify:** `src/utils/mockData.js`

`mockProjects` — 5 projects:
```
{ id, title, description, status, progress(0-100), deadline,
  teamMembers:[{ id, name, avatar }], tasksTotal, tasksCompleted, department }
```

`mockTasks` — 10 tasks spread across projects and statuses:
```
{ id, projectId, title, description, status, priority, assignee,
  dueDate, createdAt }
```

`mockTickets` — 8 helpdesk tickets:
```
{ id, ticketNo, title, category, priority, status, description,
  raisedBy, assignedTo, createdAt, updatedAt, comments:[] }
```

`mockNotifications` — 10 notifications:
```
{ id, type, title, message, isRead, createdAt, actionUrl }
```

**Modify:** `src/utils/formatters.js`
- `formatNotificationTime(date)` — "Just now" / "5m ago" / "2h ago" / "Yesterday" / date string

---

### Task 5.2 — API Services

**File:** `src/api/projectApi.js`

| Function | Endpoint |
|---|---|
| `getProjects(params)` | `GET /api/projects` |
| `getProjectById(id)` | `GET /api/projects/:id` |
| `createProject(data)` | `POST /api/projects` |
| `updateProject(id, data)` | `PUT /api/projects/:id` |
| `getMyTasks(params)` | `GET /api/projects/tasks/me` |
| `updateTaskStatus(taskId, status)` | `PUT /api/projects/tasks/:id` |

**File:** `src/api/helpdeskApi.js`

| Function | Endpoint |
|---|---|
| `getMyTickets(params)` | `GET /api/helpdesk/me` |
| `getAllTickets(params)` | `GET /api/helpdesk` |
| `getTicketById(id)` | `GET /api/helpdesk/:id` |
| `createTicket(data)` | `POST /api/helpdesk` |
| `updateTicket(id, data)` | `PUT /api/helpdesk/:id` |
| `closeTicket(id)` | `PUT /api/helpdesk/:id/close` |

**File:** `src/api/notificationApi.js`

| Function | Endpoint |
|---|---|
| `getNotifications()` | `GET /api/notifications` |
| `markAsRead(id)` | `PUT /api/notifications/:id/read` |
| `markAllRead()` | `PUT /api/notifications/read-all` |
| `deleteNotification(id)` | `DELETE /api/notifications/:id` |

---

### Task 5.3 — Notification Context

**File:** `src/context/NotificationContext.jsx`

```
State:
  notifications[]   — full list
  unreadCount       — computed from notifications
  isLoading

Methods:
  markAsRead(id)    — marks single notification read
  markAllRead()     — marks all read
  addNotification() — for Socket.io real-time push (future)
  removeNotification(id)

Usage: wraps app in App.jsx alongside AuthProvider
```

This context is consumed by both `Topbar.jsx` (badge count) and `NotificationPanel.jsx` (panel list).

---

### Task 5.4 — Notifications Panel Component

**Files:** `src/components/notifications/NotificationPanel.jsx`, `NotificationItem.jsx`, `Notifications.css`

**NotificationPanel.jsx layout:**
```
┌─────────────────────────────────────────┐
│  Notifications               [Mark all read] │
├─────────────────────────────────────────┤
│  ● Leave approved    2m ago   [unread]   │
│  ● Payroll processed 1h ago   [unread]   │
│  ○ Q2 review due     Yesterday           │
│  ○ New ticket raised 2 days ago          │
│  ○ Candidate hired   3 days ago          │
│  ─────────────────────────────────────── │
│           View all notifications         │
└─────────────────────────────────────────┘
```

**Behavior:**
- Slides in from top-right as an absolute-positioned dropdown (not a full modal)
- Closes when clicking outside (click-away listener)
- Unread notifications have a colored left border + light background tint
- Each item has an icon per `NOTIFICATION_TYPES` (color-coded)
- Clicking an item marks it read + navigates to `actionUrl` if present
- "Mark all read" button at top-right of header
- Max height with scroll if more than 6 items

**NotificationItem.jsx:**
- Left: colored icon dot per type
- Center: `title` (bold), `message` (truncated to 60 chars), `time` (relative)
- Right: unread blue dot indicator
- Hover: subtle background highlight

**Topbar.jsx changes:**
- Import `useNotifications` hook from `NotificationContext`
- Bell button `onClick` toggles panel open/close state
- Badge shows real `unreadCount` (hidden when 0)
- `<NotificationPanel>` renders conditionally next to bell button

---

### Task 5.5 — Projects Module Components

**Files:** `src/components/projects/ProjectCard.jsx`, `TaskItem.jsx`, `Projects.css`

**ProjectCard.jsx:**
```
┌──────────────────────────────────────────┐
│  Senior React Developer Hiring          │
│  Engineering · Due: Aug 15, 2026        │
│  ────────────────────────────────────   │
│  Progress:  ████████░░  80%             │
│  Tasks:  16 / 20 completed              │
│  Team: [AS] [PK] [RG] +2               │
│                         [Active ●]      │
└──────────────────────────────────────────┘
```
- Gradient accent bar on card left edge per status color
- Team member avatars (max 3 shown, "+N" overflow)
- Progress bar color: green (>70%), yellow (30–70%), red (<30%)
- Status badge top-right

**TaskItem.jsx:**
- Checkbox (clicking toggles TODO ↔ DONE)
- Task title (strikethrough when done)
- Priority badge (color: red=Critical, orange=High, yellow=Medium, gray=Low)
- Assignee avatar + name
- Due date (red text if overdue)
- Subtle hover background

---

### Task 5.6 — Projects Page

**Files:** `src/pages/projects/ProjectsPage.jsx`, `ProjectsPage.css`

**Layout (Tabbed — reuses TabNav):**
```
┌──────────────────────────────────────────────────────────────┐
│  Projects                              [+ New Project]       │
├──────────────────────────────────────────────────────────────┤
│  [My Projects]   [My Tasks]                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TAB 1: MY PROJECTS — Card grid (2 columns)                  │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Platform Rebuild│  │ HR Portal Revamp│                   │
│  │ 80% ████████░░  │  │ 45% ████░░░░░░  │                   │
│  │ [AS][PK] +2     │  │ [RG][MJ]        │                   │
│  │ Active ●        │  │ At Risk ⚠       │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  TAB 2: MY TASKS — Filterable task list                      │
│  Filter: [All] [To Do] [In Progress] [Done]                  │
│  ☐ Complete API integration   HIGH  Ayush  Jul 31            │
│  ☐ Fix login redirect bug     CRIT  Ayush  Jul 10 🔴         │
│  ✓ Update documentation       LOW   Ayush  Jun 30            │
└──────────────────────────────────────────────────────────────┘
```

**My Projects tab:**
- 2-column responsive card grid
- Filter chips: All / Active / On Hold / Completed

**My Tasks tab:**
- Filter pills: All / To Do / In Progress / Done
- Sorted: overdue first, then by due date
- Checkbox interaction updates task status locally (mock)
- Empty state per filter

---

### Task 5.7 — Helpdesk Module Components

**Files:** `src/components/helpdesk/TicketCard.jsx`, `CreateTicketModal.jsx`, `Helpdesk.css`

**TicketCard.jsx:**
```
┌──────────────────────────────────────────┐
│  #TKT-001  Laptop not charging           │
│  IT · High · Raised by: Karan Mehta     │
│  Assigned: Support Team · Jul 8, 2026   │
│                          [Open 🔵]      │
└──────────────────────────────────────────┘
```
- Ticket number + title
- Category + Priority badge + Status badge
- Raised by, assigned to, created date
- Color-coded left border per priority: red=Urgent, orange=High, yellow=Medium, gray=Low

**CreateTicketModal.jsx (uses Modal):**
- Title input (required)
- Category dropdown (IT / HR / Admin / Facilities / Other)
- Priority selector (Low / Medium / High / Urgent) — visual pill selector, not plain dropdown
- Description textarea (required, min 20 chars)
- Submit + loading state + toast feedback

---

### Task 5.8 — Helpdesk Page

**Files:** `src/pages/helpdesk/HelpdeskPage.jsx`, `HelpdeskPage.css`

**Layout (Tabbed):**
```
┌──────────────────────────────────────────────────────────────┐
│  Helpdesk                             [+ Create Ticket]      │
├──────────────────────────────────────────────────────────────┤
│  [My Tickets]   [All Tickets]                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Summary row:                                                │
│  Open: 5  |  In Progress: 3  |  Resolved: 12  |  Closed: 8  │
│                                                              │
│  Filter: [All] [Open] [In Progress] [Resolved]               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ #TKT-001 │ Laptop not charging │ IT │ High │ Open     │  │
│  │ #TKT-002 │ VPN access issue    │ IT │ Urgent│ Progress │  │
│  │ #TKT-003 │ Leave policy query  │ HR │ Low  │ Resolved │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Key features:**
- Summary stat row (Open / In Progress / Resolved / Closed) color-coded
- Status filter pills
- Table view with priority-colored rows
- "All Tickets" tab (HR/Admin view) shows all employees' tickets
- Create Ticket opens modal

---

## Day 6: Analytics Dashboard, Documents & AI Assistant

---

### Task 6.1 — Constants & Mock Data Updates (Day 6)

**Modify:** `src/utils/constants.js`
```js
DOCUMENT_TYPES = { OFFER_LETTER, CONTRACT, PAYSLIP, ID_PROOF, POLICY, OTHER }
DOCUMENT_TYPE_LABELS — display names
```

**Modify:** `src/utils/mockData.js`

`mockAnalyticsData`:
```
headcountTrend: [{ month, count }] × 12 months
attritionRate: [{ month, rate }] × 12 months
leaveStats: [{ type, days, color }]
payrollTrend: [{ month, gross, net }] × 6 months
departmentHeadcount: (reuse mockDepartmentDistribution)
genderSplit: { male: 62, female: 38 }
topPerformers: [{ name, department, rating }] × 5
```

`mockDocuments` — 10 documents:
```
{ id, name, type, uploadedBy, uploadedDate, size, url }
```

`mockAIMessages` — pre-seeded conversation:
```
{ id, role:'user'|'assistant', content, timestamp }
```

---

### Task 6.2 — API Services (Day 6)

**File:** `src/api/analyticsApi.js`

| Function | Endpoint |
|---|---|
| `getHeadcountTrend(year)` | `GET /api/analytics/headcount` |
| `getAttritionRate(year)` | `GET /api/analytics/attrition` |
| `getDepartmentBreakdown()` | `GET /api/analytics/departments` |
| `getLeaveStats(year)` | `GET /api/analytics/leave` |
| `getPayrollTrend(year)` | `GET /api/analytics/payroll` |

**File:** `src/api/documentApi.js`

| Function | Endpoint |
|---|---|
| `getDocuments(params)` | `GET /api/documents` |
| `uploadDocument(formData)` | `POST /api/documents` |
| `downloadDocument(id)` | `GET /api/documents/:id/download` |
| `deleteDocument(id)` | `DELETE /api/documents/:id` |

**File:** `src/api/aiApi.js`

| Function | Endpoint |
|---|---|
| `sendMessage(message)` | `POST /api/ai/chat` |
| `getConversationHistory()` | `GET /api/ai/history` |
| `clearHistory()` | `DELETE /api/ai/history` |

---

### Task 6.3 — Reusable Chart Components

**Files:** `src/components/ui/LineChart.jsx`, `BarChart.jsx`, `DonutChart.jsx`, `Charts.css`

All charts are **pure CSS/SVG — no external library** (matching existing pattern in the codebase).

**LineChart.jsx:**
- Props: `data=[{label, value}]`, `color`, `height`, `unit`
- SVG polyline connecting data points
- X-axis labels, Y-axis scale
- Hover tooltip showing value
- Smooth curved line via SVG cubic bezier

**BarChart.jsx:**
- Props: `data=[{label, value, color?}]`, `maxValue`, `horizontal?`
- Vertical bars with animated height on mount
- Value labels on top of each bar
- X-axis labels below bars
- Optional horizontal mode (for salary breakdown — replaces SalaryBreakdown inline bars)

**DonutChart.jsx:**
- Props: `segments=[{label, value, color}]`, `size`, `innerLabel`
- CSS `conic-gradient` based — no SVG needed
- Center label showing total or custom text
- Legend list below

---

### Task 6.4 — Analytics Dashboard Page

**Files:** `src/pages/analytics/AnalyticsPage.jsx`, `AnalyticsPage.css`

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Analytics Dashboard                    Year: 2026  ◀ ▶     │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│ Total Emps   │ Avg Tenure   │ Attrition    │ Avg Performance  │
│    156       │  2.4 years   │   8.2%       │   4.1 / 5       │
├──────────────┴──────────────┴──────────────┴─────────────────┤
│  Headcount Trend (Line Chart — 12 months)                    │
│  Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec             │
│  142─143─145─148─150─152─154─155─156─156─157─158            │
├──────────────────────────────┬───────────────────────────────┤
│  Department Distribution     │  Leave Stats Breakdown        │
│  (DonutChart)                │  (DonutChart)                 │
│  Engineering 31%             │  Casual 42%                   │
│  Sales 14% HR 8%...          │  Sick 18% Earned 32%...       │
├──────────────────────────────┴───────────────────────────────┤
│  Payroll Trend (BarChart — 6 months, grouped Gross vs Net)   │
├──────────────────────────────┬───────────────────────────────┤
│  Top Performers              │  Gender Split                 │
│  1. Vikram Singh  4.8★       │  (DonutChart)                 │
│  2. Divya Nair    4.6★       │  Male: 62%  Female: 38%       │
└──────────────────────────────┴───────────────────────────────┘
```

**Key features:**
- Year navigation (◀ ▶)
- 4 KPI stat cards at top
- All charts use the new reusable chart components
- Top Performers list uses StarRating component (reused from Day 4)
- Responsive 2-column grid collapses to 1 column on mobile

---

### Task 6.5 — Documents Module

**Files:** `src/components/documents/DocumentRow.jsx`, `Documents.css`, `src/pages/documents/DocumentsPage.jsx`, `DocumentsPage.css`

**DocumentRow.jsx:**
- File type icon (📄 PDF, 📊 Excel, 🖼 Image, 📝 Doc — emoji or SVG)
- Filename (bold) + type badge
- Uploaded by + date
- File size
- Actions: Download button, Delete button (with confirm)

**DocumentsPage layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Documents                             [↑ Upload Document]   │
├──────────────────────────────────────────────────────────────┤
│  Search: [_____________]                                     │
│  Filter: [All] [Offer Letters] [Contracts] [Payslips] [IDs]  │
├──────────────────────────────────────────────────────────────┤
│  Filename         │ Type       │ Uploaded By │ Date  │ Size  │
│  ─────────────────┼────────────┼─────────────┼───────┼────── │
│  offer_letter.pdf │ Offer Ltr  │ HR Manager  │Jul 1  │ 240KB │
│  contract_2026.pdf│ Contract   │ HR Manager  │Jun 15 │ 180KB │
│  payslip_jun.pdf  │ Payslip    │ System      │Jun 30 │ 95KB  │
└──────────────────────────────────────────────────────────────┘
```

**Key features:**
- Search bar (debounced — uses `useDebounce` hook already built)
- Category filter tabs using TabNav
- Upload button (mock: shows toast "Upload feature coming soon" — no actual file upload needed for mock)
- Download button triggers mock download toast
- Delete button removes from local state with confirmation

---

### Task 6.6 — AI Assistant Chat Interface

**Files:** `src/components/ai/ChatBubble.jsx`, `ChatInput.jsx`, `AI.css`, `src/pages/ai-assistant/AIAssistantPage.jsx`, `AIAssistantPage.css`

**ChatBubble.jsx:**
- `role='user'` → right-aligned, primary color background
- `role='assistant'` → left-aligned, secondary background, bot avatar icon
- Timestamp below each bubble
- Markdown-lite: bold text (wrap `**text**` in `<strong>`)

**ChatInput.jsx:**
- Textarea (auto-grows up to 4 lines)
- Send button (primary color, arrow icon)
- Enter = send, Shift+Enter = new line
- Disabled + spinner while AI is "thinking"
- Clear button when text present

**AIAssistantPage layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  AI Assistant                              🤖                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🤖 Hello! I'm your HR assistant. How can I help?   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                              ┌────────────┐  │
│                                              │ How many   │  │
│                                              │ leaves do  │  │
│                                              │ I have?    │  │
│                                              └────────────┘  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  🤖 You have 4 remaining casual leaves, 4 sick...   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Suggested prompts (shown when chat is empty):              │
│  [Check leave balance] [View payslip] [Raise a ticket]       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  [  Type your message...              ] [➤ Send]            │
└──────────────────────────────────────────────────────────────┘
```

**Key features:**
- Mock AI responses (canned replies based on keywords — no real API needed yet)
- Suggested prompt chips shown when conversation is empty — clicking inserts text
- Auto-scroll to bottom on new message
- "AI is typing..." indicator with 3-dot bounce animation
- Message timestamps
- Chat history persists in component state (resets on page leave — no localStorage)

**Mock response logic (keyword matching):**
```
"leave" / "balance"   → leave balance summary from mockLeaveBalance
"payslip" / "salary"  → latest payslip from mockPayslipHistory
"attendance"          → current month summary from mockAttendanceLog
"ticket" / "helpdesk" → redirect to /helpdesk
"performance"         → Q2 review summary from mockReviews
default               → "I'll connect to the HR system to fetch that for you once the backend is live."
```

---

## File Summary

| Day | New Files | Modified Files | Total |
|-----|-----------|----------------|-------|
| Day 5 | ~16 files | 4 (mockData, constants, formatters, App.jsx) | ~20 |
| Day 6 | ~15 files | 3 (mockData, constants, App.jsx) | ~18 |
| **Total** | **~31** | **4 unique files** | **~35** |

### New Directory Structure (Day 5–6 additions)
```
frontend/src/
├── api/
│   ├── projectApi.js          [NEW - Day 5]
│   ├── helpdeskApi.js         [NEW - Day 5]
│   ├── notificationApi.js     [NEW - Day 5]
│   ├── analyticsApi.js        [NEW - Day 6]
│   ├── documentApi.js         [NEW - Day 6]
│   └── aiApi.js               [NEW - Day 6]
├── components/
│   ├── notifications/
│   │   ├── NotificationPanel.jsx  [NEW - Day 5]
│   │   ├── NotificationItem.jsx   [NEW - Day 5]
│   │   └── Notifications.css      [NEW - Day 5]
│   ├── projects/
│   │   ├── ProjectCard.jsx    [NEW - Day 5]
│   │   ├── TaskItem.jsx       [NEW - Day 5]
│   │   └── Projects.css       [NEW - Day 5]
│   ├── helpdesk/
│   │   ├── TicketCard.jsx     [NEW - Day 5]
│   │   ├── CreateTicketModal.jsx  [NEW - Day 5]
│   │   └── Helpdesk.css       [NEW - Day 5]
│   ├── documents/
│   │   ├── DocumentRow.jsx    [NEW - Day 6]
│   │   └── Documents.css      [NEW - Day 6]
│   ├── ai/
│   │   ├── ChatBubble.jsx     [NEW - Day 6]
│   │   ├── ChatInput.jsx      [NEW - Day 6]
│   │   └── AI.css             [NEW - Day 6]
│   └── ui/
│       ├── LineChart.jsx      [NEW - Day 6]
│       ├── BarChart.jsx       [NEW - Day 6]
│       ├── DonutChart.jsx     [NEW - Day 6]
│       └── Charts.css         [NEW - Day 6]
├── context/
│   └── NotificationContext.jsx  [NEW - Day 5]
└── pages/
    ├── projects/
    │   ├── ProjectsPage.jsx   [NEW - Day 5]
    │   └── ProjectsPage.css   [NEW - Day 5]
    ├── helpdesk/
    │   ├── HelpdeskPage.jsx   [NEW - Day 5]
    │   └── HelpdeskPage.css   [NEW - Day 5]
    ├── analytics/
    │   ├── AnalyticsPage.jsx  [NEW - Day 6]
    │   └── AnalyticsPage.css  [NEW - Day 6]
    ├── documents/
    │   ├── DocumentsPage.jsx  [NEW - Day 6]
    │   └── DocumentsPage.css  [NEW - Day 6]
    └── ai-assistant/
        ├── AIAssistantPage.jsx    [NEW - Day 6]
        └── AIAssistantPage.css    [NEW - Day 6]
```

---

## Design Patterns to Follow (Consistency Rules)

| Pattern | Rule |
|---|---|
| Page wrapper | `<div className="[module]-page">` with `padding: 24px; max-width: 1200px` |
| Page header | flex row: title left, action button right |
| Card containers | `background: var(--color-bg-primary)`, `border: 1px solid var(--color-border)`, `border-radius: var(--radius-lg)` |
| Status badges | Always use `<Badge>` component with correct color variant |
| Tab navigation | Always use `<TabNav>` component |
| Modals | Always use `<Modal>` component |
| Toast feedback | Always use `useToast()` hook |
| Empty states | Centered text with `var(--color-text-secondary)` color |
| Dark mode | Use only CSS variables — never hardcode colors |
| Responsive | `@media (max-width: 768px)` breakpoint, collapse grids to single column |

---

## Verification Plan

```bash
npm run build    # zero errors
npm run lint     # zero errors

# Manual browser checks:
# /projects     — tab between My Projects & My Tasks, checkbox toggles
# /helpdesk     — create ticket modal, filter by status, My/All tabs
# Topbar bell   — panel opens, badge updates, mark all read
# /analytics    — all charts render, year nav works
# /documents    — search, category filter, download/delete toasts
# /ai-assistant — suggested prompts, mock AI replies, typing indicator
# Dark mode on all 6 new pages
# Mobile responsive on all 6 new pages
```
