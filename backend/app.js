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

// Middleware
app.use(cors({
    origin: 'https://schedulo-m21t.onrender.com',
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// Connect to MongoDB
database();

// API Routes
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);
app.use('/api/task', taskRoute);


module.exports = app;
