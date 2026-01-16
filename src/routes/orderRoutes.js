const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// --- KHÁCH HÀNG ---
router.post('/checkout', orderController.createOrder);
router.get('/:userId', orderController.getUserOrders);

// --- ADMIN ---
router.get('/admin/all', orderController.getAllOrders);       // Xem tất cả
router.put('/admin/:id', orderController.updateOrderStatus);  // Duyệt đơn
router.get('/admin/stats', orderController.getStats);         // Thống kê (Dòng gây lỗi nếu controller thiếu)

module.exports = router;