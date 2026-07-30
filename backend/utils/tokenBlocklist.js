const crypto = require('crypto');
const redis = require('../config/redis');

// The access token is a 1-day JWT and Authenticate only checks its signature
// and expiry, so logging out never actually revoked it — the cookie was
// cleared client-side, but a copy of the token would keep working against
// the API for up to 24h. This is a real bug, not a hypothetical: it's exactly
// the "broken logout" gap from the earlier backend audit.
//
// Redis is the natural fix: block by a hash of the token (never store the
// raw token itself) with a TTL equal to the token's own remaining lifetime,
// so the blocklist entry disappears on its own the moment the token would
// have expired anyway — no cleanup job needed.
const hash = (token) => crypto.createHash('sha256').update(token).digest('hex');

exports.blockToken = async (token, exp) => {
    if (!redis.isOpen) return; // fails open — see Authenticate's isTokenBlocked check
    const ttl = exp - Math.floor(Date.now() / 1000);
    if (ttl <= 0) return; // already expired, nothing to block
    try {
        await redis.setEx(`bl:token:${hash(token)}`, ttl, '1');
    } catch (err) {
        console.error('Failed to blocklist token:', err.message);
    }
};

exports.isTokenBlocked = async (token) => {
    if (!redis.isOpen) return false; // Redis down/disabled: fail open, don't lock everyone out
    try {
        return Boolean(await redis.get(`bl:token:${hash(token)}`));
    } catch (err) {
        console.error('Failed to check token blocklist:', err.message);
        return false;
    }
};
