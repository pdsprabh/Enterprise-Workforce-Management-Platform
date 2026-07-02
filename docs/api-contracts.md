# API Contracts Tracker

This document tracks the actual route, method, request body, and response shape for APIs in the Enterprise Workforce Management Platform. 
**Note (Day 2 Status):** The `backend/src/routes` and `backend/src/controllers` directories are currently empty. No active endpoints have been implemented by the feature engineers yet. The below contracts act as clear placeholders for when those modules land.

---

## 1. Authentication & Users (Rohan - In Progress)
*No implementation found in `controllers/` or `routes/` yet.*

### `POST /api/auth/register` (Placeholder)
- **Method:** POST
- **Request Body:** `{ "email": "", "password": "", "firstName": "", "lastName": "" }`
- **Response Shape:** `{ "success": true, "data": { "token": "", "user": { ... } } }`

### `POST /api/auth/login` (Placeholder)
- **Method:** POST
- **Request Body:** `{ "email": "", "password": "" }`
- **Response Shape:** `{ "success": true, "data": { "token": "", "refreshToken": "", "user": { ... } } }`

### `GET /api/users/me` (Placeholder)
- **Method:** GET
- **Request Headers:** `Authorization: Bearer <token>`
- **Response Shape:** `{ "success": true, "data": { "user": { ... } } }`

---

## 2. Organization & Employees (Rohan - In Progress)
*No implementation found in `controllers/` or `routes/` yet.*

### `POST /api/employees` (Placeholder)
- **Method:** POST
- **Request Body:** `{ "userId": "", "department": "", "designation": "", "salary": 0 }`
- **Response Shape:** `{ "success": true, "data": { "employee": { ... } } }`

### `GET /api/employees` (Placeholder)
- **Method:** GET
- **Response Shape:** `{ "success": true, "data": { "employees": [...] } }`

---

## 3. Attendance & Leave (Nimar - In Progress)
*Models exist (`Attendance.js`, `Leave.js`), but no routes/controllers yet.*

### `POST /api/attendance/clock-in` (Placeholder)
- **Method:** POST
- **Request Body:** `{ "notes": "Optional location/status" }`
- **Response Shape:** `{ "success": true, "data": { "attendance": { ... } } }`

### `POST /api/attendance/clock-out` (Placeholder)
- **Method:** POST
- **Request Body:** `{ "notes": "End of day notes" }`
- **Response Shape:** `{ "success": true, "data": { "attendance": { ... } } }`

### `POST /api/leave/request` (Placeholder)
- **Method:** POST
- **Request Body:** `{ "type": "sick", "startDate": "", "endDate": "", "reason": "" }`
- **Response Shape:** `{ "success": true, "data": { "leaveRequest": { ... } } }`

---

## 4. Projects & Tasks (Nimar - In Progress)
*Model exists (`Project.js`), but no routes/controllers yet.*

### `POST /api/projects` (Placeholder)
- **Method:** POST
- **Request Body:** `{ "name": "", "description": "", "status": "planning", "manager": "" }`
- **Response Shape:** `{ "success": true, "data": { "project": { ... } } }`

### `GET /api/projects` (Placeholder)
- **Method:** GET
- **Response Shape:** `{ "success": true, "data": { "projects": [...] } }`

---

## 5. Additional Modules
*To be filled in as they land.*

### AI Assistant (Nimar)
- `POST /api/ai/chat` (Placeholder)

### Payroll (Rohan)
- `GET /api/payroll/summary` (Placeholder)

### Asset / Helpdesk (Rohan)
- `POST /api/helpdesk/ticket` (Placeholder)
- `GET /api/assets` (Placeholder)
