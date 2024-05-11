import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/operations/authAPI';
import OTPInput from 'react-otp-input';
import { Link } from 'react-router-dom';

const VerifyOtp = () => {

    const [otp, setOtp] = React.useState("");
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const {loading,signupData} = useSelector((state)=>state.auth)

    const handleOnSubmit = (e)=>{
        e.preventDefault();

        const {email,accountType,confirmPassword,password, lastName, firstName}= signupData;
        dispatch(signUp(accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate))
    }

    useEffect(()=>{
        if(!signupData){
            navigate("/signup");
        }
    },[])

    return (
        loading?(<div className=" h-[100vh] flex justify-center items-center"><div class="custom-loader"></div></div>):(
        <div>
           <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center'>
            <div className='max-w-[500px] p-4 lg:p-8'>
            <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
            <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">A verification code has been sent to you. Enter the code below</p>
            <form onSubmit={handleOnSubmit}>
                    <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        inputStyle="w-[20px] rounded-[8px] border-[1px] border-richblack-500 text-[3rem] text-center"
                        focusStyle="border-[5px] border-red-500"
                        isInputNum={true}
                        shouldAutoFocus={true}
                        containerStyle="flex justify-between gap-4"
                        renderInput={(props) => <input {...props} />}
                        />
                    <button type="submit" className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">Verify Email</button>
            </form>
            <div className='mt-6 flex items-center justify-between'>
                <Link to={"/login"}>
                    <p class="flex items-center gap-x-2 text-richblack-5">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"></path></svg> 
                        Back To Login
                    </p>
                </Link>
            </div>
            </div>
           </div>
        </div>)
      )
}

export default VerifyOtp
