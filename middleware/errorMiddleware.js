/**
 * @desc Global Error Handling Middleware
 * @usage Should be placed at the end of all routes in server.js
 */

const errorHandler = (err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);

    // If the error has a specific status code, use it; otherwise, default to 500
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : null, // Show stack trace only in development mode
    });
};

/**
 * @desc 404 Not Found Middleware
 * @usage If no routes match, this will handle it
 */
const notFoundHandler = (req, res, next) => {
    const error = new Error(`🔍 Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = { errorHandler, notFoundHandler };
