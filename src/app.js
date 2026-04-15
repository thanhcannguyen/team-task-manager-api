
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js"
import teamRoutes from "./routes/team.routes.js"
import projectRoutes from "./routes/project.routes.js"

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes xử lý đăng ký, đăng nhập
app.use("/api/auth", authRoutes)

// Route xử lý team
app.use("/api/teams", teamRoutes)

// Route xử lý Project
app.use("/api/projects", projectRoutes)

export default app;