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



//! Post Request
//? Create New Coupon
exports.createCoupon = async (req, res) => {
    try {
        const { description, discountType, discountValue, maxAmount, minAmount, usageLimit, validFrom, validTo, active } = req.body;

        //! Validate the coupon expiration date
        if (new Date(validFrom) > new Date(validTo)) {
            return res.status(400).json({ status: 400, message: "The 'validFrom' date cannot be later than 'validTo'." });
        }
        const code = shortid.generate().toLocaleLowerCase();

        const coupon = new Coupon({
            code,
            description,
            discountType,
            discountValue,
            maxAmount,
            minAmount,
            usageLimit,
            validFrom: validFrom || new Date().toISOString().replace("Z", "+00:00"),
            validTo,
            active
        });

        coupon.save();
        res.status(201).json({ status: 201, message: "Coupon created successfully.", coupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while creating the coupon." });
    }
};


//? Apply Coupon
exports.applyCoupon = async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOne({ code }).select("code usageLimit");

        if (!coupon) {
            return res.status(404).json({ status: 404, message: "Coupon not found." });
        }

        coupon.usageLimit -= 1;

        if (coupon.usageLimit === 0) {
            await Coupon.deleteOne({ _id: coupon._id });
            return res.status(200).json({ status: 200, message: "Coupon applied and removed as usage limit reached." });
        };

        await coupon.save();

        res.status(200).json({ status: 200, message: "Coupon applied successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while updating the coupon." });
    };
};


exports.validateCoupon = async (req, res) => {
    try {
        const { code, itemAmount } = req.body;

        if (!code || itemAmount == null) {
            return res.status(400).json({ status: 400, message: "Code and itemAmount are required." });
        };

        const coupon = await Coupon.findOne({ code }).select("code maxAmount minAmount discountType discountValue");

        if (!coupon) {
            return res.status(404).json({ status: 404, message: "Coupon not found." });
        };

        //! Check amount limits
        if (coupon.maxAmount && itemAmount > coupon.maxAmount) {
            return res.status(400).json({ status: 400, message: `The maximum allowed amount is ${coupon.maxAmount}.` });
        };

        if (coupon.minAmount && itemAmount < coupon.minAmount) {
            return res.status(400).json({ status: 400, message: `The minimum required amount is ${coupon.minAmount}.` });
        };

        return res.status(200).json({
            status: 200,
            message: "Coupon is valid.",
            coupon
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while validating coupon." });
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

        res.status(200).json({ status: 200, message: "Coupon updated successfully.", coupon: updatedCoupon });
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
