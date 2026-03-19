import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { AppError } from './middlewares/errors/error';
import { ERROR_CODES } from './middlewares/errors/error.constants';
import { SelectParameters$ } from '@aws-sdk/client-s3';

export async function sendEmail(
    email: string,
    subject: string,
    content: string,
    senderEmail: string,
    senderPassword: string,
    ccPerson?: string[],
): Promise<void> {
    const transporter: Transporter = nodemailer.createTransport({
        service: 'gmail',
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: senderEmail,
            pass: senderPassword,
        },
    });

    const mailOptions: SendMailOptions = {
        from: senderEmail,
        to: email,
        subject: subject,
        html: content,
        cc: ccPerson.join(', '),
    };
    const MAX_RETRIES = 3;
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    for (let attempts = 1; attempts <= MAX_RETRIES; attempts++) {
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully`, info)
            return;
        } catch (error) {
            if (attempts == MAX_RETRIES) {
                console.log(`Email could not be sent after ${attempts} attempts`)
                throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 'Order Confirmation Email could not be sent');

            }

            const delay = attempts * 2000;
            await sleep(delay);
        }



    }
}