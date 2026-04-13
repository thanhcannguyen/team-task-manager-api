
import express from "express"
import { register } from "../controllers/auth.controller.js"

const router = express.Router()

// POST /register -> đăng ký user
router.post("/register", register)

export default router