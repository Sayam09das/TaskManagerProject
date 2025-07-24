const User = require('../models/userModels');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ===== HELPER: Generate Secure 6-digit OTP =====
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// ===== LOGIN RATE LIMITER (5 attempts every 15 minutes) =====
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
});

// ===== REGISTER USER =====
exports.registerUser = [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ max: 12 }).withMessage('Password must be at least 12 characters'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;

        try {
            const existing = await User.findOne({ email });
            if (existing) return res.status(409).json({ message: 'Email already exists' });

            const hashedPassword = await bcrypt.hash(password, 12);
            const otp = generateOtp();
            const otpExpires = Date.now() + 10 * 60 * 1000;

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires,
                isVerified: false
            });

            await newUser.save();

            const subject = `Welcome to Schedulo Task Manager!`;
            const text = `
Hi ${name},

🎉 Welcome aboard!

Your account has been successfully created on Schedulo Task Manager. We’re excited to help you manage your tasks more efficiently.

If you didn’t register, please contact support immediately.

Thanks,  
The Schedulo Team  
https://schedulo-task.app
            `;

            await sendEmail(email, subject, text);

            res.status(201).json({ message: 'Registration successful.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

// ===== LOGIN USER =====
exports.loginUser = [
    loginLimiter,
    body('email').isEmail().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '1h' } // ✅ fallback
            );

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            });

            res.status(200).json({
                message: `Login successful`,
                user: {
                    email: user.email,
                    name: user.name,
                    id: user._id
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

// ===== LOGOUT USER =====
exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie("authToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ===== FORGOT PASSWORD =====
exports.forgotPassword = [
    body('email').isEmail().withMessage('Valid email required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const otp = generateOtp();
            const otpExpires = Date.now() + 5 * 60 * 1000;

            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();

            const subject = `Schedulo Password Reset – OTP Inside`;
            const text = `
Hi ${user.name},

🛡️ Your password reset OTP is: ${otp}  
⏳ It expires in 5 minutes.

Click to reset: https://schedulo-task.app/reset-password

If you didn’t request this, ignore this email.

— The Schedulo Team
            `;

            await sendEmail(email, subject, text);
            res.status(200).json({ message: 'OTP sent to email' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

// ===== VERIFY OTP =====
exports.verifyOtp = [
    body('email').isEmail().withMessage('Valid email required'),
    body('otp').isLength({ min: 4, max: 12 }).withMessage('OTP must be 4–12 digits'),

    async (req, res) => {
        const { email, otp } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }

            user.otp = null;
            user.otpExpires = null;
            user.resetVerified = true;
            await user.save();

            res.status(200).json({ message: 'OTP verified. Proceed to reset password.' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

// ===== RESET PASSWORD =====
exports.resetPassword = [
    body('email').isEmail().withMessage('Email is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password too short'),

    async (req, res) => {
        const { email, newPassword } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user || !user.resetVerified) {
                return res.status(403).json({ message: 'Unauthorized or invalid reset request' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            user.password = hashedPassword;
            user.resetVerified = false;
            user.otp = null;
            user.otpExpires = null;
            await user.save();

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '1h' }
            );

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            });

            const subject = 'Schedulo Password Changed';
            const text = `
Hi ${user.name},

✅ Your password was successfully changed.  
❗ If this wasn’t you, contact our support immediately.

Login: https://schedulo-task.app/login

— Schedulo Task Manager Support
            `;

            await sendEmail(email, subject, text);

            res.status(200).json({
                message: 'Password reset successful. Logged in.'
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

// ===== RESEND OTP =====
exports.resendOtp = [
    body('email').isEmail().withMessage('Valid email required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const otp = generateOtp();
            const otpExpires = Date.now() + 5 * 60 * 1000;

            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();

            const subject = 'Schedulo – Resend OTP';
            const text = `
Hi ${user.name},

🔁 Your new OTP is: ${otp}  
⏳ It expires in 5 minutes.

Use it to verify your account or reset your password.

— The Schedulo Team
            `;

            await sendEmail(email, subject, text);
            res.status(200).json({ message: 'New OTP sent successfully to your email' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];
