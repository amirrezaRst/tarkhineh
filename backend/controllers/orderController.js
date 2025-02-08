const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Menu = require('../models/MenuModel');


//! Get Request
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('user', 'fullName email').populate('items.menuItem', 'name price');

        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        res.status(200).json({ status: 200, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error fetching order", error: error.message });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.menuItem', 'name price');

        res.status(200).json({ status: 200, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error fetching user's orders", error: error.message });
    }
};



//! Post Request
exports.createOrder = async (req, res) => {
    try {
        const { user, items, discount, deliveryFee, deliveryAddress, paymentMethod, estimatedDeliveryTime, branch, customerNote, paymentTransactionId } = req.body;

        //! Validate user
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        //! Validate menu items and calculate total price
        let totalPrice = 0;
        const validatedItems = await Promise.all(items.map(async item => {
            const menuItem = await Menu.findById(item.menuItem).select("price");
            if (!menuItem) {
                throw new Error(`Menu item with ID ${item.menuItem} not found.`);
            }
            const price = menuItem.price;
            totalPrice += price * item.quantity;
            return { menuItem: item.menuItem, quantity: item.quantity, price };
        }));

        const finalPrice = totalPrice - discount + deliveryFee;

        //! Create order
        const order = new Order({
            user,
            items: validatedItems,
            totalPrice,
            discount,
            finalPrice,
            deliveryFee,
            deliveryAddress,
            paymentMethod,
            estimatedDeliveryTime,
            branch,
            customerNote,
            paymentTransactionId
        });


        await order.save();

        res.status(201).json({ status: 201, message: "Order created successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error creating order", error: error.message });
    }
};


//! Put Request
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id).select("user totalPrice status").populate("user", "fullName email phoneNumber");
        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        order.status = status;
        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }
        await order.save();

        res.status(200).json({ status: 200, message: "Order status updated successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error updating order status", error: error.message });
    }
};


//! Delete Request
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        res.status(200).json({ status: 200, message: "Order deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error deleting order", error: error.message });
    }
};

