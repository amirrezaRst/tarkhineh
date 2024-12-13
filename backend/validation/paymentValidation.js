const joi = require('joi');

exports.createPaymentValidation = (req, res, next) => {
    const schema = joi.object({
        order: joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                "string.base": "Order ID must be a valid string.",
                "string.pattern.base": "Order ID must be a valid MongoDB ObjectId.",
                "any.required": "Order ID is required."
            }),
        paymentMethod: joi.string()
            .valid('online', 'cash')
            .required()
            .messages({
                "string.base": "Payment method must be a string.",
                "any.only": "Payment method must be one of ['online', 'cash'].",
                "any.required": "Payment method is required."
            }),
        transactionId: joi.string()
            .optional()
            .allow(null, '')
            .messages({
                "string.base": "Transaction ID must be a string."
            })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};

exports.updatePaymentStatusValidation = (req, res, next) => {
    const schema = joi.object({
        status: joi.string()
            .trim()
            .valid("pending", "completed", "failed")
            .required()
            .messages({
                "string.base": "Status must be a string.",
                "any.only": "Status must be one of ['pending', 'completed', 'failed'].",
                "any.required": "Status is required."
            })
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
}