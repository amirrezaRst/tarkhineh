const mongoose = require('mongoose');
const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Branch = require('../models/BranchModel');
const Review = require('../models/ReviewModel');
const Coupon = require('../models/CouponModel');
const Discount = require('../models/DiscountModel');
const Menu = require('../models/MenuModel');
const { ROLES } = require('../config/roles');

const TZ = "Asia/Tehran";
const ACTIVE = ["pending", "preparing", "on_the_way"];

const todayStart = () => { const s = new Date(); s.setHours(0, 0, 0, 0); return s; };
const monthStart = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); };
const daysAgoStart = (n) => { const s = todayStart(); s.setDate(s.getDate() - n); return s; };
const oid = (id) => new mongoose.Types.ObjectId(id);

// Is a branch currently open, given "HH:MM" hours (Asia/Tehran)? null if unset.
function branchOpen(openTime, closeTime) {
    if (!openTime || !closeTime) return null;
    const now = new Date().toLocaleTimeString("en-GB", { timeZone: TZ, hour12: false, hour: "2-digit", minute: "2-digit" });
    const mins = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
    const o = mins(openTime), c = mins(closeTime), n = mins(now);
    return c > o ? (n >= o && n < c) : (n >= o || n < c); // handle overnight
}

// ----------------------------------------------------------------------------
// DASHBOARD — cross-branch overview
// ----------------------------------------------------------------------------
exports.getOverview = async (req, res) => {
    try {
        const ts = todayStart();
        const ms = monthStart();
        const seriesStart = daysAgoStart(13); // 14 calendar days incl. today

        const [
            branches, todayAgg, monthAgg, statusAgg, seriesAgg,
            perBranchAgg, courierCountAgg, ratingAgg,
            totalUsers, newUsersMonth, couriersTotal, couriersOnline,
        ] = await Promise.all([
            Branch.find().populate("manager", "fullName phoneNumber").lean(),
            Order.aggregate([
                { $match: { status: "delivered", createdAt: { $gte: ts } } },
                { $group: { _id: null, revenue: { $sum: "$finalPrice" }, orders: { $sum: 1 } } },
            ]),
            Order.aggregate([
                { $match: { status: "delivered", createdAt: { $gte: ms } } },
                { $group: { _id: null, revenue: { $sum: "$finalPrice" }, orders: { $sum: 1 } } },
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: ts } } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: seriesStart } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TZ } }, revenue: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, "$finalPrice", 0] } } } },
            ]),
            // per-branch delivered revenue + orders, this month
            Order.aggregate([
                { $match: { status: "delivered", createdAt: { $gte: ms }, branch: { $ne: null } } },
                { $group: { _id: "$branch", revenue: { $sum: "$finalPrice" }, orders: { $sum: 1 } } },
            ]),
            User.aggregate([
                { $match: { role: ROLES.COURIER, branch: { $ne: null } } },
                { $group: { _id: "$branch", count: { $sum: 1 } } },
            ]),
            Review.aggregate([
                { $match: { branch: { $ne: null } } },
                { $group: { _id: "$branch", avg: { $avg: "$rating" } } },
            ]),
            User.countDocuments({}),
            User.countDocuments({ createdAt: { $gte: ms } }),
            User.countDocuments({ role: ROLES.COURIER }),
            User.countDocuments({ role: ROLES.COURIER, courierStatus: "available" }),
        ]);

        const revMap = Object.fromEntries(perBranchAgg.map((b) => [String(b._id), b]));
        const courierMap = Object.fromEntries(courierCountAgg.map((b) => [String(b._id), b.count]));
        const ratingMap = Object.fromEntries(ratingAgg.map((b) => [String(b._id), b.avg]));

        const leaderboard = branches.map((b) => {
            const r = revMap[String(b._id)] || { revenue: 0, orders: 0 };
            return {
                _id: b._id,
                name: b.name,
                manager: b.manager ? { fullName: b.manager.fullName, phoneNumber: b.manager.phoneNumber } : null,
                revenue: r.revenue,
                orders: r.orders,
                couriers: courierMap[String(b._id)] || 0,
                avgRating: ratingMap[String(b._id)] != null ? Number(ratingMap[String(b._id)].toFixed(1)) : null,
            };
        }).sort((a, b) => b.revenue - a.revenue);

        const monthRevenue = monthAgg[0]?.revenue || 0;
        const branchShare = leaderboard
            .filter((b) => b.revenue > 0)
            .map((b) => ({ name: b.name, revenue: b.revenue, share: monthRevenue ? Math.round((b.revenue / monthRevenue) * 100) : 0 }));

        const statusToday = { pending: 0, preparing: 0, on_the_way: 0, delivered: 0, cancelled: 0 };
        statusAgg.forEach((s) => { if (statusToday[s._id] != null) statusToday[s._id] = s.count; });

        // fill 14-day revenue series
        const seriesMap = Object.fromEntries(seriesAgg.map((d) => [d._id, d.revenue]));
        const revenueSeries = [];
        for (let i = 13; i >= 0; i--) {
            const d = daysAgoStart(i);
            const key = d.toLocaleDateString("en-CA", { timeZone: TZ });
            const label = d.toLocaleDateString("fa-IR", { day: "numeric", month: "short" });
            revenueSeries.push({ label, value: seriesMap[key] || 0 });
        }

        const ratingOverall = await Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]);

        res.status(200).json({
            status: 200,
            message: "Admin overview fetched",
            data: {
                stats: {
                    revenueToday: todayAgg[0]?.revenue || 0,
                    ordersToday: todayAgg[0]?.orders || 0,
                    revenueMonth: monthRevenue,
                    ordersMonth: monthAgg[0]?.orders || 0,
                    totalBranches: branches.length,
                    openBranches: branches.length,
                    couriersTotal, couriersOnline,
                    totalUsers, newUsersMonth,
                    avgRating: ratingOverall[0]?.avg != null ? Number(ratingOverall[0].avg.toFixed(1)) : null,
                },
                statusToday,
                revenueSeries,
                branchShare,
                leaderboard,
            },
        });
    } catch (error) {
        console.error("Admin overview error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// ----------------------------------------------------------------------------
// BRANCHES — list with stats + CRUD + assign manager
// ----------------------------------------------------------------------------
exports.getBranches = async (req, res) => {
    try {
        const ms = monthStart();
        const [branches, perBranchAgg, courierCountAgg, ratingAgg] = await Promise.all([
            Branch.find().populate("manager", "fullName phoneNumber image").lean(),
            Order.aggregate([
                { $match: { status: "delivered", createdAt: { $gte: ms }, branch: { $ne: null } } },
                { $group: { _id: "$branch", revenue: { $sum: "$finalPrice" }, orders: { $sum: 1 } } },
            ]),
            User.aggregate([
                { $match: { role: ROLES.COURIER, branch: { $ne: null } } },
                { $group: { _id: "$branch", count: { $sum: 1 } } },
            ]),
            Review.aggregate([
                { $match: { branch: { $ne: null } } },
                { $group: { _id: "$branch", avg: { $avg: "$rating" } } },
            ]),
        ]);
        const revMap = Object.fromEntries(perBranchAgg.map((b) => [String(b._id), b]));
        const courierMap = Object.fromEntries(courierCountAgg.map((b) => [String(b._id), b.count]));
        const ratingMap = Object.fromEntries(ratingAgg.map((b) => [String(b._id), b.avg]));

        const data = branches.map((b) => {
            const r = revMap[String(b._id)] || { revenue: 0, orders: 0 };
            return {
                _id: b._id,
                name: b.name,
                courierCapacity: b.courierCapacity ?? 3,
                manager: b.manager || null,
                revenue: r.revenue,
                orders: r.orders,
                couriers: courierMap[String(b._id)] || 0,
                avgRating: ratingMap[String(b._id)] != null ? Number(ratingMap[String(b._id)].toFixed(1)) : null,
            };
        }).sort((a, b) => b.revenue - a.revenue);

        res.status(200).json({ status: 200, message: "Branches fetched", data: { branches: data } });
    } catch (error) {
        console.error("Admin branches error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.getBranchDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findById(id).populate("manager", "fullName phoneNumber image").lean();
        if (!branch) return res.status(404).json({ status: 404, message: "شعبه یافت نشد." });
        const bid = oid(id);
        const ms = monthStart(), sevenStart = daysAgoStart(6);

        const [monthAgg, statusAgg, couriers, recentOrders, ratingAgg, seriesAgg] = await Promise.all([
            Order.aggregate([{ $match: { branch: bid, status: "delivered", createdAt: { $gte: ms } } }, { $group: { _id: null, revenue: { $sum: "$finalPrice" }, orders: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { branch: bid, createdAt: { $gte: todayStart() } } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
            User.find({ role: ROLES.COURIER, branch: id }).select("fullName phoneNumber courierStatus image vehicleType").lean(),
            Order.find({ branch: id }).populate("user", "fullName phoneNumber").select("user status finalPrice createdAt").sort({ createdAt: -1 }).limit(8).lean(),
            Review.aggregate([{ $match: { branch: bid } }, { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { branch: bid, createdAt: { $gte: sevenStart } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TZ } }, revenue: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, "$finalPrice", 0] } } } }]),
        ]);

        const statusToday = { pending: 0, preparing: 0, on_the_way: 0, delivered: 0, cancelled: 0 };
        statusAgg.forEach((s) => { if (statusToday[s._id] != null) statusToday[s._id] = s.count; });
        const seriesMap = Object.fromEntries(seriesAgg.map((d) => [d._id, d.revenue]));
        const revenueSeries = [];
        for (let i = 6; i >= 0; i--) {
            const d = daysAgoStart(i);
            revenueSeries.push({ label: d.toLocaleDateString("fa-IR", { weekday: "short" }), value: seriesMap[d.toLocaleDateString("en-CA", { timeZone: TZ })] || 0 });
        }

        res.status(200).json({
            status: 200, message: "Branch detail fetched",
            data: {
                branch: { ...branch, courierCapacity: branch.courierCapacity ?? 3, isOpen: branchOpen(branch.openTime, branch.closeTime) },
                stats: {
                    revenueMonth: monthAgg[0]?.revenue || 0, ordersMonth: monthAgg[0]?.orders || 0,
                    avgRating: ratingAgg[0]?.avg != null ? Number(ratingAgg[0].avg.toFixed(1)) : null,
                    reviews: ratingAgg[0]?.count || 0, couriers: couriers.length, menuCount: (branch.menus || []).length,
                },
                statusToday, couriers, recentOrders, revenueSeries,
            },
        });
    } catch (error) {
        console.error("Admin branch detail error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// Promote a user to this branch's manager and keep both sides consistent.
async function linkManager(userId, branchId) {
    await User.findByIdAndUpdate(userId, { role: ROLES.BRANCH_MANAGER, branch: branchId });
}

exports.createBranch = async (req, res) => {
    try {
        const { name, managerId, courierCapacity, address, phoneNumber, openTime, closeTime } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ status: 400, message: "نام شعبه الزامی است." });
        const manager = await User.findById(managerId).select("_id");
        if (!manager) return res.status(400).json({ status: 400, message: "مدیر انتخاب‌شده معتبر نیست." });

        const branch = await Branch.create({
            name: name.trim(),
            manager: managerId,
            courierCapacity: courierCapacity || 3,
            address: address || null, phoneNumber: phoneNumber || null,
            openTime: openTime || null, closeTime: closeTime || null,
        });
        await linkManager(managerId, branch._id);

        res.status(201).json({ status: 201, message: "شعبه با موفقیت ایجاد شد.", data: { branch } });
    } catch (error) {
        console.error("Admin create branch error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, managerId, courierCapacity } = req.body;
        const branch = await Branch.findById(id);
        if (!branch) return res.status(404).json({ status: 404, message: "شعبه یافت نشد." });

        if (name && name.trim()) branch.name = name.trim();
        if (courierCapacity != null) branch.courierCapacity = courierCapacity;
        ["address", "phoneNumber", "openTime", "closeTime"].forEach((k) => {
            if (req.body[k] !== undefined) branch[k] = req.body[k] || null;
        });
        if (managerId && String(managerId) !== String(branch.manager)) {
            const manager = await User.findById(managerId).select("_id");
            if (!manager) return res.status(400).json({ status: 400, message: "مدیر انتخاب‌شده معتبر نیست." });
            branch.manager = managerId;
            await linkManager(managerId, branch._id);
        }
        await branch.save();
        res.status(200).json({ status: 200, message: "شعبه به‌روزرسانی شد.", data: { branch } });
    } catch (error) {
        console.error("Admin update branch error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.assignManager = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const branch = await Branch.findById(id);
        if (!branch) return res.status(404).json({ status: 404, message: "شعبه یافت نشد." });
        const user = await User.findById(userId).select("_id");
        if (!user) return res.status(400).json({ status: 400, message: "کاربر انتخاب‌شده معتبر نیست." });

        branch.manager = userId;
        await branch.save();
        await linkManager(userId, branch._id);
        res.status(200).json({ status: 200, message: "مدیر شعبه منتسب شد." });
    } catch (error) {
        console.error("Admin assign manager error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findById(id);
        if (!branch) return res.status(404).json({ status: 404, message: "شعبه یافت نشد." });

        const activeOrders = await Order.countDocuments({ branch: id, status: { $in: ACTIVE } });
        if (activeOrders > 0) {
            return res.status(400).json({ status: 400, message: `این شعبه ${activeOrders} سفارش فعال دارد و قابل حذف نیست.` });
        }
        await Branch.findByIdAndDelete(id);
        res.status(200).json({ status: 200, message: "شعبه حذف شد." });
    } catch (error) {
        console.error("Admin delete branch error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// ----------------------------------------------------------------------------
// USERS — list/search/filter + role management + delete
// ----------------------------------------------------------------------------
exports.getUsers = async (req, res) => {
    try {
        const { role, q } = req.query;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);

        const filter = {};
        if (role && role !== "all") filter.role = role;
        if (q && q.trim()) {
            const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [{ fullName: rx }, { phoneNumber: rx }];
        }

        const [users, total, roleAgg] = await Promise.all([
            User.find(filter).select("fullName phoneNumber role branch image courierStatus createdAt")
                .populate("branch", "name").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            User.countDocuments(filter),
            User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
        ]);

        const roleCounts = { all: 0, admin: 0, branch_manager: 0, courier: 0, user: 0 };
        roleAgg.forEach((r) => { if (roleCounts[r._id] != null) roleCounts[r._id] = r.count; roleCounts.all += r.count; });

        res.status(200).json({
            status: 200,
            message: "Users fetched",
            data: { users, total, page, pages: Math.ceil(total / limit), roleCounts },
        });
    } catch (error) {
        console.error("Admin users error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, branch } = req.body;
        if (!Object.values(ROLES).includes(role)) {
            return res.status(400).json({ status: 400, message: "نقش نامعتبر است." });
        }
        if (String(id) === String(req.user.id)) {
            return res.status(400).json({ status: 400, message: "نمی‌توانید نقش خودتان را تغییر دهید." });
        }
        const user = await User.findById(id).select("role branch");
        if (!user) return res.status(404).json({ status: 404, message: "کاربر یافت نشد." });

        // Guard: a user who currently manages a branch can't be demoted until reassigned.
        if (user.role === ROLES.BRANCH_MANAGER && role !== ROLES.BRANCH_MANAGER) {
            const managed = await Branch.findOne({ manager: id }).select("name");
            if (managed) {
                return res.status(400).json({ status: 400, message: `این کاربر مدیر شعبهٔ «${managed.name}» است؛ ابتدا مدیر دیگری برای آن شعبه منتسب کنید.` });
            }
        }

        if (role === ROLES.BRANCH_MANAGER || role === ROLES.COURIER) {
            if (!branch) return res.status(400).json({ status: 400, message: "برای این نقش انتخاب شعبه الزامی است." });
            const b = await Branch.findById(branch).select("_id");
            if (!b) return res.status(400).json({ status: 400, message: "شعبهٔ انتخاب‌شده معتبر نیست." });
            user.branch = branch;
        } else {
            user.branch = null;
        }
        user.role = role;
        await user.save();
        res.status(200).json({ status: 200, message: "نقش کاربر به‌روزرسانی شد." });
    } catch (error) {
        console.error("Admin update role error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (String(id) === String(req.user.id)) {
            return res.status(400).json({ status: 400, message: "نمی‌توانید حساب خودتان را حذف کنید." });
        }
        const user = await User.findById(id).select("role");
        if (!user) return res.status(404).json({ status: 404, message: "کاربر یافت نشد." });

        if (user.role === ROLES.BRANCH_MANAGER) {
            const managed = await Branch.findOne({ manager: id }).select("name");
            if (managed) return res.status(400).json({ status: 400, message: `این کاربر مدیر شعبهٔ «${managed.name}» است؛ ابتدا مدیر دیگری منتسب کنید.` });
        }
        if (user.role === ROLES.COURIER) {
            const active = await Order.countDocuments({ courier: id, status: { $in: ["preparing", "on_the_way"] } });
            if (active > 0) return res.status(400).json({ status: 400, message: `این پیک ${active} تحویل فعال دارد و قابل حذف نیست.` });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ status: 200, message: "کاربر حذف شد." });
    } catch (error) {
        console.error("Admin delete user error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// Candidate users for manager assignment (users + existing managers, searchable).
exports.getAssignableUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const filter = { role: { $in: [ROLES.USER, ROLES.BRANCH_MANAGER] } };
        if (q && q.trim()) {
            const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [{ fullName: rx }, { phoneNumber: rx }];
        }
        const users = await User.find(filter).select("fullName phoneNumber role").limit(20).lean();
        res.status(200).json({ status: 200, message: "Assignable users fetched", data: { users } });
    } catch (error) {
        console.error("Admin assignable users error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// ----------------------------------------------------------------------------
// OPERATIONS — global orders + couriers
// ----------------------------------------------------------------------------
exports.getOrders = async (req, res) => {
    try {
        const { branch, status, q } = req.query;
        const range = req.query.range || "week";
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);

        const base = {};
        if (branch && branch !== "all") base.branch = branch;
        const ws = range === "today" ? todayStart() : range === "week" ? daysAgoStart(6) : range === "month" ? monthStart() : null;
        if (ws) base.createdAt = { $gte: ws };
        if (q && q.trim()) {
            const term = q.trim();
            const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            const users = await User.find({ $or: [{ fullName: rx }, { phoneNumber: rx }] }).select("_id").limit(50);
            base.$or = [
                { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: term, options: "i" } } },
                { user: { $in: users.map((u) => u._id) } },
            ];
        }
        const query = { ...base };
        if (status && status !== "all") query.status = status;

        const aggMatch = { ...base };
        if (aggMatch.branch) aggMatch.branch = oid(aggMatch.branch);

        const [orders, total, countsAgg] = await Promise.all([
            Order.find(query)
                .populate("user", "fullName phoneNumber")
                .populate("branch", "name")
                .populate("courier", "fullName phoneNumber")
                .populate("items.menuItem", "name")
                .select("user branch courier status finalPrice deliveryFee deliveryType paymentStatus paymentMethod refundStatus deliveryAddress items createdAt deliveredAt")
                .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Order.countDocuments(query),
            Order.aggregate([{ $match: aggMatch }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
        ]);

        const counts = { all: 0, pending: 0, preparing: 0, on_the_way: 0, delivered: 0, cancelled: 0 };
        countsAgg.forEach((c) => { if (c._id in counts) counts[c._id] = c.count; counts.all += c.count; });

        res.status(200).json({
            status: 200, message: "Orders fetched",
            data: { orders, total, page, pages: Math.ceil(total / limit), counts },
        });
    } catch (error) {
        console.error("Admin orders error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select("status paymentStatus refundStatus");
        if (!order) return res.status(404).json({ status: 404, message: "سفارش یافت نشد." });
        if (order.status === "delivered") return res.status(400).json({ status: 400, message: "سفارش تحویل‌شده قابل لغو نیست." });
        if (order.status === "cancelled") return res.status(400).json({ status: 400, message: "این سفارش قبلاً لغو شده است." });
        order.status = "cancelled";
        let refunded = false;
        if (order.paymentStatus === "paid") { order.refundStatus = "requested"; refunded = true; }
        await order.save();
        res.status(200).json({ status: 200, message: refunded ? "سفارش لغو و درخواست بازپرداخت ثبت شد." : "سفارش لغو شد." });
    } catch (error) {
        console.error("Admin cancel order error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.getCouriers = async (req, res) => {
    try {
        const couriers = await User.find({ role: ROLES.COURIER })
            .populate("branch", "name").select("fullName phoneNumber image vehicleType plateNumber courierStatus branch createdAt").lean();
        const ids = couriers.map((c) => c._id);
        const ts = todayStart();

        const [activeAgg, todayAgg, totalAgg] = await Promise.all([
            Order.aggregate([{ $match: { courier: { $in: ids }, status: { $in: ["preparing", "on_the_way"] } } }, { $group: { _id: "$courier", c: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { courier: { $in: ids }, status: "delivered", deliveredAt: { $gte: ts } } }, { $group: { _id: "$courier", c: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { courier: { $in: ids }, status: "delivered" } }, { $group: { _id: "$courier", c: { $sum: 1 } } }]),
        ]);
        const m = (agg) => Object.fromEntries(agg.map((x) => [String(x._id), x.c]));
        const [act, tod, tot] = [m(activeAgg), m(todayAgg), m(totalAgg)];

        const data = couriers.map((c) => ({
            ...c,
            active: act[String(c._id)] || 0,
            deliveredToday: tod[String(c._id)] || 0,
            totalDeliveries: tot[String(c._id)] || 0,
        })).sort((a, b) => b.totalDeliveries - a.totalDeliveries);

        const online = data.filter((c) => c.courierStatus === "available").length;
        res.status(200).json({ status: 200, message: "Couriers fetched", data: { couriers: data, summary: { total: data.length, online, offline: data.length - online } } });
    } catch (error) {
        console.error("Admin couriers error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// ----------------------------------------------------------------------------
// FINANCE — revenue, payment split, refunds, per-branch settlement (order-based)
// ----------------------------------------------------------------------------
exports.getFinance = async (req, res) => {
    try {
        const period = req.query.period || "month";
        const start = period === "today" ? todayStart() : period === "week" ? daysAgoStart(6) : period === "all" ? null : monthStart();
        const dm = start ? { createdAt: { $gte: start } } : {};
        const sum1 = (agg) => ({ sum: agg[0]?.sum || 0, count: agg[0]?.count || 0 });

        const [grossAgg, paidAgg, unpaidAgg, methodAgg, perBranchAgg, refundAgg, branches, txns] = await Promise.all([
            Order.aggregate([{ $match: { status: "delivered", ...dm } }, { $group: { _id: null, sum: { $sum: "$finalPrice" }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { paymentStatus: "paid", ...dm } }, { $group: { _id: null, sum: { $sum: "$finalPrice" }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { paymentStatus: "unpaid", ...dm } }, { $group: { _id: null, sum: { $sum: "$finalPrice" }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { paymentStatus: "paid", ...dm } }, { $group: { _id: "$paymentMethod", sum: { $sum: "$finalPrice" }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { status: "delivered", branch: { $ne: null }, ...dm } }, { $group: { _id: "$branch", sum: { $sum: "$finalPrice" }, count: { $sum: 1 } } }]),
            Order.aggregate([{ $match: { refundStatus: { $in: ["requested", "processed"] }, ...dm } }, { $group: { _id: "$refundStatus", sum: { $sum: "$finalPrice" }, count: { $sum: 1 } } }]),
            Branch.find().select("name").lean(),
            Order.find({ ...dm }).populate("user", "fullName phoneNumber").populate("branch", "name")
                .select("user branch finalPrice paymentStatus paymentMethod refundStatus status createdAt").sort({ createdAt: -1 }).limit(50).lean(),
        ]);

        const methodSplit = { online: { sum: 0, count: 0 }, cash: { sum: 0, count: 0 } };
        methodAgg.forEach((m) => { if (methodSplit[m._id]) methodSplit[m._id] = { sum: m.sum, count: m.count }; });
        const refunds = { requested: { sum: 0, count: 0 }, processed: { sum: 0, count: 0 } };
        refundAgg.forEach((r) => { if (refunds[r._id]) refunds[r._id] = { sum: r.sum, count: r.count }; });

        const nameMap = Object.fromEntries(branches.map((b) => [String(b._id), b.name]));
        const perBranch = perBranchAgg.map((b) => ({ name: nameMap[String(b._id)] || "—", sum: b.sum, count: b.count })).sort((a, b) => b.sum - a.sum);

        res.status(200).json({
            status: 200, message: "Finance fetched",
            data: {
                summary: { gross: sum1(grossAgg), paid: sum1(paidAgg), unpaid: sum1(unpaidAgg) },
                methodSplit, perBranch, refunds, transactions: txns,
            },
        });
    } catch (error) {
        console.error("Admin finance error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.refundOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select("refundStatus");
        if (!order) return res.status(404).json({ status: 404, message: "سفارش یافت نشد." });
        if (order.refundStatus !== "requested") return res.status(400).json({ status: 400, message: "این سفارش درخواست بازپرداخت فعالی ندارد." });
        order.refundStatus = "processed";
        await order.save();
        res.status(200).json({ status: 200, message: "بازپرداخت انجام شد." });
    } catch (error) {
        console.error("Admin refund error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// ----------------------------------------------------------------------------
// PROMOTIONS — coupons + per-item discounts
// ----------------------------------------------------------------------------
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ validTo: -1 }).lean();
        res.status(200).json({ status: 200, message: "Coupons fetched", data: { coupons } });
    } catch (error) {
        console.error("Admin coupons error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, maxAmount, minAmount, usageLimit, validFrom, validTo, active } = req.body;
        if (!code || !code.trim()) return res.status(400).json({ status: 400, message: "کد کوپن الزامی است." });
        if (!["percentage", "flat"].includes(discountType)) return res.status(400).json({ status: 400, message: "نوع تخفیف نامعتبر است." });
        if (!discountValue || discountValue <= 0) return res.status(400).json({ status: 400, message: "مقدار تخفیف نامعتبر است." });
        if (!validFrom || !validTo) return res.status(400).json({ status: 400, message: "بازهٔ اعتبار الزامی است." });

        const exists = await Coupon.findOne({ code: code.trim() }).select("_id");
        if (exists) return res.status(400).json({ status: 400, message: "کوپنی با این کد وجود دارد." });

        const coupon = await Coupon.create({
            code: code.trim(), description, discountType, discountValue,
            maxAmount: maxAmount || undefined, minAmount: minAmount || undefined,
            usageLimit: usageLimit || 1, validFrom, validTo, active: active !== false,
        });
        res.status(201).json({ status: 201, message: "کوپن ایجاد شد.", data: { coupon } });
    } catch (error) {
        console.error("Admin create coupon error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const fields = (({ description, discountType, discountValue, maxAmount, minAmount, usageLimit, validFrom, validTo, active }) =>
            ({ description, discountType, discountValue, maxAmount, minAmount, usageLimit, validFrom, validTo, active }))(req.body);
        Object.keys(fields).forEach((k) => fields[k] === undefined && delete fields[k]);
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, fields, { new: true });
        if (!coupon) return res.status(404).json({ status: 404, message: "کوپن یافت نشد." });
        res.status(200).json({ status: 200, message: "کوپن به‌روزرسانی شد.", data: { coupon } });
    } catch (error) {
        console.error("Admin update coupon error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const c = await Coupon.findByIdAndDelete(req.params.id);
        if (!c) return res.status(404).json({ status: 404, message: "کوپن یافت نشد." });
        res.status(200).json({ status: 200, message: "کوپن حذف شد." });
    } catch (error) {
        console.error("Admin delete coupon error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.getDiscounts = async (req, res) => {
    try {
        const [discounts, menus] = await Promise.all([
            Discount.find().populate("menuItem", "name category").sort({ endDate: -1 }).lean(),
            Menu.find().select("name category").sort({ name: 1 }).lean(),
        ]);
        res.status(200).json({ status: 200, message: "Discounts fetched", data: { discounts, menus } });
    } catch (error) {
        console.error("Admin discounts error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.createDiscount = async (req, res) => {
    try {
        const { menuItem, discountType, discountValue, startDate, endDate, active } = req.body;
        if (!menuItem) return res.status(400).json({ status: 400, message: "آیتم منو الزامی است." });
        if (!["percentage", "flat"].includes(discountType)) return res.status(400).json({ status: 400, message: "نوع تخفیف نامعتبر است." });
        if (!discountValue || discountValue <= 0) return res.status(400).json({ status: 400, message: "مقدار تخفیف نامعتبر است." });
        if (!startDate || !endDate) return res.status(400).json({ status: 400, message: "بازهٔ زمانی الزامی است." });
        const discount = await Discount.create({ menuItem, discountType, discountValue, startDate, endDate, active: active !== false });
        res.status(201).json({ status: 201, message: "تخفیف ایجاد شد.", data: { discount } });
    } catch (error) {
        console.error("Admin create discount error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.updateDiscount = async (req, res) => {
    try {
        const { discountType, discountValue, startDate, endDate, active } = req.body;
        const fields = {};
        if (discountType !== undefined) {
            if (!["percentage", "flat"].includes(discountType)) return res.status(400).json({ status: 400, message: "نوع تخفیف نامعتبر است." });
            fields.discountType = discountType;
        }
        if (discountValue !== undefined) {
            if (!discountValue || discountValue <= 0) return res.status(400).json({ status: 400, message: "مقدار تخفیف نامعتبر است." });
            fields.discountValue = discountValue;
        }
        if (startDate !== undefined) fields.startDate = startDate;
        if (endDate !== undefined) fields.endDate = endDate;
        if (active !== undefined) fields.active = active;

        const discount = await Discount.findByIdAndUpdate(req.params.id, fields, { new: true });
        if (!discount) return res.status(404).json({ status: 404, message: "تخفیف یافت نشد." });
        res.status(200).json({ status: 200, message: "تخفیف به‌روزرسانی شد.", data: { discount } });
    } catch (error) {
        console.error("Admin update discount error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.deleteDiscount = async (req, res) => {
    try {
        const d = await Discount.findByIdAndDelete(req.params.id);
        if (!d) return res.status(404).json({ status: 404, message: "تخفیف یافت نشد." });
        res.status(200).json({ status: 200, message: "تخفیف حذف شد." });
    } catch (error) {
        console.error("Admin delete discount error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// ----------------------------------------------------------------------------
// REVIEWS — moderation
// ----------------------------------------------------------------------------
exports.getReviews = async (req, res) => {
    try {
        const { rating, status, branch } = req.query;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);
        const filter = {};
        if (rating && rating !== "all") filter.rating = Number(rating);
        if (status && status !== "all") filter.status = status;
        if (branch && branch !== "all") filter.branch = branch;

        const [reviews, total, distAgg, avgAgg, statusAgg, byBranchAgg, branches] = await Promise.all([
            Review.find(filter).populate("user", "fullName phoneNumber").populate("menuItem", "name").populate("branch", "name")
                .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Review.countDocuments(filter),
            Review.aggregate([{ $group: { _id: "$rating", count: { $sum: 1 } } }]),
            Review.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }]),
            Review.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Review.aggregate([{ $match: { branch: { $ne: null } } }, { $group: { _id: "$branch", avg: { $avg: "$rating" }, count: { $sum: 1 } } }]),
            Branch.find().select("name").lean(),
        ]);
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        distAgg.forEach((d) => { if (distribution[d._id] != null) distribution[d._id] = d.count; });
        const statusCounts = { all: 0, pending: 0, approved: 0, rejected: 0 };
        statusAgg.forEach((s) => { if (statusCounts[s._id] != null) statusCounts[s._id] = s.count; statusCounts.all += s.count; });
        const nameMap = Object.fromEntries(branches.map((b) => [String(b._id), b.name]));
        const byBranch = byBranchAgg
            .map((b) => ({ name: nameMap[String(b._id)] || "—", avg: Number(b.avg.toFixed(1)), count: b.count }))
            .sort((a, b) => b.avg - a.avg);

        res.status(200).json({
            status: 200, message: "Reviews fetched",
            data: {
                reviews, total, page, pages: Math.ceil(total / limit),
                distribution, statusCounts, byBranch,
                avg: avgAgg[0]?.avg != null ? Number(avgAgg[0].avg.toFixed(1)) : null,
                totalAll: avgAgg[0]?.count || 0,
            },
        });
    } catch (error) {
        console.error("Admin reviews error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ status: 400, message: "وضعیت نامعتبر است." });
        }
        const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!review) return res.status(404).json({ status: 404, message: "نظر یافت نشد." });
        const msg = status === "approved" ? "نظر تأیید و منتشر شد." : status === "rejected" ? "نظر رد شد." : "نظر به حالت در انتظار بازگشت.";
        res.status(200).json({ status: 200, message: msg });
    } catch (error) {
        console.error("Admin review status error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const r = await Review.findByIdAndDelete(req.params.id);
        if (!r) return res.status(404).json({ status: 404, message: "نظر یافت نشد." });
        res.status(200).json({ status: 200, message: "نظر حذف شد." });
    } catch (error) {
        console.error("Admin delete review error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

// ----------------------------------------------------------------------------
// REPORTS — cross-branch analytics
// ----------------------------------------------------------------------------
exports.getReports = async (req, res) => {
    try {
        const period = req.query.period || "month";
        const start = period === "today" ? todayStart() : period === "week" ? daysAgoStart(6) : monthStart();

        const [peakAgg, categoryAgg, topCouriers, revenueByBranchAgg, branches] = await Promise.all([
            Order.aggregate([
                { $match: { createdAt: { $gte: start } } },
                { $group: { _id: { $hour: { date: "$createdAt", timezone: TZ } }, count: { $sum: 1 } } },
            ]),
            Order.aggregate([
                { $match: { status: "delivered", createdAt: { $gte: start } } },
                { $unwind: "$items" },
                { $lookup: { from: "menus", localField: "items.menuItem", foreignField: "_id", as: "menu" } },
                { $unwind: "$menu" },
                { $group: { _id: "$menu.category", quantity: { $sum: "$items.quantity" } } },
            ]),
            Order.aggregate([
                { $match: { status: "delivered", createdAt: { $gte: start }, courier: { $ne: null } } },
                { $group: { _id: "$courier", deliveries: { $sum: 1 } } },
                { $sort: { deliveries: -1 } },
                { $limit: 5 },
                { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "u" } },
                { $unwind: "$u" },
                { $project: { deliveries: 1, fullName: "$u.fullName", phoneNumber: "$u.phoneNumber" } },
            ]),
            Order.aggregate([
                { $match: { status: "delivered", createdAt: { $gte: start }, branch: { $ne: null } } },
                { $group: { _id: "$branch", revenue: { $sum: "$finalPrice" }, orders: { $sum: 1 } } },
            ]),
            Branch.find().select("name").lean(),
        ]);

        // peak hours 8..23
        const peakMap = Object.fromEntries(peakAgg.map((h) => [h._id, h.count]));
        const peakHours = [];
        for (let h = 8; h <= 23; h++) peakHours.push({ hour: h, count: peakMap[h] || 0 });

        const CAT_LABEL = { main: "غذای اصلی", side: "پیش‌غذا", drink: "نوشیدنی", dessert: "دسر" };
        const salesByCategory = categoryAgg
            .map((c) => ({ category: CAT_LABEL[c._id] || c._id, quantity: c.quantity }))
            .sort((a, b) => b.quantity - a.quantity);

        const nameMap = Object.fromEntries(branches.map((b) => [String(b._id), b.name]));
        const revenueByBranch = revenueByBranchAgg
            .map((b) => ({ name: nameMap[String(b._id)] || "—", revenue: b.revenue, orders: b.orders }))
            .sort((a, b) => b.revenue - a.revenue);

        res.status(200).json({
            status: 200,
            message: "Admin reports fetched",
            data: { peakHours, salesByCategory, topCouriers, revenueByBranch },
        });
    } catch (error) {
        console.error("Admin reports error:", error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
};
