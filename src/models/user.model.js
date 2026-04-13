
import mongoose from 'mongoose'

// Bước 1: Định nghĩa schema (cấu trúc dữ liệu của User)
const userSchema = new mongoose.Schema({
    // Các field của user
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

}, {
    // Bước 2: Cấu hình schema (tự động thêm createdAt, updatedAt)
    timestamps: true
})

// Bước 3: Tạo model từ schema
const User = mongoose.model("User", userSchema)

// Bước 4: Export model để sử dụng ở nơi khác (controller, service...)
export default User