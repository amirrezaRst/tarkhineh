const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
}, { timestamps: true });

module.exports = mongoose.model('Like', likeSchema);