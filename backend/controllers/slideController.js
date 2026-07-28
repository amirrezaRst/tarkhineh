const Slide = require('../models/SlideModel');

// Public: active slides for the homepage/menus/branches hero, in admin order.
exports.getActiveSlides = async (req, res) => {
    try {
        const slides = await Slide.find({ active: true }).sort({ order: 1, createdAt: 1 });
        res.status(200).json({ status: 200, message: "fetch slides successfully", slides });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching slides.", error: error.message });
    }
};
