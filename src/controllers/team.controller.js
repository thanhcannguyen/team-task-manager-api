
import Team from "../models/team.model.js"


// Tạo team
export const createTeam = async (req, res) => {
    try {
        // Bước 1 . Lấy dữ liệu đầu vào

        const { name, description } = req.body

        // Bước 2. Validate dữ liệu
        if (!name) {
            return res.status(400).json({
                message: "Lỗi xác thực"
            })
        }
        // Bước 3. Xác định owner
        // Bước 4 . Tạo object team mới và lưu vào database
        const newTeam = await Team.create({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id]
        })
        // Bước 5. Trả response
        return res.status(201).json({
            message: "Tạo dự án cho team thành công",
            team: newTeam
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi Server",
            error: error.message
        })
    }
}