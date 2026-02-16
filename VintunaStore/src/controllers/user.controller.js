import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import bcrypt from 'bcrypt';
import { verifyEmailTemplate } from '../utils/verifyEmailTemplate.js';
import { sendEmail } from '../config/sendEmail.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateAccessAndRefreshToken.js';

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

  const {name,email,password } = req.body;
  if (!name || !email || !password) {
    throw new apiError(400, 'All fields are required');
  }
  // email validation regex

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new apiError(400, 'email should be in correct format ');
  }
  if (password.length < 8) {
    throw new apiError(400, 'Password must be at least 8 characters');
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
  return res.status(201).json(new apiResponse(201, save, 'user registered succesfully '));
});

const verifyEmailController = asyncHandler(async (req, res) => {
  // step :

  // 1. get the code from the frontend
  // 2. find the user with the code
  // 3. if user not found throw error
  // 4. if user found update the isVerified field to true
  // 5. return the user

  const { code } = req.body;

  const user = await User.findOne({ _id: code });
  if (!user) {
    throw new apiError(400, 'invalid Code ');
  }

  const updateUser = await User.updateOne(
    { _id: code },
    {
      verify_email: true,
    },
  );

  return res.status(200).json(new apiResponse(200, 'Email has been verified '));
});

const loginController = asyncHandler(async (req, res) => {
  /*  step to login controller:
  1. get the userEmail and Password from the frontend
  2, check if the user exists or not 
  3. if not exit throw error
  4. if exist check if the password is correct or not
  5. if password is incorrect throw error
    
  */

  const { email, password } = req.body;

  // checking wether the all fields are entered or not

  if (!email || !password) {
    throw new apiError(400, 'all field are required  ');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(400, 'User with this email address didint exit');
  }

  if (user.status !== 'Active') {
    throw new apiError(
      400,
      'your accoutt is either inactive or suspended contact the Admin for help ',
    );
  }

  const checkpassword = await bcrypt.compare(password, user.password);

  if (!checkpassword) {
    throw new apiError(400, 'your password didnt matched ');
  }

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const accessToken = await generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  const option = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };

  //returning the response
  return res
    .status(200)
    .cookie('accessToken', accessToken, option)
    .cookie('refreshToken', refreshToken, option)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'User Logged In successFully ',
      ),
    );
});

const logoutController = asyncHandler(async (req, res) => {
  /* 
  step:
  1. get the user id from the access token
  2. find the user with the id
  3. if user not found throw error
  4. if user found update the refresh token to null
  5. return the response
   */
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },

    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, {}, 'user Logged out successfully '));
});

/*upload user avatar image
step: 
1. get the user id from the auth middleware
2. get the image from the multer middleware
3. check if the image is present or not if not throw error
4. if image is present upload the image to cloudinary
*/

const uploadAvatarController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const file = req.file;

  if (!file) {
    throw new apiError(400, 'image is required');
  }

  const result = await uploadOnCloudinary(file.path,);

  const response = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar: result.secure_url,
      },
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .json(new apiResponse(200, response, 'avatar uploaded successfully '));
});

/*
update user details and password hased 

step :
1. get the user id from the auth middleware
2. get the user details from the frontend
3. check if the user details are present or not if not throw error
4. if user details are present update the user details in the database
5. return the response
*/

const updateUSerDetailsController = asyncHandler(async (req, res) => {
  
})




//forget password
//verify forget password otp
// reset the password
//refresh token controller
//get login user details

export { registerUser, verifyEmailController, loginController, logoutController, uploadAvatarController };
