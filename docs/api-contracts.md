# API Contracts

Define API request/response formats here.

## Authentication
`POST /api/auth/login`
- Body: `{ email, password }`
- Response: `{ token, user }`
