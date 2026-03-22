import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

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
                console.log(error)

            }

            const delay = attempts * 2000;
            await sleep(delay);
        }
    }
}