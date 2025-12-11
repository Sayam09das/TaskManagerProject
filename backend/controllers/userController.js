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
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 100,                   // limit each IP to 5 requests per windowMs
    standardHeaders: true,    // Return RateLimit-* headers
    legacyHeaders: false,     // Disable the deprecated X-RateLimit-* headers
    handler: (req, res, next) => {
        // prefer to set Retry-After in seconds (ceil of remaining window)
        const retryAfterSeconds = Math.ceil((req.rateLimit && req.rateLimit.resetTime
            ? (req.rateLimit.resetTime - Date.now()) / 1000
            : 60)); // fallback 60s

        res.set('Retry-After', String(retryAfterSeconds));
        res.status(429).json({
            error: 'Too many login attempts, please try again later.',
            retryAfter: retryAfterSeconds
        });
    }
});

// ===== REGISTER USER =====
exports.registerUser = [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8, max: 12 }).withMessage('Password must be 8–12 characters long'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            const existing = await User.findOne({ email });
            if (existing) {
                return res.status(409).json({ message: 'Email already exists' });
            }

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

            const subject = `Welcome to Schedulo Task Manager, ${name}!`;

            const html = `
<div style="background:#f5f7ff; padding:30px; font-family:'Segoe UI', Arial, sans-serif;">
  <div style="
    max-width:600px;
    margin:0 auto;
    background:#ffffff;
    border-radius:12px;
    padding:32px;
    box-shadow:0 5px 25px rgba(0,0,0,0.1);
  ">
    
    <div style="text-align:center; margin-bottom:20px;">
      <h1 style="color:#4e46e5; font-size:28px; margin:0;">🎉 Welcome to Schedulo!</h1>
      <p style="color:#555; font-size:16px; margin-top:8px;">We’re excited to have you onboard</p>
    </div>

    <p style="color:#333; font-size:16px;">
      Hi <strong>${name}</strong>,
    </p>

    <p style="color:#444; font-size:15px; line-height:1.7;">
      Your account has been successfully created on <strong>Schedulo Task Manager</strong>.<br/>
      You’re now ready to organize tasks, stay productive, and manage your entire day effortlessly.
    </p>

    <div style="
      background:#eef2ff;
      padding:16px;
      border-radius:8px;
      margin:20px 0;
      color:#4e46e5;
      font-size:15px;
      border-left:4px solid #4e46e5;
    ">
      <strong>Your account email:</strong> ${email}
    </div>

    <p style="color:#444; font-size:15px; line-height:1.7;">
      If you didn’t create this account, please ignore this email or contact our support team immediately.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a href="https://schedulo-app-theta.vercel.app"
        style="
          background:#4e46e5;
          padding:12px 28px;
          color:#ffffff;
          font-size:16px;
          text-decoration:none;
          border-radius:6px;
          display:inline-block;
        ">
        Go to Schedulo
      </a>
    </div>

    <p style="color:#666; font-size:13px; text-align:center; margin-top:8px;">
      Thank you for choosing <strong>Schedulo</strong> 💜
    </p>
  </div>

  <p style="text-align:center; color:#999; font-size:12px; margin-top:16px;">
    This is an automated message, please do not reply.
  </p>
</div>
            `.trim();

            await sendEmail(email, subject, html);

            res.status(201).json({ message: 'Registration successful.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];


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
                {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRATION || '1h' }
            );

            // cookie settings — NOTE: secure:true will only set cookie over HTTPS
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 3600000,
            });

            res.status(200).json({
                message: "Login successful",
                token,
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

exports.logoutUser = async (req, res) => {
    try {
        const isProd = process.env.NODE_ENV === 'production';

        res.clearCookie("authToken", {
            httpOnly: true,
            secure: isProd,     // must match login cookie
            sameSite: 'None',   // must match login cookie
            path: '/'           // highly recommended to include
        });

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
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const otp = generateOtp();
            const otpExpires = Date.now() + 5 * 60 * 1000;

            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();

            const subject = `Schedulo Password Reset – OTP Code`;

            const html = `
<div style="background:#f5f7ff; padding:30px; font-family:'Segoe UI', Arial, sans-serif;">
  <div style="
    max-width:600px;
    margin:0 auto;
    background:#ffffff;
    border-radius:12px;
    padding:32px;
    box-shadow:0 5px 25px rgba(0,0,0,0.1);
  ">

    <div style="text-align:center; margin-bottom:20px;">
      <h2 style="color:#4e46e5; font-size:26px; margin:0;">🔐 Password Reset Request</h2>
      <p style="color:#555; font-size:15px; margin-top:8px;">Your OTP code is ready</p>
    </div>

    <p style="color:#333; font-size:16px;">Hi <strong>${user.name}</strong>,</p>

    <p style="color:#444; font-size:15px; line-height:1.7;">
      You requested to reset your Schedulo account password.  
      Use the OTP below to continue:
    </p>

    <div style="
      background:#eef2ff;
      padding:20px;
      text-align:center;
      border-radius:10px;
      margin:25px 0;
      border-left:4px solid #4e46e5;
    ">
      <div style="font-size:32px; font-weight:bold; color:#4e46e5; letter-spacing:4px;">
        ${otp}
      </div>
      <p style="color:#666; margin-top:10px; font-size:14px;">This OTP expires in <strong>5 minutes</strong>.</p>
    </div>

    <div style="text-align:center; margin:25px 0;">
      <a href="https://schedulo-app-theta.vercel.app/reset-password"
        style="
          background:#4e46e5;
          padding:12px 28px;
          color:#ffffff;
          font-size:16px;
          text-decoration:none;
          border-radius:6px;
          display:inline-block;
        ">
        Reset Password
      </a>
    </div>

    <p style="color:#444; font-size:15px; line-height:1.7;">
      If you did not request this password reset, please ignore this message.  
      Your account is safe.
    </p>

    <p style="color:#666; font-size:13px; text-align:center; margin-top:18px;">
      — The Schedulo Team
    </p>

  </div>

  <p style="text-align:center; color:#999; font-size:12px; margin-top:16px;">
    This is an automated email. Please do not reply.
  </p>
</div>
            `.trim();

            await sendEmail(email, subject, html);

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
            if (!user) return res.status(400).json({ message: 'User not found' });


            if (String(user.otp) !== String(otp)) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            if (Date.now() > user.otpExpires) {
                return res.status(400).json({ message: 'OTP has expired' });
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

exports.resetPassword = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user || !user.resetVerified) {
                return res.status(400).json({ message: 'User not verified for reset' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            user.password = hashedPassword;
            user.resetVerified = false;
            await user.save();

            res.status(200).json({ message: 'Password has been reset successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('name email createdAt');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const avatar = user.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                avatar,
                joinDate: new Date(user.createdAt).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric'
                })
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
