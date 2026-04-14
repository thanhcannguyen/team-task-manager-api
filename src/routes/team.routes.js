
import express from "express"
import { createTeam } from "../controllers/team.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router()

// POST /team -> tạo team
router.post("/", protect, createTeam);

export default router