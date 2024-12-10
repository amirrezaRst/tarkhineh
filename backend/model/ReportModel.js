const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    totalSales: { type: Number, required: true },
    totalOrders: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);



// const mongoose = require('mongoose');
// const Report = require('./models/Report');
// const Order = require('./models/Order');

// async function generateDailyReport(branchId, date) {
//     try {
//         // شروع از تاریخ
//         const startOfDay = new Date(date);
//         startOfDay.setHours(0, 0, 0, 0);
        
//         // پایان از تاریخ
//         const endOfDay = new Date(date);
//         endOfDay.setHours(23, 59, 59, 999);

//         // جمع‌آوری اطلاعات سفارشات از مدل Order
//         const orders = await Order.aggregate([
//             {
//                 $match: {
//                     branch: mongoose.Types.ObjectId(branchId),
//                     createdAt: { $gte: startOfDay, $lte: endOfDay }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalSales: { $sum: "$totalPrice" },
//                     totalOrders: { $sum: 1 },
//                     totalDiscount: { $sum: "$discountAmount" }
//                 }
//             }
//         ]);

//         // ساخت گزارش
//         const reportData = {
//             branch: branchId,
//             totalSales: orders[0]?.totalSales || 0,
//             totalOrders: orders[0]?.totalOrders || 0,
//             totalDiscount: orders[0]?.totalDiscount || 0,
//             date: date
//         };

//         const report = new Report(reportData);
//         await report.save();

//         console.log('Report generated successfully!');
//     } catch (error) {
//         console.error('Error generating report:', error);
//     }
// }





// const cron = require('node-cron');
// const generateDailyReport = require('./reportController');

// cron.schedule('0 0 * * *', async () => {
//     const today = new Date();
//     const branchId = 'branch_id_here';
//     await generateDailyReport(branchId, today);
//     console.log('Daily report generated!');
// });
