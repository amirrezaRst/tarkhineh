const mongoose = require('mongoose');
const Order = require('../models/OrderModel');
const User = require('../models/UserModel');

const TZ = "Asia/Tehran";
const ACTIVE = ["preparing", "on_the_way"];

const todayStart = () => { const s = new Date(); s.setHours(0, 0, 0, 0); return s; };
const monthStart = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); };
const toMin = (ms) => (ms != null ? Math.round(ms / 60000) : null);

// Average delivery duration (assigned -> delivered) for one courier over a match.
async function avgDeliveryMs(match) {
    const agg = await Order.aggregate([
        { $match: { ...match, assignedAt: { $ne: null }, deliveredAt: { $ne: null } } },
        { $group: { _id: null, avgMs: { $avg: { $subtract: ["$deliveredAt", "$assignedAt"] } } } },
    ]);
    return agg[0]?.avgMs ?? null;
}

// The active deliveries assigned to a courier: orders still being prepared at the
// branch (awaiting pickup) and orders already picked up (en route). pickupCode is
// deliberately excluded — the courier must obtain it from the customer.
// on_the_way orders surface first (the immediate task), then the ones to pick up.
async function activeDeliveries(courierId) {
    const list = await Order.find({ courier: courierId, status: { $in: ACTIVE } })
        .populate("user", "fullName phoneNumber")
        .populate("items.menuItem", "name")
        .select("user items finalPrice deliveryFee deliveryType status assignedAt deliveryAddress createdAt")
        .lean();
    const stageRank = { on_the_way: 0, preparing: 1 };
    return list.sort(
        (a, b) => (stageRank[a.status] - stageRank[b.status]) ||
            (new Date(a.assignedAt || a.createdAt) - new Date(b.assignedAt || b.createdAt))
    );
}

