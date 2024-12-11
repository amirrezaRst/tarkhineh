const shortid = require('shortid');

const Coupon = require('../models/CouponModel');


//! Get Request
//? Get All Coupons
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while fetching the coupons." });
    }
};

//? Get Coupons By ID 
exports.getCouponByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOne({ code });

        if (!coupon) {
            return res.status(404).json({ status: 404, message: "Coupon not found." });
        }

        res.status(200).json({ status: 200, message: "coupon fetched successfully", coupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while fetching the coupon." });
    }
};


//! Create Request
//? Create New Coupon
exports.createCoupon = async (req, res) => {
    try {
        const { description, discountType, discountValue, maxDiscountAmount, usageLimit, validFrom, validTo, active } = req.body;

        // Validate the coupon expiration date
        if (new Date(validFrom) > new Date(validTo)) {
            return res.status(400).json({status:400, message: "The 'validFrom' date cannot be later than 'validTo'." });
        }

        const code = shortid.generate().toLocaleLowerCase();

        const newCoupon = new Coupon({
            code,
            description,
            discountType,
            discountValue,
            maxDiscountAmount,
            usageLimit,
            validFrom,
            validTo,
            active
        });

        const savedCoupon = await newCoupon.save();
        res.status(201).json({status:201, message: "Coupon created successfully.", coupon: savedCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while creating the coupon." });
    }
};


//! Put Request
//? Update Coupons
exports.updateCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const updatedCoupon = await Coupon.findOneAndUpdate({ code }, req.body, { new: true });

        if (!updatedCoupon) {
            return res.status(404).json({ status: 404, message: "Coupon not found." });
        }

        res.status(200).json({status:200, message: "Coupon updated successfully.", coupon: updatedCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while updating the coupon." });
    }
};


//! Delete Request
//? Delete Coupon By ID
exports.deleteCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const deletedCoupon = await Coupon.findOneAndDelete({ code });

        if (!deletedCoupon) {
            return res.status(404).json({ status: 404, message: "Coupon not found." });
        }

        res.status(200).json({ status: 200, message: "Coupon deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while deleting the coupon." });
    }
};
