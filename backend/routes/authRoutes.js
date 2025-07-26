const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp,
    getCurrentUser,
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticateToken, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOtp);
router.get('/me', authenticateToken, getCurrentUser);


// Example protected route
router.get('/', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

module.exports = router;

