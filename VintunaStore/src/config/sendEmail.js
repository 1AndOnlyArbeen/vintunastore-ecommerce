import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
  console.error('RESEND_API is not defined');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: ' VintunaStore [EMAIL_ADDRESS]',
      to: sendTo,
      subject: subject,
      html: html,
    });
    if (error) {
      return console.error('Error sending email:', error);
    }
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendEmail };
