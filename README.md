TaskFlow — Task Management Application

A full-stack task management application built as a 24-hour technical assessment. Live demo, secure authentication, AES encryption, and full CRUD task management.

Live URLs

Frontend: https://task-management-application-12.onrender.com
 
Backend API: https://task-management-application-la8l.onrender.com
 
GitHub: https://github.com/Sakshi322/task-management-application.git
 

Tech Stack
Layer	Technology
Frontend	React 18, Vite, Tailwind CSS, React Router v6
Backend	Node.js, Express.js
Database	MongoDB (Mongoose ODM)
Auth	JWT stored in HTTP-only cookies
Encryption	AES-256-CBC (Node.js crypto)
Deployment	Render
Architecture
Browser (Render Frontend)
      ↓ HTTPS + HTTP-only cookie
Express API (Render Backend)
      ↓ Mongoose ODM
MongoDB Atlas
Folder Structure
task-management-assignment/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validate.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── tasks.js
│   │   ├── utils/
│   │   │   ├── encryption.js
│   │   │   └── response.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/ProtectedRoute.jsx
    │   │   ├── layout/Navbar.jsx
    │   │   ├── tasks/TaskCard.jsx
    │   │   ├── tasks/TaskForm.jsx
    │   │   └── ui/StatusBadge.jsx
    │   ├── context/AuthContext.jsx
    │   ├── lib/api.js
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
Local Setup
Prerequisites

Node.js 18+

MongoDB Atlas account (free tier)

1. Clone the repo
git clone https://github.com/yourusername/task-manager.git
cd task-manager
2. Backend setup
cd backend
npm install
copy .env.example .env

Fill in your .env:

PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskmanager
JWT_SECRET=your_random_32_char_secret
JWT_EXPIRES_IN=7d
AES_SECRET_KEY=your_exactly_32_char_aes_key
CLIENT_URL=http://localhost:5173
npm run dev
# Server running on http://localhost:5000
3. Frontend setup
cd ../frontend
npm install

Create .env file:

VITE_API_URL=http://localhost:5000/api
npm run dev
# App running on http://localhost:5173
API Documentation
Base URL
http://localhost:5000/api
Auth Endpoints
POST /auth/register
{
  "name": "Sakshi",
  "email": "sakshi@example.com",
  "password": "sakshi1234"
}
POST /auth/login
{
  "email": "sakshi@example.com",
  "password": "sakshi1234"
}
POST /auth/logout
GET /auth/me 🔒
Task Endpoints (all require auth cookie 🔒)
GET /tasks

Example:

GET /tasks?page=1&limit=9&status=pending&search=deploy
{
  "success": true,
  "data": {
    "tasks": [
      ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 9,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
POST /tasks
{
  "title": "Deploy backend",
  "description": "Deploy API and verify health check",
  "status": "pending"
}
PUT /tasks/:id
{ "status": "completed" }
DELETE /tasks/:id
Error Response Format
{
  "success": false,
  "message": "Validation failed",
  "errors": ["title is required", "status must be pending, in-progress or completed"]
}
HTTP Status Codes
Code	Meaning
200	OK
201	Created
401	Unauthorized
404	Not found
409	Conflict
422	Validation error
429	Rate limit exceeded
500	Server error
Security Implementation
Feature	Implementation
Password hashing	bcryptjs with 12 salt rounds
JWT storage	HTTP-only cookie (not localStorage)
Payload encryption	AES-256-CBC on task description field
Input validation	Joi schemas on all routes
HTTP security headers	Helmet.js
Rate limiting	100 req/15min global, 10 req/15min on auth
CORS	Whitelist only frontend URL
NoSQL injection	Mongoose ODM
Env variables	dotenv, never hardcoded
Deployment
Backend → Render

Push repo to GitHub

Create new Web Service on Render

Set root directory to backend

Add environment variables in Render dashboard

Build Command: npm install

Start Command: npm start

Deploy

Frontend → Render

Create new Static Site on Render

Set root directory to frontend

Build Command: npm run build

Publish directory: dist

Add environment variable:

VITE_API_URL=https://your-backend.onrender.com/api

Deploy
