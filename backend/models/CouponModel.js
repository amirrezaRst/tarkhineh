const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true },
    maxAmount: { type: Number },
    minAmount: { type: Number },
    usageLimit: { type: Number, default: 1 },
    validFrom: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    validTo: { type: Date, required: true },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', CouponSchema);
