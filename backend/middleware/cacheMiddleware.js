const redis = require('../config/redis'); // کانکشن ردیس رو جدا می‌نویسیم

// Read-through cache for GET routes. Every failure mode (Redis disabled,
// disconnected, or erroring mid-request) falls back to `next()` instead of
// throwing — caching is an optimization, never a hard dependency for a
// request to succeed. `X-Cache` on the response makes the outcome visible
// without needing to inspect Redis directly.
module.exports = function cache(ttl, keyBuilder, { skip } = {}) {
    return async (req, res, next) => {
        if (!redis.isOpen || (skip && skip(req))) {
            res.set('X-Cache', 'BYPASS');
            return next();
        }

        const key = keyBuilder(req);

        try {
            const cached = await redis.get(key);
            if (cached) {
                res.set('X-Cache', 'HIT');
                return res.status(200).json(JSON.parse(cached));
            }
        } catch (err) {
            console.error('Cache read failed:', err.message);
            res.set('X-Cache', 'BYPASS');
            return next();
        }

        res.set('X-Cache', 'MISS');
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redis.setEx(key, ttl, JSON.stringify(body)).catch((err) => {
                    console.error('Cache write failed:', err.message);
                });
            }
            return originalJson(body);
        };

        next();
    };
};

// Best-effort invalidation for the write side. Accepts any mix of keys/arrays
// so a controller can pass exactly the keys a matching read would have used.
module.exports.invalidate = async (...keys) => {
    const flat = keys.flat().filter(Boolean);
    if (!redis.isOpen || flat.length === 0) return;
    try {
        await redis.del(flat);
    } catch (err) {
        console.error('Cache invalidation failed:', err.message);
    }
};
