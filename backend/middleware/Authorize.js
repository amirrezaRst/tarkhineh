// Must run after Authenticate so req.user is populated.
module.exports = roles => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ status: 401, message: "Authentication is required to access this resource" });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ status: 403, message: "Insufficient permissions" });
    }
    next();
};
