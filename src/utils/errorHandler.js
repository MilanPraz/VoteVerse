export const errorHandler = (err, req, res, next) => {
    return res.status(err.status || err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error.',
    });
};
