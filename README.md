# Team Task Manager API

API RESTful phục vụ quản lý nhóm, dự án và công việc — cho phép nhiều người dùng cùng làm việc trong một không gian chung, tổ chức công việc theo dự án và theo dõi tiến độ qua từng task.

---

## Công nghệ sử dụng

| Tầng | Công nghệ |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| Cơ sở dữ liệu | MongoDB + Mongoose |
| Xác thực | JWT (JSON Web Token) |
| Bảo mật mật khẩu | bcryptjs |
| Công cụ dev | Nodemon, Morgan |

---

## Tính năng

- **Xác thực người dùng** — Đăng ký, đăng nhập và lấy thông tin cá nhân thông qua JWT Bearer token
- **Quản lý nhóm** — Tạo nhóm, xem danh sách nhóm của bản thân, thêm thành viên vào nhóm
- **Quản lý dự án** — CRUD đầy đủ cho dự án theo nhóm, theo dõi trạng thái (`planning` → `in-progress` → `completed`)
- **Quản lý task** — Tạo task thuộc dự án, xem danh sách và chi tiết task, giao task cho thành viên trong nhóm
- **Middleware bảo vệ route** — Mọi route cần xác thực đều kiểm tra Bearer token và gắn thông tin user vào request

---

## Cấu trúc thư mục

```
src/
├── config/
│   └── db.js                  # Kết nối MongoDB
├── controllers/
│   ├── auth.controller.js     # Đăng ký, đăng nhập, lấy profile
│   ├── team.controller.js     # Quản lý nhóm và thành viên
│   ├── project.controller.js  # Quản lý dự án
│   └── task.controller.js     # Quản lý task và phân công
├── middlewares/
│   └── auth.middleware.js     # Middleware xác thực JWT
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
├── app.js                     # Khởi tạo Express app
└── server.js                  # Điểm khởi động server
```

---

## Hướng dẫn cài đặt

### Yêu cầu

- Node.js ≥ 18
- MongoDB (local hoặc Atlas)

### Các bước cài đặt

```bash
# 1. Clone repository
git clone https://github.com/thanhcannguyen/team-task-manager-api.git
cd team-task-manager-api

# 2. Cài đặt dependencies
npm install

# 3. Cấu hình biến môi trường
cp .env.example .env
```

### Biến môi trường

Tạo file `.env` ở thư mục gốc:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/team-task-manager
JWT_SECRET=your_jwt_secret_key
```

### Khởi chạy

```bash
# Môi trường development (tự reload khi code thay đổi)
npm run dev

# Môi trường production
npm start
```

Server chạy tại `http://localhost:5000`

---

## Danh sách API

### Xác thực — `/api/auth`

| Method | Endpoint | Yêu cầu Auth | Mô tả |
|--------|----------|------|-------------|
| POST | `/register` | Không | Đăng ký tài khoản mới |
| POST | `/login` | Không | Đăng nhập, nhận JWT token |
| GET | `/me` | ✅ | Lấy thông tin người dùng hiện tại |

### Nhóm — `/api/teams`

| Method | Endpoint | Yêu cầu Auth | Mô tả |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Tạo nhóm mới |
| GET | `/my-teams` | ✅ | Lấy danh sách nhóm của bản thân |
| POST | `/:teamId/members` | ✅ | Thêm thành viên vào nhóm |

### Dự án — `/api/projects`

| Method | Endpoint | Yêu cầu Auth | Mô tả |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Tạo dự án mới thuộc một nhóm |
| GET | `/team/:teamId` | ✅ | Lấy danh sách dự án của nhóm |
| GET | `/:id` | ✅ | Xem chi tiết dự án |
| PATCH | `/:id` | ✅ | Cập nhật thông tin hoặc trạng thái dự án |
| DELETE | `/:id` | ✅ | Xóa dự án |

### Task — `/api/tasks`

| Method | Endpoint | Yêu cầu Auth | Mô tả |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Tạo task thuộc dự án |
| GET | `/project/:projectId` | ✅ | Lấy danh sách task của dự án |
| GET | `/:id` | ✅ | Xem chi tiết task |
| PATCH | `/:id/assign` | ✅ | Giao task cho thành viên trong nhóm |

> Tất cả route có bảo vệ đều yêu cầu header: `Authorization: Bearer <token>`

---

## Mô hình dữ liệu

### User
```
name, email (duy nhất), password (đã mã hóa), timestamps
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

## Luồng xác thực

1. Đăng ký hoặc đăng nhập để nhận JWT token (có hiệu lực **7 ngày**)
2. Đính kèm token vào mọi request cần xác thực:
   ```
   Authorization: Bearer <your_token>
   ```
3. Middleware `protect` tự động xác thực token và gắn thông tin user vào `req.user` để controller xử lý tiếp

---

## Giấy phép

ISC
