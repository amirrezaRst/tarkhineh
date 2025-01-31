const joi = require('joi');

exports.addNewItemCartValidation = (req, res, next) => {
    const schema = joi.object({
        user: joi.string().required(),
        menuItem: joi.string().required(),
        quantity: joi.number().min(1).default(1),
        branch: joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    if (!req.body.quantity) req.body.quantity = 1;

    next();
};

exports.decreaseQuantityValidation = (req, res, next) => {
    const schema = joi.object({
        menuItemId: joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};