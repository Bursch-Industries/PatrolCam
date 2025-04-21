const nodemailer = require('nodemailer');


export async function POST(req){
    // get the form info from the request
    const formInfo = await req.json();
    const { contactName, organization, phoneNumber, email, productInterest, extension } = formInfo;
    console.log(formInfo);

    if (!contactName || !email || !organization || !phoneNumber || !productInterest) {
        return new Response(
            JSON.stringify({error: 'failed to process request'}),
            { status: 400 }
        )
    }

    try {
        // Creat nodemailer transport (connection to SMTP server)
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: 'mekashaniftalem@gmail.com', // REPLACE with email address that is being "charged" for the emails
                pass: process.env.GMAIL_APP // REPLACE with app password corresponding to above email
            }
        });

        // Initialize mailOptions as empty, as there will be two potential formats
        let mailOptions;

        // If the user did NOT provide an extension, format the email without it
        if (extension === 'optional') {
            mailOptions = {
                from: `"${contactName}" <${email}>`,
                to: 'patrolcamproject@gmail.com', 
                subject: 'New Contact Form Submission',
                text: `New inquiry from: \n ${contactName} at ${organization} \n Phone: ${phoneNumber} \nAbout: ${productInterest}`,
        };

        // Format for contact form with an extension
        } else {
            mailOptions = {
                from: `"${contactName}" <${email}>`,
                to: 'patrolcamproject@gmail.com', 
                subject: 'New Contact Form Submission',
                text: `New inquiry from: \n${contactName} at ${organization} \nPhone: ${extension} - ${phoneNumber} \nAbout: ${productInterest}`,
            };
        }

        // Send the email
        await transporter.sendMail(mailOptions);


        // TODO: implement this function so that it works for us

        // // Log email sent action
        // await withTransaction(async (session) => {
            
        //     await logActivity({
        //         action: 'Contact Form Submission',
        //         session
        //     });
        // });

        return new Response (
            { status: 200 }
        )
        
    } catch (error) {
        
        // TODO: Implement this function so that it works for us

        // await withTransaction(async (session) => {        
        //     await logError(req, {
        //         level: 'ERROR',
        //         desc: 'Failed to send email',
        //         source: 'emailController',
        //         userId: '',
        //         code: '500',
        //         meta: { message: err.message, stack: err.stack },
        //         session
        //     });
        // });

        return new Response(
            { status: 500 }
        )
    }
}