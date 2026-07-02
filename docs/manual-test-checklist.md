# Manual Test Checklist (Smoke Tests)

Since a test framework (e.g., Jest/Supertest) is not yet configured, and the core authentication routes have not yet been merged into `dev`, use this checklist to manually smoke test the features via Postman/cURL once they land.

## 1. Authentication Flow
- [ ] **Registration:** `POST /api/auth/register` creates a user and returns a 201 status.
- [ ] **Duplicate User:** `POST /api/auth/register` with an existing email returns a 400 or 409 status with a clear error message.
- [ ] **Login:** `POST /api/auth/login` returns a 200 status with a valid JWT token and user payload.
- [ ] **Invalid Login:** `POST /api/auth/login` with incorrect password returns a 401 status.

## 2. JWT & Protected Routes
- [ ] **Access Protected Route:** `GET /api/users/me` with a valid JWT in the `Authorization: Bearer <token>` header returns a 200 status.
- [ ] **Missing Token:** Accessing `GET /api/users/me` without a token returns a 401 status.
- [ ] **Expired Token:** Accessing `GET /api/users/me` with an expired token returns a 401/403 status.

## 3. Role-Based Access Control (RBAC)
- [ ] **Admin Access:** An Admin user can successfully access an admin-only route (e.g., `GET /api/employees`).
- [ ] **Forbidden Access:** A standard Employee attempting to access an admin-only route receives a 403 Forbidden status.
