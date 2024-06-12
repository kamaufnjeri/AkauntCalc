import dotenv from "dotenv";
import transporter from "../config/mail.config";

dotenv.config();

const SENDER = process.env.APP_EMAIL || "";

interface returnAttributes {
  booleanValue: boolean;
  message: string;
}

const sendMail = async (
  receiverEmail: string,
  subject: string,
  text: string,
): Promise<returnAttributes | undefined> => {
  if (!SENDER) {
    return { booleanValue: false, message: "Sender email required" };
  }
  const mailOptions = {
    from: SENDER,
    to: receiverEmail,
    subject: subject,
    text: text,
  };


  try {
    const response = await transporter.sendMail(mailOptions);
    console.log(response);
    return { booleanValue: true, message: "Check your email for link" };
} catch (error) {
    console.log("Error sending mail", error);
    return { booleanValue: false, message: "Error sending mail" };
}
};

export default sendMail;
