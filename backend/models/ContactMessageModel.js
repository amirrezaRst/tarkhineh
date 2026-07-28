const mongoose = require("mongoose");

// Messages submitted through the public "پیام به ترخینه" footer form.
const ContactMessageSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, default: null, trim: true },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    status: { type: String, enum: ["new", "read"], default: "new" },
}, { timestamps: true });

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);
