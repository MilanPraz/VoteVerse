import { Router } from 'express';
import {
    changePassword,
    forgotPassword,
    loginUser,
    logout,
    refreshToken,
    registerUser,
    resetPassword,
    validateAccessToken,
} from '../controllers/user.controller.js';
import { authMiddleware } from '../utils/authMiddleware.js';

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(logout);
userRouter.route('/validate/accessToken').get(validateAccessToken);
userRouter.route('/refresh-token').post(refreshToken);
userRouter.route('/forgot-password').post(forgotPassword);
userRouter.route('/reset-password').post(resetPassword);
userRouter.route('/change-password').post(authMiddleware, changePassword);

export default userRouter;
