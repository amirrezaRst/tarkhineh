const joi = require("joi")

exports.createCouponValidation = (req, res, next) => {
    const schema = joi.object({
        description: joi.string(),
        discountType: joi.string().valid("percentage", "flat").required(),
        discountValue: joi.number().required(),
        maxAmount: joi.number(),
        minAmount: joi.number(),
        usageLimit: joi.number().default(1),
        user: joi.string(),
        validFrom: joi.date(),
        validTo: joi.date().required(),
        active: joi.boolean().default(true),
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};