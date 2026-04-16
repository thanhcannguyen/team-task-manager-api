# Team Task Manager API

A RESTful API for managing teams, projects, and tasks — built to support collaborative workflows where multiple users share a workspace, organize work into projects, and track progress through tasks.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Token) |
| Password Security | bcryptjs |
| Dev Tooling | Nodemon, Morgan |

---

## Features

- **Authentication** — Register, login, and retrieve authenticated user profile via JWT Bearer token
- **Team Management** — Create teams, view your teams, and add members
- **Project Management** — Full CRUD for projects scoped to a team, with status tracking (`planning` → `in-progress` → `completed`)
- **Task Management** — Create tasks under a project, view task lists, inspect task detail, and assign tasks to team members
- **Authorization Middleware** — Every protected route validates the Bearer token and attaches the authenticated user to the request context

---

## Project Structure

```
src/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── auth.controller.js     # Register, login, get profile
│   ├── team.controller.js     # Team CRUD + member management
│   ├── project.controller.js  # Project CRUD
│   └── task.controller.js     # Task CRUD + assignment
├── middlewares/
│   └── auth.middleware.js     # JWT verification guard
├── models/
│   ├── user.model.js
│   ├── team.model.js
│   ├── project.model.js
│   └── task.model.js
├── routes/
│   ├── auth.routes.js
│   ├── team.routes.js
│   ├── project.routes.js
│   └── task.routes.js
├── app.js                     # Express app setup
└── server.js                  # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/thanhcannguyen/team-task-manager-api.git
cd team-task-manager-api

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_jwt_secret_key
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create a new user account |
| POST | `/login` | No | Login and receive a JWT token |
| GET | `/me` | ✅ | Get authenticated user's profile |

### Teams — `/api/teams`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create a new team |
| GET | `/my-teams` | ✅ | Get all teams the user belongs to |
| POST | `/:teamId/members` | ✅ | Add a member to a team |

### Projects — `/api/projects`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create a new project under a team |
| GET | `/team/:teamId` | ✅ | Get all projects of a team |
| GET | `/:id` | ✅ | Get project detail |
| PATCH | `/:id` | ✅ | Update project info or status |
| DELETE | `/:id` | ✅ | Delete a project |

### Tasks — `/api/tasks`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create a task under a project |
| GET | `/project/:projectId` | ✅ | Get all tasks of a project |
| GET | `/:id` | ✅ | Get task detail |
| PATCH | `/:id/assign` | ✅ | Assign a task to a team member |

> All protected routes require the `Authorization: Bearer <token>` header.

---

## Data Models

### User
```
name, email (unique), password (hashed), timestamps
```

### Team
```
name, description, owner (ref: User), members ([ref: User]), timestamps
```

### Project
```
name, description, team (ref: Team), createdBy (ref: User),
status (planning | in-progress | completed), startDate, endDate, timestamps
```

### Task
```
title, description, team (ref: Team), project (ref: Project),
assignee (ref: User), createdBy (ref: User),
status (todo | in-progress | done), dueDate, timestamps
```

---

## Authentication Flow

1. Register or login to receive a JWT token (valid for **7 days**)
2. Include the token in subsequent requests:
   ```
   Authorization: Bearer <your_token>
   ```
3. The `protect` middleware validates the token and injects the user object into `req.user` for controller use

---

## License

ISC
