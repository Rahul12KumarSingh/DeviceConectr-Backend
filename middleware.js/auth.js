const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Otp = require('../models/otp');



const authMiddleware = async(req , res , next) => {
      try {
          const token = req.cookies.token || 
              req.body.token ;

        if(!token){
               return res.status(401).json({
                  success: false  ,
                  message: "token add karke req karo...."
               })
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET) ;

        console.log("decode : ", decode);
        req.user = decode ;

        next();
      } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while authenticating the user",
            error: error.message
        })
      }
}

module.exports = authMiddleware ;