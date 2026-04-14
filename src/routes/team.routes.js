
import express from "express"
import { createTeam, getMyTeams } from "../controllers/team.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";


const router = express.Router()

// POST /team -> tạo team
router.post("/", protect, createTeam);

// GET /my-teams -> xem danh sách team
router.get("/my-teams", protect, getMyTeams)

export default router