const { ROLES, BRANCH_SCOPED_ROLES } = require('../config/roles');

// Restricts branch_manager/courier to their own branch (req.params[paramName]);
// admin always passes. Must run after Authenticate.
module.exports = (paramName = 'branch') => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ status: 401, message: "Authentication is required to access this resource" });
    }
    if (req.user.role === ROLES.ADMIN) {
        return next();
    }
    if (!BRANCH_SCOPED_ROLES.includes(req.user.role)) {
        return res.status(403).json({ status: 403, message: "Insufficient permissions" });
    }
    if (!req.user.branch || req.user.branch !== req.params[paramName]) {
        return res.status(403).json({ status: 403, message: "You do not have access to this branch" });
    }
    next();
};
