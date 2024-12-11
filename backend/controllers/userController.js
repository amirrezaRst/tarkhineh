const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require("../model/UserModel");
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
            const user = await userModel.findById(decoded.id).select("-refreshToken");
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



//! Post Request
exports.registerUser = async (req, res) => {
    const { fullName, email, password, phoneNumber, remember } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(409).json({ status: 409, message: "User already exists" });
        }

        const phoneExist = await userModel.findOne({ phoneNumber }).select("phoneNumber");
        if (phoneExist) {
            return res.status(409).json({ status: 409, message: "This phone number has already been registered." });
        };

        const newUser = new userModel({
            fullName,
            email,
            phoneNumber,
            password
        });

        const tokenData = {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        }

        const token = generateAccessToken(tokenData);


        if (remember) {
            const refreshToken = generateRefreshToken(tokenData);

            newUser.refreshToken = refreshToken; //! Save refresh token to user database

            setRefreshTokenCookie(res, refreshToken);
        };
        await newUser.save();

        setTokenCookie(res, token);

        res.status(201).json({ status: 201, message: "User created", user: newUser });
    }
    catch (error) {
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