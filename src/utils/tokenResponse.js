const tokenResponse = async (statusCode, user, res, message) => {
    //generate access token
    const token = user.generateAccessToken();
    //generate refresh token
    const refreshToken = user.generateRefreshToken();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: process.env.EXPIRES_REFRESH_TOKEN,
    });

    //store latest refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
        success: true,
        message: message || 'Login Successful',
        token,
    });
};
