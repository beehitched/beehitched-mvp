const express = require('express');
const { authenticateToken } = require('../utils/auth');
const { sendMail } = require('../utils/email');
const router = express.Router();

// Submit contact form
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Prepare email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #fce7f3 0%, #fbbf24 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: #1f2937; margin: 0; text-align: center;">BeeHitched Support</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 20px;">New Contact Form Submission</h2>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151;">From:</strong> ${name} (${email})
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #374151;">Subject:</strong> ${subject}
          </div>
          
          <div style="margin-bottom: 30px;">
            <strong style="color: #374151;">Message:</strong>
            <div style="background: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap; line-height: 1.6;">
              ${message}
            </div>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              This message was sent from the BeeHitched contact form by user: ${req.user.name} (${req.user.email})
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
              Submitted on: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>BeeHitched - Making wedding planning beautiful and simple</p>
        </div>
      </div>
    `;

    // Send email to support
    await sendMail({
      to: 'support@beehitched.com',
      subject: `Contact Form: ${subject}`,
      html: emailContent
    });

    // Send confirmation email to user
    const confirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #fce7f3 0%, #fbbf24 100%); padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: #1f2937; margin: 0; text-align: center;">BeeHitched</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #374151; margin-bottom: 20px;">Thank you for contacting us!</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Hi ${name},
          </p>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            We've received your message and our support team will get back to you within 24 hours.
          </p>
          
          <div style="background: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong style="color: #374151;">Your message:</strong>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-style: italic;">"${message}"</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            In the meantime, you can also reach us at:
          </p>
          
          <ul style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            <li>Email: hello@beehitched.com</li>
            <li>Support: support@beehitched.com</li>
          </ul>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 0;">
            Best regards,<br>
            The BeeHitched Team
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>BeeHitched - Making wedding planning beautiful and simple</p>
        </div>
      </div>
    `;

    await sendMail({
      to: email,
      subject: 'We received your message - BeeHitched Support',
      html: confirmationContent
    });

    res.json({
      message: 'Contact form submitted successfully',
      success: true
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit contact form. Please try again later.',
      success: false
    });
  }
});

module.exports = router; 