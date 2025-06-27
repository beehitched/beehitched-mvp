const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

async function sendMail({ to, subject, html, text }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || 'BeeHitched <no-reply@beehitched.com>',
    to,
    subject,
    html,
    text
  })
}

module.exports = { sendMail } 