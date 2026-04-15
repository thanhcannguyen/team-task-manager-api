

import Project from "../models/project.model.js"
import Team from "../models/team.model.js"



// Tạo dự án
export const createProject = async (req, res) => {
    try {
        // Bước 1: Lấy dữ liệu
        const { name, description, teamId } = req.body
        // Bước 2: Xác thực dữ liệu
        if (!name || !teamId) {
            return res.status(400).json({
                message: "Tên dự án và team chưa hợp lệ",
            })
        }
        // Bước 3: Tìm team, kiểm tra team có tồn tại chưa
        const team = await Team.findById(teamId)
        // Bước 4: Nếu team không tồn tại -> báo lỗi
        if (!team) {
            return res.status(404).json({
                message: "Team chưa tồn tại",
            })
        }
        // Bước 5: Kiểm tra user hiện tại có thuộc team không
        const isMember = team.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        )
        // Bước 6: Nếu không thuộc team
        if (!isMember) {
            return res.status(403).json({
                message: "Bạn không thuộc team này nên không tạo được dự án"
            })
        }
        // Bước 7: Tạo project mới
        const newProject = await Project.create({
            name,
            description,
            team: teamId,
            createdBy: req.user._id
        })
        // Bước 8: Lưu database

        // Bước 9: Trả response thành công
        return res.status(201).json({
            message: "Tạo project thành công",
            newProject
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
}


// lấy danh sách project thuộc team
export const getProjectsByTeam = async (req, res) => {
    try {
        // Bước 1. Lấy dữ liệu
        const { teamId } = req.params

        // Bước 2. Kiểm tra team có tồn tại chưa
        const team = await Team.findById(teamId)

        // Bước 3. Xác thực 
        if (!team) {
            return res.status(404).json({
                message: "Team chưa tồn tại"
            })
        }

        // Bước 4. Kiểm tra user có thuộc team 
        const isMember = team.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        )
        // Bước 5. 
        if (!isMember) {
            return res.status(403).json({
                message: "User không thuộc team nên không được xem project của team"
            })
        }
        // Bước 6. nếu hợp lệ -> trả kết quả
        const listProject = await Project.find({ team: teamId }).populate("createdBy", "name")
        return res.status(200).json({
            message: "Danh sách các project mà bạn tham gia",
            project: listProject
        })

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
}



//  Xem thông tin chi tiết của 1 project
export const getProjectDetail = async (req, res) => {
    try {
        // Bước 1 lấy dữ liệu
        const projectId = req.params.id
        // Bước 2 Tìm project trong Database
        const project = await Project.findById(projectId)
            .populate("createdBy", "name ")
            .populate("team", "name description");
        // Bước 3 Kiểm tra project có tồn tại không
        if (!project) {
            return res.status(404).json({
                message: "Không tìm thấy project"
            })
        }
        //
        const team = await Team.findById(project.team._id);
        // Bước 4 Kiểm tra xem user hiện tại có quyền xem không
        const isMember = team.members.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        )
        if (!isMember) {
            return res.status(403).json({
                message: "User không thuộc team nên không được xem project của team"
            })
        }
        // Bước 5. nếu hợp lệ -> trả kết quả
        return res.status(200).json({
            message: "Lấy chi tiết project thành công",
            project
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message
        })
    }
}
