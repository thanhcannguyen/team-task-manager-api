
import express from "express"
import {
    createTeam,
    getMyTeams,
    addMemberToTeam
} from "../controllers/team.controller.js";
import { protect } from "../middlewares/auth.middleware.js";



const router = express.Router()

// POST /team -> tạo team
router.post("/", protect, createTeam);

// GET /my-teams -> xem danh sách team
router.get("/my-teams", protect, getMyTeams)

// Thêm thành viên vào team
router.post("/:teamId/members", protect, addMemberToTeam);

export default router