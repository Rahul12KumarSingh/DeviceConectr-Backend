

const signupController = async (req, res) => {
    try {
        const { firstName, lastName, email, profilePic, otp } = req.body;


        if (!firstName || !lastName || !email || !profilePic) {
            return res.status(400).json({ message: "Please provide all the fields" });
        }


        //   const user = await User.findOne({email}) ;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //finding the recent otp for that user....
        const response = await Otp.findOne({ email }).limit(1).sort({ createdAt: -1 });

        if (!response) {
            return res.status(400).json({
                success: false,
                message: "please generate the otp again"
            });
        }


        if (otp != response[0].otp) {
            return res.status(400).json({
                success: false,
                message: "please provide the correct otp"
            });
        }


        const user = await User.create({
            firstName, lastName, email, profilePic, devices: [], CorrespondingCode: ""
        });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

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

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the  required fields"
            });
        }

        //checking if the user exists or not
        const user = await user.findOne({email});

        if(!user){
            res.success(400).json({
                success: false,
                message: "User nahi hai...."
            })
        }

        //finding the recent otp for that user....
        const response = await Otp.findOne({ email }).limit(1).sort({ createdAt: -1 });

        if (!response) {
            return res.status(400).json({
                success: false,
                message: "please generate the otp again"
            });
        }

        if (otp != response[0].otp) {
            return res.status(400).json({
                success: false,
                message: "please provide the correct otp"
            });
        }

       
        const token = jwt.sign({
            email 
        } , process.env.JWT_SECRET , {expiresIn: '30d'}) ;

        user.token = token ;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true ,
        }

        res.cookie("token" , token , options).status(200).json( {
            success : true ,
            token , 
            user ,
            message : "User logged in successfully" ,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while logging in the user",
            error: error.message
        });
    }
}