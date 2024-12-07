const mongoose = require('mongoose');

exports.AddressSchema = mongoose.Schema({
    title: { type: String },
    addressLine: { type: String, required: true },
    recipientPhoneNumber: { type: Number, required: true },
    recipientFullname: { type: String, required: true },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    } // مختصات مکانی
});