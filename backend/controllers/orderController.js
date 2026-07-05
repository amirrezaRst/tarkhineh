const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const Payment = require('../models/PaymentModel');
const Cart = require('../models/CartModel');
const Discount = require('../models/DiscountModel');
const Coupon = require('../models/CouponModel');
const ZarinpalCheckout = require("zarinpal-checkout");
const { ROLES, STAFF_ROLES } = require('../config/roles');

const zarinpal = ZarinpalCheckout.create(
    process.env.ZARINPAL_MERCHANT_ID,
    process.env.ZARINPAL_SANDBOX !== "false",
    "IRT"
);

const COURIER_DELIVERY_FEE = 26000;

//! Get Request
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate('user', 'fullName email').populate('items.menuItem', 'name price');

        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        const isOwner = order.user._id.toString() === req.user.id;
        const isAdmin = req.user.role === ROLES.ADMIN;
        const isBranchStaff = [ROLES.BRANCH_MANAGER, ROLES.COURIER].includes(req.user.role)
            && req.user.branch && order.branch?.toString() === req.user.branch;

        if (!isOwner && !isAdmin && !isBranchStaff) {
            return res.status(403).json({ status: 403, message: "You do not have access to this order" });
        }

        res.status(200).json({ status: 200, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error fetching order", error: error.message });
    }
};

// exports.getOrdersByUser = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const status = req.query.status || "all";

//         const orders = await Order.find({ user: userId })
//             .populate('items.menuItem', 'name price')
//             .sort({ createdAt: -1 });

//         res.status(200).json({ status: 200, orders });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 500, message: "Error fetching user's orders", error: error.message });
//     }
// };


exports.getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const status = req.query.status || "all";

        // Pagination query params
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const query = { user: userId };

        if (status !== "all" && ['delivered', 'cancelled', 'preparing'].includes(status)) {
            if (status === "preparing") {
                query.status = { $in: ['pending', 'preparing', 'on_the_way'] };
            } else {
                query.status = status;
            }
        }

        // Count total for pagination
        const totalCount = await Order.countDocuments(query);

        // Fetch paginated orders
        const orders = await Order.find(query)
            .populate('items.menuItem', 'name price images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: 200,
            orders,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Error fetching user's orders",
            error: error.message,
        });
    }
};




