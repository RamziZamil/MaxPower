const express = require('express');
const router = express.Router();
const { register, login, logout, registerAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Middleware to make image upload optional
const optionalUpload = (req, res, next) => {
  // Use .any() to accept any files, then find the image file
  upload.any()(req, res, (err) => {
    if (err) {
      return next(err);
    }
    // If files were uploaded, find the image file and assign it to req.file
    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find(file => file.fieldname === 'image');
      if (imageFile) {
        req.file = imageFile;
      }
    }
    next();
  });
};

// Register user with optional image upload
router.post('/register', optionalUpload, register);

// Login user
router.post('/login', login);

// Logout user
router.get('/logout', protect, logout);

// Register admin (protected route)
router.post('/register-admin', upload.single('image'), registerAdmin);

module.exports = router; 