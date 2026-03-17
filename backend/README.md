Task Manager — Backend API

Express.js REST API with MongoDB, JWT authentication, and AES-256 payload encryption.

Tech Stack

Runtime: Node.js 18+

Framework: Express.js

Database: MongoDB (Mongoose ODM)

Auth: JWT stored in HTTP-only cookies

Security: bcryptjs, Helmet, CORS, rate limiting, AES-256 encryption

Setup
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
Environment variables
Variable	Description
PORT	Server port (default 5000)
MONGO_URI	MongoDB connection string
JWT_SECRET	Secret for signing JWTs (min 32 chars)
JWT_EXPIRES_IN	Token expiry e.g. 7d
AES_SECRET_KEY	Exactly 32 characters for AES-256
CLIENT_URL	Frontend URL for CORS (e.g. http://localhost:5173
)
NODE_ENV	development or production
API Reference
Auth
POST /api/auth/register
{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }

Response (201):

{
  "success": true,
  "message": "Registration successful",
  "data": { "user": { "id": "...", "name": "Alice", "email": "alice@example.com" } }
}
POST /api/auth/login
{ "email": "alice@example.com", "password": "secret123" }

Response (200 — sets HttpOnly cookie "token"):

{
  "success": true,
  "message": "Login successful",
  "data": { "user": { "id": "...", "name": "Alice", "email": "alice@example.com" } }
}
POST /api/auth/logout

Response (200):

{ "success": true, "message": "Logged out successfully", "data": {} }
GET /api/auth/me 🔒

Response (200):

{ "success": true, "data": { "user": { "id": "...", "name": "Alice", "email": "..." } } }
Tasks 🔒 (all require auth cookie)
GET /api/tasks

Query params: page, limit, status, search

{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "64f...",
        "title": "Deploy backend",
        "description": "Deploy and verify API health",
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
POST /api/tasks
{ "title": "Deploy backend", "description": "Deploy API", "status": "pending" }
PUT /api/tasks/:id
{ "status": "completed" }
DELETE /api/tasks/:id
Error Response Format
{
  "success": false,
  "message": "Validation failed",
  "errors": ["title is required"]
}
HTTP Status Codes Used
Code	Meaning
200	OK
201	Created
401	Unauthorized
403	Forbidden
404	Not found
409	Conflict
422	Validation error
429	Rate limit exceeded
500	Server error
Architecture
src/
├── config/db.js
├── middleware/
│   ├── auth.js
│   └── validate.js
├── models/
│   ├── User.js
│   └── Task.js
├── controllers/
│   ├── authController.js
│   └── taskController.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── utils/
│   ├── encryption.js
│   └── response.js
└── app.js
Deployment (Render)

Push your project to GitHub

Go to Render dashboard

Click New → Web Service

Connect your GitHub repository

Configure:

Build Command: npm install

Start Command: npm start

Add all environment variables in Render dashboard

Deploy the service

Use the generated Render URL to access your API