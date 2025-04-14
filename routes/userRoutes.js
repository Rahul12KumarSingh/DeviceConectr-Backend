const Router = require('express');
const { signupController , otpController, loginController } = require('../controllers.js/userController');



const router = Router();

//Route for generating the OTP...
router.post('/auth/generate-otp', otpController); 
//Route for signing up the user...
router.post('/auth/signup', signupController);

//Route for logging in the user...
router.post('/auth/login' , loginController) ;

module.exports = router;



