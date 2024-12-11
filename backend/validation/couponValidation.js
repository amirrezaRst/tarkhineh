const joi = require("joi")

exports.createCouponValidation = (req, res, next) => {
    const schema = joi.object({
        description: joi.string(),
        discountType: joi.string().valid("percentage", "flat").required(),
        discountValue: joi.number().required(),
        maxDiscountAmount: joi.number(),
        usageLimit: joi.number().default(1),
        usedCount: joi.number().default(0),
        user: joi.string(),
        validFrom: joi.date().required(),
        validTo: joi.date().required(),
        active: joi.boolean().default(true),
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details[0].message });

    next();
};