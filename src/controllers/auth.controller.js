

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
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