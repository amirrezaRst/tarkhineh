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

const TZ = "Asia/Tehran";
const ACTIVE_STATUSES = ["pending", "preparing", "on_the_way"];

function periodStart(period, ref = new Date()) {
    const now = new Date(ref);
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

// Delivered-order count + revenue for a [start, end) window on one branch.
async function deliveredSummary(branchObjectId, start, end) {
    const agg = await Order.aggregate([
        { $match: { branch: branchObjectId, status: "delivered", createdAt: { $gte: start, $lt: end } } },
        { $group: { _id: null, revenue: { $sum: "$finalPrice" }, count: { $sum: 1 } } },
    ]);
    const revenue = agg[0]?.revenue || 0;
    const count = agg[0]?.count || 0;
    return { revenue, count, avgBasket: count ? Math.round(revenue / count) : 0 };
}

// Percentage change vs a previous value; null when there's no baseline to compare.
function pctChange(current, previous) {
    if (!previous) return current ? null : 0;
    return Math.round(((current - previous) / previous) * 100);
}

exports.getBranchStats = async (req, res) => {
    try {
        const branchId = req.params.branch;
        const period = ["today", "week", "month"].includes(req.query.period) ? req.query.period : "today";
        const branchObjectId = new mongoose.Types.ObjectId(branchId);

        const now = new Date();
        const start = periodStart(period);
        const duration = now - start;
        const prevStart = new Date(start.getTime() - duration); // previous window of equal length
        const todayStart = periodStart("today");
        const sevenStart = new Date(todayStart);
        sevenStart.setDate(sevenStart.getDate() - 6); // last 7 calendar days incl. today

        const [
            ordersCount,
            prevOrdersCount,
            current,
            previous,
            topItems,
            statusAgg,
            activeAgg,
            revenueSeriesAgg,
            peakHoursAgg,
        ] = await Promise.all([
            Order.countDocuments({ branch: branchId, createdAt: { $gte: start, $lt: now } }),
            Order.countDocuments({ branch: branchId, createdAt: { $gte: prevStart, $lt: start } }),
            deliveredSummary(branchObjectId, start, now),
            deliveredSummary(branchObjectId, prevStart, start),

            Order.aggregate([
                { $match: { branch: branchObjectId, status: "delivered", createdAt: { $gte: start, $lt: now } } },
                { $unwind: "$items" },
                { $group: { _id: "$items.menuItem", quantity: { $sum: "$items.quantity" } } },
                { $sort: { quantity: -1 } },
                { $limit: 5 },
                { $lookup: { from: "menus", localField: "_id", foreignField: "_id", as: "menuItem" } },
                { $unwind: "$menuItem" },
                { $project: { _id: 0, menuItem: { _id: 1, name: 1, images: 1 }, quantity: 1 } },
            ]),

            // Order-status breakdown for the period (donut).
            Order.aggregate([
                { $match: { branch: branchObjectId, createdAt: { $gte: start, $lt: now } } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),

            // Current active pipeline — NOT period-scoped.
            Order.aggregate([
                { $match: { branch: branchObjectId, status: { $in: ACTIVE_STATUSES } } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),

            // Delivered revenue per day, last 7 calendar days.
            Order.aggregate([
                { $match: { branch: branchObjectId, status: "delivered", createdAt: { $gte: sevenStart, $lt: now } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TZ } }, value: { $sum: "$finalPrice" } } },
            ]),

            // Today's orders grouped by hour (peak hours).
            Order.aggregate([
                { $match: { branch: branchObjectId, createdAt: { $gte: todayStart, $lt: now } } },
                { $group: { _id: { $hour: { date: "$createdAt", timezone: TZ } }, count: { $sum: 1 } } },
            ]),
        ]);

        // status/active maps with every key present (0 default)
        const statusBreakdown = { pending: 0, preparing: 0, on_the_way: 0, delivered: 0, cancelled: 0 };
        statusAgg.forEach((s) => { if (s._id in statusBreakdown) statusBreakdown[s._id] = s.count; });
        const activeBreakdown = { pending: 0, preparing: 0, on_the_way: 0 };
        activeAgg.forEach((s) => { if (s._id in activeBreakdown) activeBreakdown[s._id] = s.count; });
        const activeOrders = activeBreakdown.pending + activeBreakdown.preparing + activeBreakdown.on_the_way;

        // fill the 7-day series with zero-days, ISO date + value (frontend labels it)
        const seriesMap = Object.fromEntries(revenueSeriesAgg.map((d) => [d._id, d.value]));
        const revenueSeries = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenStart);
            d.setDate(d.getDate() + i);
            const key = d.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
            revenueSeries.push({ date: key, value: seriesMap[key] || 0 });
        }

        const peakHours = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }));
        peakHoursAgg.forEach((p) => { if (p._id >= 0 && p._id < 24) peakHours[p._id].count = p.count; });

        res.status(200).json({
            status: 200,
            message: "Branch stats fetched successfully",
            data: {
                period,
                ordersCount,
                revenue: current.revenue,
                avgBasket: current.avgBasket,
                activeOrders,
                trends: {
                    revenue: pctChange(current.revenue, previous.revenue),
                    orders: pctChange(ordersCount, prevOrdersCount),
                    avgBasket: pctChange(current.avgBasket, previous.avgBasket),
                },
                statusBreakdown,
                activeBreakdown,
                revenueSeries,
                peakHours,
                topItems,
            },
        });
    } catch (error) {
        console.error("Error fetching branch stats:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};
