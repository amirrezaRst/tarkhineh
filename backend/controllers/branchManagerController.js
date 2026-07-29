const mongoose = require('mongoose');
const Menu = require('../models/MenuModel');
const Branch = require('../models/BranchModel');
const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const { ROLES } = require('../config/roles');
const cache = require('../middleware/cacheMiddleware');
const { branchByIdKey } = require('../utils/cacheKeys');


// Resolve a named date range (or explicit from/to) to a createdAt filter.
function ordersDateWindow({ range, from, to }) {
    const now = new Date();
    if (range === "today") { const s = periodStart("today"); return { $gte: s }; }
    if (range === "yesterday") {
        const e = periodStart("today");
        const s = new Date(e); s.setDate(s.getDate() - 1);
        return { $gte: s, $lt: e };
    }
    if (range === "7days") { const s = periodStart("today"); s.setDate(s.getDate() - 6); return { $gte: s }; }
    if (range === "custom" && (from || to)) {
        const w = {};
        if (from) w.$gte = new Date(from);
        if (to) { const t = new Date(to); t.setHours(23, 59, 59, 999); w.$lte = t; }
        return w;
    }
    return null; // "all" or unspecified
}

exports.getBranchOrders = async (req, res) => {
    try {
        const branch = req.params.branch;
        const status = req.query.status || "pending";
        const { range, from, to, q, sort } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const skip = (page - 1) * limit;

        // Date window (shared by both the list and the per-status tab counts).
        const dateFilter = ordersDateWindow({ range, from, to });
        const baseQuery = { branch };
        if (dateFilter) baseQuery.createdAt = dateFilter;

        // Free-text search over order id (hex substring) or customer name/phone.
        if (q && q.trim()) {
            const term = q.trim();
            const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            const users = await User.find({ $or: [{ fullName: rx }, { phoneNumber: rx }] }).select("_id").limit(50);
            baseQuery.$or = [
                { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: term, options: "i" } } },
                { user: { $in: users.map((u) => u._id) } },
            ];
        }

        const query = { ...baseQuery };
        if (status !== "all") query.status = status;

        const sortMap = { oldest: { createdAt: 1 }, amount: { finalPrice: -1 }, newest: { createdAt: -1 } };
        const sortBy = sortMap[sort] || sortMap.newest;

        const orders = await Order.find(query)
            .populate("user", "fullName phoneNumber")
            .populate("items.menuItem", "name images")
            .skip(skip)
            .limit(limit)
            .sort(sortBy)
            .select("-updatedAt -__v");

        const count = await Order.countDocuments(query);
        const totalPages = Math.ceil(count / limit);

        // Per-status counts for the filter tabs, scoped to the same window/search
        // so each tab reflects what's actually visible.
        const countMatch = { ...baseQuery, branch: new mongoose.Types.ObjectId(branch) };
        const countsAgg = await Order.aggregate([
            { $match: countMatch },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        const counts = { all: 0, pending: 0, preparing: 0, on_the_way: 0, delivered: 0, cancelled: 0 };
        countsAgg.forEach((c) => { if (c._id in counts) counts[c._id] = c.count; counts.all += c.count; });

        res.status(200).json({
            status: 200,
            message: "Orders fetched successfully",
            data: {
                orders,
                totalPages,
                currentPage: page,
                totalOrders: count,
                counts,
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

        await cache.invalidate(branchByIdKey(branchId));

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

// One courier's live operational stats: active load, deliveries today/this week,
// average delivery minutes (assigned -> delivered) and lifetime deliveries.
async function courierStats(courierId) {
    const todayStart = periodStart("today");
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);

    const [activeOrders, deliveredToday, deliveredWeek, agg] = await Promise.all([
        Order.countDocuments({ courier: courierId, status: { $in: ["preparing", "on_the_way"] } }),
        Order.countDocuments({ courier: courierId, status: "delivered", deliveredAt: { $gte: todayStart } }),
        Order.countDocuments({ courier: courierId, status: "delivered", deliveredAt: { $gte: weekStart } }),
        Order.aggregate([
            { $match: { courier: courierId, status: "delivered", assignedAt: { $ne: null }, deliveredAt: { $ne: null } } },
            { $group: { _id: null, total: { $sum: 1 }, avgMs: { $avg: { $subtract: ["$deliveredAt", "$assignedAt"] } } } },
        ]),
    ]);
    const total = agg[0]?.total || 0;
    const avgMinutes = agg[0]?.avgMs ? Math.round(agg[0].avgMs / 60000) : null;
    // lifetime total counts all delivered (some may lack assignedAt), so recount
    const totalDeliveries = await Order.countDocuments({ courier: courierId, status: "delivered" });
    return { activeOrders, deliveredToday, deliveredWeek, avgMinutes, totalDeliveries };
}

exports.getBranchCouriers = async (req, res) => {
    try {
        const branchId = req.params.branch;

        const [branch, couriers] = await Promise.all([
            Branch.findById(branchId).select("courierCapacity"),
            User.find({ branch: branchId, role: ROLES.COURIER })
                .select("fullName phoneNumber email image courierStatus vehicleType plateNumber nationalCode"),
        ]);
        const courierCapacity = branch?.courierCapacity || 3;

        const enriched = await Promise.all(
            couriers.map(async (courier) => ({
                ...courier.toObject(),
                ...(await courierStats(courier._id)),
            }))
        );

        res.status(200).json({
            status: 200,
            message: "Couriers fetched successfully",
            data: { couriers: enriched, courierCapacity },
        });
    } catch (error) {
        console.error("Error fetching branch couriers:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// Create a courier for this branch (with an optional uploaded photo). The upload
// middleware has already written the file and put its name in req.body.image.
exports.createCourier = async (req, res) => {
    try {
        const branchId = req.params.branch;
        const { fullName, phoneNumber, nationalCode, vehicleType, plateNumber } = req.body;
        if (!phoneNumber || !/^09\d{9}$/.test(phoneNumber)) {
            return res.status(400).json({ status: 400, message: "شماره موبایل معتبر نیست." });
        }
        const exists = await User.findOne({ phoneNumber }).select("_id");
        if (exists) return res.status(400).json({ status: 400, message: "کاربری با این شماره از قبل ثبت شده است." });

        // upload middleware stores just the filename; prefix with the couriers/
        // sub-path so it resolves through the /public/couriers static mount.
        const uploaded = Array.isArray(req.body.image) ? req.body.image[0] : null;
        const image = uploaded ? `couriers/${uploaded}` : null;
        const courier = await User.create({
            fullName: fullName || null,
            phoneNumber,
            nationalCode: nationalCode || null,
            vehicleType: ["motorcycle", "bicycle", "car", "foot"].includes(vehicleType) ? vehicleType : "motorcycle",
            plateNumber: plateNumber || null,
            image,
            role: ROLES.COURIER,
            branch: branchId,
            courierStatus: "available",
        });

        res.status(201).json({ status: 201, message: "پیک با موفقیت اضافه شد.", data: { courier } });
    } catch (error) {
        console.error("Error creating courier:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// Update a courier — availability toggle and/or basic profile fields.
exports.updateCourier = async (req, res) => {
    try {
        const { branch: branchId, courierId } = req.params;
        const courier = await User.findOne({ _id: courierId, branch: branchId, role: ROLES.COURIER });
        if (!courier) return res.status(404).json({ status: 404, message: "پیک یافت نشد." });

        const { courierStatus, fullName, vehicleType, plateNumber, nationalCode } = req.body;
        if (courierStatus && ["available", "offline"].includes(courierStatus)) courier.courierStatus = courierStatus;
        if (fullName !== undefined) courier.fullName = fullName;
        if (vehicleType && ["motorcycle", "bicycle", "car", "foot"].includes(vehicleType)) courier.vehicleType = vehicleType;
        if (plateNumber !== undefined) courier.plateNumber = plateNumber;
        if (nationalCode !== undefined) courier.nationalCode = nationalCode;
        const uploaded = Array.isArray(req.body.image) ? req.body.image[0] : null;
        if (uploaded) courier.image = `couriers/${uploaded}`;

        await courier.save();
        res.status(200).json({ status: 200, message: "اطلاعات پیک به‌روزرسانی شد.", data: { courier } });
    } catch (error) {
        console.error("Error updating courier:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.deleteCourier = async (req, res) => {
    try {
        const { branch: branchId, courierId } = req.params;
        const active = await Order.countDocuments({ courier: courierId, status: { $in: ["preparing", "on_the_way"] } });
        if (active > 0) return res.status(400).json({ status: 400, message: "این پیک سفارش فعال دارد و قابل حذف نیست." });

        const courier = await User.findOneAndDelete({ _id: courierId, branch: branchId, role: ROLES.COURIER });
        if (!courier) return res.status(404).json({ status: 404, message: "پیک یافت نشد." });
        res.status(200).json({ status: 200, message: "پیک حذف شد." });
    } catch (error) {
        console.error("Error deleting courier:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// Courier detail: profile + weekly delivery series + current (unfinished) orders.
exports.getCourierDetail = async (req, res) => {
    try {
        const { branch: branchId, courierId } = req.params;
        const courier = await User.findOne({ _id: courierId, branch: branchId, role: ROLES.COURIER })
            .select("fullName phoneNumber image courierStatus vehicleType plateNumber nationalCode createdAt");
        if (!courier) return res.status(404).json({ status: 404, message: "پیک یافت نشد." });

        const todayStart = periodStart("today");
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 6);

        const [stats, weekAgg, currentOrders] = await Promise.all([
            courierStats(courierId),
            Order.aggregate([
                { $match: { courier: new mongoose.Types.ObjectId(courierId), status: "delivered", deliveredAt: { $gte: weekStart } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$deliveredAt", timezone: TZ } }, count: { $sum: 1 } } },
            ]),
            Order.find({ courier: courierId, status: { $in: ["preparing", "on_the_way"] } })
                .populate("user", "fullName phoneNumber")
                .populate("items.menuItem", "name")
                .select("user items finalPrice status createdAt assignedAt deliveryAddress")
                .sort({ assignedAt: -1 }),
        ]);

        const seriesMap = Object.fromEntries(weekAgg.map((d) => [d._id, d.count]));
        const weeklyDeliveries = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
            weeklyDeliveries.push({ date: key, count: seriesMap[key] || 0 });
        }

        res.status(200).json({
            status: 200,
            message: "Courier detail fetched successfully",
            data: { courier: { ...courier.toObject(), ...stats }, weeklyDeliveries, currentOrders },
        });
    } catch (error) {
        console.error("Error fetching courier detail:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// Update the branch-wide courier capacity (one value for every courier).
exports.updateCourierCapacity = async (req, res) => {
    try {
        const branchId = req.params.branch;
        const capacity = parseInt(req.body.capacity, 10);
        if (!capacity || capacity < 1 || capacity > 20) {
            return res.status(400).json({ status: 400, message: "ظرفیت باید بین ۱ تا ۲۰ باشد." });
        }
        const branch = await Branch.findByIdAndUpdate(branchId, { courierCapacity: capacity }, { new: true }).select("courierCapacity");
        if (!branch) return res.status(404).json({ status: 404, message: "شعبه یافت نشد." });
        res.status(200).json({ status: 200, message: "ظرفیت پیک‌ها به‌روزرسانی شد.", data: { courierCapacity: branch.courierCapacity } });
    } catch (error) {
        console.error("Error updating courier capacity:", error);
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

const faNum = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

// Period-aware series for the reports trend chart. today -> hourly (business
// hours), week -> last 7 days, month -> each day of the current month. Every
// point carries both delivered revenue and total order count so the frontend
// can toggle the metric without another request.
async function buildTrendSeries(branchObjectId, period, now) {
    if (period === "today") {
        const start = periodStart("today");
        const agg = await Order.aggregate([
            { $match: { branch: branchObjectId, createdAt: { $gte: start, $lt: now } } },
            { $group: { _id: { $hour: { date: "$createdAt", timezone: TZ } }, revenue: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, "$finalPrice", 0] } }, orders: { $sum: 1 } } },
        ]);
        const map = Object.fromEntries(agg.map((a) => [a._id, a]));
        const series = [];
        for (let h = 8; h <= 23; h++) {
            const a = map[h];
            series.push({ label: faNum(h), value: a?.revenue || 0, orders: a?.orders || 0 });
        }
        return series;
    }

    let start, count;
    if (period === "month") {
        start = periodStart("month");
        count = Math.floor((now - start) / 86400000) + 1;
    } else {
        start = periodStart("today");
        start.setDate(start.getDate() - 6);
        count = 7;
    }
    const agg = await Order.aggregate([
        { $match: { branch: branchObjectId, createdAt: { $gte: start, $lt: now } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TZ } }, revenue: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, "$finalPrice", 0] } }, orders: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(agg.map((a) => [a._id, a]));
    const series = [];
    for (let i = 0; i < count; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
        const a = map[key];
        const label = period === "week"
            ? d.toLocaleDateString("fa-IR", { weekday: "short" })
            : faNum(d.toLocaleDateString("en-US", { day: "numeric", timeZone: TZ }));
        series.push({ label, value: a?.revenue || 0, orders: a?.orders || 0 });
    }
    return series;
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
            paymentAgg,
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

            // Payment-method split for the period (online vs cash).
            Order.aggregate([
                { $match: { branch: branchObjectId, createdAt: { $gte: start, $lt: now } } },
                { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
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

        const paymentSplit = { online: 0, cash: 0 };
        paymentAgg.forEach((p) => { if (p._id in paymentSplit) paymentSplit[p._id] = p.count; });

        // Cancellation rate for the period (share of orders that were cancelled).
        const periodTotal = Object.values(statusBreakdown).reduce((a, b) => a + b, 0);
        const cancellationRate = periodTotal ? Math.round((statusBreakdown.cancelled / periodTotal) * 1000) / 10 : 0;

        // Period-aware trend series (revenue + orders per bucket) for the chart.
        const trendSeries = await buildTrendSeries(branchObjectId, period, now);

        // Extra reports analytics (all scoped to the period window).
        const nn = (x) => ({ $ne: [x, null] });
        const [timingsAgg, courierPerfAgg, categoryAgg, hourlyAgg] = await Promise.all([
            // Average accept / delivery / fulfillment durations over delivered orders.
            Order.aggregate([
                { $match: { branch: branchObjectId, status: "delivered", createdAt: { $gte: start, $lt: now } } },
                {
                    $group: {
                        _id: null,
                        accept: { $avg: { $cond: [nn("$approvedAt"), { $subtract: ["$approvedAt", "$createdAt"] }, null] } },
                        delivery: { $avg: { $cond: [{ $and: [nn("$assignedAt"), nn("$deliveredAt")] }, { $subtract: ["$deliveredAt", "$assignedAt"] }, null] } },
                        fulfillment: { $avg: { $cond: [nn("$deliveredAt"), { $subtract: ["$deliveredAt", "$createdAt"] }, null] } },
                    },
                },
            ]),
            // Top couriers by deliveries in the period, with average delivery time.
            Order.aggregate([
                { $match: { branch: branchObjectId, status: "delivered", courier: { $ne: null }, createdAt: { $gte: start, $lt: now } } },
                { $group: { _id: "$courier", deliveries: { $sum: 1 }, avgMs: { $avg: { $cond: [{ $and: [nn("$assignedAt"), nn("$deliveredAt")] }, { $subtract: ["$deliveredAt", "$assignedAt"] }, null] } } } },
                { $sort: { deliveries: -1 } },
                { $limit: 5 },
                { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "courier" } },
                { $unwind: "$courier" },
                { $project: { _id: 0, deliveries: 1, avgMs: 1, courier: { _id: "$courier._id", fullName: "$courier.fullName", image: "$courier.image" } } },
            ]),
            // Revenue + quantity per menu category.
            Order.aggregate([
                { $match: { branch: branchObjectId, status: "delivered", createdAt: { $gte: start, $lt: now } } },
                { $unwind: "$items" },
                { $lookup: { from: "menus", localField: "items.menuItem", foreignField: "_id", as: "m" } },
                { $unwind: "$m" },
                { $group: { _id: "$m.category", revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }, quantity: { $sum: "$items.quantity" } } },
            ]),
            // Orders per hour across the whole period (peak hours).
            Order.aggregate([
                { $match: { branch: branchObjectId, createdAt: { $gte: start, $lt: now } } },
                { $group: { _id: { $hour: { date: "$createdAt", timezone: TZ } }, count: { $sum: 1 } } },
            ]),
        ]);

        const toMin = (ms) => (ms != null ? Math.round(ms / 60000) : null);
        const t0 = timingsAgg[0] || {};
        const timings = { accept: toMin(t0.accept), delivery: toMin(t0.delivery), fulfillment: toMin(t0.fulfillment) };
        const courierPerformance = courierPerfAgg.map((c) => ({ courier: c.courier, deliveries: c.deliveries, avgMinutes: toMin(c.avgMs) }));
        const salesByCategory = categoryAgg.map((c) => ({ category: c._id, revenue: c.revenue, quantity: c.quantity }));
        const peakHoursPeriod = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }));
        hourlyAgg.forEach((p) => { if (p._id >= 0 && p._id < 24) peakHoursPeriod[p._id].count = p.count; });

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
                trendSeries,
                peakHours,
                peakHoursPeriod,
                timings,
                courierPerformance,
                salesByCategory,
                paymentSplit,
                cancellationRate,
                topItems,
            },
        });
    } catch (error) {
        console.error("Error fetching branch stats:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};
