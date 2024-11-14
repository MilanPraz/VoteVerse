import User from '../models/user.js';
import { ApiError } from '../utils/apiError.js';
import { asynchandler } from '../utils/ASynchandler.js';
import { sendResponse } from '../utils/sendResponse.js';
import { tokenResponse } from '../utils/tokenResponse.js';
import Jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const registerUser = asynchandler(async (req, res) => {
    const { fullname, phone, email, password, address, nationalId, role } =
        req.body;

    //checking for unique nationalId
    const nationalID = await User.findOne({ nationalId });
    if (nationalID) {
        throw new ApiError(409, 'User with the NationalID already Exist.');
    }

    //checking for unique phone
    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
        throw new ApiError(409, 'User with the Phone no. already Exist.');
    }

    // Create a new user document
    const newUser = await User.create({
        fullname,
        phone,
        email,
        password,
        address,
        nationalId,
        role,
    });

    sendResponse(res, 200, 'User Registered Successfully!', newUser);
});

export const loginUser = asynchandler(async (req, res) => {
    const { nationalId, password } = req.body;

    //check if user Exist
    const userExist = await User.findOne({ nationalId });
    if (!userExist)
        throw new ApiError(401, `Invalid credentials: National ID not found.`);

    const loggedUser = await User.findOne({ nationalId });

    const isPasswordMatched = await loggedUser.checkPassword(password);
    if (!isPasswordMatched)
        throw new ApiError(401, 'Incorrect password entered.');

    tokenResponse(200, loggedUser, res, 'Login Successful');
});

export const validateAccessToken = asynchandler(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the format is "Bearer <token>"
    if (!token) {
        throw new ApiError(401, 'No access token provided.');
    }

    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            throw new ApiError(
                403,
                'Invalid access token! Please log in again.'
            );
        }

        // If token is valid, attach the decoded information to the request object
        req.user = decoded; // You can store user information or ID for later use

        sendResponse(res, 201, 'Access Token is Valid!');
    });
});

export const refreshToken = asynchandler(async (req, res) => {
    const refresh_token = req.cookies.refreshToken || req.body.refreshToken;

    console.log('helloooooooo');

    if (!refresh_token)
        throw new ApiError(401, 'No refresh token was provided.');

    Jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err)
                throw new ApiError(403, 'Invalid refresh token! Login Again');

            //generate new access token

            const user = await User.findOne({ nationalId: decoded.nationalId });

            if (!user)
                throw new ApiError(401, 'User not found with such National Id');

            //check the refresh TOken with DB refreshToken
            if (refresh_token !== user?.refreshToken) {
                throw new ApiError(401, 'Refresh Token is Expired.');
            }

            const newAccessToken = user.generateAccessToken();
            sendResponse(res, 200, 'New Access Token Set Successfully', {
                token: newAccessToken,
                user: user,
            });
        }
    );
});

export const forgotPassword = asynchandler(async (req, res) => {
    const { nationalId } = req.body;

    console.log('NATIONAL ID:', nationalId);

    //verfiy user by nationalId
    const user = await User.findOne({ nationalId });
    if (!user) {
        console.log('xainaaaaaaaaa');

        throw new ApiError(404, 'User not found with this National ID.');
    }

    //generate 6 digits code;
    const verificationCode = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    user.tempCode = verificationCode;
    user.tempCodeExpiry = Date.now() + 10 * 60 * 1000; //10  min
    user.save();
    // Send the code to the user's email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Verification Code',
        text: `Your password reset verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('userrr', user);
    sendResponse(
        res,
        200,
        'Verification code sent to your email for password reset.'
    );
});

export const resetPassword = asynchandler(async (req, res) => {
    const { nationalId, verificationCode, newPassword } = req.body;

    // Find the user and verify the code
    const user = await User.findOne({ nationalId });
    if (!user) {
        throw new ApiError(404, 'User with that National Id not found.');
    }

    // Check if the code has expired
    if (!user.tempCode || user.tempCodeExpiry < Date.now()) {
        throw new ApiError(
            400,
            'Verification code expired. Request a new code.'
        );
    }

    // Check if the code matches
    if (user.tempCode !== verificationCode) {
        throw new ApiError(400, 'Invalid verification code.');
    }

    // Update the password and clear temp code data
    user.password = newPassword;
    user.tempCode = undefined;
    user.tempCodeExpiry = undefined;
    await user.save();

    sendResponse(res, 200, 'Password updated successfully.');
});

export const changePassword = asynchandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    console.log('current password:', currentPassword);
    console.log('new password:', newPassword);

    const nationalId = req.nationalId;
    const user = await User.findOne({ nationalId });
    if (!user) {
        throw new ApiError(404, 'User not found with this National Id.');
    }

    //check if current password is correct
    const isCorrectPw = await user.checkPassword(currentPassword);
    if (!isCorrectPw) {
        throw new ApiError(401, 'Incorrect Current Password.');
    }

    //set new password
    user.password = newPassword;

    await user.save();

    sendResponse(res, 200, 'Password changed successfully!');
});

export const logout = asynchandler(async (req, res) => {
    // Clear the refresh token cookie by setting it to expire immediately
    console.log('LOGOUT REIGGERDDDD');

    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: true, // Use true in production
        sameSite: 'Strict',
        maxAge: 0, // Set to expire immediately
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});
