const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const ActivityLog = require('../models/ActivityLog');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { logFailedLogin, logActivityManual } = require('../middleware/activityLogger');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user', // Default to 'user' if not specified
    });

    // Generate token
    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Log failed login attempt
      await logFailedLogin(email, req, 'User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Log failed login attempt
      await logFailedLogin(email, req, 'Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate Access Token and Refresh Token
    const accessToken = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Save Refresh Token to database
    const refreshTokenDoc = await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdByIp: ipAddress,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Find refresh token in database
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken }).populate('user');

    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Check if token is active
    if (!tokenDoc.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is expired or revoked',
      });
    }

    // Verify JWT
    const jwt = require('jsonwebtoken');
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Generate new access token
    const newAccessToken = tokenDoc.user.generateToken();

    // Optionally: Generate new refresh token and revoke old one (rotation)
    const newRefreshToken = tokenDoc.user.generateRefreshToken();
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Revoke old refresh token
    tokenDoc.revoke(ipAddress, newRefreshToken);
    await tokenDoc.save();

    // Create new refresh token
    await RefreshToken.create({
      token: newRefreshToken,
      user: tokenDoc.user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdByIp: ipAddress,
    });

    res.status(200).json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: tokenDoc.user._id,
        name: tokenDoc.user.name,
        email: tokenDoc.user.email,
        role: tokenDoc.user.role,
        avatar: tokenDoc.user.avatar,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during token refresh',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Revoke refresh token if provided
    if (refreshToken) {
      const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
      if (tokenDoc) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        tokenDoc.revoke(ipAddress);
        await tokenDoc.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during logout',
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email',
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent',
      });
    }

    // Check if user recently requested reset (rate limiting)
    const now = new Date();
    const lastResetRequest = user.resetPasswordExpire;
    
    if (lastResetRequest && now < lastResetRequest) {
      const timeLeft = Math.ceil((lastResetRequest - now) / (1000 * 60)); // minutes
      return res.status(429).json({
        success: false,
        message: `Please wait ${timeLeft} minutes before requesting another reset`,
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    // Log resetToken để test
    console.log('Reset Token:', resetToken);
    console.log('Reset URL:', `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `Password Reset Request

Hello ${user.name},

You are receiving this email because you (or someone else) has requested to reset your password for your account.

Please click on the following link to reset your password:
${resetUrl}

If you did not request this password reset, please ignore this email and your password will remain unchanged.

This link will expire in 10 minutes for security reasons.

Best regards,
Authentication App Team`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #5a67d8; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${user.name}</strong>,</p>
          
          <p>You are receiving this email because you (or someone else) has requested to reset your password for your account.</p>
          
          <p>Please click on the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button" target="_blank">Reset My Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          
          <div class="warning">
            <p><strong>⚠️ Security Notice:</strong></p>
            <ul>
              <li>This link will expire in <strong>10 minutes</strong></li>
              <li>If you did not request this, please ignore this email</li>
              <li>Your password will remain unchanged if you don't click the link</li>
            </ul>
          </div>
          
          <p>Best regards,<br>
          <strong>Authentication App Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </body>
      </html>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
        html,
      });

      res.status(200).json({
        success: true,
        message: 'Reset password email sent',
      });
    } catch (err) {
      console.error('Email send error:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate new token
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

