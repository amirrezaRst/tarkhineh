const redis = require('../config/redis');

// OTP is a short-lived value that needs an expiry — exactly what Redis TTLs
// are for, versus the previous approach of a Date field on the User document
// checked manually on every verify. Falls back to the caller storing it on
// the User doc itself (the original behavior) when Redis is off, so
// registration/login keeps working with zero external dependencies by
// default — this is not allowed to become a hard dependency for auth.
const OTP_TTL_SECONDS = 10 * 60;
const key = (phone) => `otp:${phone}`;

exports.otpBackedByRedis = () => redis.isOpen;

exports.setOtp = async (phone, code) => {
    await redis.setEx(key(phone), OTP_TTL_SECONDS, code);
};

exports.getOtp = async (phone) => {
    return redis.get(key(phone));
};

exports.clearOtp = async (phone) => {
    await redis.del(key(phone));
};
