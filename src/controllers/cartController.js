const Cart = require('../models/Cart');
const Product = require('../models/Product');

// 1. Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Tìm giỏ hàng của user
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Nếu giỏ hàng đã tồn tại, kiểm tra xem sản phẩm đã có trong đó chưa
            const itemIndex = cart.products.findIndex(p => p.productId == productId);

            if (itemIndex > -1) {
                // Nếu có rồi thì tăng số lượng
                cart.products[itemIndex].quantity += quantity;
            } else {
                // Nếu chưa có thì thêm mới vào mảng
                cart.products.push({ productId, quantity });
            }
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Nếu user chưa có giỏ hàng thì tạo mới
            const newCart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
            await newCart.save();
            return res.status(201).json(newCart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Lỗi thêm vào giỏ hàng" });
    }
};

// 2. Lấy thông tin giỏ hàng (kèm chi tiết sản phẩm)
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        
        if (!cart) {
            return res.status(200).json({ products: [] }); // Trả về giỏ rỗng thay vì lỗi
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Cập nhật số lượng món hàng (Tăng/Giảm)
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ userId });
        
        if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

        const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        
        if (itemIndex > -1) {
            if (quantity > 0) {
                // Cập nhật số lượng mới
                cart.products[itemIndex].quantity = quantity;
            } else {
                // Nếu số lượng <= 0 thì xóa luôn món đó
                cart.products.splice(itemIndex, 1);
            }
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: "Sản phẩm không có trong giỏ" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Xóa hẳn một món khỏi giỏ
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cart = await Cart.findOne({ userId });
        
        if (cart) {
            // Lọc giữ lại những món KHÔNG trùng ID với món cần xóa
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: "Giỏ hàng không tìm thấy" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};