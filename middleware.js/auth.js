const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Otp = require('../models/otp');


const authenticate = async(req, res, next) => {
  console.log("authetication start...");
  try {
    const token =
      req.body.token || req.headers["authorization"]?.split(" ")[1];

   console.log("token : ", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token add karke req bhejo...."
      })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    console.log("authetication done..");

    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while authenticating the user....",
      error: error.message
    })
  }
}

module.exports = { authenticate };