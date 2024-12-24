const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../models/UserModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");
const { setRefreshTokenCookie, setTokenCookie } = require("../utils/cookieUtils");

//! Get Request
exports.allUser = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({ status: 200, users, message: "User list fetch successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}

exports.singleUser = async (req, res) => {
    try {
        const { refreshToken, token } = req.cookies;

        if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).select("-refreshToken -createdAt -updatedAt ");
            if (!user) {
                return res.status(404).json({ status: 404, message: "User not found" });
            }
            return res.status(200).json({ status: 200, user, message: "User fetch successfully" });
        }
        else if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await userModel.findById(decoded.id).select("-refreshToken");
            // .select('-password -refreshToken -watchList')
            if (!user) {
                return res.status(404).json({ status: 404, message: "User not found" });
            }
            const newTokenData = { id: user._id, email: user.email, role: user.role };

            //! Generate new access token and refresh token
            const newToken = generateAccessToken(newTokenData);
            const newRefreshToken = generateRefreshToken(newTokenData);

            user.refreshToken = newRefreshToken; //! Save refresh token to user database
            setTokenCookie(res, newToken);
            setRefreshTokenCookie(res, newRefreshToken);

            await user.save();
            user.refreshToken = undefined;
            return res.status(200).json({ status: 200, user, message: "User fetch successfully" });
        }

        else {
            return res.status(401).json({ status: 401, message: "Unauthorized" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};


// 67588061e2d7717059d7aacd
//! Post Request
exports.registerUser = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const user = await userModel.findOne({ phoneNumber }).select("phoneNumber");

        const otpCode = Math.floor(10000 + Math.random() * 90000);
        //! it is necessary to add the SMS sending module here

        if (user) {
            user.otpCode = otpCode.toString();
            user.otpExpires = Date.now() + 10 * 60 * 1000; //! 10 minutes

            await user.save();
            return res.status(200).json({
                status: 200,
                message: "OTP sent",
                user: { _id: user._id, phoneNumber: user.phoneNumber }
            });
        } else {
            const newUser = new userModel({
                phoneNumber,
                email: null,
                otpCode: otpCode.toString(),
                otpExpires: Date.now() + 10 * 60 * 1000, //! 10 minutes
            });

            await newUser.save();
            return res.status(201).json({ status: 201, message: "User created and OTP sent", user: newUser });
        }
    }
    catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

//? Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otpCode } = req.body;
        const user = await userModel.findOne({ phoneNumber }).select("phoneNumber role otpCode otpExpires");

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        if (user.otpCode !== otpCode || user.otpExpires < Date.now()) {
            return res.status(403).json({ status: 403, message: "Invalid or expired OTP" });
        }

        //! remove the OTP code and expiry date from the user
        user.otpCode = undefined;
        user.otpExpires = undefined;

        const tokenData = {
            id: user._id,
            phoneNumber: user.phoneNumber,
            role: user.role,
        }

        const token = generateAccessToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);

        user.refreshToken = refreshToken; //! Save refresh token to user database

        setRefreshTokenCookie(res, refreshToken);
        setTokenCookie(res, token);

        await user.save();

        res.status(200).json({
            status: 200,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};


//? Login
exports.login = async (req, res) => {
    const { email, password, remember } = req.body;
    try {
        const user = await userModel.findOne({ email })
            .select("email password role refreshToken");

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 401, message: "Invalid Credentials" });
        }

        const tokenData = {
            id: user._id,
            email: user.email,
            role: user.role,
        }

        const token = generateAccessToken(tokenData);


        if (remember) {
            const refreshToken = generateRefreshToken(tokenData);
            setRefreshTokenCookie(res, refreshToken);
            user.refreshToken = refreshToken; //! Save refresh token to user database
        }
        await user.save();
        setTokenCookie(res, token);

        //! Set HTTP Only cookie for token (access token)
        res.status(200).json({ status: 200, message: "Login Successfully" });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};


exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies
    if (!refreshToken) return res.status(401).json({ status: 401, message: "No refresh token provided" });

    try {
        //! Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await userModel.findById(decoded.id)
            .select("email role refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ status: 403, message: "Invalid refresh token" });
        }

        //! Generate a new access token
        const newTokenData = { id: user._id, email: user.email, role: user.role };
        const newToken = generateAccessToken(newTokenData);

        //! Optionally generate a new refresh token
        const newRefreshToken = generateRefreshToken(newTokenData);
        user.refreshToken = newRefreshToken; // Update the refresh token in the database
        await user.save();

        // Set HTTP Only cookie for token (access token)
        setTokenCookie(res, newToken);
        setRefreshTokenCookie(res, newRefreshToken);

        res.status(200).json({ status: 200, message: "Tokens refreshed successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

exports.logout = (req, res) => {
    try {
        res.cookie('token', '', { httpOnly: true, sameSite: 'strict', expires: new Date(0) });
        res.cookie('refreshToken', '', { httpOnly: true, sameSite: 'strict', expires: new Date(0) });

        res.status(200).json({ status: 200, message: "Logout Successfully" });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};



//! must add edit user controller here


//! Delete Request
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        res.status(200).json({ status: 200, message: "User deleted" });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}