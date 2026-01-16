const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hàm tạo Token đăng nhập
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
        expiresIn: '30d',
    });
};

// 1. ĐĂNG KÝ
exports.register = async (req, res) => {
    console.log("------------------------------------------");
    console.log("📝 ĐANG XỬ LÝ ĐĂNG KÝ:");
    console.log("- Dữ liệu nhận từ Web:", req.body);

    try {
        const { username, phoneNumber, password, address } = req.body;

        // Kiểm tra trùng số điện thoại
        const userExists = await User.findOne({ phoneNumber });
        if (userExists) {
            console.log("❌ Thất bại: Số điện thoại đã tồn tại trong DB");
            return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
        }

        // Tạo user mới
        const user = await User.create({
            username: username || "Khách hàng",
            phoneNumber,
            password,
            address
        });

        if (user) {
            console.log("✅ Đăng ký thành công User ID:", user._id);
            res.status(201).json({
                message: "Đăng ký thành công",
                user: {
                    _id: user._id,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                    address: user.address
                },
                token: generateToken(user._id),
            });
        } else {
            console.log("❌ Lỗi: Không tạo được user");
            res.status(400).json({ message: "Không thể tạo tài khoản" });
        }
    } catch (error) {
        console.log("❌ LỖI SERVER KHI ĐĂNG KÝ:", error.message);
        res.status(500).json({ message: "Lỗi Server: " + error.message });
    }
};

// 2. ĐĂNG NHẬP (CÓ LOG DÒ LỖI)
exports.login = async (req, res) => {
    console.log("------------------------------------------");
    console.log("🔑 ĐANG THỬ ĐĂNG NHẬP:");
    console.log("- Dữ liệu nhận từ Web:", req.body); 

    try {
        const { phoneNumber, password } = req.body;

        // Tìm user theo số điện thoại
        const user = await User.findOne({ phoneNumber });
        
        // In ra kết quả tìm kiếm để kiểm tra
        if (user) {
            console.log("✅ Đã tìm thấy User trong DB:", user.username);
            console.log("- SĐT trong DB:", user.phoneNumber);
            console.log("- Mật khẩu mã hóa trong DB:", user.password);
        } else {
            console.log("❌ KHÔNG TÌM THẤY USER NÀO VỚI SĐT:", phoneNumber);
            console.log("(Gợi ý: Có thể do thừa khoảng trắng hoặc chưa đăng ký)");
        }

        // Kiểm tra logic
        if (!user) {
            return res.status(400).json({ message: "User không tồn tại" });
        }

        // Kiểm tra mật khẩu
        const isMatch = await user.matchPassword(password);
        console.log("- Kết quả so sánh mật khẩu:", isMatch ? "✅ Khớp" : "❌ Không khớp");

        if (isMatch) {
            res.json({
                message: "Đăng nhập thành công",
                user: {
                    _id: user._id,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                    address: user.address,
                    role: user.role
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Sai mật khẩu!" });
        }
    } catch (error) {
        console.log("❌ LỖI SERVER KHI ĐĂNG NHẬP:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// 3. QUÊN MẬT KHẨU
exports.resetPassword = async (req, res) => {
    try {
        const { phoneNumber, username, newPassword } = req.body;
        
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        if (user.username !== username) {
            return res.status(400).json({ message: "Tên đăng nhập không khớp!" });
        }

        user.password = newPassword; 
        await user.save();

        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};