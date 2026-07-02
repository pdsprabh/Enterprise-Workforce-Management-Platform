# Proposed Shared Standards (DRAFT)

> [!IMPORTANT]
> **TEAM AGREEMENT REQUIRED:** The standards proposed in this document touch shared code (API responses, error handling, linting). Do **NOT** adopt these into `main` or `dev` until the entire team (Prabh Deep, Rohan, Nimar, Ayush) has reviewed and agreed upon them.

## 1. Standard API Response Format
To ensure consistency across all backend endpoints and simplify frontend parsing, it is proposed that *every* API response adheres to the following structure:

**Success Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "123", "name": "John Doe" }
  },
  "message": "User fetched successfully" // Optional
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR", // Or "UNAUTHORIZED", "NOT_FOUND", etc.
    "details": "Email is required" // Human-readable error message
  }
}
```

## 2. Central Error-Handling Middleware Pattern
To prevent repetitive `try/catch` blocks and inconsistent error reporting in controllers, we propose using a central error handler in `backend/src/middlewares/errorHandler.js` combined with a custom `AppError` class.

**Custom AppError Class:**
```javascript
class AppError extends Error {
  constructor(message, statusCode, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Identifies known errors vs bugs
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
```

**Middleware Pattern:**
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      details: err.message || 'An unexpected error occurred'
    },
    // Optional: Include stack trace only in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
module.exports = errorHandler;
```

## 3. ESLint & Prettier Configuration
To maintain a unified code style across the MERN monorepo, we propose adding shared ESLint and Prettier configs.

**Proposed `.prettierrc`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

**Proposed `.eslintrc.json` (Base Backend):**
```json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "eqeqeq": "error"
  }
}
```
*(Frontend to extend standard React/Vite plugins similarly).*
