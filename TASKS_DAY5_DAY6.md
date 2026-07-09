# Day 5 & Day 6 — Task Checklist (Ayush — Frontend UI)

> **Branch:** `ayush-frontend`
> **Status:** Ready to implement (Days 1–4 complete)

---

## Day 5: Projects Module + Helpdesk UI + Notifications Panel

### Foundation (Utils & API)
- [ ] Update `constants.js` — add `PROJECT_STATUS`, `TICKET_STATUS`, `TICKET_PRIORITY`, `NOTIFICATION_TYPES`
- [ ] Update `mockData.js` — add `mockProjects`, `mockTasks`, `mockTickets`, `mockNotifications`
- [ ] Update `formatters.js` — add `formatNotificationTime()` (smart relative time for notifications)
- [ ] Create `src/api/projectApi.js` — getProjects, getProjectById, createProject, updateProject, getMyTasks, updateTaskStatus
- [ ] Create `src/api/helpdeskApi.js` — getTickets, getTicketById, createTicket, updateTicket, closeTicket
- [ ] Create `src/api/notificationApi.js` — getNotifications, markAsRead, markAllRead, deleteNotification

### Notifications Panel (Topbar)
- [ ] Create `src/components/notifications/NotificationPanel.jsx` — slide-out panel from topbar bell
- [ ] Create `src/components/notifications/NotificationItem.jsx` — single notification row with icon, text, time, read/unread state
- [ ] Create `src/components/notifications/Notifications.css` — panel slide animation + notification item styles
- [ ] Create `src/context/NotificationContext.jsx` — global state: notifications list, unread count, markRead, markAllRead
- [ ] Update `src/components/Topbar.jsx` — wire bell button to open/close NotificationPanel, show real unread count badge

### Projects Module
- [ ] Create `src/components/projects/ProjectCard.jsx` — project card with title, team members avatars, progress bar, deadline, status badge
- [ ] Create `src/components/projects/TaskItem.jsx` — single task row with checkbox toggle, assignee, due date, priority badge
- [ ] Create `src/components/projects/Projects.css` — shared project component styles
- [ ] Create `src/pages/projects/ProjectsPage.jsx` — tabbed: My Projects (card grid) + My Tasks (task list with status filter)
- [ ] Create `src/pages/projects/ProjectsPage.css` — scoped page styles

### Helpdesk Module
- [ ] Create `src/components/helpdesk/TicketCard.jsx` — ticket card with ID, title, priority badge, status badge, raised date, assignee
- [ ] Create `src/components/helpdesk/CreateTicketModal.jsx` — form modal: title, category, priority, description, attachment placeholder
- [ ] Create `src/components/helpdesk/Helpdesk.css` — shared helpdesk styles
- [ ] Create `src/pages/helpdesk/HelpdeskPage.jsx` — tabbed: My Tickets + All Tickets (admin), with Create Ticket button
- [ ] Create `src/pages/helpdesk/HelpdeskPage.css` — scoped page styles

### Integration
- [ ] Update `App.jsx` — replace `/projects` placeholder with ProjectsPage
- [ ] Update `App.jsx` — replace `/helpdesk` placeholder with HelpdeskPage
- [ ] **Verify:** `npm run build` — zero errors
- [ ] **Verify:** Notifications panel opens/closes, badge count updates, mark all read works

---

## Day 6: Analytics Dashboard + Documents Module + AI Assistant

### Foundation (Utils & API)
- [ ] Update `constants.js` — add `DOCUMENT_TYPES`, `DOCUMENT_STATUS`
- [ ] Update `mockData.js` — add `mockAnalyticsData`, `mockDocuments`, `mockAIMessages`
- [ ] Create `src/api/analyticsApi.js` — getHeadcountTrend, getAttritionRate, getDepartmentBreakdown, getLeaveStats, getPayrollTrend
- [ ] Create `src/api/documentApi.js` — getDocuments, uploadDocument, downloadDocument, deleteDocument
- [ ] Create `src/api/aiApi.js` — sendMessage, getConversationHistory

### Reusable Chart Components
- [ ] Create `src/components/ui/LineChart.jsx` — CSS/SVG-based line chart (headcount trend, payroll trend)
- [ ] Create `src/components/ui/BarChart.jsx` — CSS-based bar chart (reusable, replaces inline chart in Dashboard)
- [ ] Create `src/components/ui/DonutChart.jsx` — CSS conic-gradient donut chart (department split, leave breakdown)
- [ ] Create `src/components/ui/Charts.css` — shared chart styles

### Analytics Dashboard
- [ ] Create `src/pages/analytics/AnalyticsPage.jsx` — full analytics dashboard with 4 sections (see layout below)
- [ ] Create `src/pages/analytics/AnalyticsPage.css` — scoped page styles

### Documents Module
- [ ] Create `src/components/documents/DocumentRow.jsx` — table row: icon, filename, type badge, uploaded by, date, download/delete actions
- [ ] Create `src/components/documents/Documents.css` — shared document styles
- [ ] Create `src/pages/documents/DocumentsPage.jsx` — searchable document list with upload button and category filter tabs
- [ ] Create `src/pages/documents/DocumentsPage.css` — scoped page styles

### AI Assistant
- [ ] Create `src/components/ai/ChatBubble.jsx` — single message bubble (user vs assistant styling)
- [ ] Create `src/components/ai/ChatInput.jsx` — textarea with send button, Enter-to-send, loading state
- [ ] Create `src/components/ai/AI.css` — chat interface styles
- [ ] Create `src/pages/ai-assistant/AIAssistantPage.jsx` — full chat UI (message history, input, suggested prompts)
- [ ] Create `src/pages/ai-assistant/AIAssistantPage.css` — scoped page styles

### Integration
- [ ] Update `App.jsx` — replace `/analytics`, `/documents`, `/ai-assistant` placeholders with real pages
- [ ] **Verify:** `npm run build` — zero errors
- [ ] **Verify:** Dark mode on all Day 5–6 pages
- [ ] **Verify:** Responsive layouts on all Day 5–6 pages
- [ ] **Verify:** `npm run lint` — zero errors

---

## End of Day 6 Deliverables

### Pages Completed (Full Running Total)
| Day | Pages Added |
|-----|-------------|
| Day 1 | Login, Register, Forgot Password, Dashboard Shell |
| Day 2 | Dashboard, Employee List, Employee Detail, Add Employee |
| Day 3 | Attendance, Leave |
| Day 4 | Payroll, Performance, Recruitment |
| **Day 5** | **Projects, Helpdesk** |
| **Day 6** | **Analytics, Documents, AI Assistant** |
| **Total** | **17 pages + Notifications Panel** |

### Git Push
```bash
git add .
git commit -m "feat(frontend): add projects module with task list and kanban"
git commit -m "feat(frontend): add helpdesk module with ticket management"
git commit -m "feat(frontend): add notifications panel with real-time badge"
git commit -m "feat(frontend): add analytics dashboard with charts"
git commit -m "feat(frontend): add documents module with upload/download"
git commit -m "feat(frontend): add AI assistant chat interface"
git push origin ayush-frontend
git checkout dev
git merge ayush-frontend
git push origin dev
```
