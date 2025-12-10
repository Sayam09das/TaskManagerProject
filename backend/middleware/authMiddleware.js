const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    try {
        // Try reading JWT from cookie (recommended)
        let token = req.cookies?.authToken;

        // If not found, check Authorization: Bearer <token>
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated. Token missing.' });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach all decoded data
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        };

        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
