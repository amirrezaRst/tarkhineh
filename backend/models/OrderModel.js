const mongoose = require("mongoose");

const OrderAddressSchema = mongoose.Schema({
    addressLine: { type: String, required: true },
    recipientPhoneNumber: { type: String, required: true },
    recipientFullName: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //? User ID
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },  //? Menu Item ID
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    deliveryType: { type: String, enum: ["courier", "person"] },
    orderReadyOrDeliveredAt: { type: Date },
    deliveryFee: { type: Number, default: 0 },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: { type: OrderAddressSchema, required: true },
    paymentMethod: {
        type: String,
        enum: ['cash', 'online'],
        default: 'online'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid', 'failed'],
        default: 'unpaid'
    },
    deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
