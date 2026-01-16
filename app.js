const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối Database
// Thay đổi kết nối Database bằng dòng này:
mongoose.connect('mongodb+srv://Client:abc123456@cluster0.bp2gmbm.mongodb.net/PetHouse?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ MongoDB Atlas Connected!'))
    .catch(err => console.log("❌ DB Error: ", err));

// --- KHAI BÁO ROUTES (ĐƯỜNG DẪN) ---
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes'); // <--- MỚI: Thêm dòng này

// Kích hoạt các đường dẫn
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes); // <--- MỚI: Thêm dòng này

// Server Listen (Cái này phải LUÔN Ở CUỐI CÙNG)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});