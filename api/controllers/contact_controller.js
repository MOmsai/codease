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
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; padding: 12px; background: white; border-left: 4px solid #3b82f6; border-radius: 4px; }
          .label { font-weight: bold; color: #1e40af; display: block; margin-bottom: 5px; }
          .value { color: #374151; }
          .message-box { background: white; padding: 15px; border: 1px solid #d1d5db; border-radius: 4px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          .reply-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 New Contact Form Submission</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">From Codease Website</p>
          </div>
          
          <div class="content">
            <div class="field">
              <span class="label">👤 Name:</span>
              <span class="value">${data.name} ${data.lastname}</span>
            </div>
            
            <div class="field">
              <span class="label">📧 Email:</span>
              <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
            </div>
            
            <div class="field">
              <span class="label">📱 Phone:</span>
              <span class="value">${data.phone || 'Not provided'}</span>
            </div>
            
            <div class="field">
              <span class="label">📋 Subject:</span>
              <span class="value">${formattedSubject}</span>
            </div>
            
            <div class="field">
              <span class="label">💬 Message:</span>
              <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div style="text-align: center;">
              <a href="mailto:${data.email}" class="reply-button">Reply to ${data.name}</a>
            </div>
          </div>
          
          <div class="footer">
            <p>Received on ${new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p>This email was sent from Codease contact form</p>
          </div>
        </div>
      </body>
      </html>
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
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .checkmark { font-size: 48px; color: #10b981; }
          .footer { text-align: center; margin-top: 20px; padding: 20px; background: #f3f4f6; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="checkmark">✓</div>
            <h2>Thank You for Contacting Us!</h2>
          </div>
          
          <div class="content">
            <p>Dear ${data.name} ${data.lastname},</p>
            
            <p>We have received your message and will get back to you within 24-48 hours.</p>
            
            <p>Our team at <strong>Codease</strong> is committed to providing you with the best possible support and information about our training programs.</p>
            
            <p>If you have any urgent questions, feel free to reach out to us directly at:</p>
            <p style="text-align: center; margin: 20px 0;">
              📧 <a href="mailto:hr@codease.in">info@codease.com</a><br>
              📱 +91  9398942422
            </p>
            
            <p>Best regards,<br><strong>Codease Team</strong></p>
          </div>
          
          <div class="footer">
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              This is an automated confirmation email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  });

  console.log('User confirmation email sent');
}
