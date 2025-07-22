const redisClient = require('../redisConfig');

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 10;

module.exports = async function rateLimiter(req, res, next) {
    try {

        const ip = req.ip;
        const key = `rate_limit:${ip}`;

        const requests = await redisClient.incr(key);

        if (requests === 1) {
            await redisClient.expire(key, WINDOW_SECONDS);
        }

        if (requests > MAX_REQUESTS) {
            return res.status(429).json({
                message: 'Too many requests. Please try again later.'
            });
        }

        next();
    } catch (err) {
        console.error('Rate limiter error:', err);
        next();
    }
};
