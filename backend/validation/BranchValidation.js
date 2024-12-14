const joi = require("joi")

exports.createBranchValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().valid("تهرانپارس", "چالوس", "اقدسیه", "ونک").trim().required().messages({
            "string.base": "Name must be a string.",
            "any.only": "Name must be one of ['تهرانپارس','چالوس','اقدسیه','ونک'].",
            "any.required": "Name is required."
        }),
        manager: joi.string().trim().required().messages({
            "string.base": "Manager bust be a string.",
            "any.required": "Manager is required,"
        }),
        menus: joi.array().items(joi.string()).messages({
            "array.base":"Menus must be a array."
        }),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};


exports.updateBranchValidation = (req, res, next) => {
    const schema = joi.object({
        manager: joi.string().trim().required(),
        menus: joi.array().items(joi.string()),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};