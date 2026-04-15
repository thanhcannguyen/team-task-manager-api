

import express from "express"
import { createProject } from "../controllers/project.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

// POST /project -> tạo project
router.post("/", protect, createProject);



export default router