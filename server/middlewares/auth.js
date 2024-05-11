const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")

// auth 

exports.auth = async (req, res, next) =>{
    try{
        console.log("inside auth");
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorisation").replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing",
            })
        }

        // verify the token
        try{
            
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("inside decode auth")
            console.log(decode);
            req.user = decode;
            
        }catch(err){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    }
    catch (error){
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verification"
        })
    }
}

// isStudent

exports.isStudent = async (req, res, next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students only"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, try again"
        })
    }
}

// isInstructor

exports.isInstructor = async (req, res, next)=>{
    console.log("inside isInstructor")
    try{
        
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructors only"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, try again"
        })
    }
}

// isAdmin

exports.isAdmin = async (req, res, next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, try again"
        })
    }
}

