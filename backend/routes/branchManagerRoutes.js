const express = require('express');

const router = express.Router();


const Order = require('../models/OrderModel');

router.get("/orders/:branch", async (req, res) => {
    const status = req.query.status || "pending";


    const branch = req.params.branch;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;



    // const orders = await Order.find({ branch: branch, status: status })
    const orders = await Order.find({ branch: branch })
        .populate("user", "fullName phoneNumber")
        .populate("items.menuItem", "name images")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("-updatedAt -__v");

    if (!orders) return res.status(404).json({ status: 404, message: "No orders found" });

    const count = await Order.countDocuments({ branch: branch, status: status });
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
        status: 200,
        message: "Orders fetched successfully",
        data: {
            orders,
            totalPages,
            currentPage: page,
            totalOrders: count
        }
    });

});



module.exports = router;