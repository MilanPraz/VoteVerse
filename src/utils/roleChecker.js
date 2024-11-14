import { ApiError } from './apiError.js';
import { asynchandler } from './asynchandler.js';

export const roleChecker = asynchandler(async (req, res, next) => {
    if (req.role !== 'admin') {
        throw new ApiError(403, 'Access Denied. Admins only.');
    }
    console.log('HE IS ADMIN');

    next();
});
export const voterChecker = asynchandler(async (req, res, next) => {
    if (req.role !== 'voter') {
        throw new ApiError(403, 'Only Voters can vote.');
    }
    console.log('HE IS Voter');

    next();
});
