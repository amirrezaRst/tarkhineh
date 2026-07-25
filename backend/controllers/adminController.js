const mongoose = require('mongoose');
const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Branch = require('../models/BranchModel');
const Review = require('../models/ReviewModel');
const { ROLES } = require('../config/roles');

const TZ = "Asia/Tehran";
const ACTIVE = ["pending", "preparing", "on_the_way"];

const todayStart = () => { const s = new Date(); s.setHours(0, 0, 0, 0); return s; };
const monthStart = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); };
const daysAgoStart = (n) => { const s = todayStart(); s.setDate(s.getDate() - n); return s; };
const oid = (id) => new mongoose.Types.ObjectId(id);

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
                courierCapacity: b.courierCapacity,
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

// Promote a user to this branch's manager and keep both sides consistent.
async function linkManager(userId, branchId) {
    await User.findByIdAndUpdate(userId, { role: ROLES.BRANCH_MANAGER, branch: branchId });
}

exports.createBranch = async (req, res) => {
    try {
        const { name, managerId, courierCapacity } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ status: 400, message: "نام شعبه الزامی است." });
        const manager = await User.findById(managerId).select("_id");
        if (!manager) return res.status(400).json({ status: 400, message: "مدیر انتخاب‌شده معتبر نیست." });

        const branch = await Branch.create({
            name: name.trim(),
            manager: managerId,
            courierCapacity: courierCapacity || 3,
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
