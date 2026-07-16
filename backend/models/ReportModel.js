const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    totalSales: { type: Number, required: true },
    totalOrders: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    reportType: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
