const BranchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phoneNumber: { type: String, required: true },
    images: [{ type: String }],
    workingHours: {
        openTime: { type: String, required: true },
        closeTime: { type: String, required: true },
    },
});

module.exports = mongoose.model("Branch", BranchSchema);