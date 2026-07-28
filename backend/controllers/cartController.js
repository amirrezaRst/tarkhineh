const mongoose = require('mongoose');
const Cart = require('../models/CartModel');
const Menu = require('../models/MenuModel');
const Discount = require('../models/DiscountModel');


//! Get Request
//? Get User Cart by userID
exports.getCartByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

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
            },
            cartBranch: cart.branch
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
        const user = req.user.id;
        const { menuItem, quantity, branch } = req.body;

        const menuItemExists = await Menu.findById(menuItem).select("_id available");
        if (!menuItemExists) {
            return res.status(404).json({ status: 404, message: 'Menu item not found.' });
        }
        if (menuItemExists.available === false) {
            return res.status(409).json({ status: 409, message: 'This menu item is currently unavailable.' });
        }

        let cart = await Cart.findOne({ user })
            .populate('items.menuItem', "_id name price images ingredients");

        if (cart) {
            if (branch != cart.branch) return res.status(400).json({ status: 400, message: "The branch of the selected item does not match the branch of the items already in your cart. Please choose items from the same branch" });
            const itemIndex = cart.items.findIndex(item => item.menuItem._id.toString() === menuItem);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                let newItem = await Menu.findById(menuItem).select("_id name price images ingredients")
                cart.items.push({ menuItem: newItem, quantity });
            }
            await cart.save();
            res.status(200).json({ status: 200, message: 'Item added to cart successfully.', cart });
        } else {
            let newItem = await Menu.findById(menuItem).select("_id name price images ingredients")
            cart = new Cart({ user, items: [{ menuItem: newItem, quantity }], branch });
            await cart.save();
            res.status(201).json({ status: 201, message: 'Cart created and item added.', cart });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'An error occurred while adding item to the cart.' });
    }
};

exports.repeatOrder = async (req, res) => {
    try {
        const user = req.user.id;
        const { items, branch } = req.body; // items = [{ menuItem, quantity }]

        // چک کردن اینکه همه آیتم‌ها وجود دارن
        const menuIds = items.map(i => i.menuItem);
        const foundMenuItems = await Menu.find({ _id: { $in: menuIds } }).select("_id name price images ingredients");

        if (foundMenuItems.length !== menuIds.length) {
            return res.status(404).json({ status: 404, message: 'One or more menu items not found.' });
        }

        let cart = await Cart.findOne({ user }).populate('items.menuItem', "_id name price images ingredients");

        if (cart) {
            if (cart.branch != branch) {
                return res.status(400).json({
                    status: 400,
                    message: "The branch of the selected items does not match the branch of the existing cart items."
                });
            }

            // اضافه یا آپدیت آیتم‌ها
            for (let i of items) {
                const existingIndex = cart.items.findIndex(ci => ci.menuItem._id.toString() === i.menuItem);
                if (existingIndex > -1) {
                    cart.items[existingIndex].quantity += i.quantity;
                } else {
                    const menuData = foundMenuItems.find(m => m._id.toString() === i.menuItem);
                    if (menuData) cart.items.push({ menuItem: menuData, quantity: i.quantity });
                }
            }

            await cart.save();
            return res.status(200).json({ status: 200, message: 'Items added to cart.', cart });

        } else {
            // سبد جدید
            const newItems = items.map(i => {
                const menuData = foundMenuItems.find(m => m._id.toString() === i.menuItem);
                return { menuItem: menuData, quantity: i.quantity };
            });

            cart = new Cart({ user, items: newItems, branch });
            await cart.save();

            return res.status(201).json({ status: 201, message: 'New cart created with repeated items.', cart });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'An error occurred while repeating the order.' });
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
