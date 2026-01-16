const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ai cũng xem được
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Chỉ Admin mới được dùng (Tạm thời mình mở công khai để bạn test cho dễ nhé)
router.post('/', productController.createProduct);       // Đường dẫn thêm sản phẩm
router.delete('/:id', productController.deleteProduct);  // Đường dẫn xóa sản phẩm

module.exports = router;