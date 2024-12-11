const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: ['main', 'side', 'dessert', 'drink'],
        required: true
    },
    images: [{ type: String }],
    ingredients: [{ type: String }],
    available: { type: Boolean, default: true },
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount'
    },
}, { timestamps: true });

module.exports = mongoose.model('Menu', MenuSchema);
