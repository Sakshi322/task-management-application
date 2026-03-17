# TaskFlow — Task Management Application

A full-stack task management application built as a technical assessment.
Live demo, secure authentication, AES encryption, and full CRUD task management.

**Live URLs**
- Frontend: `https://your-app.vercel.app` ← replace after deployment
- Backend API: `https://your-api.up.railway.app` ← replace after deployment
- GitHub: `https://github.com/yourusername/task-manager` ← replace

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT stored in HTTP-only cookies |
| Encryption | AES-256-CBC (Node.js crypto) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Architecture

```
Browser (Vercel)
      ↓ HTTPS + HTTP-only cookie
Express API (Railway)
      ↓ Mongoose ODM
MongoDB Atlas
```

### Folder Structure

```
task-management-assignment/
├── backend/
│   ├── src/
│   │   ├── config/db.js           ← MongoDB connection
│   │   ├── middleware/
│   │   │   ├── auth.js            ← JWT verification
│   │   │   └── validate.js        ← Joi input validation
│   │   ├── models/
│   │   │   ├── User.js            ← bcrypt password hashing
│   │   │   └── Task.js            ← AES encrypted description
│   │   ├── controllers/
│   │   │   ├── authController.js  ← register, login, logout
│   │   │   └── taskController.js  ← CRUD + pagination + search
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── tasks.js
│   │   ├── utils/
│   │   │   ├── encryption.js      ← AES-256-CBC helpers
│   │   │   └── response.js        ← structured response helpers
│   │   └── app.js                 ← Express entry point
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
    │   ├── context/AuthContext.jsx ← global auth state
    │   ├── lib/api.js              ← Axios instance
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

### 2. Backend setup
```bash
cd backend
npm install
copy .env.example .env
```

Fill in your `.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskmanager
JWT_SECRET=your_random_32_char_secret
JWT_EXPIRES_IN=7d
AES_SECRET_KEY=your_exactly_32_char_aes_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# App running on http://localhost:5173
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

#### POST /auth/register
```json
// Request
{
  "name": "Sakshi",
  "email": "sakshi@example.com",
  "password": "sakshi1234"
}

// Response 201
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id": "64f...", "name": "Sakshi", "email": "sakshi@example.com" }
  }
}
```

#### POST /auth/login
```json
// Request
{
  "email": "sakshi@example.com",
  "password": "sakshi1234"
}

// Response 200 — sets HttpOnly cookie
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "64f...", "name": "Sakshi", "email": "sakshi@example.com" }
  }
}
```

#### POST /auth/logout
```json
// Response 200 — clears cookie
{
  "success": true,
  "message": "Logged out successfully",
  "data": {}
}
```

#### GET /auth/me 🔒
```json
// Response 200
{
  "success": true,
  "data": {
    "user": { "id": "64f...", "name": "Sakshi", "email": "sakshi@example.com" }
  }
}
```

---

### Task Endpoints (all require auth cookie 🔒)

#### GET /tasks
Query params: `page`, `limit`, `status`, `search`

```
GET /tasks?page=1&limit=9&status=pending&search=deploy
```

```json
// Response 200
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "64f...",
        "title": "Deploy backend to Railway",
        "description": "Push code and set env variables",
        "status": "pending",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
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
```

#### POST /tasks
```json
// Request
{
  "title": "Deploy backend",
  "description": "Push to Railway and verify health check",
  "status": "pending"
}

// Response 201
{
  "success": true,
  "message": "Task created",
  "data": { "task": { "id": "64f...", ... } }
}
```

#### PUT /tasks/:id
```json
// Request (any subset of fields)
{ "status": "completed" }

// Response 200
{
  "success": true,
  "message": "Task updated",
  "data": { "task": { ... } }
}
```

#### DELETE /tasks/:id
```json
// Response 200
{
  "success": true,
  "message": "Task deleted",
  "data": {}
}
```

---

### Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["title is required", "status must be pending, in-progress or completed"]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 401 | Unauthorized |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 422 | Validation error |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

## Security Implementation

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcryptjs with 12 salt rounds |
| JWT storage | HTTP-only cookie (not localStorage) |
| Payload encryption | AES-256-CBC on task description field |
| Input validation | Joi schemas on all routes |
| HTTP security headers | Helmet.js |
| Rate limiting | 100 req/15min global, 10 req/15min on auth |
| CORS | Whitelist only frontend URL |
| NoSQL injection | Mongoose ODM, no raw queries |
| Env variables | dotenv, never hardcoded |

---

## Deployment

### Backend → Render
1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo
3. Set root directory to `backend`
4. Set the following:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   AES_SECRET_KEY=your_32_char_aes_key
   CLIENT_URL=https://your-app.onrender.com
   ```
6. Click **Create Web Service**
7. Render gives you a URL like `https://task-manager-api.onrender.com`
8. Test: `https://task-manager-api.onrender.com/health`

### Frontend → Render
1. Go to Render → New → **Static Site**
2. Connect your GitHub repo
3. Set root directory to `frontend`
4. Set the following:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Click **Create Static Site**
7. Render gives you a URL like `https://task-manager.onrender.com`

### After both are deployed
Go back to your backend service on Render → Environment → update `CLIENT_URL` to your frontend Render URL → click **Save Changes** (auto redeploys)
