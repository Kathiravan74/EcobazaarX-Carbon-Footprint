const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

const ADMIN_ROLE_ID = 3;

router.post('/', auth, feedbackController.submitFeedback); // Customers or sellers submit feedback
router.get('/', auth, authorizeRoles([3]), feedbackController.getAllFeedback); // Admin views all feedback

module.exports = router;
