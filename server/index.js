require('dotenv').config();

const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const loginRoutes = require('./routes/loginRoutes');

const PORT = process.env.PORT;

const app = express(); // Create express app

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/instructors', instructorRoutes);
app.use('/auth', loginRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});