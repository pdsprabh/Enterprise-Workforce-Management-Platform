# Implementation Results

## Features Added
1. **Google Auth**: Integrated `@react-oauth/google` on the frontend and `google-auth-library` on the backend.
2. **Microsoft Auth**: Integrated `@azure/msal-react` on the frontend and Microsoft Graph API validation on the backend.
3. **reCAPTCHA**: Added Google reCAPTCHA v2 to the standard login flow to prevent bot abuse.

## Changes Made
- Updated `backend/src/models/User.js` to include schema fields and password hashing logic.
- Restored `authMiddleware.js` and `validate.js` which were missing from the `dev` branch.
- Removed deprecated `departmentRoutes` and `designationRoutes` from `app.js` to fix routing errors.
- Added `/api/auth/google` and `/api/auth/microsoft` endpoints.
- Updated the frontend `AuthContext.jsx`, `authApi.js`, and `LoginPage.jsx` to support the new providers.
- Wrapped the React app in `GoogleOAuthProvider` and `MsalProvider` in `main.jsx`.

## Test Results
- Backend tests encountered timeouts in Jest hooks due to `mongodb-memory-server` and `bcrypt` taking longer than the default 5000ms.
- Code successfully builds and all module resolution issues were resolved.
