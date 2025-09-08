const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/authMiddleware');

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, userController.updateUserProfile);

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, userController.updateUserPassword);

module.exports = router;