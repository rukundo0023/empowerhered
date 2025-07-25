import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
   tls: {
    rejectUnauthorized: false, // add this line
  },
});

export const sendWelcomeEmail = async ({ name, email }) => {
  const mailOptions = {
    from: `"EmpowHerEd" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to EmpowerHerEd!',
    html: `
      <h2>Welcome to EmpowHerEd!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for signing up for EmpowHerEd.</p>
      <p>You can now sign in and start exploring courses, workshops, and mentorship opportunities by clicking the button below:</p>
      <p><a href="http://localhost:5173/login" style="padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;">Sign In</a></p>
      <p>We're excited to support you on your journey!</p>
      <p>If you have any questions, feel free to contact us anytime.</p>
      <br>
      <p>Best regards,<br>EmpowHerEd Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