exports.getDashboard = async (req, res) => {
    try {
        const courierId = req.user.id;
        const oid = new mongoose.Types.ObjectId(courierId);
        const ts = todayStart();

        const [deliveredToday, active, avgMs, feesAgg, deliveries, me] = await Promise.all([
            Order.countDocuments({ courier: courierId, status: "delivered", deliveredAt: { $gte: ts } }),
            Order.countDocuments({ courier: courierId, status: { $in: ACTIVE } }),
            avgDeliveryMs({ courier: oid, status: "delivered", deliveredAt: { $gte: ts } }),
            Order.aggregate([
                { $match: { courier: oid, status: "delivered", deliveredAt: { $gte: ts } } },
                { $group: { _id: null, fees: { $sum: "$deliveryFee" } } },
            ]),
            activeDeliveries(courierId),
            User.findById(courierId).select("courierStatus"),
        ]);

        res.status(200).json({
            status: 200,
            message: "Courier dashboard fetched",
            data: {
                courierStatus: me?.courierStatus || "available",
                stats: { deliveredToday, active, avgMinutes: toMin(avgMs), feesToday: feesAgg[0]?.fees || 0 },
                activeDeliveries: deliveries,
            },
        });
    } catch (error) {
        console.error("Courier dashboard error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.getActiveDeliveries = async (req, res) => {
    try {
        const deliveries = await activeDeliveries(req.user.id);
        res.status(200).json({ status: 200, message: "Active deliveries fetched", data: { deliveries } });
    } catch (error) {
        console.error("Courier deliveries error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const courierId = req.user.id;
        const oid = new mongoose.Types.ObjectId(courierId);
        const range = req.query.range || "week";

        let windowStart = null;
        if (range === "today") windowStart = todayStart();
        else if (range === "week") { windowStart = todayStart(); windowStart.setDate(windowStart.getDate() - 6); }
        else if (range === "month") windowStart = monthStart();

        const listQuery = { courier: courierId, status: "delivered" };
        if (windowStart) listQuery.deliveredAt = { $gte: windowStart };

        const [orders, total, thisMonth, feesAgg, avgMs] = await Promise.all([
            Order.find(listQuery).populate("user", "fullName phoneNumber").select("user finalPrice deliveryFee assignedAt deliveredAt deliveryType").sort({ deliveredAt: -1 }).limit(100),
            Order.countDocuments({ courier: courierId, status: "delivered" }),
            Order.countDocuments({ courier: courierId, status: "delivered", deliveredAt: { $gte: monthStart() } }),
            Order.aggregate([{ $match: { courier: oid, status: "delivered" } }, { $group: { _id: null, fees: { $sum: "$deliveryFee" } } }]),
            avgDeliveryMs({ courier: oid, status: "delivered" }),
        ]);

        res.status(200).json({
            status: 200,
            message: "Courier history fetched",
            data: { orders, summary: { total, thisMonth, totalFees: feesAgg[0]?.fees || 0, avgMinutes: toMin(avgMs) } },
        });
    } catch (error) {
        console.error("Courier history error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const courierId = req.user.id;
        const oid = new mongoose.Types.ObjectId(courierId);
        const weekStart = todayStart(); weekStart.setDate(weekStart.getDate() - 6);

        const [profile, total, weekTotal, avgMs, weekAgg] = await Promise.all([
            User.findById(courierId).select("fullName phoneNumber image vehicleType plateNumber nationalCode courierStatus branch createdAt"),
            Order.countDocuments({ courier: courierId, status: "delivered" }),
            Order.countDocuments({ courier: courierId, status: "delivered", deliveredAt: { $gte: weekStart } }),
            avgDeliveryMs({ courier: oid, status: "delivered" }),
            Order.aggregate([
                { $match: { courier: oid, status: "delivered", deliveredAt: { $gte: weekStart } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$deliveredAt", timezone: TZ } }, count: { $sum: 1 } } },
            ]),
        ]);

        const seriesMap = Object.fromEntries(weekAgg.map((d) => [d._id, d.count]));
        const weekly = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart); d.setDate(d.getDate() + i);
            const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
            weekly.push({ date: key, count: seriesMap[key] || 0 });
        }

        res.status(200).json({
            status: 200,
            message: "Courier profile fetched",
            data: { profile, performance: { total, weekTotal, avgMinutes: toMin(avgMs), weekly } },
        });
    } catch (error) {
        console.error("Courier profile error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.setAvailability = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["available", "offline"].includes(status)) {
            return res.status(400).json({ status: 400, message: "وضعیت نامعتبر است." });
        }
        const user = await User.findByIdAndUpdate(req.user.id, { courierStatus: status }, { new: true }).select("courierStatus");
        res.status(200).json({ status: 200, message: "وضعیت فعالیت به‌روزرسانی شد.", data: { courierStatus: user.courierStatus } });
    } catch (error) {
        console.error("Courier availability error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// Complete a delivery by verifying the customer's pickup code. The code lives on
// the order server-side and is never sent to the courier; only a correct match
// flips the order to delivered.
exports.completeDelivery = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { code } = req.body;

        const order = await Order.findOne({ _id: orderId, courier: req.user.id });
        if (!order) return res.status(404).json({ status: 404, message: "سفارش یافت نشد یا به شما تخصیص داده نشده است." });
        if (order.status !== "on_the_way") return res.status(400).json({ status: 400, message: "این سفارش در وضعیت قابل تحویل نیست." });
        if (!code || String(order.pickupCode) !== String(code).trim()) {
            return res.status(400).json({ status: 400, message: "کد تحویل نادرست است." });
        }

        order.status = "delivered";
        order.deliveredAt = new Date();
        await order.save();

        res.status(200).json({ status: 200, message: "تحویل با موفقیت ثبت شد.", data: { orderId: order._id } });
    } catch (error) {
        console.error("Courier complete delivery error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// The courier picks the order up from the branch and starts the route:
// preparing -> on_the_way. Only the assigned courier may do this, and only from
// preparing (the manager approves/prepares; the courier controls dispatch).
exports.markPickedUp = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId, courier: req.user.id });
        if (!order) return res.status(404).json({ status: 404, message: "سفارش یافت نشد یا به شما تخصیص داده نشده است." });
        if (order.status !== "preparing") {
            return res.status(400).json({ status: 400, message: "این سفارش در وضعیت قابل تحویل‌گرفتن نیست." });
        }
        order.status = "on_the_way";
        await order.save();
        res.status(200).json({ status: 200, message: "سفارش تحویل گرفته شد؛ در مسیر هستید.", data: { orderId: order._id } });
    } catch (error) {
        console.error("Courier pickup error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// Courier earnings: delivery-fee totals over the requested range plus a
// per-delivery breakdown. Earnings are proxied by the deliveryFee of the
// courier's delivered orders.
exports.getEarnings = async (req, res) => {
    try {
        const courierId = req.user.id;
        const oid = new mongoose.Types.ObjectId(courierId);
        const range = req.query.range || "week";

        const weekStart = todayStart(); weekStart.setDate(weekStart.getDate() - 6);
        let windowStart = null;
        if (range === "today") windowStart = todayStart();
        else if (range === "week") windowStart = weekStart;
        else if (range === "month") windowStart = monthStart();

        const sumFees = (match) =>
            Order.aggregate([
                { $match: { courier: oid, status: "delivered", ...match } },
                { $group: { _id: null, fees: { $sum: "$deliveryFee" }, count: { $sum: 1 } } },
            ]);

        const listMatch = { courier: courierId, status: "delivered" };
        if (windowStart) listMatch.deliveredAt = { $gte: windowStart };

        const [todayAgg, weekAgg, monthAgg, allAgg, orders, dailyAgg] = await Promise.all([
            sumFees({ deliveredAt: { $gte: todayStart() } }),
            sumFees({ deliveredAt: { $gte: weekStart } }),
            sumFees({ deliveredAt: { $gte: monthStart() } }),
            sumFees({}),
            Order.find(listMatch)
                .populate("user", "fullName phoneNumber")
                .select("user finalPrice deliveryFee deliveredAt deliveryType")
                .sort({ deliveredAt: -1 }).limit(100).lean(),
            Order.aggregate([
                { $match: { courier: oid, status: "delivered", deliveredAt: { $gte: weekStart } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$deliveredAt", timezone: TZ } }, fees: { $sum: "$deliveryFee" }, count: { $sum: 1 } } },
            ]),
        ]);

        const dailyMap = Object.fromEntries(dailyAgg.map((d) => [d._id, d]));
        const daily = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart); d.setDate(d.getDate() + i);
            const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
            daily.push({ date: key, fees: dailyMap[key]?.fees || 0, count: dailyMap[key]?.count || 0 });
        }

        res.status(200).json({
            status: 200,
            message: "Courier earnings fetched",
            data: {
                totals: {
                    today: { fees: todayAgg[0]?.fees || 0, count: todayAgg[0]?.count || 0 },
                    week: { fees: weekAgg[0]?.fees || 0, count: weekAgg[0]?.count || 0 },
                    month: { fees: monthAgg[0]?.fees || 0, count: monthAgg[0]?.count || 0 },
                    all: { fees: allAgg[0]?.fees || 0, count: allAgg[0]?.count || 0 },
                },
                daily,
                orders,
            },
        });
    } catch (error) {
        console.error("Courier earnings error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};
