const jwt = require('jsonwebtoken');

// The main authentication middleware
const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token format is invalid' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId: ..., roleId: ... }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware for generic role-based access control
// This single function handles all role checks, including for sellers and admins.
const authorizeRoles = (requiredRoles) => {
    return (req, res, next) => {
        // Ensure the user object exists (auth middleware must run first)
        if (!req.user || !req.user.roleId) {
            return res.status(403).json({ message: 'Forbidden: Authentication required before role check.' });
        }

        const userRoleId = req.user.roleId;

        // Check if the user's role ID is one of the required role IDs
        if (requiredRoles.includes(userRoleId)) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden: You do not have the required role' });
        }
    };
};

module.exports = { auth, authorizeRoles };