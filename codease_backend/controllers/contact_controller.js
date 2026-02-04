const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Contact form handler - sends email and saves to Excel
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
    // 1. Save to Excel file
    await saveToExcel({ name, lastname, email, phone, subject, message });

    // 2. Send email notification to company
    await sendEmailNotification({ name, lastname, email, phone, subject, message });

    // 3. Send confirmation email to customer (optional)
    await sendConfirmationEmail({ name, lastname, email });

    console.log('Contact form processed successfully');
    
    res.json({ 
      message: 'Message sent successfully! We will get back to you soon.',
      success: true
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    res.status(500).json({ 
      message: 'Failed to send message. Please try again or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Save contact details to Excel file
async function saveToExcel(data) {
  const excelDir = path.join(__dirname, '..', 'data');
  const excelPath = path.join(excelDir, 'contact_submissions.xlsx');

  // Create data directory if it doesn't exist
  if (!fs.existsSync(excelDir)) {
    fs.mkdirSync(excelDir, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  let worksheet;

  // Check if file exists
  if (fs.existsSync(excelPath)) {
    // Load existing workbook
    await workbook.xlsx.readFile(excelPath);
    worksheet = workbook.getWorksheet('Contact Submissions');
  } else {
    // Create new workbook
    worksheet = workbook.addWorksheet('Contact Submissions');
    
    // Add headers with styling
    worksheet.columns = [
      { header: 'Date & Time', key: 'datetime', width: 20 },
      { header: 'First Name', key: 'name', width: 15 },
      { header: 'Last Name', key: 'lastname', width: 15 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Subject', key: 'subject', width: 20 },
      { header: 'Message', key: 'message', width: 50 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };
  }

  // Add new row
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  worksheet.addRow({
    datetime: timestamp,
    name: data.name,
    lastname: data.lastname,
    email: data.email,
    phone: data.phone || 'N/A',
    subject: formatSubject(data.subject),
    message: data.message
  });

  // Add borders to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Save the workbook
  await workbook.xlsx.writeFile(excelPath);
  
  console.log(`Contact saved to Excel: ${excelPath}`);
  
  return excelPath;
}

// Send email notification to company
async function sendEmailNotification(data) {
  // Configure email transporter
  const transporter = nodemailer.createTransport({
    // Option 1: Gmail (recommended for testing)
    service: 'gmail',
    auth: {
      user: process.env.COMPANY_EMAIL, // e.g., 'info@codease.com'
      pass: process.env.COMPANY_EMAIL_PASSWORD // App password, not regular password
    }

    // Option 2: Custom SMTP (for production)
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    // secure: true,
    // auth: {
    //   user: process.env.SMTP_USER,
    //   pass: process.env.SMTP_PASSWORD
    // }
  });

  const subjectMap = {
    'general': 'General Inquiry',
    'courses': 'Course Information',
    'technical': 'Technical Support',
    'partnership': 'Partnership Opportunities',
    'other': 'Other'
  };

  const formattedSubject = subjectMap[data.subject] || data.subject;

  // Email to company
  const mailOptions = {
    from: process.env.COMPANY_EMAIL,
    to: process.env.COMPANY_EMAIL, // Your company email
    replyTo: data.email, // Customer's email for easy reply
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
  };

  await transporter.sendMail(mailOptions);
  console.log('Email notification sent to company');
}

// Send confirmation email to customer
async function sendConfirmationEmail(data) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_EMAIL_PASSWORD
    }
  });

  const mailOptions = {
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
              📧 <a href="mailto:info@codease.com">info@codease.com</a><br>
              📱 +1 (555) 123-4567
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
  };

  await transporter.sendMail(mailOptions);
  console.log('Confirmation email sent to customer');
}

// Helper function to format subject
function formatSubject(subject) {
  const subjectMap = {
    'general': 'General Inquiry',
    'courses': 'Course Information',
    'technical': 'Technical Support',
    'partnership': 'Partnership Opportunities',
    'other': 'Other'
  };
  return subjectMap[subject] || subject;
}

// Export contact data as Excel (admin endpoint)
exports.downloadContactSubmissions = async (req, res) => {
  try {
    const excelPath = path.join(__dirname, '..', 'data', 'contact_submissions.xlsx');
    
    if (!fs.existsSync(excelPath)) {
      return res.status(404).json({ 
        message: 'No contact submissions found' 
      });
    }

    res.download(excelPath, 'contact_submissions.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error('Error in downloadContactSubmissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};