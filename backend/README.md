# Task Manager — Backend API

Express.js REST API with MongoDB, JWT authentication, and AES-256 payload encryption.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT stored in HTTP-only cookies
- **Security:** bcryptjs, Helmet, CORS, rate limiting, AES-256 encryption

---

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs (min 32 chars) |
| `JWT_EXPIRES_IN` | Token expiry e.g. `7d` |
| `AES_SECRET_KEY` | Exactly 32 characters for AES-256 |
| `CLIENT_URL` | Frontend URL for CORS (e.g. http://localhost:5173) |
| `NODE_ENV` | `development` or `production` |

---

## API Reference

### Auth

#### POST /api/auth/register
```json
// Request
{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }

// Response 201
{
  "success": true,
  "message": "Registration successful",
  "data": { "user": { "id": "...", "name": "Alice", "email": "alice@example.com" } }
}
```

#### POST /api/auth/login
```json
// Request
{ "email": "alice@example.com", "password": "secret123" }

// Response 200 — sets HttpOnly cookie "token"
{
  "success": true,
  "message": "Login successful",
  "data": { "user": { "id": "...", "name": "Alice", "email": "alice@example.com" } }
}
```

#### POST /api/auth/logout
```json
// Response 200 — clears cookie
{ "success": true, "message": "Logged out successfully", "data": {} }
```

#### GET /api/auth/me  🔒
```json
// Response 200
{ "success": true, "data": { "user": { "id": "...", "name": "Alice", "email": "..." } } }
```

---

### Tasks  🔒 (all require auth cookie)

#### GET /api/tasks
Query params: `page`, `limit`, `status` (pending|in-progress|completed), `search`

```json
// GET /api/tasks?page=1&limit=10&status=pending&search=deploy

// Response 200
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "64f...",
        "title": "Deploy backend",
        "description": "Push to Railway and verify health check",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### POST /api/tasks
```json
// Request
{ "title": "Deploy backend", "description": "Push to Railway", "status": "pending" }

// Response 201
{ "success": true, "message": "Task created", "data": { "task": { ... } } }
```

#### PUT /api/tasks/:id
```json
// Request (any subset of fields)
{ "status": "completed" }

// Response 200
{ "success": true, "message": "Task updated", "data": { "task": { ... } } }
```

#### DELETE /api/tasks/:id
```json
// Response 200
{ "success": true, "message": "Task deleted", "data": {} }
```

---

## Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["title is required", "status must be one of pending, in-progress, completed"]
}
```

## HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 422 | Validation error |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

## Architecture

```
src/
├── config/db.js          Mongoose connection
├── middleware/
│   ├── auth.js           JWT verification, attaches req.user
│   └── validate.js       Joi schema validation
├── models/
│   ├── User.js           bcrypt pre-save hook, comparePassword method
│   └── Task.js           AES encrypt/decrypt on description field
├── controllers/
│   ├── authController.js register, login, logout, getMe
│   └── taskController.js CRUD + pagination + filter + search
├── routes/
│   ├── auth.js
│   └── tasks.js
├── utils/
│   ├── encryption.js     AES-256-CBC encrypt/decrypt
│   └── response.js       Structured success/error helpers
└── app.js                Express setup, middleware chain, server start
```

## Deployment (Railway)

1. Push repo to GitHub
2. Create new Railway project → Deploy from GitHub repo
3. Add environment variables in Railway dashboard
4. Railway auto-detects Node.js and runs `npm start`
5. Set custom domain or use Railway's generated URL