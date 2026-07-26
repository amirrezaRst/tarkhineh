const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Branch profile (admin-managed). Optional so existing branches keep working.
    address: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    // Working hours as "HH:MM" 24h strings; drive the open/closed indicator.
    openTime: { type: String, default: null },
    closeTime: { type: String, default: null },
    images: [{ type: String }],
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
    // Max concurrent orders a single courier of this branch may carry. One
    // shared setting for every courier; drives the over-assignment guard.
    courierCapacity: { type: Number, default: 3, min: 1 },
});

module.exports = mongoose.model("Branch", BranchSchema);