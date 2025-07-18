
const { log } = require('./utils/logger');

const loggingMiddleware = (req, res, next) => {
    let message = `Request: ${req.method} ${req.originalUrl}`;
    if (Object.keys(req.body).length > 0) {
        message += ` | Body: ${JSON.stringify(req.body)}`;
    }
    message += ` | IP: ${req.ip || req.connection.remoteAddress}`;

    log('backend', 'info', 'middleware', message);

    next();
};

module.exports = loggingMiddleware;