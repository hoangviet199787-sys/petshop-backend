const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            price: { type: Number }
        }
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: { 
        type: String, 
        default: 'Pending',
        enum: ['Pending', 'Shipping', 'Completed', 'Cancelled'] 
    },
    // Phương thức thanh toán (Mới thêm)
    paymentMethod: { 
        type: String, 
        default: 'COD',
        enum: ['COD', 'Banking', 'MoMo'] 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);