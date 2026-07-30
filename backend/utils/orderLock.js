const redis = require('../config/redis');

// createOrder has a real double-submit window: for online payments the cart
// isn't cleared until the user comes back through verifyPayment (they're
// away at Zarinpal in between), so a double-click or a client retrying a
// slow request can create two separate Order+Payment docs — and two separate
// Zarinpal payment requests — from the same cart. A short per-user lock
// closes that window without needing a client-supplied idempotency key.
// Fails open when Redis is off/unreachable: this must never be able to block
// checkout entirely.
const LOCK_TTL_MS = 10 * 1000;
const key = (userId) => `lock:create-order:${userId}`;

exports.acquireOrderLock = async (userId) => {
    if (!redis.isOpen) return true;
    try {
        const ok = await redis.set(key(userId), '1', { NX: true, PX: LOCK_TTL_MS });
        return ok === 'OK';
    } catch (err) {
        console.error('Failed to acquire order lock:', err.message);
        return true;
    }
};

exports.releaseOrderLock = async (userId) => {
    if (!redis.isOpen) return;
    try {
        await redis.del(key(userId));
    } catch (err) {
        console.error('Failed to release order lock:', err.message);
    }
};
