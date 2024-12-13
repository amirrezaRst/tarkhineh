const express = require('express');
const dotEnv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDb = require('./config/db');

//! Config Env
dotEnv.config({ path: './config/config.env' });


//! Connect to Database
connectDb();

//! cors options
const corsOptions = {
    origin: ["http://localhost:3000",],
    credentials: true,
};

const app = express().use(express.json())
    .use(cors(corsOptions))
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser());


//! Static Folder

//! Routes
app.use("/api/user", require('./routes/userRoutes'));
app.use("/api/review", require('./routes/reviewRoutes'));
app.use("/api/branch", require('./routes/branchRoutes'));
app.use("/api/coupon", require('./routes/couponRoutes'));
app.use("/api/menu", require('./routes/menuRoutes'));
app.use("/api/discount", require('./routes/discountRoutes'));
app.use("/api/cart", require('./routes/cartRoutes'));
app.use("/api/order", require('./routes/orderRoutes'));
app.use("/api/payment", require('./routes/paymentRoutes'));
app.use("/api/like", require('./routes/likeRoutes'));

//! Report Scheduler
require('./utils/reportScheduler');


app.listen(process.env.PORT, err => {
    if (err) return console.log(err);
    console.log(`Server is running on port ${process.env.PORT}`);
});