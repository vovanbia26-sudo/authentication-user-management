const express = require('express');
const router = express.Router();
const {
  getAllLogs,
  getUserLogs,
  getActivityStats,
  getSecurityAlerts,
  cleanupLogs,
} = require('../controllers/logController');
const { protect, checkMinRole, checkRole } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { logAccountAccess } = require('../middleware/activityLogger');

// All log routes require authentication and rate limiting
router.use(protect);
router.use(apiLimiter);

// Get all logs (Admin & Moderator only)
router.get('/', checkMinRole('moderator'), logAccountAccess, getAllLogs);

// Get user activity logs
router.get('/user/:userId', logAccountAccess, getUserLogs);

// Get activity statistics (Admin & Moderator only)
router.get('/stats', checkMinRole('moderator'), logAccountAccess, getActivityStats);

// Get security alerts (Admin & Moderator only)
router.get('/security-alerts', checkMinRole('moderator'), logAccountAccess, getSecurityAlerts);

// Cleanup old logs (Admin only)
router.delete('/cleanup', checkRole('admin'), cleanupLogs);

module.exports = router;
