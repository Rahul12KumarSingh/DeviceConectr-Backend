const otpGenerator = require('otp-generator')

const User = require('../models/user')
const Otp = require('../models/otp')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')



const signupController = async (req, res) => {
    try {
        const { firstName, lastName, email, mobileNumber, otp } = req.body;


        if (!firstName || !email || !mobileNumber) {
            return res.status(400).json({ message: "Please provide all the fields required" });
        }

        if (!otp) {
            return res.status(400).json({ message: "Please provide the otp" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //finding the recent otp for that user....
        const response = await Otp.findOne({ email }).limit(1).sort({ createdAt: -1 });


        if (otp != response?.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid Otp!!"
            });
        }

        const user = await User.create({
            firstName, lastName, email, mobileNumber, devices: [], controllerCode: ""
        });

        const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            success: true,
            message: "User created successfully",
            token,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while creating the user",
            error: error.message
        });
    }
}


const loginController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide the email"
            });
        }

        if(!otp){
            return res.status(400).json({
                success: false,
                message: "Please provide the otp"
            });
        }


        const user = await User.findOne({ email });

        if (!user) {
            res.success(400).json({
                success: false,
                message: "User nahi hai...."
            })
        }

        //finding the recent otp for that user....
        const response = await Otp.findOne({ email }).limit(1).sort({ createdAt: -1 });

        console.log("otp : " , response?.otp) ;


        if (otp != response?.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid Otp!!"
            });
        }


        const token = jwt.sign({
            email
        }, process.env.JWT_SECRET, { expiresIn: '1d' });


        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while logging in the user",
            error: error.message
        });
    }
}


const otpController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please provide the email"
        });
    }

    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    await Otp.create({
        email,
        otp
    });


    sendEmail('rahulsingh8556kumar@gmail.com', otp);

    return res.status(200).json({
        success: true,
        message: "Otp generated successfully",
        otp: otp
    })
}

module.exports = { signupController, loginController, otpController };   