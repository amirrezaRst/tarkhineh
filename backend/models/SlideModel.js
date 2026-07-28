const mongoose = require("mongoose");

// Admin-managed hero banners shown at the top of the public site.
const SlideSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    buttonLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Slide", SlideSchema);
