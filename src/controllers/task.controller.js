


import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";

// Tạo task
export const createTask = async (req, res) => {
    try {
        // Bước 1: Lấy dữ liệu từ body
        const { title, description, projectId, assignee, dueDate } = req.body;

        // Bước 2: Validate dữ liệu
        if (!title || !projectId) {
            return res.status(400).json({
                message: "Thiếu title hoặc projectId",
            });
        }

        // Bước 3: Kiểm tra project tồn tại
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project không tồn tại",
            });
        }

        // Bước 4: Lấy team từ project
        const team = await Team.findById(project.team);

        if (!team) {
            return res.status(404).json({
                message: "Team không tồn tại",
            });
        }

        // Bước 5: Kiểm tra user hiện tại có thuộc team không
        const isMember = team.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Bạn không thuộc team nên không được tạo task",
            });
        }

        // Bước 6: Kiểm tra assignee (nếu có)
        let assignedUser = null;

        if (assignee) {
            const user = await User.findById(assignee);

            if (!user) {
                return res.status(404).json({
                    message: "User được giao task không tồn tại",
                });
            }

            const isMemberInTeam = team.members.some(
                (memberId) => memberId.toString() === assignee.toString()
            );

            if (!isMemberInTeam) {
                return res.status(400).json({
                    message: "User được giao task không thuộc team",
                });
            }

            assignedUser = assignee;
        }

        // Bước 7: Tạo task
        const newTask = await Task.create({
            title,
            description,
            project: projectId,
            team: project.team,
            assignee: assignedUser,
            createdBy: req.user._id,
            dueDate,
        });
        //
        const taskDetail = await Task.findById(newTask._id)
            .populate("assignee", "name")
            .populate("createdBy", "name");

        // Bước 8: Trả response
        return res.status(201).json({
            message: "Tạo task thành công",
            task: taskDetail,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message,
        });
    }
};