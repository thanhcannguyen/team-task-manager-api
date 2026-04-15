

import express from "express"
import { createTask, getTaskByProject } from "../controllers/task.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

// POST /project -> tạo task
router.post("/", protect, createTask);

// GET /project/:projectId -> xem danh sách task của project
router.get("/project/:projectId", protect, getTaskByProject);

export default router