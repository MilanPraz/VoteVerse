import { ApiError } from './apiError.js';
import { asynchandler } from './ASynchandler.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = asynchandler(async (req, res, next) => {
    //extract the bearer token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log('BEFORE TOKENNNNN', token);

    if (!token) throw new ApiError(401, 'Authorization token is missing!');

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
        throw new ApiError(401, 'Refresh the page.');
    }
    console.log('DECODED:', decoded);

    req.userId = decoded._id;
    req.role = decoded.role;
    req.nationalId = decoded.nationalId;
    next();
});
