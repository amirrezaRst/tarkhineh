const Payment = require('../models/PaymentModel');
const Order = require('../models/OrderModel');
const { ROLES } = require('../config/roles');


//! Get Request
//? Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const { user } = req.query;

        if (!user) {
            const payments = await Payment.find().populate('order');
            return res.status(200).json({ status: 200, message: "payments fetched successfully", payments });
        }
        else {
            const payments = await Payment.find()
                .populate({
                    path: 'order',
                    match: { user }
                });

            const userPayments = payments.filter(payment => payment.order !== null);

            return res.status(200).json({ status: 200, message: `The payments with ID ${user} were successfully completed.`, payments: userPayments });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error retrieving payments.", error: error.message });
    }
};


//? Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId).populate('order');
        if (!payment) {
            return res.status(404).json({ status: 404, message: "Payment not found." });
        }

        if (payment.user.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({ status: 403, message: "You do not have access to this payment" });
        }

        res.status(200).json({ status: 200, message: "Payment fetched successfully", payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error retrieving payment.", error: error.message });
    }
};


//! Post Request
//? Create a payment
exports.createPayment = async (req, res) => {
    try {
        const { order, paymentMethod, transactionId } = req.body;

        // Validate order
        const existingOrder = await Order.findById(order).select("user totalPrice");
        if (!existingOrder) {
            return res.status(404).json({ status: 404, message: "Order not found." });
        }

        if (existingOrder.user.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
            return res.status(403).json({ status: 403, message: "You do not have access to this order" });
        }

        // Create payment
        const payment = new Payment({
            order,
            user: existingOrder.user,
            paymentMethod,
            amount: existingOrder.totalPrice,
            transactionId,
        });

        await payment.save();

        res.status(201).json({ status: 201, message: "Payment created successfully.", payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error creating payment.", error: error.message });
    }
};

//! Put Request
//? Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status } = req.body;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ status: 404, message: "Payment not found." });
        }

        // Update status
        payment.status = status;
        await payment.save();

        res.status(200).json({ status: 200, message: "Payment status updated successfully.", payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error updating payment status.", error: error.message });
    }
};

