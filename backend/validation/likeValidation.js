const joi = require('joi');

module.exports = (req, res, next) => {
    const schema = joi.object({
        user: joi.string().required().messages({
            'string.base': 'User ID should be a string.',
            'string.empty': 'User ID cannot be empty.',
            'any.required': 'User ID is required.',
        }),
        menuItem: joi.string().required().messages({
            'string.base': 'Menu Item ID should be a string.',
            'string.empty': 'Menu Item ID cannot be empty.',
            'any.required': 'Menu Item ID is required.',
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
}