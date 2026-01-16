const express = require('express');
const router = express.Router();
// Gọi đúng file Controller vừa sửa ở Bước 1
const authController = require('../controllers/authController'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);

module.exports = router;