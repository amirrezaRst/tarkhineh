const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
    // name: { type: String, required: true },
    // address: { type: String, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // phoneNumber: { type: String, required: true },
    // images: [{ type: String }],
    // openTime: { type: String, required: true },
    // closeTime: { type: String, required: true },
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
});

module.exports = mongoose.model("Branch", BranchSchema);