const rateLimit = require('express-rate-limit');

const message = (text) => ({ status: 429, message: text });

// Broad safety net for the whole API. Generous enough not to interfere with
// normal browsing (menu/branch pages fire several requests per page).
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 500,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: message("تعداد درخواست‌های شما بیش از حد مجاز است. لطفا کمی بعد دوباره تلاش کنید."),
});

// OTP request/verify are the abuse-prone endpoints: requesting an OTP will cost
// money once SMS is wired up, and the OTP itself is only 5 digits, so verify is
// brute-forceable without a strict cap.
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: message("تعداد تلاش‌های شما بیش از حد مجاز است. لطفا ۱۵ دقیقه دیگر دوباره تلاش کنید."),
});

module.exports = { globalLimiter, otpLimiter };
