//שליחת מייל באמצעות ספריית NODE MAILER
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    //יצירת שכבת תעבורה,הגדרת מארח,שירות,פורט,ופרטי התחברות לתיבת המייל השולחת
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
//שליחת המייל למשתמש לטובת איפוס סיסמא
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent successfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;