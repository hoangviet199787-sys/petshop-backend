const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Thêm vào giỏ: POST http://localhost:5000/api/cart/add
router.post('/add', cartController.addToCart);

// Xem giỏ hàng: GET http://localhost:5000/api/cart/:userId
router.get('/:userId', cartController.getCart);

// Cập nhật số lượng: POST http://localhost:5000/api/cart/update
router.post('/update', cartController.updateCartItem);

// Xóa món: POST http://localhost:5000/api/cart/remove
router.post('/remove', cartController.removeFromCart);

module.exports = router;