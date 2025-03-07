const User=require("../models/User")
const mailSender=require("../utils/mailSender")
const bcrypt=require("bcrypt")
const crypto=require("crypto")

// resetPasswordToken
exports.resetPasswordToken = async (req,res)=>{
    try{
        // get email from request

        const email = req.body.email;

        const user = await User.findOne({email: email});

        if(!user){
            return res.json({
                success:false,
                message:"email not registered"
            })
        }

        const token = crypto.randomBytes(20).toString("hex");

        const updatedDetails= await User.findOneAndUpdate(
            {email:email},
            {
                token: token,
                resetPasswordExpires:Date.now() + 3600000,
            },
            {
                new: true,
            }
        )
            console.log("details", updatedDetails)
        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email,"Password Reset Link",
        `Password reset link: ${url}` );

        return res.json({
            success:true,
            message:"Email sent successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong ,,'
        })
    }
} 

// resetpassword

exports.resetPassword = async (req,res) =>{
    try{
        // data fetch 

    const {password, confirmPassword, token} = req.body;

    // validate 
    if(password !=confirmPassword){
        return res.json({
            success:false,
            message:"password not matching"
        });
    }
    // userdetails from db using token 

    const userDetails = await User.findOne({token:token})

    if(!userDetails){
        return res.json({
            success:false,
            message:'Token invalid',
        });
    }

    // token time check

    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:'Token is expired, regenrate your token',
        });
    }

    // hash pasword and update 

    const hashedPassword = await bcrypt.hash(password,10);

    await User.findOneAndUpdate(
        {token:token},
        {password: hashedPassword},
        {new:true},
    );

    return res.status(200).json({
        success:true,
        message: "password reset successful"
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong, while sending reset password mail'
        })
    }
}