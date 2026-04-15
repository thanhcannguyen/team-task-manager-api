

import express from "express"
import { createProject, getProjectsByTeam } from "../controllers/project.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

// POST /project -> tạo project
router.post("/", protect, createProject);

// GET /my-projects -> xem danh sách project thuộc team
router.get("/team/:teamId", protect, getProjectsByTeam)


export default router