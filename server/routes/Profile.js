const express= require("express")
const router=express.Router();
const {auth,isInstructor}=require("../middlewares/auth")

const {
    deleteAccount,updateProfile,getAllUserDetails,getEnrolledCourses,updateDisplayPicture,instructorDashboard
}=require("../controllers/Profile")

// Delet User Account
router.delete("/deleteProfile",auth,deleteAccount)
router.put("/updateProfile", auth,updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
//get instructor dashboard details
router.get("/getInstructorDashboardDetails",auth,isInstructor, instructorDashboard)

module.exports = router;