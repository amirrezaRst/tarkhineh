const mongoose = require('mongoose');
const Cart = require('../models/CartModel');
const Menu = require('../models/MenuModel');
const User = require('../models/UserModel');


//! Get Request
//? Get User Cart by userID
exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');

        if (!cart) {
            return res.status(404).json({ status: 404, message: 'Cart not found for this user.' });
        }

        res.status(200).json({ status: 200, message: "new item added to the cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'An error occurred while fetching the cart.' });
    }
};


//! Post Request
//? Add Item to Cart
exports.addItemToCart = async (req, res) => {
    try {
        const { user, menuItem, quantity } = req.body;
        console.log(req.body)
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ status: 404, message: 'User not found.' });
        }

        const menuItemExists = await Menu.findById(menuItem).select("_id");
        if (!menuItemExists) {
            return res.status(404).json({ status: 404, message: 'Menu item not found.' });
        }


        let cart = await Cart.findOne({ user });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItem);
            if (itemIndex > -1) {
                console.log(cart.items[itemIndex].quantity)
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ menuItem, quantity });
            }
            await cart.save();
            res.status(200).json({ message: 'Item added to cart successfully.', cart });
        } else {
            cart = new Cart({ user, items: [{ menuItem, quantity }] });
            await cart.save();
            res.status(201).json({ status: 201, message: 'Cart created and item added.', cart });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'An error occurred while adding item to the cart.' });
    }
};


//! Delete Request
//? Remove Item from Cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { menuItemId } = req.body;

        const itemId = new mongoose.Types.ObjectId(menuItemId);

        let cart = await Cart.findOne({ user: userId }).select("items");
        if (!cart) {
            return res.status(404).json({ status: 404, message: 'User not found.' });
        }

        const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === itemId.toString())

        if (itemIndex === -1) return res.status(400).json({ status: 400, message: "there is no item with this menuItemId" })

        cart.items = cart.items.filter(item => item.menuItem.toString() !== itemId.toString());

        await cart.save();

        res.status(200).json({ status: 200, message: 'Item removed from cart.', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'An error occurred while removing item from cart.' });
    }
};


//? Remove Cart
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        let cart = await Cart.findOneAndDelete({ user: userId });
        if (!cart) {
            return res.status(404).json({ status: 404, message: 'Cart not found for this user.' });
        }

        res.status(200).json({ status: 200, message: 'Cart cleared successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while clearing the cart.' });
    }
};
