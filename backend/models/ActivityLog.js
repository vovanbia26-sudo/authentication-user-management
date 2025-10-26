const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout', 
        'signup',
        'forgot_password',
        'reset_password',
        'profile_update',
        'avatar_upload',
        'password_change',
        'role_change',
        'user_delete',
        'failed_login',
        'token_refresh',
        'account_access'
      ],
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // For additional data
    },
    success: {
      type: Boolean,
      default: true,
    },
    errorMessage: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
activityLogSchema.index({ user: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ ipAddress: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

// Static method to log activity
activityLogSchema.statics.logActivity = async function(data) {
  try {
    const log = new this(data);
    await log.save();
    console.log(`Activity logged: ${data.action} by user ${data.user}`);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Static method to get user activity
activityLogSchema.statics.getUserActivity = async function(userId, limit = 50) {
  return this.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('user', 'name email role');
};

// Static method to get failed login attempts
activityLogSchema.statics.getFailedLoginAttempts = async function(ipAddress, timeWindow = 15) {
  const since = new Date(Date.now() - timeWindow * 60 * 1000); // minutes ago
  return this.countDocuments({
    action: 'failed_login',
    ipAddress: ipAddress,
    timestamp: { $gte: since }
  });
};

// Static method to get activity stats
activityLogSchema.statics.getActivityStats = async function(timeWindow = 24) {
  const since = new Date(Date.now() - timeWindow * 60 * 60 * 1000); // hours ago
  
  const stats = await this.aggregate([
    { $match: { timestamp: { $gte: since } } },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        successCount: {
          $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] }
        },
        failureCount: {
          $sum: { $cond: [{ $eq: ['$success', false] }, 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return stats;
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
