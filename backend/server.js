const dotEnv = require('dotenv');

//! Config Env
//! Must run before any local module is required — several of them (redis
//! config, rate limiters) read process.env at import time.
dotEnv.config({ path: './config/config.env' });

const connectDb = require('./config/db');

//! Connect to Database
require('./config/redis');
connectDb();

const app = require('./app');

//! Report Scheduler
require('./utils/reportScheduler');

app.listen(process.env.PORT, err => {
    if (err) return console.log(err);
    console.log(`Server is running on port ${process.env.PORT}`);
});
