const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, updateOrderStatus, deleteOrder, getOrdersByUser, approveOrder } = require('../controllers/orderController');
const { createOrderValidation, updateOrderStatusValidation, approveOrderValidation } = require('../validation/orderValidation');


// Create a new order
router.post('/', createOrderValidation, createOrder);

// Get an order by ID
router.get('/:id', getOrderById);

// Get all orders for a specific user
router.get('/user/:userId', getOrdersByUser);

// Update order status
router.patch('/:id/status', updateOrderStatusValidation, updateOrderStatus);

//! Update EstimatedDeliveryTime and ApprovedAt Field
router.patch("/:id/approved", approveOrderValidation, approveOrder);

// Delete an order
router.delete('/:id', deleteOrder);


module.exports = router;