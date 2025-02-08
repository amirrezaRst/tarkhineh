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
    estimatedDeliveryTime: { type: Date },  //! New Field
    deliveryFee: { type: Number, default: 0 },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },    //! New Field
    customerNote: { type: String, default: "" },    //! New Field
    status: {
        type: String,
        enum: ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
        default: 'preparing'
    },
    deliveryAddress: { type: OrderAddressSchema },
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
    paymentTransactionId: { type: String }, //! New Field
    refundStatus: { type: String, enum: ['none', 'requested', 'processed'] },   //! New Field
    pickupCode: { type: Number },   //! New Field
    approvedAt: { type: Date, default: null },  //! New Field
    deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);