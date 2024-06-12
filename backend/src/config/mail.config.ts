import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// configuring transpoter for sending message from browser as an email
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_EMAIL_PWD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default transporter;