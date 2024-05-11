const express= require("express")
const router=express.Router();

const {
    createCourse,getCourseDetails,showAllCourses,
    editCourse,getInstructorCourses,markLectureAsComplete,
    searchCourse,
    deleteCourse,getFullCourseDetails
} =require("../controllers/Course")


const {auth, isAdmin, isStudent,isInstructor}= require("../middlewares/auth")
const {createCategory, showAllCategories, categoryPageDetails} = require("../controllers/Category")
const {createSection,updateSection,deleteSection} = require("../controllers/Section")

const {createSubSection,updateSubSection,deleteSubSection} =require("../controllers/SubSection")

const {createRating, getAverageRating, getAllRating}= require("../controllers/RatingAndReview")

// course

router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)

router.post("/addSubSection", auth, isInstructor, createSubSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

router.get("/getAllCourses", showAllCourses)
router.post("/getCourseDetails", getCourseDetails)
router.post("/editCourse", auth, isInstructor, editCourse)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.delete("/deleteCourse",auth, deleteCourse)
router.post("/searchCourse", searchCourse);
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories",showAllCategories)
router.post("/getCategoryPageDetails",categoryPageDetails)

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating",getAverageRating)
router.get("/getReviews",getAllRating)

module.exports=router;

