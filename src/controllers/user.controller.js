import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";

import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse} from "../utils/ApiResponse.js";


const registerUser  =  asyncHandler(  async (req,res)=>{
   // get user details from frontend
   // validation - not empty
   // check if user already exist : username, email
   // check for images , check for avatar
   // upload them to cloudinary,avatar
   // create user object - create entry in db
   // remove password and refresh tokenfield from response
   // check for user creation
   // retuen creation

 const {fullname, email, username, password} = req.body
 console.log("email : ",email);

 if([fullName, email, username, password].some( (field)=>{
return field?.trim() === "";
 })){
    throw new ApiError(400,"all fields are required")
 }

 const existedUser =  User.findOne({
    $or: [ {username}, {email}]
 })

 if(existedUser){
    throw new ApiError(409," user with email or username already registered ")
 }

   const avatarLocalpath = req.files?.avatar[0]?.path;
   const coverImageLocalPath =   req.files?.coverImage[0]?.path;

   if(!avatarocalpath){
      throw new ApiError(400," Avatar file is required ");
   }

  const avatar = await uploadOnCloudinary(avatarLocalpath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
   throw new ApiError(400," Avatar file is required ");

  }

 const user = await User.create({
   fullName,
   avatar: avatar.url,
   coverImage: coverImage?.url || "",
   email,
   password,
   username: username.toLowerCase()
  })

     const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
     )

   if(!createdUser){
      throw new ApiError(500, "Something went wrong while regestering the user")
   }



})

export {registerUser}
