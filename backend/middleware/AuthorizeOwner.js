const { ROLES } = require('../config/roles');

// Allows the request through if the authenticated user IS the resource
// (req.params[paramName] matches req.user.id) or is an admin.
// Must run after Authenticate.
module.exports = (paramName = 'id') => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ status: 401, message: "Authentication is required to access this resource" });
    }
    if (req.user.role === ROLES.ADMIN || req.user.id === req.params[paramName]) {
        return next();
    }
    return res.status(403).json({ status: 403, message: "You do not have access to this resource" });
};
