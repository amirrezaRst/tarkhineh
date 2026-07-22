const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, updateOrderStatus, deleteOrder, getOrdersByUser, approveOrder, assignCourier } = require('../controllers/orderController');
const { createOrderValidation, updateOrderStatusValidation, approveOrderValidation, assignCourierValidation } = require('../validation/orderValidation');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');
const AuthorizeOwner = require('../middleware/AuthorizeOwner');
const { ROLES } = require('../config/roles');


// Create a new order
router.post('/', Authenticate, createOrderValidation, createOrder);

// Get an order by ID
router.get('/:id', Authenticate, getOrderById);

// Get all orders for a specific user
router.get('/user/:userId', Authenticate, AuthorizeOwner('userId'), getOrdersByUser);

// Update order status (ownership/staff check happens inside the controller,
// since it needs the order's owning user, not a URL param)
router.patch('/:id/status', Authenticate, updateOrderStatusValidation, updateOrderStatus);

//! Update EstimatedDeliveryTime and ApprovedAt Field
router.patch("/:id/approved", Authenticate, Authorize([ROLES.ADMIN, ROLES.BRANCH_MANAGER]), approveOrderValidation, approveOrder);

// Assign a courier to a courier-delivery order (branch/admin only; branch scoping happens in the controller)
router.patch("/:id/assign-courier", Authenticate, Authorize([ROLES.ADMIN, ROLES.BRANCH_MANAGER]), assignCourierValidation, assignCourier);

// Delete an order
router.delete('/:id', Authenticate, Authorize([ROLES.ADMIN]), deleteOrder);


module.exports = router;
