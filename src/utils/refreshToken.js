import User from '../models/user';
import { ApiError } from './apiError';
import { asynchandler } from './ASynchandler';
import Jwt from 'jsonwebtoken';
import { sendResponse } from './sendResponse';

export const refreshToken = asynchandler(async (req, res) => {
    const refresh_token = req.cookies.refreshToken || req.body.refreshToken;

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
            });
        }
    );
});
