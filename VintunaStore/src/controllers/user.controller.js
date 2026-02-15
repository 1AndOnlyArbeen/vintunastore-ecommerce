import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import bcrypt from 'bcrypt';
import { verifyEmailTemplate } from '../utils/verifyEmailTemplate.js';
import { sendEmail } from '../config/sendEmail.js';

const registerUser = asyncHandler(async (req, res) => {
  /* step to register the user :
    1. first get the data from the frontend 
    2. check if the user already exists
    3. check if the user is valid
    4. hash the password
    5. save the user to the database
    6. return the user
    */

  // get user details from frontend

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new apiError(400, 'All fields are required');
  }

  // check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    throw new apiError(400, 'User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hasPassword = await bcrypt.hash(password, salt);

  const payload = {
    name,
    email,
    password: hasPassword,
  };

  const newUser = new User(payload);
  const save = await newUser.save();

  const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;
  const verifyEmail = await sendEmail({
    sendTo: email,
    subject: 'Welcome to VintunaStore',
    html: verifyEmailTemplate({
      name: name,
      url: verifyEmailUrl,
    }),
  });
  return res.status(201).json(
    new apiResponse(201, save, 'user registered succesfully '));
});



const verifyEmailController = asyncHandler(async(req,res)=>{

  // step : 

  // 1. get the code from the frontend
  // 2. find the user with the code
  // 3. if user not found throw error
  // 4. if user found update the isVerified field to true
  // 5. return the user



  const {code} = req.body


  const user = await User.findOne({_id:code})
  if (!user) {
    throw new apiError(400, "invalid Code ")
    
  }

  const updateUser = await User.updateOne({_id: code},{
  verify_email : true

  })

  return res.status(200).json(
    new apiResponse(200, "Email has been verified ")
  )

})
export { registerUser, verifyEmailController };
