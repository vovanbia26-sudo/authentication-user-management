const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Multer configuration for file upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Profile routes (authenticated users)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, deleteUser); // Admin or own account
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;

