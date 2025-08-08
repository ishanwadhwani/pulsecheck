const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: 'michale.schulist@ethereal.email',
    pass: 'evGfSKZGPNpTpES9CK',
  },
});

class MailService {
  /**
   * Sends a "Site Down" alert email.
   * @param {string} userEmail - The email address to send the alert to.
   * @param {object} check - The check object that has gone down.
   */

  static async sentDownAlert(userEmail, check) {
    const mailOptions = {
      from: '"PulseCheck" <noreply@pulsecheck.com',
      to: userEmail,
      subject: `Alert: Your site ${check.name} is Down!`,
      html: `
                <h1>Site Down Alert</h1>
                <p>Hi there, </p>
                <p>Our PulseCheck monitor has detected that your site is currently down.</p>
                <ul>
                    <li><b>Name:</br> ${check.name}</li>
                    <li><b>URL:</br><a href="${check.url}">${check.url}</a></li>
                    <li><b>Time Detected:</b> ${new Date().toLocaleString()}</li>
                    </ul>
                <p>We will notify you again once it's back up.</p>
                <p>— The PulseCheck Team</p>
                `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(` -> Alert email sent successfully to ${userEmail}`);
        console.log(" -> Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error(`Error sending "Down" alert to ${userEmail}:`, error);
    }
  }
}

module.exports = MailService;
