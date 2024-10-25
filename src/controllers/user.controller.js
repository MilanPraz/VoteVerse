import User from '../models/user.js';
import { ApiError } from '../utils/apiError.js';
import { asynchandler } from '../utils/ASynchandler.js';
import { sendResponse } from '../utils/sendResponse.js';

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
