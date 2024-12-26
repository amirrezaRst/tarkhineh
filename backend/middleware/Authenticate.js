const jwt = require('jsonwebtoken');

// authenticate
module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ status: 403, message: "Authentication is required to access this resource. Please provide a valid token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ status: 401, message: "Invalid or expired token" });
    }
};