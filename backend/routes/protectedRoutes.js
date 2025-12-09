const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');

// ✅ Protected route: /schedulo (accessible to any logged-in user)
router.get('/schedulo', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Schedulo Task Manager!',
    user: req.user,
    userId: req.userId || 'N/A',
  });
});


module.exports = router;
