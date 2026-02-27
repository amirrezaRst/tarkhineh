const Menu = require('../models/MenuModel');
const Branch = require('../models/BranchModel');


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