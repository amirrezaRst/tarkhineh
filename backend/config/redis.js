// config/redis.js
const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

const connectRedis = async () => {
    if (!client.isOpen) {
        try {
            await client.connect();
            console.log('Redis Client Connected Successfully.');
        } catch (err) {
            console.error('Failed to connect to Redis:', err.message);
        }
    }
};

connectRedis();

module.exports = client;