const mongoose = require('mongoose');
const { AddressSchema } = require('./AddressSchema');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, default: null },
    email: { type: String, lowercase: true, default: null },
    phoneNumber: { type: String, required: true, unique: true },
    userName: { type: String, default: null },
    role: {
        type: String,
        enum: ['user', 'admin', 'branch_manager',"courier"],
        default: 'user'
    },
    // Only meaningful for branch_manager / courier roles.
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
    // Courier-only profile fields (managed from the branch panel).
    image: { type: String, default: null },
    courierStatus: { type: String, enum: ['available', 'offline'], default: 'available' },
    vehicleType: { type: String, enum: ['motorcycle', 'bicycle', 'car', 'foot'], default: 'motorcycle' },
    plateNumber: { type: String, default: null },
    nationalCode: { type: String, default: null },
    coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    addresses: [AddressSchema],
    refreshToken: { type: String },
    otpCode: { type: String, select: false },
    otpExpires: { type: Date, select: false },
}, { timestamps: true });

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model('User', UserSchema);