//! Post Request
exports.createOrder = async (req, res) => {
    try {
        const user = req.user.id;
        const { deliveryType, deliveryAddress, paymentMethod, customerNote, couponCode } = req.body;

        //! Validate user
        const userExists = await User.findById(user).select("phoneNumber");
        if (!userExists) {
            return res.status(404).json({ status: 404, message: "User not found" });
        };

        //! Price is computed entirely server-side from the user's own cart -
        //! never trust an amount/discount/deliveryFee sent by the client.
        const cart = await Cart.findOne({ user }).populate("items.menuItem", "price");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ status: 400, message: "Cart is empty" });
        }

        const now = new Date();
        const orderItems = [];
        let totalPrice = 0;

        for (const cartItem of cart.items) {
            const menuItem = cartItem.menuItem;
            const activeDiscount = await Discount.findOne({
                menuItem: menuItem._id,
                active: true,
                startDate: { $lte: now },
                endDate: { $gte: now },
            }).select("discountType discountValue");

            let price = menuItem.price;
            if (activeDiscount) {
                price = activeDiscount.discountType === "percentage"
                    ? price - (price * activeDiscount.discountValue) / 100
                    : price - activeDiscount.discountValue;
            }
            price = Math.max(Math.round(price), 0);

            orderItems.push({ menuItem: menuItem._id, quantity: cartItem.quantity, price });
            totalPrice += price * cartItem.quantity;
        }

        let discount = 0;
        let appliedCoupon = null;

        if (couponCode) {
            appliedCoupon = await Coupon.findOne({ code: couponCode, active: true });
            if (!appliedCoupon) {
                return res.status(404).json({ status: 404, message: "Coupon not found." });
            }
            if (appliedCoupon.validFrom > now || appliedCoupon.validTo < now) {
                return res.status(400).json({ status: 400, message: "این کد تخفیف دیگر معتبر نیست." });
            }
            if (appliedCoupon.maxAmount && totalPrice > appliedCoupon.maxAmount) {
                return res.status(400).json({ status: 400, message: "مبلغ سفارش بیش از حد مجاز است!" });
            }
            if (appliedCoupon.minAmount && totalPrice < appliedCoupon.minAmount) {
                return res.status(400).json({ status: 400, message: "سفارش شما کمتر از حداقل مبلغ مورد نیاز است!" });
            }

            discount = appliedCoupon.discountType === "percentage"
                ? (totalPrice * appliedCoupon.discountValue) / 100
                : appliedCoupon.discountValue;
            discount = Math.min(Math.round(discount), totalPrice);
        }

        const deliveryFee = deliveryType === "courier" ? COURIER_DELIVERY_FEE : 0;
        const finalPrice = totalPrice - discount + deliveryFee;
        const branch = cart.branch;

        if (appliedCoupon) {
            // atomic decrement so two concurrent orders can't both redeem the last use
            const consumed = await Coupon.findOneAndUpdate(
                { _id: appliedCoupon._id, usageLimit: { $gt: 0 } },
                { $inc: { usageLimit: -1 } }
            );
            if (!consumed) {
                return res.status(400).json({ status: 400, message: "این کد تخفیف دیگر معتبر نیست." });
            }
        }

        const order = new Order({
            user,
            items: orderItems,
            totalPrice,
            discount,
            finalPrice,
            deliveryFee,
            deliveryType,
            ...(deliveryType === "courier" && { deliveryAddress }),
            paymentMethod,
            branch,
            customerNote,
            pickupCode: Math.floor(1000 + Math.random() * 9000),
        });

        const payment = new Payment({
            order: order._id,
            user,
            paymentMethod,
            amount: finalPrice,
        });

        if (paymentMethod === "online") {
            try {
                const response = await zarinpal.PaymentRequest({
                    Amount: finalPrice,
                    CallbackURL: `${process.env.FRONT_ADDRESS}payment-status`,
                    Description: `پرداخت برای سفارش شماره ${order._id} از رستوران زنجیره‌ای ترخینه. مبلغ نهایی شامل هزینه غذا، تخفیف‌ها و هزینه ارسال می‌باشد. لطفاً در صورت بروز هرگونه مشکل، با پشتیبانی تماس بگیرید.`,
                    Mobile: userExists.phoneNumber,
                });

                if (response.status !== 100) {
                    throw new Error("Zarinpal rejected the payment request");
                }

                payment.paymentCode = response.authority;
                await order.save();
                await payment.save();

                return res.status(200).json({ status: 200, message: "Payment request was successful. Please proceed to complete the payment.", url: response.url });
            } catch (err) {
                console.error(err);
                return res.status(400).json({ status: 400, message: "Payment request encountered an issue. Please try again later." });
            }
        }

        await order.save();
        await payment.save();
        await Cart.findOneAndDelete({ user });

        const successMessage = deliveryType === "courier"
            ? "Order created successfully. Your order will be delivered soon."
            : "Order created successfully. Please proceed to pick up your order.";

        return res.status(201).json({ status: 201, message: successMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Error creating order", error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const { authority } = req.params;

    const payment = await Payment.findOne({ paymentCode: authority }).select("order user status amount transactionId");
    if (!payment) return res.status(404).json({ status: 404, message: "no payment found with this code. please check your information" })

    const userOrder = await Order.findById(payment.order).select("paymentTransactionId");
    if (!userOrder) return res.status(404).json({ status: 404, message: "no order found for this payment" })

    zarinpal.PaymentVerification({
        Amount: payment.amount,
        Authority: authority,
    })
        .then(async (response) => {
            const { status } = response;
            if (status === 100) {
                payment.transactionId = response.refId;
                payment.status = "completed";
                userOrder.paymentTransactionId = response.refId;

                await Cart.findOneAndDelete({ user: payment.user });

                await payment.save();
                await userOrder.save();

                res.status(200).json({
                    status: 200,
                    message: "Payment verification successful. Your order is confirmed and the transaction has been completed.",
                    transactionId: response.refId,
                    orderStatus: 100,
                });
            } else if (status === 101) {
                res.status(200).json({
                    status: 200,
                    message: "Payment has already been verified. Your order has been successfully processed.",
                    transactionId: response.refId,
                    orderStatus: 101,
                });
            } else {
                payment.status = "failed";
                await payment.save();

                console.log("response: ", response);
                res.status(400).json({
                    status: 400,
                    message: "Payment verification failed or invalid status. Please check your payment details and try again.",
                });
            }
        })
        .catch((err) => {
            console.error(err);
            if (err.errors.code == -51) return res.status(400).json({ status: 400, message: "payment verification failed or invalid status" })
            res.status(500).json({
                status: 500,
                message: "An error occurred while verifying the payment. Please try again later.",
                error: err.message,
            });
        });
};


//! Put Request
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId).select("user branch totalPrice status").populate("user", "fullName email phoneNumber");
        if (!order) return res.status(404).json({ status: 404, message: "Order not found" });

        const isStaff = STAFF_ROLES.includes(req.user.role);
        if (!isStaff) {
            const isOwner = order.user._id.toString() === req.user.id;
            if (!isOwner) {
                return res.status(403).json({ status: 403, message: "You do not have access to this order" });
            }
            if (status !== "cancelled") {
                return res.status(403).json({ status: 403, message: "You can only cancel your own order" });
            }
        } else if (req.user.role === ROLES.BRANCH_MANAGER || req.user.role === ROLES.COURIER) {
            if (!req.user.branch || order.branch?.toString() !== req.user.branch) {
                return res.status(403).json({ status: 403, message: "You do not have access to this branch's orders" });
            }
        }

        if (status === "cancelled" && order.status === "on_the_way") {
            return res.status(400).json({
                status: 400,
                message: "سفارشی که در حال ارسال است قابل لغو نیست.",
            });
        };

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


//! Patch Request
exports.approveOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params;
        const { estimatedDeliveryTime } = req.body; //! Estimated delivery time set by the manager

        //! Find the order
        const order = await Order.findById(orderId).select("branch approvedAt estimatedDeliveryTime");
        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found." });
        }

        if (req.user.role === ROLES.BRANCH_MANAGER && (!req.user.branch || order.branch?.toString() !== req.user.branch)) {
            return res.status(403).json({ status: 403, message: "You do not have access to this branch's orders" });
        }

        //! Check if the order is already approved
        if (order.approvedAt) {
            return res.status(400).json({ status: 400, message: "Order is already approved." });
        }

        //! Set approval timestamp and estimated delivery time
        order.approvedAt = new Date();
        if (estimatedDeliveryTime) {
            order.estimatedDeliveryTime = new Date(order.approvedAt.getTime() + estimatedDeliveryTime * 60000);
        };

        await order.save();

        return res.status(200).json({
            status: 200,
            message: "Order approved successfully.",
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Internal server error.", error: error.message });
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

