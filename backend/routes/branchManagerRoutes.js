const express = require('express');

const { getBranchOrders, getBranchMenus, toggleMenuAvailability, getBranchCouriers, getBranchStats } = require('../controllers/branchManagerController');
const Authenticate = require('../middleware/Authenticate');
const AuthorizeBranch = require('../middleware/AuthorizeBranch');

const router = express.Router();

router.get("/orders/:branch", Authenticate, AuthorizeBranch('branch'), getBranchOrders);
router.get("/menus/:branch", Authenticate, AuthorizeBranch('branch'), getBranchMenus);
router.patch("/menus/:branch/:menuId", Authenticate, AuthorizeBranch('branch'), toggleMenuAvailability);
router.get("/couriers/:branch", Authenticate, AuthorizeBranch('branch'), getBranchCouriers);
router.get("/stats/:branch", Authenticate, AuthorizeBranch('branch'), getBranchStats);

module.exports = router;
