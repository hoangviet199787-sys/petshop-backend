const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối Database
mongoose.connect('mongodb+srv://Client:abc123456@cluster0.bp2gmbm.mongodb.net/PetHouse?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ MongoDB Atlas Connected!'))
    .catch(err => console.log("❌ DB Error: ", err));

// --- KHAI BÁO ROUTES (ĐƯỜNG DẪN) ---
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

// --- TÍNH NĂNG MỚI: SỬA SẢN PHẨM (Đặt code này ở đây để chạy ưu tiên) ---
// Đoạn này giúp Server hiểu lệnh "Sửa" từ trang Admin
app.put('/api/products/:id', async (req, res) => {
    try {
        // Lấy model Product (đã được tạo ở các file khác)
        const Product = mongoose.model('Product'); 
        
        const { name, price, image, category } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, image, category },
            { new: true } // Trả về dữ liệu mới sau khi sửa
        );
        res.json(updatedProduct);
    } catch (err) {
        console.error("Lỗi sửa sản phẩm:", err);
        res.status(500).json({ error: "Lỗi khi sửa sản phẩm" });
    }
});

// Kích hoạt các đường dẫn (Routes)
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Server Listen (Cái này phải LUÔN Ở CUỐI CÙNG)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});