const Profile= require("../models/Profile")
const User= require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")
const Course = require("../models/Course")

exports.updateProfile = async (req,res) =>{
    try {
        const {dateOfBirth="", about="",firstName,lastName, contactNumber, gender=""} = req.body;

        const id = req.user.id

        if(!contactNumber|| !gender || !id){
            return res.status(400).json({
                success:false,
                message:"all fields required",
            });
        }

        const userDetails = await User.findById(id);
        const profileId= userDetails.additionalDetails;
        const profileDetails =await Profile.findById(profileId);

        userDetails.firstName=firstName || userDetails.firstName;
        userDetails.lastName=lastName || userDetails.lastName;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about || profileDetails.about;
        profileDetails.gender = gender || profileDetails.gender;
        profileDetails.contactNumber = contactNumber || profileDetails.contactNumber;

        await profileDetails.save();
        await userDetails.save();

        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails,
            userDetails,
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"",
            error:error.message
        })
    }
}

exports.deleteAccount = async (req,res)=>{
    try {
        const id = req.user.id

        const userDetails = await User.findById({ _id: id });

        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"user cannot be deleted",
            error:error.message
        })
    }
};

exports.getAllUserDetails = async (req,res)=>{
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"user details fetched successfully",
            data:userDetails
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"",
            error:error.message
        })
    }
}

exports.getEnrolledCourses=async (req,res) => {
	try {
        console.log("2");
        const id = req.user.id;
        const user = await User.findOne({
            _id:id,
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
      
        const enrolledCourses = await User.findOne({
            _id:id,
        }).populate("courses").exec();

        console.log(enrolledCourses);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: enrolledCourses.courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.updateDisplayPicture = async (req, res) => {
	try {

		const id = req.user.id;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
	const image = req.files.pfp;
	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await uploadImageToCloudinary(
		image,
		process.env.FOLDER_NAME
	);
	console.log(uploadDetails);

	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });
		
	} catch (error) {
		return res.status(500).json({
            success: false,
            message: error.message,
        });
		
	}
}

exports.instructorDashboard = async (req, res) => {
	try {
		const id = req.user.id;
		const courseData = await Course.find({instructor:id});
		const courseDetails = courseData.map((course) => {
			totalStudents = course?.studentsEnrolled?.length;
			totalRevenue = course?.price * totalStudents;
			const courseStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudents,
				totalRevenue,
			};
			return courseStats;
		});
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: courseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}