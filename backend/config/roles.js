const ROLES = Object.freeze({
    ADMIN: 'admin',
    BRANCH_MANAGER: 'branch_manager',
    COURIER: 'courier',
    USER: 'user',
});

const STAFF_ROLES = Object.freeze([ROLES.ADMIN, ROLES.BRANCH_MANAGER, ROLES.COURIER]);
const BRANCH_SCOPED_ROLES = Object.freeze([ROLES.BRANCH_MANAGER, ROLES.COURIER]);

module.exports = { ROLES, STAFF_ROLES, BRANCH_SCOPED_ROLES };
