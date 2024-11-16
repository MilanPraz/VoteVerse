export const tokenResponse = async (statusCode, user, res, message) => {
    //generate access token
    const token = user.generateAccessToken();
    //generate refresh token
    const refreshToken = user.generateRefreshToken();

    // refresh token cannot be cookied due to diff origin
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, //true in production
        sameSite: 'None',
        // sameSite: 'None',
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    //store latest refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
        success: true,
        message: message || 'Login Successful',
        token,
        user,
        // refreshToken,
    });
};
