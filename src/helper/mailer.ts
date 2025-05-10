import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcrypt from "bcryptjs";

export const sendEmail = async({email, emailType, userId}: any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType==="VERIFY") {
            await User.findByIdAndUpdate(userId, 
                {
                    $set: { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
                }
            )
        } 
        else if (emailType==="RESET") {
            await User.findByIdAndUpdate(userId, 
                {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}
            )
        } 

        // Create a test account or replace with real credentials.
        // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            }
              
        });

        const mailOptions = {
            from: 'mj.devsoft@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify your email':'Reset your password',
            text: "Hello world?", // plain‑text body
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
                    to ${emailType==="VERIFY" ? "verify your email" : "reset your password"}
                    or copy and paste the link below in your browser.
                    <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`
        }
        const mailResponse = await transport.sendMail(mailOptions);

        return mailResponse;
        
    } catch (error: any) {
        throw new Error(error.message);
    }
}