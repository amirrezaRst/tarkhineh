const redis = require('../config/redis'); // کانکشن ردیس رو جدا می‌نویسیم

module.exports = function cache(ttl = 300, keyBuilder) {
    return async (req, res, next) => {
        const key = keyBuilder(req);
        const cached = await redis.get(key);

        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const originalJson = res.json.bind(res);
        res.json = (body) => {
            redis.setEx(key, ttl, JSON.stringify(body));
            originalJson(body);
        };

        next();
    };
};
