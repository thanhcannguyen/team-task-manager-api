
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Kiểm tra header Authorization có tồn tại không
        // Format chuẩn: Bearer <token>
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2. Nếu không có token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Không có token, truy cập bị từ chối",
            });
        }

        // 3. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Tìm user từ id nằm trong token
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User không tồn tại",
            });
        }

        // 5. Gắn thông tin user vào req để controller sau dùng
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn",
            error: error.message,
        });
    }
};