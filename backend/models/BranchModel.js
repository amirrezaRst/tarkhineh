const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // address: { type: String, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // phoneNumber: { type: String, required: true },
    // images: [{ type: String }],
    // openTime: { type: String, required: true },
    // closeTime: { type: String, required: true },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
    // Max concurrent orders a single courier of this branch may carry. One
    // shared setting for every courier; drives the over-assignment guard.
    courierCapacity: { type: Number, default: 3, min: 1 },
});

module.exports = mongoose.model("Branch", BranchSchema);