export const validateAccessToken = (req, res, next) => {
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
        next(); // Proceed to the next middleware or route handler
    });
};
