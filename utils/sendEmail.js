const nodemailer = require('nodemailer');
const otpTemplate = require('../templates/otpTemplate') ;
require('dotenv').config() ;


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})


const sendEmail = async(email , otp) => {
    try {
        console.log("email info : "  , {email , otp}) ;

        const info = await transporter.sendMail({
            from: `DeviceContectr <${process.env.EMAIL}>`,
            to: email,
            subject: "OTP for signup/Login",
            html: `${otpTemplate(otp)}`,
        })

        console.log("Email sent successfully", info.response);
    }
    catch(error){
        console.log("Error while sending the email : " , error.message) ;
    }
};

module.exports = sendEmail;


