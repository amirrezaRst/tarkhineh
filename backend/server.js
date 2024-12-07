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


app.listen(process.env.PORT, err => {
    if (err) return console.log(err);
    console.log(`Server is running on port ${process.env.PORT}`);
});