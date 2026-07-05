const express = require('express');
const router = express.Router();
const { getAllPayments, createPayment, getPaymentById, updatePaymentStatus } = require('../controllers/paymentController');
const { createPaymentValidation, updatePaymentStatusValidation } = require('../validation/paymentValidation');
const { verifyPayment } = require('../controllers/orderController');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const { ROLES } = require('../config/roles');



router.route('/')
    .get(Authenticate, Authorize([ROLES.ADMIN]), getAllPayments) // Get All Payment
    .post(Authenticate, createPaymentValidation, createPayment); // Create a payment

// Get payment by ID
router.get('/:paymentId', Authenticate, getPaymentById);

// Update payment status
// Not driven by any client flow today (real verification happens via
// verifyPayment/Zarinpal callback) - restricted to admin to close the
// "anyone can mark any payment paid" hole until that flow is revisited.
router.patch('/:paymentId/status', Authenticate, Authorize([ROLES.ADMIN]), updatePaymentStatusValidation, updatePaymentStatus);

router.get("/verifyPayment/:authority", Authenticate, verifyPayment);

module.exports = router;
