const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // --- SỬA ĐOẠN NÀY ---
    username: { 
        type: String, 
        default: "Khách hàng" // Không bắt buộc nhập, nếu thiếu tự điền là "Khách hàng"
    },
    // --------------------
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, default: "" },
    role: { type: String, default: 'user' }
}, { timestamps: true });

// Hàm kiểm tra mật khẩu
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hàm mã hóa mật khẩu
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);