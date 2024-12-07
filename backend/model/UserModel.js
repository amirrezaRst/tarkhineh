const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { AddressSchema } = require('./AddressSchema');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
        type: [String],
        enum: ['user', 'admin', 'branch_manager'],
        default: ['user']
    },
    coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    addresses: [AddressSchema],
}, { timestamps: true });


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
