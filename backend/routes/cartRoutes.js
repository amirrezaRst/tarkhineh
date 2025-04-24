const express = require('express');
const router = express.Router();
const { addItemToCart, getCartByUserId, updateCart, removeItemFromCart, clearCart, decreaseItemQuantity, repeatOrder } = require('../controllers/cartController');
const { addNewItemCartValidation, decreaseQuantityValidation, repeatOrderValidation } = require('../validation/cartValidation');
const Authenticate = require('../middleware/Authenticate');
const ValidateObjectId = require('../middleware/ValidateObjectId');

router.post('/add', [addNewItemCartValidation, Authenticate], addItemToCart);
router.patch('/decrease/:id', [ValidateObjectId, decreaseQuantityValidation, Authenticate], decreaseItemQuantity);
router.post('/repeat', [repeatOrderValidation, Authenticate], repeatOrder);

router.get('/', getCartByUserId);

router.delete('/remove/:userId', [Authenticate], removeItemFromCart);

router.delete('/clear/:userId', [Authenticate], clearCart);

module.exports = router;