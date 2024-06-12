import dotenv from 'dotenv';
import sendMail from './sendMail';
import tokenClass from '../middlewares/jwToken';

dotenv.config();
const verifyUser = async (receiverEmail: string): Promise<any> => {
    const token = await tokenClass.generateToken({ email: receiverEmail });
    console.log(token);
    const verificationLink = `${process.env.FRONTEND_URL}/api/v1/user/${token}`;
    const subject = "Verify Your Email Address";
    const body = `
    Dear User,

    Thank you for registering with our service. To complete your registration, we need to verify your email address.
    
    Please click the link below to verify your email address:
    
    ${verificationLink}
    
    This link will expire in 8 hours.
    
    If you did not request this verification, please ignore this email.
    
    Thank you,
    AkauntCalc   
    `;
    const result = await sendMail(receiverEmail, subject, body);

    if (result) {
        return result
    }
}

export default verifyUser;