const express = require('express');

const { getBranchOrders, getBranchMenus } = require('../controllers/branchManagerController');
const Authenticate = require('../middleware/Authenticate');
const AuthorizeBranch = require('../middleware/AuthorizeBranch');

const router = express.Router();

router.get("/orders/:branch", Authenticate, AuthorizeBranch('branch'), getBranchOrders);
router.get("/menus/:branch", Authenticate, AuthorizeBranch('branch'), getBranchMenus);

module.exports = router;
