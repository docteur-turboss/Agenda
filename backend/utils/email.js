let nodemailer = require('nodemailer');

const sendEmail = async (optionEmail = {AdressEmail, subjectEmail, textEmail}) => {
    try{
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
        return {
            status : true
        }
    }catch(err){
        console.log("EMAIL (backend/utils/email) HAS ERROR : ")
        console.log(err)
        
        return {
            status : false
        }
    }
}

module.exports = sendEmail;