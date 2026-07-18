// config/redis.js
const { createClient } = require('redis');

// Redis is not used by any application logic yet (see README roadmap), so it's
// opt-in: it only tries to connect when REDIS_ENABLED=true. This keeps local
// dev quiet for anyone who doesn't have a Redis server running.
const enabled = process.env.REDIS_ENABLED === 'true';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

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
