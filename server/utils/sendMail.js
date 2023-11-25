const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};
