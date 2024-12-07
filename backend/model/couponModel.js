const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true },
    maxDiscountAmount: { type: Number },
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', CouponSchema);



// const isValidCoupon = async (code, userId) => {
//     const coupon = await Coupon.findOne({ code, user: userId, active: true });

//     if (!coupon) {
//         return { valid: false, message: 'Invalid or expired coupon' };
//     }

//     if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
//         return { valid: false, message: 'Coupon usage limit reached' };
//     }

//     if (new Date() > coupon.validTo) {
//         return { valid: false, message: 'Coupon has expired' };
//     }

//     return { valid: true, discountType: coupon.discountType, discountValue: coupon.discountValue, maxDiscount: coupon.maxDiscountAmount };
// };
