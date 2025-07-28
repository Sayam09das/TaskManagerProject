const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

// Database connection
const database = require('./database/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoute = require('./routes/taskRoute');
const protectedRoutes = require('./routes/protectedRoutes');

// Allowed origins for CORS
const allowedOrigins = [
    'http://localhost:5173',
    'https://schedulo-m21t.onrender.com',
    'https://taskmanagerproject-iewf.onrender.com'
];

// CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Connect to MongoDB
database();

// Routes
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);
app.use('/api/task', taskRoute);

// Export
module.exports = app;
