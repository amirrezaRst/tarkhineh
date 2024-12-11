const joi = require("joi")

exports.createDiscountValidation = (req, res, next) => {
    const schema = joi.object({
        menuItem: joi.string().required(),
        discountType: joi.string().required(),
        discountValue: joi.number().required(),
        startDate: joi.date().required(),
        endDate: joi.date().required(),
        active: joi.boolean().default(true)
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};