const Category= require("../models/Category")
const Course = require("../models/Course")

exports.createCategory =  async (req,res) => {
    try {

        const {name, description}=req.body;

        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields required"
            })
        }

        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        
        console.log(categoryDetails)

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// getAllcategory

exports.showAllCategories = async (req,res) => {
    try {

        const allCategory = await Category.find({}, {name:true, description:true})

        return res.status(200).json({
            success:true,
            message:"All category returned successfully",
            data:allCategory,
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// pageDetails

exports.categoryPageDetails = async (req,res)=>{
    try {
        console.log("inside get category page details")
        const {categoryId}= req.body;

        const selectedCategory = await Category.findById(categoryId)    
        .populate({path:"courses",match:{status:"Published"},populate:([{path:"instructor"},{path:"ratingAndReviews"}])})
        .exec();
        
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data Not Found"
            })
        }
        
        if (selectedCategory.courses.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

        const selectedCourses = selectedCategory.courses;

		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		}).populate({path:"courses",match:{status:"Published"},populate:([{path:"instructor"},{path:"ratingAndReviews"}])});
		let differentCourses = [];
		for (const category of categoriesExceptSelected) {
			differentCourses.push(...category.courses);
		}

        const allCategories = await Category.find().populate({path:"courses",match:{status:"Published"},populate:([{path:"instructor"},{path:"ratingAndReviews"}])});
		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);

        return res.status(200).json({
            success:true,
            selectedCourses:selectedCourses,
            differentCourses:differentCourses,
            mostSellingCourses:mostSellingCourses
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.addCourseToCategory = async (req,res) =>{
    const {courseId, categoryId}=req.body;

    try {
        const category = await Category.findById(categoryId)
        if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

        const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

        if(category.courses.includes(courseId)){
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}
        category.courses.push(courseId);
		await category.save();
		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});

    } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message,
            });
    }
}