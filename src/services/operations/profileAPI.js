import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { profileEndpoints, settingsEndpoints } from "../apis";
import { logout } from "./authAPI";
import { setProgress } from "../../slices/loadingBarSlice";

export async function getUserCourses(token){
    let result= []
    try {
        const response= await apiConnector(
            "GET",profileEndpoints.GET_USER_ENROLLED_COURSES_API,
            null,
            {
            Authorisation: `Bearer ${token}`,
            }
        );
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result=response.data.data;
    } catch (error) {
        console.log("get user enrolled courses api error",error)
        toast.error("could not get enrolled courses")
    }
    return result;
}

export async function updatePfp(token,pfp){
    const toastId = toast.loading("Uploading...")
    try {
        const formData= new FormData();
        console.log("pfp",pfp);
        formData.append("pfp",pfp);
        const response = await apiConnector("PUT", settingsEndpoints.UPDATE_DISPLAY_PICTURE_API, formData,{
            Authorisation:`Bearer ${token}`,
        });
        console.log("UPDATE PFP API RESPONSE....",response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("profile picture uploaded successfully");
        const imageUrl= response.data.data.image;
        localStorage.setItem("user",JSON.stringify({...JSON.parse(localStorage.getItem("user")),image:imageUrl}));
        console.log(JSON.parse(localStorage.getItem("user")).image);
    } catch (error) {
        console.log("update display picture api error",error);
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

export async function updateAdditionalDetails(token,additionalDetails){
    console.log("additional Details, ",additionalDetails)
    const {firstName,lastName,dateOfBirth,gender,contactNumber,about}=additionalDetails;
    const toastId=toast.loading("updating..");
    try {
        const response = await apiConnector("PUT",settingsEndpoints.UPDATE_PROFILE_API,{firstName,lastName,dateOfBirth,gender,contactNumber,about},{
            Authorisation:`Bearer ${token}`,
        });
        console.log("update additional details api response",response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Additional Details Updated Successfully");
        const user = JSON.parse(localStorage.getItem("user"));
        user.firstName=firstName||user.firstName;
        user.lastName=lastName|| user.lastName;

        user.additionalDetails.dateOfBirth=dateOfBirth || user.additionalDetails.dateOfBirth;
        user.additionalDetails.contactNumber= contactNumber|| user.additionalDetails.contactNumber;
        user.additionalDetails.gender= gender;
        localStorage.setItem("user",JSON.stringify(user));
    } catch (error) {
        console.log("update additionals details api error",error);
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

export async function deleteAccount(token,dispatch,navigate){
    const toastId=toast.loading("Deleting..");
    try {
        const response = await apiConnector("DELETE", settingsEndpoints.DELETE_PROFILE_API,null,{
            Authorisation:`Bearer ${token}`,
        });
        console.log("delete account api response",response)
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Account deleted successfully");
        dispatch(logout(navigate))
    } catch (error) {
        console.log("delete account api error..",error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

export async function updatePassword(token,password){
    const {oldPassword,newPassword,confirmPassword:confirmNewPassword}=password;
    console.log("password", password);
    const toastId= toast.loading("updating...")
    try {
        const response = await apiConnector("POST", settingsEndpoints.CHANGE_PASSWORD_API, {oldPassword,newPassword,confirmNewPassword},{
            Authorisation:`Bearer ${token}`
        })
        console.log("update password api response.. ", response)
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("password updated successfully");
    } catch (error) {
        console.log("update password api error",error);
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}