const Menu = require('../models/MenuModel');
const Branch = require('../models/BranchModel');
const Discount = require('../models/DiscountModel');
const uploadImage = require('../utils/upload');
const { createMenuValidation } = require('../validation/menuValidation');
const cache = require('../middleware/cacheMiddleware');
const { branchByIdKey } = require('../utils/cacheKeys');

// A menu item doesn't know its own branch(es) — Branch.menus is the only link
// — so a write has to look them up before it can invalidate the right
// per-branch cache entries.
const invalidateBranchesForMenuItem = async (menuItemId) => {
    const branches = await Branch.find({ menus: menuItemId }).select('_id');
    await cache.invalidate(branches.map((b) => branchByIdKey(b._id)));
};

const upload = uploadImage({
    fieldName: "images", // نام فیلد فایل‌ها در درخواست
    fileSize: "4000000", // حداکثر حجم 4 مگابایت
    destination: '../public/menu-images/',
    width: 474, // عرض تصویر
    height: 474, // ارتفاع تصویر
    quality: 70, // کیفیت تصویر
    maxCount: 10 // حداکثر تعداد تصاویر
});



//! Get Request
//? Get Menu Item List
exports.getMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find().populate('discount');
        res.status(200).json({ status: 200, message: "menu items fetched successfully", menuItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while fetching the menu items." });
    }
};


//? Get Menu item By ID
exports.getMenuItemById = async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id).populate('discount');
        if (!menuItem) {
            return res.status(404).json({ status: 404, message: "Menu item not found." });
        }
        res.status(200).json({ status: 200, message: "menu item fetched successfully", menuItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while fetching the menu item." });
    }
};



//! Post Request
//? Create new Menu Item
exports.createMenuItem = [upload, createMenuValidation, async (req, res) => {
    try {
        const newMenuItem = new Menu(req.body);

        await newMenuItem.save();
        res.status(201).json({ status: 201, message: "Menu item created successfully.", menuItem: newMenuItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while creating the menu item." });
    }
}];


//! Update Request
//? Update Menu Item
exports.updateMenuItem = [upload, createMenuValidation, async (req, res) => {
    try {
        const { name, description, price, category, images, ingredients, discount, available } = req.body;

        const updatedMenuItem = await Menu.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, images, ingredients, discount, available },
            { new: true }
        );

        if (!updatedMenuItem) {
            return res.status(404).json({ status: 404, message: "Menu item not found." });
        }

        await invalidateBranchesForMenuItem(req.params.id);
        res.status(200).json({ status: 200, message: "Menu item updated successfully.", menuItem: updatedMenuItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while updating the menu item." });
    }
}];

//! Delete Request
//? Delete Menu Item
exports.deleteMenuItem = async (req, res) => {
    try {
        const deletedMenuItem = await Menu.findByIdAndDelete(req.params.id);
        if (!deletedMenuItem) {
            return res.status(404).json({ status: 404, message: "Menu item not found." });
        }
        await invalidateBranchesForMenuItem(req.params.id);
        res.status(200).json({ status: 200, message: "Menu item deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while deleting the menu item." });
    }
};
