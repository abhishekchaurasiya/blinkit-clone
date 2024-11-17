import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_EMAIL_API_KEY;

if (!resendApiKey) {
    throw new Error('Please provide the Resend API key in your environment variables.');
}

const resend = new Resend(resendApiKey);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Blinkit <onboarding@resend.dev>',
            // to: [sendTo],
            to: sendTo,
            subject: subject,
            html: html,
        });
        if(error){
           return console.error({error})
        }
        return data;
    } catch (error) {
        console.log(error);
    }
}

export default sendEmail

