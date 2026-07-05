const express = require('express');
const router = express.Router();
const { addItemToCart, getCartByUserId, updateCart, removeItemFromCart, clearCart, decreaseItemQuantity, repeatOrder } = require('../controllers/cartController');
const { addNewItemCartValidation, decreaseQuantityValidation, repeatOrderValidation } = require('../validation/cartValidation');
const Authenticate = require('../middleware/Authenticate');
const AuthorizeOwner = require('../middleware/AuthorizeOwner');
const ValidateObjectId = require('../middleware/ValidateObjectId');

router.post('/add', Authenticate, [addNewItemCartValidation], addItemToCart);
router.patch('/decrease/:id', Authenticate, AuthorizeOwner('id'), [ValidateObjectId, decreaseQuantityValidation], decreaseItemQuantity);
router.post('/repeat', Authenticate, [repeatOrderValidation], repeatOrder);

router.get('/', Authenticate, getCartByUserId);

router.delete('/remove/:userId', Authenticate, AuthorizeOwner('userId'), removeItemFromCart);

router.delete('/clear/:userId', Authenticate, AuthorizeOwner('userId'), clearCart);

module.exports = router;
