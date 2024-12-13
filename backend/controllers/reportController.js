const mongoose = require('mongoose');
const Report = require('../models/ReportModel');
const Order = require('../models/OrderModel');
const moment = require('moment');



//! Create Daily Report
const generateDailyReport = async (branchId, date) => {
    try {
        const startOfDay = moment(date).startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();

        const orders = await Order.aggregate([
            {
                $match: {
                    branch: mongoose.Types.ObjectId(branchId),
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 },
                    totalDiscount: { $sum: "$discountAmount" }
                }
            }
        ]);

        const reportData = {
            branch: branchId,
            totalSales: orders[0]?.totalSales || 0,
            totalOrders: orders[0]?.totalOrders || 0,
            totalDiscount: orders[0]?.totalDiscount || 0,
            date: date,
            reportType: "daily"
        };

        await Report.create(reportData);
        console.log(`Daily report generated for branch ${branchId}`);
    } catch (error) {
        console.error(`Error generating daily report for branch ${branchId}:`, error);
    }
};

//! Create Weekly Report
const generateWeeklyReport = async (branchId, startDate, endDate) => {
    try {
        const orders = await Order.aggregate([
            {
                $match: {
                    branch: mongoose.Types.ObjectId(branchId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 },
                    totalDiscount: { $sum: "$discountAmount" }
                }
            }
        ]);

        const reportData = {
            branch: branchId,
            totalSales: orders[0]?.totalSales || 0,
            totalOrders: orders[0]?.totalOrders || 0,
            totalDiscount: orders[0]?.totalDiscount || 0,
            date: startDate,
            reportType: "weekly"
        };

        await Report.create(reportData);
        console.log(`Weekly report generated for branch ${branchId}`);
    } catch (error) {
        console.error(`Error generating weekly report for branch ${branchId}:`, error);
    }
};

//! Create Monthly Report
const generateMonthlyReport = async (branchId, year, month) => {
    try {
        const startOfMonth = moment().year(year).month(month - 1).startOf('month').toDate();
        const endOfMonth = moment().year(year).month(month - 1).endOf('month').toDate();

        const orders = await Order.aggregate([
            {
                $match: {
                    branch: mongoose.Types.ObjectId(branchId),
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 },
                    totalDiscount: { $sum: "$discountAmount" }
                }
            }
        ]);

        const reportData = {
            branch: branchId,
            totalSales: orders[0]?.totalSales || 0,
            totalOrders: orders[0]?.totalOrders || 0,
            totalDiscount: orders[0]?.totalDiscount || 0,
            date: `${year}-${month}`,
            reportType: "monthly"
        };

        await Report.create(reportData);
        console.log(`Monthly report generated for branch ${branchId}`);
    } catch (error) {
        console.error(`Error generating monthly report for branch ${branchId}:`, error);
    }
};

module.exports = {
    generateDailyReport,
    generateWeeklyReport,
    generateMonthlyReport
};
