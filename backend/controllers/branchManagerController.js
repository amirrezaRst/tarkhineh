const mongoose = require('mongoose');
const Menu = require('../models/MenuModel');
const Branch = require('../models/BranchModel');
const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const { ROLES } = require('../config/roles');


exports.getBranchOrders = async (req, res) => {
    try {
        const branch = req.params.branch;
        const status = req.query.status || "pending";

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const skip = (page - 1) * limit;

        const query = { branch };
        if (status !== "all") query.status = status;

        const orders = await Order.find(query)
            .populate("user", "fullName phoneNumber")
            .populate("items.menuItem", "name images")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-updatedAt -__v");

        const count = await Order.countDocuments(query);
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
    } catch (error) {
        console.error("Error fetching branch orders:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.getBranchMenus = async (req, res) => {
    try {
        const branchId = req.params.branch;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const skip = (page - 1) * limit;

        // پیدا کردن شعبه و آیتم‌های منوی مربوط به اون
        const branch = await Branch.findById(branchId).select("menus");
        if (!branch) return res.status(404).json({ status: 404, message: "Branch not found" });

        // گرفتن همه‌ی آیتم‌های منو با paginate
        const allMenus = await Menu.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("-updatedAt -__v");

        // ساخت لیست نهایی با اضافه کردن فیلد available
        const branchMenuIds = branch.menus.map(id => id.toString());
        const menusWithAvailability = allMenus.map(menu => ({
            ...menu.toObject(),
            available: branchMenuIds.includes(menu._id.toString())
        }));

        const count = await Menu.countDocuments(); // تعداد کل آیتم‌های منو (برای pagination)
        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            status: 200,
            message: "Menus fetched successfully",
            data: {
                menus: menusWithAvailability,
                totalPages,
                currentPage: page,
                totalMenus: count
            }
        });

    } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
}

// Toggles whether a (globally-catalogued) menu item is carried by this branch.
// Editing the item itself (name/price/...) stays admin-only and unchanged.
exports.toggleMenuAvailability = async (req, res) => {
    try {
        const { branch: branchId, menuId } = req.params;
        const { available } = req.body;

        const menuExists = await Menu.exists({ _id: menuId });
        if (!menuExists) return res.status(404).json({ status: 404, message: "Menu item not found" });

        const update = available ? { $addToSet: { menus: menuId } } : { $pull: { menus: menuId } };
        const branch = await Branch.findByIdAndUpdate(branchId, update, { new: true }).select("menus");
        if (!branch) return res.status(404).json({ status: 404, message: "Branch not found" });

        res.status(200).json({
            status: 200,
            message: "Menu availability updated successfully",
            data: { menuId, available },
        });
    } catch (error) {
        console.error("Error toggling menu availability:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.getBranchCouriers = async (req, res) => {
    try {
        const branchId = req.params.branch;

        const couriers = await User.find({ branch: branchId, role: ROLES.COURIER })
            .select("fullName phoneNumber email");

        const withActiveCounts = await Promise.all(
            couriers.map(async (courier) => ({
                ...courier.toObject(),
                activeOrders: await Order.countDocuments({ courier: courier._id, status: "on_the_way" }),
            }))
        );

        res.status(200).json({
            status: 200,
            message: "Couriers fetched successfully",
            data: { couriers: withActiveCounts },
        });
    } catch (error) {
        console.error("Error fetching branch couriers:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

function periodStart(period) {
    const now = new Date();
    if (period === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay()); // start of week (Sunday)
        start.setHours(0, 0, 0, 0);
        return start;
    }
    if (period === "month") {
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
    // today
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start;
}

exports.getBranchStats = async (req, res) => {
    try {
        const branchId = req.params.branch;
        const period = ["today", "week", "month"].includes(req.query.period) ? req.query.period : "today";
        const branchObjectId = new mongoose.Types.ObjectId(branchId);
        const start = periodStart(period);

        const [ordersCount, revenueResult, topItems, activeOrders] = await Promise.all([
            Order.countDocuments({ branch: branchId, createdAt: { $gte: start } }),

            Order.aggregate([
                { $match: { branch: branchObjectId, status: "delivered", createdAt: { $gte: start } } },
                { $group: { _id: null, total: { $sum: "$finalPrice" } } },
            ]),

            Order.aggregate([
                { $match: { branch: branchObjectId, status: "delivered", createdAt: { $gte: start } } },
                { $unwind: "$items" },
                { $group: { _id: "$items.menuItem", quantity: { $sum: "$items.quantity" } } },
                { $sort: { quantity: -1 } },
                { $limit: 3 },
                {
                    $lookup: {
                        from: "menus",
                        localField: "_id",
                        foreignField: "_id",
                        as: "menuItem",
                    },
                },
                { $unwind: "$menuItem" },
                { $project: { _id: 0, menuItem: { _id: 1, name: 1, images: 1 }, quantity: 1 } },
            ]),

            // Not period-scoped on purpose: this reflects the branch's current
            // pipeline, not the selected reporting window.
            Order.countDocuments({ branch: branchId, status: { $in: ["pending", "preparing", "on_the_way"] } }),
        ]);

        res.status(200).json({
            status: 200,
            message: "Branch stats fetched successfully",
            data: {
                period,
                ordersCount,
                revenue: revenueResult[0]?.total || 0,
                topItems,
                activeOrders,
            },
        });
    } catch (error) {
        console.error("Error fetching branch stats:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};
