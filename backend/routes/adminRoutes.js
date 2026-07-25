const express = require('express');

const {
    getOverview, getBranches, createBranch, updateBranch, assignManager, deleteBranch,
    getUsers, updateUserRole, deleteUser, getAssignableUsers, getReports,
    getOrders, cancelOrder, getCouriers,
} = require('../controllers/adminController');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');

const router = express.Router();
const adminOnly = [Authenticate, Authorize([ROLES.ADMIN])];

router.get("/overview", adminOnly, getOverview);
router.get("/reports", adminOnly, getReports);

router.get("/branches", adminOnly, getBranches);
router.post("/branches", adminOnly, createBranch);
router.patch("/branches/:id", adminOnly, updateBranch);
router.patch("/branches/:id/assign-manager", adminOnly, assignManager);
router.delete("/branches/:id", adminOnly, deleteBranch);

router.get("/orders", adminOnly, getOrders);
router.patch("/orders/:id/cancel", adminOnly, cancelOrder);
router.get("/couriers", adminOnly, getCouriers);

router.get("/users", adminOnly, getUsers);
router.get("/assignable-users", adminOnly, getAssignableUsers);
router.patch("/users/:id/role", adminOnly, updateUserRole);
router.delete("/users/:id", adminOnly, deleteUser);

module.exports = router;
