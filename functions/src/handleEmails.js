const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { getFirestore } = require('firebase-admin/firestore')
const nodemailer = require('nodemailer')
const fs = require('fs').promises // Changed to use fs.promises for async operations
const path = require('path')
const handlebars = require('handlebars')

// Load environment variables
require('dotenv').config()

// Initialize Firestore
const db = getFirestore()

const sendEmail = onCall(async (request) => {
  // Debug current directory structure
  console.log('Current directory:', __dirname)

  const { emailData } = request.data

  // Validate email data
  if (!emailData || !emailData.to || !emailData.subject) {
    throw new HttpsError('invalid-argument', 'Missing required email fields')
  }

  try {
    // Log for debugging
    console.log('Starting email send process')
    console.log('Email recipient:', emailData.to)
    console.log('Subject:', emailData.subject)

    // In the deployed environment, we need to go up one directory level from src
    // to reach the email templates folder at the project root
    const templatePath = path.join(__dirname, '../email templates/basic/basicEmail.hbs')
    console.log('Reading template from:', templatePath)

    let templateSource
    try {
      // Read the template file asynchronously
      templateSource = await fs.readFile(templatePath, 'utf8')
      console.log('Template file successfully read')
    } catch (fileError) {
      console.error('Error reading template file:', fileError.message)
      throw new HttpsError('internal', 'Failed to read email template', fileError)
    }

    // Compile the template
    const template = handlebars.compile(templateSource)

    // Prepare data for the template
    const templateData = {
      customerName: emailData.customerName || 'Customer',
      message: emailData.text || '',
      agentName: emailData.from || 'Your Agent',
      // Add any other dynamic data you need
    }

    // Generate the HTML using the template and data
    const htmlContent = template(templateData)

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    console.log('Transporter created')

    // Send email with the HTML from handlebars template
    const info = await transporter.sendMail({
      from: `"${emailData.from || 'Your App'}" <${process.env.EMAIL_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text || '', // Plain text version as fallback
      html: htmlContent, // HTML version from the template
    })

    console.log('Message sent:', info.messageId)

    // Save email metadata to Firestore
    try {
      await db.collection('sentEmails').add({
        to: emailData.to,
        subject: emailData.subject,
        sentAt: new Date(),
        messageId: info.messageId,
        read: false,
      })
      console.log('Email metadata saved to Firestore')
    } catch (dbError) {
      console.error('Failed to save email metadata:', dbError)
      // Continue execution even if DB save fails
    }

    return { success: true, messageId: info.messageId, templatePath, dir: __dirname }
  } catch (error) {
    console.error('Email sending error:', error)

    // More detailed error logging
    if (error.response) {
      console.error('SMTP response:', error.response)
    }

    throw new HttpsError('internal', 'Failed to send email', error)
  }
})

module.exports = {
  sendEmail,
}
