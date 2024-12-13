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
        deliveryAddress: joi.object({
            title: joi.string().allow(null, '').messages({
                "string.base": "Title must be a string."
            }),
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
            recipientFullname: joi.string().required().messages({
                "any.required": "Recipient full name is required."
            }),
            coordinates: joi.object({
                lat: joi.number().messages({
                    "number.base": "Latitude must be a number."
                }),
                lng: joi.number().messages({
                    "number.base": "Longitude must be a number."
                })
            }).messages({
                "object.base": "Coordinates must be an object containing 'lat' and 'lng'."
            }),
        }).required(true),
        paymentMethod: joi.string()
            .valid("cash", "online")
            .default("online")
            .messages({
                "any.only": "Payment method must be 'cash' or 'online'."
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    if (!req.body.discount) req.body.discount = 0;
    if (!req.body.deliveryFee) req.body.deliveryFee = 0;

    next();
}

exports.updateOrderStatusValidation = (req, res, next) => {
    const schema = joi.object({
        status: joi.string().trim().required().messages({
            "string.base": "Status must be a string.",
            "any.required": "Status is required."
        })
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
}