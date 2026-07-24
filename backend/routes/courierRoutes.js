const express = require('express');

const {
    getDashboard, getActiveDeliveries, getHistory, getProfile, getEarnings,
    setAvailability, completeDelivery, markPickedUp,
} = require('../controllers/courierController');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');

const router = express.Router();
const courierOnly = [Authenticate, Authorize([ROLES.COURIER])];

router.get("/dashboard", courierOnly, getDashboard);
router.get("/deliveries", courierOnly, getActiveDeliveries);
router.get("/history", courierOnly, getHistory);
router.get("/profile", courierOnly, getProfile);
router.get("/earnings", courierOnly, getEarnings);
router.patch("/availability", courierOnly, setAvailability);
router.patch("/deliveries/:orderId/pickup", courierOnly, markPickedUp);
router.patch("/deliveries/:orderId/complete", courierOnly, completeDelivery);

module.exports = router;
