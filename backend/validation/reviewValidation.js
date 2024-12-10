const joi = require('joi');


exports.createReviewValidation = (req, res, next) => {
    const schema = joi.object({
        text: joi.string().trim().required(),
        rating: joi.number().required(),
        user: joi.string().required(),
        menuItem: joi.string().required(),
        branch: joi.string().required(),
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
};



exports.updateReviewValidation = (req, res, next) => {
    const schema = joi.object({
        text: joi.string().trim().required(),
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    next();
}
//! add more validation functions here