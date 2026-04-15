

import express from "express"
import { createTask } from "../controllers/task.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

// POST /project -> tạo task
router.post("/", protect, createTask);




export default router