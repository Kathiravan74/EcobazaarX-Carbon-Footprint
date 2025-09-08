const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');

// @route   GET /api/profile/me
// @desc    Get user's profile
// @access  Private
router.get('/me', auth, (req, res) => {
  // Access the user's information from the middleware
  res.json({
    message: 'Welcome to your private profile!',
    user: req.user
  });
});

module.exports = router;