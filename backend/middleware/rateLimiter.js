const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const ActivityLog = require('../models/ActivityLog');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true,
});

// Login rate limiter with progressive delays
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  // Custom handler for rate limit exceeded
  handler: async (req, res) => {
    // Log the rate limit violation
    try {
      await ActivityLog.logActivity({
        user: null,
        action: 'failed_login',
        description: 'Rate limit exceeded for login attempts',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
        success: false,
        errorMessage: 'Rate limit exceeded',
        metadata: {
          method: req.method,
          url: req.originalUrl,
          rateLimitHit: true,
        }
      });
    } catch (error) {
      console.error('Error logging rate limit violation:', error);
    }

    res.status(429).json({
      success: false,
      message: 'Too many login attempts from this IP. Please try again in 15 minutes.',
      retryAfter: Math.round(req.rateLimit.resetTime / 1000),
    });
  },
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again in 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow down middleware for repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // allow 5 requests per windowMs without delay
  delayMs: 500, // add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // maximum delay of 20 seconds
});

// Advanced brute force protection
const createBruteForceProtection = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxAttempts = 5,
    blockDuration = 15 * 60 * 1000, // 15 minutes
  } = options;

  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      
      // Check failed attempts in the last window
      const failedAttempts = await ActivityLog.getFailedLoginAttempts(ip, windowMs / (60 * 1000));
      
      if (failedAttempts >= maxAttempts) {
        // Log the brute force attempt
        await ActivityLog.logActivity({
          user: null,
          action: 'failed_login',
          description: 'Brute force protection triggered',
          ipAddress: ip,
          userAgent: req.get('User-Agent') || 'unknown',
          success: false,
          errorMessage: 'Brute force protection',
          metadata: {
            method: req.method,
            url: req.originalUrl,
            failedAttempts: failedAttempts,
            bruteForceBlocked: true,
          }
        });

        return res.status(429).json({
          success: false,
          message: `Too many failed attempts. IP blocked for ${blockDuration / (60 * 1000)} minutes.`,
          blockedUntil: new Date(Date.now() + blockDuration),
          failedAttempts: failedAttempts,
        });
      }

      next();
    } catch (error) {
      console.error('Brute force protection error:', error);
      next(); // Continue on error to not break the flow
    }
  };
};

// API rate limiter for different endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 API requests per windowMs
  message: {
    success: false,
    message: 'API rate limit exceeded, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 uploads per windowMs
  message: {
    success: false,
    message: 'Too many upload attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  loginLimiter,
  passwordResetLimiter,
  speedLimiter,
  createBruteForceProtection,
  apiLimiter,
  uploadLimiter,
};
