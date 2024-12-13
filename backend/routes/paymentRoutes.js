const express = require('express');
const router = express.Router();
const { getAllPayments, createPayment, getPaymentById, updatePaymentStatus } = require('../controllers/paymentController');
const { createPaymentValidation, updatePaymentStatusValidation } = require('../validation/paymentValidation');



router.route('/')
    .get(getAllPayments) // Get All Payment
    .post(createPaymentValidation, createPayment); // Create a payment

// Get payment by ID
router.get('/:paymentId', getPaymentById);

// Update payment status
router.patch('/:paymentId/status', updatePaymentStatusValidation, updatePaymentStatus);


module.exports = router;
