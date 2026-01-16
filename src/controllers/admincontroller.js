const Order = require('../models/Order');

exports.getMonthlyRevenue = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $match: { status: "Completed" } }, // Chỉ tính các đơn đã hoàn thành
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Nhóm theo tháng
                    totalRevenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } } // Sắp xếp từ tháng 1 đến tháng 12
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};