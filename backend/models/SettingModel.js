const mongoose = require("mongoose");

// Single platform-wide settings document (key: "platform").
const SettingSchema = new mongoose.Schema({
    key: { type: String, default: "platform", unique: true },
    deliveryFee: { type: Number, default: 0 },      // default courier delivery fee (Toman)
    taxPercent: { type: Number, default: 0 },       // VAT / service tax percent
    minOrder: { type: Number, default: 0 },         // minimum order amount
    serviceFee: { type: Number, default: 0 },       // fixed per-order service fee
    supportPhone: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Setting", SettingSchema);
