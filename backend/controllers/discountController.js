const Discount = require('../models/DiscountModel');  // مدل Discount
const Menu = require('../models/MenuModel');  // مدل Menu برای رفرنس دادن



//! Get Request
//? get all Discounts List
exports.getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find().populate('menuItem',"name price");
        res.status(200).json({ status: 200, message: "discount list fetched successfully", discounts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching discounts." });
    }
};

//? Get Discount By ID
exports.getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id).populate('menuItem',"name price");
        if (!discount) {
            return res.status(404).json({ status: 404, message: "Discount not found." });
        }
        res.status(200).json({ status: 200, message: "discount fetched successfully", discount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while fetching the discount." });
    }
};

//! Post Request
//? Create new Discount
exports.createDiscount = async (req, res) => {
    try {
        const { menuItem, discountType, discountValue, startDate, endDate, active } = req.body;

        // validate discount expiration date
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ status: 400, message: "The 'startDate' cannot be later than 'endDate'." });
        }

        const menu = await Menu.findById(menuItem).select("discount");
        if (!menu) return res.status(404).json({ status: 404, message: "the menu item with this ID does not exist." })

        menu.discount = menuItem;
        await menu.save();

        const newDiscount = new Discount({
            menuItem,
            discountType,
            discountValue,
            startDate,
            endDate,
            active
        });

        await newDiscount.save();
        res.status(201).json({ status: 201, message: "Discount created successfully.", discount: newDiscount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while creating the discount." });
    }
};


//! Put Request
//? Update Discount Item
exports.updateDiscount = async (req, res) => {
    try {
        const { menuItem, discountType, discountValue, startDate, endDate, active } = req.body;

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ status: 400, message: "The 'startDate' cannot be later than 'endDate'." });
        }

        const updatedDiscount = await Discount.findByIdAndUpdate(
            req.params.id,
            { menuItem, discountType, discountValue, startDate, endDate, active },
            { new: true }
        );

        if (!updatedDiscount) {
            return res.status(404).json({ status: 404, message: "Discount not found." });
        }

        res.status(200).json({ status: 200, message: "Discount updated successfully.", discount: updatedDiscount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while updating the discount." });
    }
};

//! Delete Request
//? Delete Discount Item
exports.deleteDiscount = async (req, res) => {
    try {
        const deletedDiscount = await Discount.findByIdAndDelete(req.params.id);

        if (!deletedDiscount) {
            return res.status(404).json({ status: 404, message: "Discount not found." });
        }

        res.status(200).json({ status: 200, message: "Discount deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while deleting the discount." });
    }
};
