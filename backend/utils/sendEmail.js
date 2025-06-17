import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, booking }) => {
  const { menteeName, mentorName, date, time, duration, topic } = booking;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333333;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #eeeeee;
        border-radius: 8px;
        background-color: #f9f9f9;
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        color: #2E86C1;
        margin-bottom: 10px;
      }
      .content {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .footer {
        font-size: 14px;
        color: #888888;
        border-top: 1px solid #dddddd;
        padding-top: 10px;
        text-align: center;
      }
      .btn {
        display: inline-block;
        background-color: #2E86C1;
        color: white !important;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Mentorship Booking Confirmed</div>
      <div class="content">
        Dear ${menteeName},<br><br>

        We are pleased to inform you that your mentorship booking with <strong>${mentorName}</strong> has been successfully accepted.<br><br>

        <strong>Booking Details:</strong><br>
        - Date: ${new Date(date).toLocaleDateString()}<br>
        - Time: ${time}<br>
        - Duration: ${duration} minutes<br>
        - Topic: ${topic}<br><br>

        Please be ready and make sure to attend the session on time.<br><br>

        If you have any questions or need to reschedule, feel free to contact us.<br><br>

        Best regards,<br>
        <strong>EmpowHer Mentorship Team</strong>
      </div>
      <div class="footer">
        EmpowHer Mentorship &bull; Empowering futures through guidance<br>
        <a href="mailto:support@empowher.com">support@empowher.com</a> | +1 (234) 567-8900
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"EmpowHer Mentorship" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Mentorship Booking Has Been Accepted',
      html: htmlContent,
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
