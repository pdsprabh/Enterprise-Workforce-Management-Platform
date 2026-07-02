# Known Issues

This document tracks bugs and architectural issues found during the integration phase (`prabh-debug` branch).

## Day 2 Smoke Test Findings
- **BUG-001 (Missing Endpoints):** The `routes/` and `controllers/` directories are currently empty in the `dev` branch. The expected Day 1-2 features (register, login, JWT issuance, RBAC middleware) are not yet implemented or merged. Automated smoke testing is blocked until Rohan's code lands.
- **ISSUE-002 (Missing Test Framework):** The backend lacks a configured testing framework (e.g., Jest, Supertest) in `package.json`, necessitating manual API testing for now.
