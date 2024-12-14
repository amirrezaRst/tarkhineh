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
        foodType: joi.string()
            .when("category", {
                is: joi.valid("main", "side"),
                then: joi.valid("iranian", "non-iranian", "pizza", "sandwich").required().messages({
                    "any.required": "food type is required when category is main or side.",
                    "any.only": "food type must be one of ['iranian', 'non-iranian', 'pizza', 'sandwich'].",
                }),
                otherwise: joi.forbidden().messages({
                    "any.unknown": "food type is not allowed when category is not main or side."
                }),
            }),
        isPersian: joi.boolean()
            .when("category", {
                is: joi.valid("dessert", "drink"),
                then: joi.required().messages({
                    "any.required": "isPersian is required when category is dessert or drink.",
                }),
                otherwise: joi.forbidden().messages({
                    "any.unknown": "isPersian is not allowed when category is not dessert or drink."
                }),
            }),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};
