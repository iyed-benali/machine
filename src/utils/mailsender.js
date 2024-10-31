const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "iyedbenali27@example.com",
        pass: "tennisdechebba"
      }
    });
    
    let info = await transporter.sendMail({
      from: 'www.sandeepdev.me - Sandeep Singh',
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = mailSender;