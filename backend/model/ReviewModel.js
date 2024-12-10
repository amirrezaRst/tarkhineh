const mongoose = require("mongoose");

const ReviewModel = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    // status: {
    //     type: String,
    //     enum: ['pending', 'approved', 'rejected'],
    //     default: 'pending'
    // }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewModel);
