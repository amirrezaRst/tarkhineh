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

app.get("/hello", (req, res) => {
    res.send("hello world")
})


app.listen(process.env.PORT, err => {
    if (err) return console.log(err);
    console.log(`Server is running on port ${process.env.PORT}`);
});