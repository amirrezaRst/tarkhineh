const joi = require("joi")

exports.createBranchValidation = (req, res, next) => {
    const schema = joi.object({
        manager: joi.string().trim().required(),
        menus: joi.array().items(joi.string()),
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