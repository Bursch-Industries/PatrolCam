const nodemailer = require('nodemailer');
const { withTransaction } = require('./transactionHandler');
const { logError } = require('./errorLogger'); 
const  { logActivity }  = require('./logger');

const sendContactFormEmail = async (req, res) => {
    const { name, org, ext, phone, email, productInterest } = req.body;

    // REPLACE with client-side js validation ? 
    if (!name || !email || !org) return res.status(400).json({ 'message': 'Please fill in all required fields.' });

    try {

        // Creat nodemailer transport (connection to SMTP server)
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'skeetercathcart@gmail.com', // REPLACE with email address that is being "charged" for the emails
                pass: process.env.GMAIL_APP // REPLACE with app password corresponding to above email
            }
        });

        // Initialize mailOptions as empty, as there will be two potential formats
        let mailOptions;

        // If the user did NOT provide an extension, format the email without it
        if (!ext) {
            mailOptions = {
                from: `"${name}" <${email}>`,
                to: 'patrolcamproject@gmail.com', 
                subject: 'New Contact Form Submission',
                text: `New inquiry from: \n ${name} at ${org} \n Phone: ${phone} \nAbout: ${productInterest}`,
        };

        // Format for contact form with an extension
        } else {
            mailOptions = {
                from: `"${name}" <${email}>`,
                to: 'patrolcamproject@gmail.com', 
                subject: 'New Contact Form Submission',
                text: `New inquiry from: \n${name} at ${org} \nPhone: ${ext} - ${phone} \nAbout: ${productInterest}`,
            };
        }

        // Send the email
        await transporter.sendMail(mailOptions);

        // Log email sent action
        await withTransaction(async (session) => {
            
            await logActivity({
                action: 'Contact Form Submission',
                session
            });
        });

        // REPLACE this with client-side js to show confirmation of successful email sent ? 
        res.status(200).json({ 'message': 'Thank you for your interest in Patrol Cam products and services, we will get back to you shortly' });

    } catch (err) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to send email',
                source: 'emailController',
                userId: '',
                code: '500',
                meta: { message: err.message, stack: err.stack },
                session
            });

        });
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { sendContactFormEmail }