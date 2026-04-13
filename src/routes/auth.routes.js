
import express from "express"
import { register, login, getMe } from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

// POST /register -> đăng ký user
router.post("/register", register)

// POST /login -> đăng nhập user
router.post("/login", login)

// GET /me -> lấy thông tin user
router.get("/me", protect, getMe);

export default router