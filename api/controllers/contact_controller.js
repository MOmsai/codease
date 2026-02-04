const nodemailer = require('nodemailer');

// ==========================================
// CONTACT FORM HANDLER
// ==========================================
exports.sendContactMessage = async (req, res) => {
  const { name, lastname, email, phone, subject, message } = req.body;

  console.log('Contact form submission:', { name, lastname, email, subject });

  // Validation
  if (!name || !lastname || !email || !subject || !message) {
    return res.status(400).json({
      message: 'Please fill in all required fields'
    });
  }

  try {

    // Send email to company
    await sendEmailNotification({ name, lastname, email, phone, subject, message });

    // Send confirmation email to user
    await sendConfirmationEmail({ name, lastname, email });

    res.json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('Contact error:', error);

res.status(500).json({
  message: error.message
});

  }
};

// ==========================================
// EMAIL TO COMPANY
// ==========================================
async function sendEmailNotification(data) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_EMAIL_PASSWORD
    }
  });

  const subjectMap = {
    general: 'General Inquiry',
    courses: 'Course Information',
    technical: 'Technical Support',
    partnership: 'Partnership Opportunities',
    other: 'Other'
  };

  const formattedSubject = subjectMap[data.subject] || data.subject;

  await transporter.sendMail({
    from: process.env.COMPANY_EMAIL,
    to: process.env.COMPANY_EMAIL,
    replyTo: data.email,
    subject: `🔔 New Contact Form: ${formattedSubject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><b>Name:</b> ${data.name} ${data.lastname}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phone || 'N/A'}</p>
      <p><b>Subject:</b> ${formattedSubject}</p>
      <p><b>Message:</b><br>${data.message}</p>
    `
  });

  console.log('Company email sent');
}

// ==========================================
// CONFIRMATION EMAIL TO USER
// ==========================================
async function sendConfirmationEmail(data) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.COMPANY_EMAIL,
    to: data.email,
    subject: '✅ We received your message - Codease',
    html: `
      <h2>Thank You for Contacting Codease</h2>
      <p>Dear ${data.name} ${data.lastname},</p>
      <p>We have received your message and will get back to you soon.</p>
      <p>Regards,<br><b>Codease Team</b></p>
    `
  });

  console.log('User confirmation email sent');
}
