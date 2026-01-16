const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Quan trọng: Phải có dòng này

// 1. TẠO ĐƠN HÀNG (Khách)
exports.createOrder = async (req, res) => {
    try {
        const { userId, address, phoneNumber, paymentMethod } = req.body;
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Giỏ hàng trống!" });
        }

        let totalAmount = 0;
        const orderProducts = cart.products.map(item => {
            totalAmount += item.productId.price * item.quantity;
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            };
        });

        const newOrder = new Order({
            userId,
            products: orderProducts,
            totalAmount,
            address,
            phoneNumber,
            paymentMethod: paymentMethod || 'COD',
            status: 'Pending'
        });

        await newOrder.save();
        cart.products = [];
        await cart.save();

        res.status(201).json({ message: "Đặt hàng thành công!", orderId: newOrder._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. XEM LỊCH SỬ (Khách)
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- ADMIN ---

// 3. XEM TẤT CẢ ĐƠN
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'username phoneNumber address')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. DUYỆT ĐƠN
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: "Đã cập nhật trạng thái!" });
        } else {
            res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. THỐNG KÊ (Hàm mới bị thiếu gây lỗi)
exports.getStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        
        const completedOrders = await Order.find({ status: 'Completed' });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.json({ totalOrders, totalProducts, totalRevenue });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};