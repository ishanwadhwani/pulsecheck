const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Get the token from the request header
    const token = req.header('x-auth-token');

    // Check if token is provided
    if (!token) {
        return res.status(401).json({
            message: 'No token, authorization denied'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If valid, add the user's info from the token's payload to the request object
        req.user = decoded.user;

        next(); // Call the next middleware or route handler
    } catch (error) {
        // console.error("Token verification failed:", error);
        return res.status(401).json({
            message: 'Token is not valid'
        });
    }
}


module.exports = authMiddleware;