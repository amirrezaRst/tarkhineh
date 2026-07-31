const jwt = require('jsonwebtoken');

const userModel = require("../models/UserModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");
const { setRefreshTokenCookie, setTokenCookie, clearAuthCookies } = require("../utils/cookieUtils");
const { blockToken } = require("../utils/tokenBlocklist");
const otpStore = require("../utils/otpStore");

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
            const newTokenData = { id: user._id, email: user.email, role: user.role, branch: user.branch };

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

        const otpCode = Math.floor(10000 + Math.random() * 90000).toString();
        //! No SMS provider is wired up — this is a portfolio project with no
        //! real users, so DEMO_MODE returns the code in the response itself
        //! instead of pretending to text it. Off by default; only meant for
        //! a public demo deployment, never a real product.
        const demoMode = process.env.DEMO_MODE === 'true';

        const useRedis = otpStore.otpBackedByRedis();
        if (useRedis) {
            await otpStore.setOtp(phoneNumber, otpCode);
        }
        //! 10 minutes — only written to Mongo when Redis isn't available to hold it
        const otpFields = useRedis ? {} : { otpCode, otpExpires: Date.now() + 10 * 60 * 1000 };

        if (user) {
            if (!useRedis) {
                Object.assign(user, otpFields);
                await user.save();
            }
            return res.status(200).json({
                status: 200,
                message: "OTP sent",
                user: { _id: user._id, phoneNumber: user.phoneNumber },
                ...(demoMode && { otpCode }),
            });
        } else {
            const newUser = new userModel({
                phoneNumber,
                email: null,
                ...otpFields,
            });

            await newUser.save();
            return res.status(201).json({
                status: 201,
                message: "User created and OTP sent",
                user: newUser,
                ...(demoMode && { otpCode }),
            });
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
        const user = await userModel.findOne({ phoneNumber }).select("phoneNumber role branch otpCode otpExpires");

        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        if (otpStore.otpBackedByRedis()) {
            const storedCode = await otpStore.getOtp(phoneNumber);
            if (!storedCode || storedCode !== otpCode) {
                return res.status(403).json({ status: 403, message: "Invalid or expired OTP" });
            }
            await otpStore.clearOtp(phoneNumber); //! single-use
        } else {
            if (user.otpCode !== otpCode || user.otpExpires < Date.now()) {
                return res.status(403).json({ status: 403, message: "Invalid or expired OTP" });
            }
            //! remove the OTP code and expiry date from the user
            user.otpCode = undefined;
            user.otpExpires = undefined;
        }

        const tokenData = {
            id: user._id,
            phoneNumber: user.phoneNumber,
            role: user.role,
            branch: user.branch,
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


exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies
    if (!refreshToken) return res.status(401).json({ status: 401, message: "No refresh token provided" });

    try {
        //! Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await userModel.findById(decoded.id)
            .select("email role branch refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ status: 403, message: "Invalid refresh token" });
        }

        //! Generate a new access token
        const newTokenData = { id: user._id, email: user.email, role: user.role, branch: user.branch };
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

exports.logout = async (req, res) => {
    try {
        const { refreshToken, token } = req.cookies;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                await userModel.findByIdAndUpdate(decoded.id, { refreshToken: null });
            } catch (err) {
                // token already invalid/expired - nothing to invalidate server-side
            }
        }

        // The access token is still cryptographically valid for up to a day
        // after this — clearing the cookie only stops the browser from
        // sending it, it doesn't revoke it. Blocklisting it here is what
        // actually makes logout take effect immediately.
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                await blockToken(token, decoded.exp);
            } catch (err) {
                // already invalid/expired - nothing to block
            }
        }

        clearAuthCookies(res);

        res.status(200).json({ status: 200, message: "Logout Successfully" });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};


//? Add new Address
exports.newAddress = async (req, res) => {
    const { title, addressLine, recipientPhoneNumber, recipientFullName, coordinates } = req.body;

    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const address = {
            title,
            addressLine,
            recipientPhoneNumber,
            recipientFullName,
            coordinates
        }

        const addresses = [...user.addresses, address];
        user.addresses = addresses;

        await user.save();

        res.status(200).json({ status: 200, message: "a new address has been added", user });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}


exports.editAddress = async (req, res) => {
    const userId = req.params.id;
    const addressIndex = parseInt(req.params.address, 10);

    const { title, addressLine, recipientPhoneNumber, recipientFullName, coordinates } = req.body;

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ status: 404, message: "User not found" });

        const address = user.addresses.findIndex((_, index) => index === addressIndex)
        if (address === -1) return res.status(400).json({ status: 400, message: "the requested address was not found" });

        user.addresses[addressIndex].title = title;
        user.addresses[addressIndex].addressLine = addressLine;
        user.addresses[addressIndex].recipientFullName = recipientFullName;
        user.addresses[addressIndex].recipientPhoneNumber = recipientPhoneNumber;
        if (coordinates) {
            user.addresses[addressIndex].coordinates = coordinates;
        }

        await user.save();

        res.status(200).json({
            status: 200,
            message: 'address has been successfully updated',
            user
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

//! 1.54 KB Responding Size
exports.editUser = async (req, res) => {
    const userId = req.params.id;
    const { fullName, email, userName } = req.body;

    try {
        const user = await userModel.findById(userId)
            .select("fullName email userName");
        if (!user) return res.status(404).json({ status: 404, message: "User not found" });

        user.fullName = fullName || user.fullName;
        user.userName = userName || user.userName;
        user.email = email || user.email;

        await user.save();

        return res.status(200).json({
            status: 200, message: "User updated",
            user: {
                fullName: user.fullName,
                userName: user.userName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}


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

exports.deleteAddress = async (req, res) => {
    const userId = req.params.id;
    const addressIndex = req.params.address;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const address = await user.addresses.filter((_, index) => index != addressIndex);
        user.addresses = address

        await user.save();

        res.status(200).json({ status: 200, message: "Address has been successfully removed", user });
    }
    catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}