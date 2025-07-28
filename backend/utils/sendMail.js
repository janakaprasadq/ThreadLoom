import nodemailer from "nodemailer";

const sendMail = async (
  subject,
  htmlContent,
  toEmail = process.env.ADMIN_EMAILS
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "Mailgun", "SendGrid", etc.
    auth: {
      user: process.env.MAIL_USER, // admin@gmail.com
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: toEmail, // target admin email
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
