require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// Import routes
// const authRoutes = require('./routes/auth_routes');
// const courseRoutes = require('./routes/course_routes');
// const registrationRoutes = require('./routes/registration_routes');
// const studentRoutes = require('./routes/student_routes');
const contactRoutes = require('./routes/contact_routes'); // NEW

// API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/registrations', registrationRoutes);
// app.use('/api/students', studentRoutes);
app.use('/api/contact', contactRoutes); // NEW

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Contact form submissions will be saved to: ./data/contact_submissions.xlsx`);
});

module.exports = app;