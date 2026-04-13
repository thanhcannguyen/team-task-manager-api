
import express from "express"
import { register, login } from "../controllers/auth.controller.js"

const router = express.Router()

// POST /register -> đăng ký user
router.post("/register", register)

// POST /login -> đăng nhập user
router.post("/login", login)

export default router