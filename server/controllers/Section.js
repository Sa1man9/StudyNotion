const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req, res) => {
    try {
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            });
        }

        const newSection = await Section.create({sectionName});

        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push : {
                    courseContent:newSection._id,
                }
            },
            {new:true}
        );
        return res.status(200).json({
            success:true,
            message:"section creted successfully",
            updatedCourseDetails,
        })

    } catch (error) {

        res.status(500).json({
            success:false,
            message:"failed to create section, please try again",
            error:error.message
        })
        
    }
}

exports.updateSection =  async (req,res) => {
    try {
        
        const {sectionName,sectionId} =req.body;

        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            });
        }

        const section = await Section.findByIdAndUpdate(
            sectionId,
            {
              sectionName  
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"Section updated successfully"
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"failed to update section, please try again",
            error:error.message
        })
    }
}

exports.deleteSection = async (req,res) =>{
    try {
        
        const {sectionId,courseId} =req.body;

        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            });
        }

        await Section.findByIdAndDelete(sectionId);
        const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "subSection" } }).exec();

        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
            updatedCourse
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"failed to delete section, please try again",
            error:error.message
        })
    }
};