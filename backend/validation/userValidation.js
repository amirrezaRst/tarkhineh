const joi = require("joi");

exports.registerValidation = (req, res, next) => {
    const schema = joi.object({
        // fullName: joi.string()
        //     .min(3)
        //     .max(50)
        //     .required(),
        // email: joi.string()
        //     .email()
        //     .trim()
        //     .lowercase()
        //     .required(),
        // password: joi.string()
        //     .min(8)
        //     .max(50)
        //     .required(),
        phoneNumber: joi.string()
            .min(11)
            .max(11)
            .required(),
        // remember: joi.boolean()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details.map(d => d.message) });

    next();
};

exports.verifyOtpValidation = (req, res, next) => {
    const schema = joi.object({
        phoneNumber: joi.string()
            .min(11)
            .max(11)
            .required(),
        otpCode: joi.number()
            // .min(5)
            // .max(5)
            .required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details.map(d => d.message) });

    next();
}


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


exports.newAddressValidation = (req, res, next) => {
    const schema = joi.object({
        title: joi.string()
            .trim()
            .required()
            .messages({
                "string.base": "Title must be a valid string.",
                "any.required": "Title is required."
            }),
        addressLine: joi.string()
            .trim()
            .required()
            .messages({
                "string.base": "Address Line must be a valid string.",
                "any.required": "Address Line is required."
            }),
        recipientPhoneNumber: joi.string()
            .min(11)
            .max(11)
            .required()
            .messages({
                "string.base": "Recipient Phone Number must be a valid string.",
                "string.min": "Recipient Phone Number must be exactly 11 characters long.",
                "string.max": "Recipient Phone Number must be exactly 11 characters long.",
                "any.required": "Recipient Phone Number is required."
            }),
        recipientFullName: joi.string()
            .required()
            .messages({
                "string.base": "Recipient Full Name must be a valid string.",
                "any.required": "Recipient Full Name is required."
            }),
        coordinates: joi.object({
            lat: joi.number()
                .min(-90)
                .max(90)
                .required()
                .messages({
                    "number.base": "Latitude must be a valid number.",
                    "number.min": "Latitude must be greater than or equal to -90.",
                    "number.max": "Latitude must be less than or equal to 90.",
                    "any.required": "Latitude is required."
                }),
            lng: joi.number()
                .min(-180)
                .max(180)
                .required()
                .messages({
                    "number.base": "Longitude must be a valid number.",
                    "number.min": "Longitude must be greater than or equal to -180.",
                    "number.max": "Longitude must be less than or equal to 180.",
                    "any.required": "Longitude is required."
                })
        }).messages({
            "object.base": "Coordinates must be a valid object.",
            // "any.required": "Coordinates field is required."
        })
    })


    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details.map(d => d.message) });

    next();
}


exports.editAddressValidation = (req, res, next) => {
    const schema = joi.object({
        title: joi.string()
            .trim()
            .required()
            .messages({
                "string.base": "Title must be a valid string.",
                "any.required": "Title is required."
            }),
        addressLine: joi.string()
            .trim()
            .required()
            .messages({
                "string.base": "Address Line must be a valid string.",
                "any.required": "Address Line is required."
            }),
        recipientPhoneNumber: joi.string()
            .min(11)
            .max(11)
            .required()
            .messages({
                "string.base": "Recipient Phone Number must be a valid string.",
                "string.min": "Recipient Phone Number must be exactly 11 characters long.",
                "string.max": "Recipient Phone Number must be exactly 11 characters long.",
                "any.required": "Recipient Phone Number is required."
            }),
        recipientFullName: joi.string()
            .required()
            .messages({
                "string.base": "Recipient Full Name must be a valid string.",
                "any.required": "Recipient Full Name is required."
            }),
        coordinates: joi.object({
            lat: joi.number()
                .min(-90)
                .max(90)
                .required()
                .messages({
                    "number.base": "Latitude must be a valid number.",
                    "number.min": "Latitude must be greater than or equal to -90.",
                    "number.max": "Latitude must be less than or equal to 90.",
                    "any.required": "Latitude is required."
                }),
            lng: joi.number()
                .min(-180)
                .max(180)
                .required()
                .messages({
                    "number.base": "Longitude must be a valid number.",
                    "number.min": "Longitude must be greater than or equal to -180.",
                    "number.max": "Longitude must be less than or equal to 180.",
                    "any.required": "Longitude is required."
                })
        }).messages({
            "object.base": "Coordinates must be a valid object.",
            // "any.required": "Coordinates field is required."
        })
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details.map(d => d.message) });

    next();
}

exports.editUserValidation = (req, res, next) => {
    const schema = joi.object({
        fullName: joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                "string.base": "'fullName' must be a valid string.",
                "string.min": "'fullName' must be at least 3 characters long.",
                "string.max": "'fullName' must be at most 50 characters long.",
                "any.required": "'fullName' is required."
            }),
        email: joi.string()
            .email()
            .trim()
            .lowercase()
            .messages({
                "string.base": "'email' must be a valid string.",
            }),
        userName: joi.string()
            .min(3)
            .max(50)
            .messages({
                "string.base": "'userName' must be a valid string.",
                "string.min": "'userName' must be at least 3 characters long.",
                "string.max": "'userName' must be at most 50 characters long.",
            }),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 400, message: error.details.map(d => d.message) });

    next();
}