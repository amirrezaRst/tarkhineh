const ContactMessage = require('../models/ContactMessageModel');

exports.createMessage = async (req, res) => {
    try {
        const { fullName, phoneNumber, email, message } = req.body;

        if (!fullName || !fullName.trim()) return res.status(400).json({ status: 400, message: "نام و نام خانوادگی را وارد کنید." });
        if (!phoneNumber || !/^09\d{9}$/.test(phoneNumber.trim())) return res.status(400).json({ status: 400, message: "شماره تماس معتبر نیست." });
        if (!message || !message.trim()) return res.status(400).json({ status: 400, message: "متن پیام را وارد کنید." });
        if (message.trim().length > 500) return res.status(400).json({ status: 400, message: "پیام نباید بیشتر از ۵۰۰ کاراکتر باشد." });

        await ContactMessage.create({
            fullName: fullName.trim(),
            phoneNumber: phoneNumber.trim(),
            email: email?.trim() || null,
            message: message.trim(),
        });

        res.status(201).json({ status: 201, message: "پیام شما با موفقیت ارسال شد." });
    } catch (error) {
        res.status(500).json({ status: 500, message: "خطایی در ارسال پیام رخ داد.", error: error.message });
    }
};
