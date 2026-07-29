// config/redis.js
const { createClient } = require('redis');

// Backs rate limiting, cached reads, and logout/token revocation. Opt-in: it
// only tries to connect when REDIS_ENABLED=true, so local dev stays quiet for
// anyone who doesn't have a Redis server running — every caller falls back to
// its non-Redis behavior instead of failing when this is off or unreachable.
const enabled = process.env.REDIS_ENABLED === 'true';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Exposed alongside the client so callers that need to make a build-time
// decision (e.g. which rate-limit store to construct) can check the
// configured intent instead of the transient `isOpen` state, which is still
// false for a moment right after boot while the connection is in flight.
client.enabled = enabled;

// Log at most one concise line instead of spamming the full error object on
// every reconnect attempt.
let errorLogged = false;
client.on('error', (err) => {
    if (!errorLogged) {
        console.error('Redis Client Error:', err.message);
        errorLogged = true;
    }
});

const connectRedis = async () => {
    if (!enabled || client.isOpen) return;
    try {
        await client.connect();
        console.log('Redis Client Connected Successfully.');
    } catch (err) {
        console.error('Failed to connect to Redis:', err.message);
    }
};

connectRedis();

module.exports = client;
