

import User from "../models/user.model.js";     // Dùng model User để làm việc với bảng user trong MongoDB.
import bcrypt from "bcryptjs";                  // Dùng để mã hóa mật khẩu.
import jwt from "jsonwebtoken";                 // Dùng để tạo token đăng nhập.

// Đăng ký user
export const register = async (req, res) => {
    try {
        // Bước 1 
        const { name, email, password } = req.body
        // Bước 2 Check email đã tồn tại chưa
        const existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({
                message: "Email đã tồn tại"
            })
        }
        // Bước 3 Hash password 
        const hashedPassword = await bcrypt.hash(password, 10)

        // Bước 4 Tạo user mới
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        // Bước 5 Tạo token
        const token = jwt.sign(
            { id: user._id },       // dữ liệu muốn lưu trong token 
            process.env.JWT_SECRET, // khóa bí mật để ký token
            { expiresIn: "7d" }     // token hết hạn sau 7 ngày
        )
        // Bước 6 Trả về user + token
        return res.status(200).json({
            message: "Đăng ký user thành công",
            user: user,
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi Server",
            error: error.message
        })

    }
}


// Đăng nhập
export const login = async (req, res) => {
    try {
        // Bước 1
        const { email, password } = req.body
        // 1. Kiểm tra thiếu dữ liệu
        if (!email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập email và password",
            });
        }
        // Bước 2 Tìm user theo email
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không hợp lệ "
            })
        }
        // Bước 3 so sánh password nhập vào với password đã hash trong DB
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không hợp lệ"
            })
        }
        // Bước 4 Tạo token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        // 5. Trả kết quả
        return res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi Server",
            error: error.message
        })
    }
}


// lấy thông tin user
export const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Lấy thông tin user thành công",
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server",
            error: error.message,
        });
    }
};