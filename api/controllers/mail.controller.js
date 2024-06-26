import nodemailer from "nodemailer";
import { secret } from "../app.js";

export const sendMail = async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // Setup Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // or another email service
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user:
        process.env.NODE_ENV == "production"
          ? secret?.Portfolio_Email
          : process.env.Portfolio_Email, // your email address
      pass:
        process.env.NODE_ENV == "production"
          ? secret?.Portfolio_Password
          : process.env.Portfolio_Password, // your email password
    },
  });

  const mailOptions = {
    to: "abhishek.codes0@gmail.com", // where you want to receive the email
    subject: `${email} | ${subject}`,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Message Sent" });
  } catch (error) {
    next(error);
  }
};
