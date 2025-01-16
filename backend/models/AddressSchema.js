const mongoose = require('mongoose');

exports.AddressSchema = mongoose.Schema({
    title: { type: String },
    addressLine: { type: String, required: true },
    recipientPhoneNumber: { type: String, required: true },
    recipientFullName: { type: String, required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    } // مختصات مکانی
});