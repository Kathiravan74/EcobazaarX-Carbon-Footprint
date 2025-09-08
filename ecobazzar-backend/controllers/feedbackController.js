const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;
    const roleId = req.user.roleId;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Feedback message is required' });
    }
    if (!roleId) {
      return res.status(400).json({ message: 'Role ID is missing in user context' });
    }

    const feedbackId = await Feedback.create(userId, roleId, message);
    res.status(201).json({ message: 'Feedback submitted', feedbackId });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
