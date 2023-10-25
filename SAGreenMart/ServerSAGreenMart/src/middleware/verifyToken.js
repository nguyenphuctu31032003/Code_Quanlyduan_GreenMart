// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies.token || '';
    try {
        req.user = jwt.verify(token, 'vietlong-secret-key');
    } catch (error) {
        // Handle token verification error, for example:
        console.error('Error verifying token:', error);
    }
    next();
}

module.exports = verifyToken;
