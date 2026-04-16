


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



// xem danh sách task của một project
export const getTaskByProject = async (req, res) => {
    try {
        // Bước 1: Lấy projectId
        const { projectId } = req.params;

        // Bước 2: Kiểm tra project có tồn tại không
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Không tìm thấy project",
            });
        }

        // Bước 3: Lấy team của project
        const team = await Team.findById(project.team);

        if (!team) {
            return res.status(404).json({
                message: "Không tìm thấy team",
            });
        }

        // Bước 4: Kiểm tra user hiện tại có thuộc team không
        const isMember = team.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Bạn không có quyền xem task của project này",
            });
        }

        // Bước 5: Lấy danh sách task của project
        const tasks = await Task.find({ project: projectId })
            .populate("assignee", "name")
            .populate("createdBy", "name");

        // Bước 6: Trả response
        return res.status(200).json({
            message: "Lấy danh sách task thành công",
            tasks,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message,
        });
    }
}


// Xem chi tiết một task
export const getTaskDetail = async (req, res) => {
    try {
        // Bước 1: Lấy taskId từ params
        const { id } = req.params;

        // Bước 2: Tìm task trong database
        const task = await Task.findById(id)
            .populate("assignee", "name email")
            .populate("createdBy", "name email")
            .populate("project", "name description")
            .populate("team", "name description");

        // Bước 3: Kiểm tra task có tồn tại không
        if (!task) {
            return res.status(404).json({
                message: "Không tìm thấy task",
            });
        }

        // Bước 4: Kiểm tra project của task có tồn tại không
        const project = await Project.findById(task.project._id);

        if (!project) {
            return res.status(404).json({
                message: "Không tìm thấy project của task",
            });
        }

        // Bước 5: Kiểm tra team của task có tồn tại không
        const team = await Team.findById(task.team._id);

        if (!team) {
            return res.status(404).json({
                message: "Không tìm thấy team của task",
            });
        }

        // Bước 6: Kiểm tra user hiện tại có thuộc team không
        const isMember = team.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Bạn không có quyền xem task này",
            });
        }

        // Bước 7: Trả kết quả
        return res.status(200).json({
            message: "Lấy chi tiết task thành công",
            task,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message,
        });
    }
};


// Giao task cho user
export const assignTask = async (req, res) => {
    try {
        // Bước 1: Lấy taskId và assignee từ request
        const taskId = req.params.id;
        const { assignee } = req.body;

        // Bước 2: Validate dữ liệu
        if (!assignee) {
            return res.status(400).json({
                message: "Thiếu user cần được giao task"
            });
        }

        // Bước 3: Tìm task
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Không tìm thấy task"
            });
        }

        // Bước 4: Tìm team của task
        const team = await Team.findById(task.team);

        if (!team) {
            return res.status(404).json({
                message: "Không tìm thấy team của task"
            });
        }

        // Bước 5: Kiểm tra user hiện tại có thuộc team không
        const isMember = team.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Bạn không thuộc team nên không có quyền giao task"
            });
        }

        // Bước 6: Kiểm tra user được giao có tồn tại không
        const user = await User.findById(assignee);

        if (!user) {
            return res.status(404).json({
                message: "User được giao task không tồn tại"
            });
        }

        // Bước 7: Kiểm tra user được giao có thuộc team không
        const isAssigneeInTeam = team.members.some(
            (memberId) => memberId.toString() === assignee.toString()
        );

        if (!isAssigneeInTeam) {
            return res.status(400).json({
                message: "User được giao task không thuộc team"
            });
        }

        // Bước 8: Cập nhật assignee cho task
        task.assignee = assignee;
        await task.save();

        // Bước 9: Lấy lại task đã populate
        const updatedTask = await Task.findById(task._id)
            .populate("assignee", "name email")
            .populate("createdBy", "name email")
            .populate("project", "name");

        // Bước 10: Trả response
        return res.status(200).json({
            message: "Giao task thành công",
            task: updatedTask
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        });
    }
};