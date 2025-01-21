const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { AddressSchema } = require('./AddressSchema');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, default: null },
    email: { type: String, lowercase: true, default: null },
    phoneNumber: { type: String, required: true, unique: true },
    // password: { type: String, required: true, select: false },
    userName: { type: String, default: null },
    role: {
        type: String,
        enum: ['user', 'admin', 'branch_manager'],
        default: 'user'
    },
    // wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
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

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
