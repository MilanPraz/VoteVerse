import { ApiError } from './apiError.js';
import { asynchandler } from './ASynchandler.js';
import jwt from 'jsonwebtoken';

export const authMiddleware = asynchandler(async (req, res) => {
    //extract the bearer token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) throw new ApiError(401, 'Authorization token is missing!');

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded._id;
    req.role = decoded.role;
    next();
});
