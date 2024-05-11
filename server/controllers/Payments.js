const {instance}=require("../config/razorpay")
const Course = require("../models/Course")
const User= require("../models/User")
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")
const {mongoose} = require("mongoose")

// capture the payment and initiate the razorpay order

exports.capturePayment = async(req,res) =>{
    const {courseId}=req.body;
    const userId = req.user.id;

    if(!courseId){
        return res.json({
            success:false,
            message:"Please provide valid course Id"
        })
    }

    let course;

    try {
       course== await Course.findById(courseId);

        if(!course){
            return res.json({
                success:false,
                message:"Could not find course",
            })
        }

        const uid = new mongoose.Types.ObjectId(userId);

        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Student already enrolled"
            })
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

    // order create
    const amount = course.price;
    const currency="INR";

    const options ={
        amount:amount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId:courseId,
            userId,

        }
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse)

        res.status(200).json({
            success:true,
            courseName:course.courseName,
            description: course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })
    } catch (error) {

        console.log(error)

        res.json({
            success:false,
            message:"could not initiate order"
        })
        
    }
};

// verify signature of razorpay and server

exports.verifySignature = async (req,res) =>{
    const webhookSecret ="12345678";

    const signature=req.headers["x-razorpay-signature"]

    const shasum= crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));

    const digest=shasum.digest("hex");

    if(signature === digest){
        console.log("payment is authorised")

        const {courseId, userId } = req.body.payload.payment.entity.notes;

        try {
        //    find the course and enroll the student in it  // 

        const enrolledCourse = await Course.findOneAndUpdate(
            {_id:courseId},
            {$push : {studentsEnrolled:userId}},
            {new:true}
        );

        if(!enrolledCourse){
            res.status(500).json({
                success:false,
                message:"Course not found"
            });
        }

        console.log(enrolledCourse);

        const enrolledStudent = await User.findByIdAndUpdate(
            {_id:userId},
            {$push:{courses:courseId}},
            {new:true}
        );

        console.log(enrolledStudent)

        // mail send;

        const emailResponse= await mailSender(
            enrolledStudent.email,
            "From Course: ",
            "Congratulations, u r onbooarded into new course",
        )

        console.log(emailResponse);

        return res.status(200).json({
            success:true,
            message:"Signature verified and one course added"
        })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }
    else{
        return res.status(400).json({
            success:false,
            message:"invalid request"
        })
    }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
    const {amount,paymentId,orderId} = req.body;
    const userId = req.user.id;
    if(!amount || !paymentId) {
        return res.status(400).json({
            success:false,
            message:'Please provide valid payment details',
        });
    }
    try{
        const enrolledStudent =  await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Study Notion Payment successful`,
            paymentSuccess(amount/100, paymentId, orderId, enrolledStudent.firstName, enrolledStudent.lastName),
        );
}
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}