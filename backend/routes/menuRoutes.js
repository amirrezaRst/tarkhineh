const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem, getMenuItemById, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { createMenuValidation } = require('../validation/menuValidation');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');


router.route("/")
    .get(getMenuItems)
    .post(Authenticate, Authorize([ROLES.ADMIN]), createMenuItem);

router.route("/:id")
    .get(getMenuItemById)
    .put(Authenticate, Authorize([ROLES.ADMIN]), updateMenuItem)
    .delete(Authenticate, Authorize([ROLES.ADMIN]), deleteMenuItem);

module.exports = router;
