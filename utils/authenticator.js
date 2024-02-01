const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    // If no token is provided, return 401
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Verification error:', err.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = verifyToken;