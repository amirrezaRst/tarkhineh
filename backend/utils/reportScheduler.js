console.log("reportScheduler.js Run!")
const cron = require('node-cron');
const moment = require('moment');
const { generateDailyReport, generateWeeklyReport, generateMonthlyReport } = require('../controllers/reportController');
const Branch = require('../models/BranchModel');

//! Get All branch
const getBranches = async () => {
    try {
        const branches = await Branch.find();
        console.log(branches)
        return branches
    } catch (error) {
        console.error('Error fetching branches:', error);
        return [];
    }
};
// getBranches()

// cronJob for daily report (everyday)
cron.schedule('0 0 * * *', async () => {
    const branches = await getBranches();
    const today = new Date();

    for (const branch of branches) {
        await generateDailyReport(branch._id, today);
    }
    console.log('Daily reports generated for all branches!');
});

// cronJob for weekly report (sundays)
cron.schedule('0 0 * * 0', async () => {
    const branches = await getBranches();
    const today = new Date();
    const startOfWeek = moment(today).startOf('week').toDate();
    const endOfWeek = moment(today).endOf('week').toDate();

    for (const branch of branches) {
        await generateWeeklyReport(branch._id, startOfWeek, endOfWeek);
    }
    console.log('Weekly reports generated for all branches!');
});

// cronJob for monthly report (first day of month)
cron.schedule('0 0 1 * *', async () => {
    const branches = await getBranches();
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    for (const branch of branches) {
        await generateMonthlyReport(branch._id, year, month);
    }
    console.log('Monthly reports generated for all branches!');
});
