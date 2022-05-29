const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({
  path: '../config.env',
});

const sendEmail = async (options) => {
  //1.) Create transporter
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: 2525,
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //   tls: { rejectUnauthorized: false },
  // });
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: '5aece2912f0e84',
      pass: '9d3dc079bfef9c',
    },
  });

  //2.) Create options

  const mailOptions = {
    from: 'Sweedal Gracius <admin@gmail.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:option.message
  };
  //3) Actually send mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
