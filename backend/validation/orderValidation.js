const joi = require("joi");


exports.createOrderValidation = (req, res, next) => {
    const schema = joi.object({
        user: joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
            "string.pattern.base": "Invalid user ID format.",
            "any.required": "User ID is required."
        }),
        items: joi.array()
            .items(
                joi.object({
                    menuItem: joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
                        "string.pattern.base": "Invalid menu item ID format.",
                        "any.required": "Menu item ID is required."
                    }),
                    quantity: joi.number().integer().min(1).required().messages({
                        "number.base": "Quantity must be a number.",
                        "number.min": "Quantity must be at least 1.",
                        "any.required": "Quantity is required."
                    }),
                })
            )
            .min(1)
            .required()
            .messages({
                "array.base": "Items must be an array.",
                "array.min": "At least one item is required.",
                "any.required": "Items are required."
            }),
        discount: joi.number().min(0).default(0).messages({
            "number.base": "Discount must be a number.",
            "number.min": "Discount cannot be negative."
        }),
        deliveryFee: joi.number().min(0).default(0).messages({
            "number.base": "Delivery fee must be a number.",
            "number.min": "Delivery fee cannot be negative."
        }),
        deliveryType: joi.string().valid("courier", "person").required(),
        deliveryAddress: joi.object({
            addressLine: joi.string().required().messages({
                "any.required": "Address line is required."
            }),
            recipientPhoneNumber: joi.string()
                .pattern(/^\d+$/)
                .required()
                .messages({
                    "string.pattern.base": "Recipient phone number must be a valid number.",
                    "any.required": "Recipient phone number is required."
                }),
            recipientFullName: joi.string().required().messages({
                "any.required": "Recipient full name is required."
            }),
        }).when("deliveryType", {
            is: "courier",
            then: joi.required().messages({
                "any.required": "'deliveryAddress' is required when 'deliveryType' is 'courier'"
            }),
            otherwise: joi.forbidden().messages({
                "any.unknown": "'deliveryAddress' is not allowed when 'deliveryType' is not 'courier'"
            })
        }),
        paymentMethod: joi.string()
            .valid("cash", "online")
            // .default("online")
            .required()
            .messages({
                "any.only": "Payment method must be 'cash' or 'online'.",
                "any.required": "'paymentMethod' is required"
            }),
        branch: joi.string().required(),
        customerNote: joi.string().allow("").default(""),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    if (!req.body.discount) req.body.discount = 0;
    if (!req.body.deliveryFee) req.body.deliveryFee = 0;

    next();
}

exports.updateOrderStatusValidation = (req, res, next) => {
    const schema = joi.object({
        status: joi.string()
            .trim()
            .required()
            .valid('pending', 'preparing', 'on_the_way', 'delivered', 'cancelled')
            .messages({
                "string.base": "Status must be a string.",
                "any.required": "Status is required.",
                "any.only": "'status' must be ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled']."
            })
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};


exports.approveOrderValidation = (req, res, next) => {
    const schema = joi.object({
        estimatedDeliveryTime: joi.number().required().messages({
            "number.base": "'estimatedDeliveryTime' must be a number",
            "any.required": "'estimatedDeliveryTime' is required"
        })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};