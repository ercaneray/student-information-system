require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT;

const app = express(); // Create express app

// Middleware
app.use(express.json({ credentials: true }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Routes
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/instructors', instructorRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});