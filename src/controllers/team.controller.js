
import Team from "../models/team.model.js"
import User from "../models/user.model.js"


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


// xem thông tin nhóm
export const getMyTeams = async (req, res) => {
    try {
        // Bước 1. lấy userId từ req.user._id
        const userId = req.user._id;
        // Bước 2. tìm tất cả team mà members có chứa userId
        const listTeam = await Team.find({ members: userId })
            .populate("owner", "name email")
            .populate("members", "name email")
        // Bước 3. trả danh sách team về response
        return res.status(200).json({
            message: "Danh sách nhóm bạn đã tham gia",
            teams: listTeam
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi Server",
            error: error.message
        })
    }
}


// Thêm thành viên vào nhóm
export const addMemberToTeam = async (req, res) => {
    try {
        // Bước 1 Lấy teamId và userId
        const { teamId } = req.params
        const { userId } = req.body

        // Bước 2: Validate dữ liệu đầu vào
        if (!userId) {
            return res.status(400).json({
                message: "userId là bắt buộc",
            });
        }

        // Bước 3 Kiểm tra team có tồn tại không
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: "Không tìm thấy team",
            });
        }
        // Bước 4 Kiểm tra người đang gọi API có phải owner không
        // Vì không thể để ai cũng thêm member vào team được.
        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Bạn không có quyền thêm thành viên vào team này",
            });
        }

        // Bước 5 Kiểm tra user cần thêm có tồn tại không
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy user",
            });
        }
        // Bước 6 Kiểm tra user đó đã có trong team chưa
        // Nếu đã có rồi thì không thêm nữa
        const isMember = team.members.some(
            (memberId) => memberId.toString() === userId.toString()
        );

        if (isMember) {
            return res.status(400).json({
                message: "User đã là thành viên của team",
            });
        }
        // Bước 7 Push userId vào members
        team.members.push(userId);

        // Bước 8 Lưu lại và trả response
        await team.save();
        const updatedTeam = await Team.findById(team._id)
            .populate("owner", "name email")
            .populate("members", "name email");

        return res.status(200).json({
            message: "Thêm thành viên vào team thành công",
            team: updatedTeam
        });

    } catch (error) {
        return res.status(500).json({
            message: "Lỗi Server",
            error: error.message
        })
    }
}