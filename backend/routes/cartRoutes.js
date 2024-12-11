const express = require('express');
const router = express.Router();
const { addItemToCart, getCartByUserId, updateCart, removeItemFromCart, clearCart } = require('../controllers/cartController');
const { addNewItemCart } = require('../validation/cartValidation');

router.post('/add', addNewItemCart, addItemToCart);

router.get('/:userId', getCartByUserId);

router.delete('/remove/:userId', removeItemFromCart);

router.delete('/clear/:userId', clearCart);

module.exports = router;
