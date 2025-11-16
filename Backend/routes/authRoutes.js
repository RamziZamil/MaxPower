const express = require('express');
const router = express.Router();
const { register, login, logout, registerAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Register user with optional image upload
router.post('/register', upload.single('image'), register);

// Login user
router.post('/login', login);

// Logout user
router.get('/logout', protect, logout);

// Register admin (protected route)
router.post('/register-admin', upload.single('image'), registerAdmin);

module.exports = router; 