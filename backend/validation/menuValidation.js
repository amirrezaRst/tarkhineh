const joi = require("joi")

exports.createMenuValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().trim().required(),
        description: joi.string().trim(),
        price: joi.number().required(),
        category: joi.string().valid("main", "side", "dessert", "drink").required(),
        images: joi.array().items(joi.string()),
        ingredients: joi.array().items(joi.string()),
        available: joi.boolean().required(),
        discount: joi.string(),
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};
