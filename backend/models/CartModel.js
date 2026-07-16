const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
            quantity: { type: Number, min: 1, default: 1, required: true }
        }
    ],
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
}, { timestamps: true });


CartSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model('Cart', CartSchema);
