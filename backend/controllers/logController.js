const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// @desc    Get all activity logs (Admin & Moderator only)
// @route   GET /api/logs
// @access  Private (Admin/Moderator)
exports.getAllLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action, 
      success, 
      userId, 
      ipAddress,
      startDate,
      endDate 
    } = req.query;

    // Build query
    let query = {};
    
    if (action) query.action = action;
    if (success !== undefined) query.success = success === 'true';
    if (userId) query.user = userId;
    if (ipAddress) query.ipAddress = ipAddress;
    
    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(query)
      .populate('user', 'name email role avatar')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all logs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get user activity logs
// @route   GET /api/logs/user/:userId
// @access  Private (Admin/Moderator/Own)
exports.getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    // Check if user can access these logs
    if (req.user.role !== 'admin' && req.user.role !== 'moderator' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const logs = await ActivityLog.getUserActivity(userId, parseInt(limit));

    res.status(200).json({
      success: true,
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Get user logs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get activity statistics
// @route   GET /api/logs/stats
// @access  Private (Admin/Moderator)
exports.getActivityStats = async (req, res) => {
  try {
    const { timeWindow = 24 } = req.query; // hours

    const stats = await ActivityLog.getActivityStats(parseInt(timeWindow));

    // Get additional stats
    const totalLogs = await ActivityLog.countDocuments();
    const recentLogs = await ActivityLog.countDocuments({
      timestamp: { $gte: new Date(Date.now() - timeWindow * 60 * 60 * 1000) }
    });

    // Get top IPs with most activity
    const topIPs = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - timeWindow * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$ipAddress',
          count: { $sum: 1 },
          actions: { $addToSet: '$action' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get failed login attempts by IP
    const failedLogins = await ActivityLog.aggregate([
      {
        $match: {
          action: 'failed_login',
          timestamp: { $gte: new Date(Date.now() - timeWindow * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$ipAddress',
          count: { $sum: 1 },
          lastAttempt: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        timeWindow: `${timeWindow} hours`,
        totalLogs,
        recentLogs,
        actionStats: stats,
        topIPs,
        failedLogins
      }
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get security alerts
// @route   GET /api/logs/security-alerts
// @access  Private (Admin/Moderator)
exports.getSecurityAlerts = async (req, res) => {
  try {
    const { timeWindow = 24 } = req.query; // hours
    const since = new Date(Date.now() - timeWindow * 60 * 60 * 1000);

    // Suspicious activities
    const suspiciousIPs = await ActivityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: since },
          success: false
        }
      },
      {
        $group: {
          _id: '$ipAddress',
          failedAttempts: { $sum: 1 },
          actions: { $addToSet: '$action' },
          lastAttempt: { $max: '$timestamp' }
        }
      },
      {
        $match: { failedAttempts: { $gte: 5 } }
      },
      { $sort: { failedAttempts: -1 } }
    ]);

    // Multiple failed logins for same email
    const suspiciousEmails = await ActivityLog.aggregate([
      {
        $match: {
          action: 'failed_login',
          timestamp: { $gte: since }
        }
      },
      {
        $group: {
          _id: '$metadata.email',
          failedAttempts: { $sum: 1 },
          ips: { $addToSet: '$ipAddress' },
          lastAttempt: { $max: '$timestamp' }
        }
      },
      {
        $match: { failedAttempts: { $gte: 3 } }
      },
      { $sort: { failedAttempts: -1 } }
    ]);

    // Rate limit violations
    const rateLimitViolations = await ActivityLog.countDocuments({
      timestamp: { $gte: since },
      'metadata.rateLimitHit': true
    });

    // Brute force attempts
    const bruteForceAttempts = await ActivityLog.countDocuments({
      timestamp: { $gte: since },
      'metadata.bruteForceBlocked': true
    });

    res.status(200).json({
      success: true,
      alerts: {
        timeWindow: `${timeWindow} hours`,
        suspiciousIPs,
        suspiciousEmails,
        rateLimitViolations,
        bruteForceAttempts,
        totalAlerts: suspiciousIPs.length + suspiciousEmails.length + rateLimitViolations + bruteForceAttempts
      }
    });
  } catch (error) {
    console.error('Get security alerts error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Clear old logs
// @route   DELETE /api/logs/cleanup
// @access  Private (Admin only)
exports.cleanupLogs = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await ActivityLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    res.status(200).json({
      success: true,
      message: `Cleaned up ${result.deletedCount} log entries older than ${days} days`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Cleanup logs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = {
  getAllLogs,
  getUserLogs,
  getActivityStats,
  getSecurityAlerts,
  cleanupLogs,
};
