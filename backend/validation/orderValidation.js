const joi = require("joi");


exports.createOrderValidation = (req, res, next) => {
    const schema = joi.object({
        // user/amount/discount/deliveryFee/branch are ignored by the controller
        // (identity comes from the session, price is recomputed server-side from
        // the cart) but still accepted here since the frontend still sends them.
        user: joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
        amount: joi.number().optional(),
        discount: joi.number().min(0).optional(),
        deliveryFee: joi.number().min(0).optional(),
        couponCode: joi.string().trim().optional(),
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
        branch: joi.string().optional(),
        customerNote: joi.string().allow("").default(""),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

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