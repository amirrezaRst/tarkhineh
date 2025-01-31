const mongoose = require('mongoose');
const Cart = require('../models/CartModel');
const Menu = require('../models/MenuModel');
const User = require('../models/UserModel');
const Discount = require('../models/DiscountModel');
const jwt = require('jsonwebtoken');


//! Get Request
//? Get User Cart by userID
// exports.getCartByUserId = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const cart = await Cart.findOne({ user: userId }).populate('items.menuItem',"_id name price images");

//         if (!cart) {
//             return res.status(404).json({ status: 404, message: 'Cart not found for this user.' });
//         }

//         res.status(200).json({ status: 200, message: "new item added to the cart", cart });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 500, message: 'An error occurred while fetching the cart.' });
//     }
// };

exports.getCartByUserId = async (req, res) => {
    try {
        const { refreshToken, token } = req.cookies;
        var userId = null;

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            userId = decoded.id;
        }
        else if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        }
        else {
            return res.status(401).json({ status: 401, message: "Unauthorized" });
        }

        const cart = await Cart.findOne({ user: userId })
            .populate('items.menuItem', "_id name price images ingredients");

        if (!cart) {
            return res.status(404).json({ status: 404, message: 'Cart not found for this user.' });
        }

        //! adding discounts to each menu item in the cart
        const itemsWithDiscounts = await Promise.all(
            cart.items.map(async (item) => {
                const discount = await Discount.findOne({
                    menuItem: item.menuItem._id,
                    active: true,
                    startDate: { $lte: new Date() },
                    endDate: { $gte: new Date() }
                }).select("discountType discountValue");

                return {
                    ...item._doc, //! copy menu info
                    menuItem: {
                        ...item.menuItem._doc, //! we copy the menu item info
                        discount: discount || null //! discount
                    }
                };
            })
        );

        res.status(200).json({
            status: 200,
            message: "Cart fetched successfully.",
            cart: {
                user: cart.user,
                items: itemsWithDiscounts //! sending the items with their respective discounts
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'An error occurred while fetching the cart.' });
    }
};



//! Post Request
//? Add Item to Cart
exports.addItemToCart = async (req, res) => {
    try {
        const { user, menuItem, quantity, branch } = req.body;

        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ status: 404, message: 'User not found.' });
        }

        const menuItemExists = await Menu.findById(menuItem).select("_id");
        if (!menuItemExists) {
            return res.status(404).json({ status: 404, message: 'Menu item not found.' });
        }

        let cart = await Cart.findOne({ user })
            .populate('items.menuItem', "_id name price images ingredients");

        if (cart) {
            if (branch != cart.branch) return res.status(400).json({ status: 400, message: "The branch of the selected item does not match the branch of the items already in your cart. Please choose items from the same branch" });
            const itemIndex = cart.items.findIndex(item => item.menuItem._id.toString() === menuItem);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ menuItem, quantity });
            }
            await cart.save();
            res.status(200).json({ status: 200, message: 'Item added to cart successfully.', cart });
        } else {
            cart = new Cart({ user, items: [{ menuItem, quantity }], branch });
            await cart.save();
            res.status(201).json({ status: 201, message: 'Cart created and item added.', cart });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'An error occurred while adding item to the cart.' });
    }
};

//! Patch Request
//? Update Item Quantity in Cart
exports.decreaseItemQuantity = async (req, res) => {
    const { id } = req.params;
    const { menuItemId } = req.body;
    const cart = await Cart.findOne({ user: id })
        .select("-branch -user")
        .populate('items.menuItem', "_id name price images ingredients");

    if (!cart) {
        return res.status(404).json({ status: 404, message: 'User not found.' });
    }

    const itemIndex = cart.items.findIndex(item => item.menuItem._id.toString() === menuItemId);
    if (itemIndex === -1) return res.status(400).json({ status: 400, message: "there is no item with this menuItemId" });


    if (cart.items[itemIndex].quantity === 1) {
        cart.items = cart.items.filter(item => item.menuItem._id.toString() !== menuItemId);
        cart.save();

        return res.status(200).json({ status: 200, message: 'Item removed from cart.', cart });
    } else {
        cart.items[itemIndex].quantity -= 1;
        cart.save();

        res.status(200).json({ status: 201, message: 'Item quantity decreased.', cart });
    }


    // Cart.findOne({ user: userId }).then(cart => {
    //     if (!cart) {
    //         return res.status(404).json({ status: 404, message: 'User not found.' });
    //     }

    //     const itemIndex = cart.items.findIndex(item => item.menuItem._id.toString() === menuItemId);

    //     if (itemIndex === -1) return res.status(400).json({ status: 400, message: "there is no item with this menuItemId" });

    //     if (cart.items[itemIndex].quantity === 1) {
    //         cart.items = cart.items.filter(item => item.menuItem._id.toString() !== menuItemId);
    //     } else {
    //         cart.items[itemIndex].quantity -= 1;
    //     }

    //     cart.save()
    //         .then(() => res.status(200).json({ status: 200, message: 'Item quantity decreased.', cart }))
    //         .catch(err => res.status(500).json({ status: 500, message: 'An error occurred while decreasing item quantity.' }));
    // })
    //     .catch(err => res.status(500).json({ status: 500, message: 'An error occurred while decreasing item quantity.' }));
}

//! Delete Request
//? Remove Item from Cart
exports.removeItemFromCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { menuItemId } = req.body;

        const itemId = new mongoose.Types.ObjectId(menuItemId);

        let cart = await Cart.findOne({ user: userId })
            .select("items")
            .populate('items.menuItem', "_id name price images ingredients");

        if (!cart) {
            return res.status(404).json({ status: 404, message: 'User not found.' });
        }

        const itemIndex = cart.items.findIndex(item => item.menuItem._id.toString() === itemId.toString())

        if (itemIndex === -1) return res.status(400).json({ status: 400, message: "there is no item with this menuItemId" })

        cart.items = cart.items.filter(item => item.menuItem._id.toString() !== itemId.toString());

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
