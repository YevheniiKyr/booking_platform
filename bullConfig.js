const Queue = require('bull');

const redisConfig = {
    redis: {
        port: 6379,
        host: 'localhost',
    },
};

const emailQueue = new Queue('emailQueue', redisConfig);

module.exports = {emailQueue};