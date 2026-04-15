

import express from "express"
import {
    createProject,
    getProjectsByTeam,
    getProjectDetail,
    updateProject,
    deleteProject
} from "../controllers/project.controller.js"
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

// POST /project -> tạo project
router.post("/", protect, createProject);

// GET /team/:teamId -> xem danh sách project thuộc team
router.get("/team/:teamId", protect, getProjectsByTeam)

// GET /:id -> xem chi tiết project thuộc team
router.get("/:id", protect, getProjectDetail)

// PATCH /:id -> cập nhật project
router.patch("/:id", protect, updateProject)

// DELETE /:id -> xóa project
router.delete("/:id", protect, deleteProject)


export default router