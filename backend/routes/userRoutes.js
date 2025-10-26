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
  getAllUsersForManagement,
  updateUserRoleAdvanced,
  getUserStats,
} = require('../controllers/userController');
const { protect, authorize, checkRole, checkMinRole } = require('../middleware/auth');

// Advanced Multer configuration for avatar upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only 1 file at a time
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  },
  // Custom filename
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = file.originalname.split('.').pop();
      cb(null, `avatar-${uniqueSuffix}.${ext}`);
    }
  })
});

// Profile routes (authenticated users)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

// Admin routes (existing)
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, deleteUser); // Admin or own account
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

// Advanced RBAC routes
router.get('/manage/all', protect, checkMinRole('moderator'), getAllUsersForManagement);
router.get('/manage/stats', protect, checkMinRole('moderator'), getUserStats);
router.put('/manage/:id/role', protect, checkRole('admin'), updateUserRoleAdvanced);

module.exports = router;

