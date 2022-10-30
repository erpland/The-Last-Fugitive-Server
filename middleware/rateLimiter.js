const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min in milliseconds
  max: 5,
  message: 'Login error, you have reached maximum retries. Please try again after 5 minutes', 
  statusCode: 429,
  headers: true,
});

module.exports = { loginRateLimiter }