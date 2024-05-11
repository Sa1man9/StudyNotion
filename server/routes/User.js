const express= require("express")
const router=express.Router();

const {login, signUp, sendOTP, changePassword}= require("../controllers/Auth")

const {resetPassword,
    resetPasswordToken}=require("../controllers/ResetPassword")

const {auth}=require("../middlewares/auth");


router.post("/login",login)
router.post("/signup",signUp);
router.post("/sendotp",sendOTP)
router.post("/changePassword",auth,changePassword)

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

module.exports=router;