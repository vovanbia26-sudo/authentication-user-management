const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);

// Debug middleware for reset-password
router.put('/reset-password/:resetToken', (req, res, next) => {
  console.log('🔥 Reset Password Route Hit!');
  console.log('Token from URL:', req.params.resetToken);
  console.log('Request body:', req.body);
  next();
}, resetPassword);

// Protected routes
router.post('/logout', protect, logout);

// Test route để lấy resetToken (chỉ dùng cho development)
router.get('/test-reset-token/:email', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      resetToken: user.resetPasswordToken,
      expires: user.resetPasswordExpire,
      isExpired: user.resetPasswordExpire < Date.now()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Test route để gửi email thử (chỉ dùng cho development)
router.post('/test-send-email', async (req, res) => {
  try {
    const sendEmail = require('../utils/sendEmail');
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    await sendEmail({
      email: email,
      subject: 'Test Email from Auth API',
      message: 'This is a test email. If you receive this, email configuration is working correctly!',
      html: '<h1>Test Email</h1><p>This is a test email. If you receive this, email configuration is working correctly!</p>'
    });

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

