const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redis = require('../config/redis');

const message = (text) => ({ status: 429, message: text });

// Without this, limits are counted in-process (express-rate-limit's default
// MemoryStore): a restart resets everyone's count to zero, and if the API
// ever runs as more than one instance, each instance counts independently —
// both defeat the point of an abuse limiter. A Redis-backed store makes the
// count shared and durable. Falls back to MemoryStore automatically when
// Redis isn't enabled, so local dev without Redis still works.
const store = (prefix) => redis.enabled
    ? new RedisStore({ sendCommand: (...args) => redis.sendCommand(args), prefix })
    : undefined;

// Broad safety net for the whole API. Generous enough not to interfere with
// normal browsing (menu/branch pages fire several requests per page).
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 500,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: store('rl:global:'),
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
    store: store('rl:otp:'),
    message: message("تعداد تلاش‌های شما بیش از حد مجاز است. لطفا ۱۵ دقیقه دیگر دوباره تلاش کنید."),
});

module.exports = { globalLimiter, otpLimiter };
