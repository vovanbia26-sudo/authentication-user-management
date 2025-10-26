const ActivityLog = require('../models/ActivityLog');

// Middleware to log user activity
const logActivity = (action, description) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log activity after response
      setImmediate(async () => {
        try {
          const logData = {
            user: req.user ? req.user.id : null,
            action: action,
            description: description || `User performed ${action}`,
            ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.get('User-Agent') || 'unknown',
            success: res.statusCode < 400,
            metadata: {
              method: req.method,
              url: req.originalUrl,
              statusCode: res.statusCode,
              responseTime: Date.now() - req.startTime,
            }
          };

          // Add error message if failed
          if (res.statusCode >= 400 && data && data.message) {
            logData.errorMessage = data.message;
          }

          // Add user info if available
          if (req.user) {
            logData.metadata.userName = req.user.name;
            logData.metadata.userEmail = req.user.email;
            logData.metadata.userRole = req.user.role;
          }

          await ActivityLog.logActivity(logData);
        } catch (error) {
          console.error('Activity logging error:', error);
        }
      });

      // Call original json method
      return originalJson.call(this, data);
    };

    // Add start time for response time calculation
    req.startTime = Date.now();
    
    next();
  };
};

// Specific middleware for different actions
const logLogin = logActivity('login', 'User login attempt');
const logLogout = logActivity('logout', 'User logout');
const logSignup = logActivity('signup', 'User registration');
const logForgotPassword = logActivity('forgot_password', 'Password reset request');
const logResetPassword = logActivity('reset_password', 'Password reset');
const logProfileUpdate = logActivity('profile_update', 'Profile information updated');
const logAvatarUpload = logActivity('avatar_upload', 'Avatar image uploaded');
const logPasswordChange = logActivity('password_change', 'Password changed');
const logRoleChange = logActivity('role_change', 'User role changed');
const logUserDelete = logActivity('user_delete', 'User account deleted');
const logTokenRefresh = logActivity('token_refresh', 'Access token refreshed');
const logAccountAccess = logActivity('account_access', 'Account accessed');

// Manual logging function for complex scenarios
const logActivityManual = async (userId, action, description, req, success = true, metadata = {}) => {
  try {
    const logData = {
      user: userId,
      action: action,
      description: description,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      success: success,
      metadata: {
        method: req.method,
        url: req.originalUrl,
        ...metadata
      }
    };

    await ActivityLog.logActivity(logData);
  } catch (error) {
    console.error('Manual activity logging error:', error);
  }
};

// Failed login logging (special case)
const logFailedLogin = async (email, req, reason = 'Invalid credentials') => {
  try {
    const logData = {
      user: null, // No user ID for failed login
      action: 'failed_login',
      description: `Failed login attempt for email: ${email}`,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      success: false,
      errorMessage: reason,
      metadata: {
        email: email,
        method: req.method,
        url: req.originalUrl,
      }
    };

    await ActivityLog.logActivity(logData);
  } catch (error) {
    console.error('Failed login logging error:', error);
  }
};

module.exports = {
  logActivity,
  logLogin,
  logLogout,
  logSignup,
  logForgotPassword,
  logResetPassword,
  logProfileUpdate,
  logAvatarUpload,
  logPasswordChange,
  logRoleChange,
  logUserDelete,
  logTokenRefresh,
  logAccountAccess,
  logActivityManual,
  logFailedLogin,
};
