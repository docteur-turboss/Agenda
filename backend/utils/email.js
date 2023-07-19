let nodemailer = require('nodemailer')

const sendEmail = async (optionEmail = {AdressEmail, subjectEmail, textEmail}) => {
    let transporter = nodemailer.createTransport({
        service : process.env.SERVICE_EMAIL,
        auth: {
            user: process.env.EMAIL_IDENTIFIANT,
            pass: process.env.EMAIL_PASS
        }
    })

    let mailOptions = {
        from : process.env.EMAIL_IDENTIFIANT,
        to : optionEmail.AdressEmail,
        subject: optionEmail.subjectEmail,
        text: optionEmail.textEmail
    }

    await transporter.sendMail(mailOptions);
    return
}

module.exports = sendEmail;