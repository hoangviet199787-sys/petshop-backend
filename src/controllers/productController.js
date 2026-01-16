const Product = require('../models/Product');

// 1. LẤY DANH SÁCH SẢN PHẨM (CÓ TÌM KIẾM & LỌC)
exports.getProducts = async (req, res) => {
    try {
        // Lấy các tham số từ Web gửi lên
        const { keyword, category, sort } = req.query;

        // Xây dựng bộ lọc
        let filter = {};
        
        // Nếu có từ khóa tìm kiếm (Dùng Regex để tìm gần đúng, không phân biệt hoa thường)
        if (keyword) {
            filter.name = { $regex: keyword, $options: 'i' };
        }

        // Nếu có chọn danh mục
        if (category && category !== 'All') {
            filter.category = category;
        }

        // Xây dựng quy tắc sắp xếp
        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;   // Giá tăng dần
        else if (sort === 'price_desc') sortOption.price = -1; // Giá giảm dần
        else sortOption.createdAt = -1; // Mặc định: Mới nhất lên đầu

        // Truy vấn Database
        const products = await Product.find(filter).sort(sortOption);
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. Lấy chi tiết 1 sản phẩm
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) res.json(product);
        else res.status(404).json({ message: 'Không tìm thấy' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 3. Admin tạo sản phẩm
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, image, category } = req.body;
        const product = new Product({ name, price, description, image, category });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. Admin xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Đã xóa' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};