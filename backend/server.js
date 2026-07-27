const express = require('express');
const dotEnv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const connectDb = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimiters');

//! Config Env
dotEnv.config({ path: './config/config.env' });


//! Connect to Database
require('./config/redis');
connectDb();


//! cors options
const corsOptions = {
    origin: (process.env.CORS_ORIGINS || "http://localhost:3000").split(","),
    credentials: true,
};

const app = express();

//! Security headers.
//! The frontend loads menu images cross-origin from /public, which helmet's
//! default same-origin Cross-Origin-Resource-Policy would block.
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//! Strip $-prefixed/dotted keys so user input can't smuggle Mongo operators
//! into a query. Must run after the body parsers.
app.use(mongoSanitize());

app.use("/api", globalLimiter);

//! Static Folder
// Courier photos live in their own dir; mount it before the generic /public
// menu-images route so /public/couriers/* resolves here first.
app.use("/public/couriers", express.static(path.join(__dirname, "public", "courier-images")));
app.use("/public/branches", express.static(path.join(__dirname, "public", "branch-images")));
app.use("/public", express.static(path.join(__dirname, "public", "menu-images")));

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
app.use("/api/branch-manager", require('./routes/branchManagerRoutes'));
app.use("/api/courier", require('./routes/courierRoutes'));
app.use("/api/admin", require('./routes/adminRoutes'));

//! Report Scheduler
require('./utils/reportScheduler');


app.listen(process.env.PORT, err => {
    if (err) return console.log(err);
    console.log(`Server is running on port ${process.env.PORT}`);
});
