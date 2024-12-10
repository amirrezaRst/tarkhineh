const joi = require("joi");

exports.registerValidation = (req, res, next) => {
    const schema = joi.object({
        fullName: joi.string()
            .min(3)
            .max(50)
            .required(),
        email: joi.string()
            .email()
            .trim()
            .lowercase()
            .required(),
        password: joi.string()
            .min(8)
            .max(50)
            .required(),
        phoneNumber: joi.string()
            .min(11)
            .max(11)
            .required(),
        remember: joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details.map(d => d.message) });

    next();
};


exports.loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string()
            .email()
            .trim()
            .lowercase()
            .required(),
        password: joi.string()
            .min(8)
            .max(50)
            .required(),
        remember: joi.boolean()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details.map(d => d.message) });

    next();
};