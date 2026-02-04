const express = require('express');
const { sendContactMessage, downloadContactSubmissions } = require('../controllers/contact_controller');

const router = express.Router();

// Submit contact form
router.post('/', sendContactMessage);

// Download contact submissions (admin only - add auth middleware in production)
router.get('/download', downloadContactSubmissions);

module.exports = router;