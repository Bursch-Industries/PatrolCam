const nodemailer = require('nodemailer');


const testContact = async (req, res) => {
    const { name, org, ext, phone, email, productInterest } = req.body;

    console.log(req.body);
    if (!name || !email || !org) return res.status(400).json({ 'message': 'Please fill in all required fields.' });

    try {

        // Creat nodemailer transport (connection to SMTP server)
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'skeetercathcart@gmail.com', // Change to email address that is being "charged" for the emails
                pass: process.env.GMAIL_APP
            }
        });

        let mailOptions;

        if (!ext) {
            mailOptions = {
                from: `"${name}" <${email}>`,
                to: 'patrolcamproject@gmail.com', 
                subject: 'New Contact Form Submission',
                text: `New inquiry from: \n ${name} at ${org} \n ${phone} about: ${productInterest}\n\n`,
        };
        } else {
            mailOptions = {
                from: `"${name}" <${email}>`,
                to: 'patrolcamproject@gmail.com', 
                subject: 'New Contact Form Submission',
                text: `New inquiry from: \n${name} at ${org} \nPhone: ${ext} - ${phone} \nAbout: ${productInterest}`,
            };
        }
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 'message': 'Thank you for your interest in Patrol Cam products and services, we will get back to you shortly' });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { testContact }