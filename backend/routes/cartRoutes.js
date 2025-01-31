const express = require('express');
const router = express.Router();
const { addItemToCart, getCartByUserId, updateCart, removeItemFromCart, clearCart, decreaseItemQuantity } = require('../controllers/cartController');
const { addNewItemCartValidation, decreaseQuantityValidation } = require('../validation/cartValidation');
const Authenticate = require('../middleware/Authenticate');
const ValidateObjectId = require('../middleware/ValidateObjectId');

router.post('/add', [addNewItemCartValidation, Authenticate], addItemToCart);
router.patch('/decrease/:id', [ValidateObjectId, decreaseQuantityValidation, Authenticate], decreaseItemQuantity);

router.get('/', getCartByUserId);

router.delete('/remove/:userId', [Authenticate], removeItemFromCart);

router.delete('/clear/:userId', clearCart);

module.exports = router;