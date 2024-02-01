const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} - Calls the next middleware or sends a JSON response.
 */
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    // If no token is provided and the route is invalid, return 404
    if (!token && !req.route) {
        return res.status(404).json({ message: "Not Found" });
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log('Verification error:', err.message);
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;