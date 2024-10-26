import { ApiError } from './apiError.js';
import { asynchandler } from './ASynchandler.js';

export const roleChecker = asynchandler(async (req, res) => {
    if (req.role !== 'admin') {
        throw new ApiError(403, 'Access Denied. Admins only.');
    }
    next();
});
