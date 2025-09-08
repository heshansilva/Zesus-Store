 import jwt from 'jsonwebtoken';
 import User from '../models/user.model.js';

// Middleware to protect routes and ensure the user is authenticated
 export const protectRoute = async(req, res, next) => {

    
    try {
        //Check for access token in cookies
        const accessToken = req.cookies.access_token;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - no access token provided" });
        }

        try {
            // Verify token and extract user ID
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            // Fetch user from DB (excluding password)
            const user = await User.findById(decoded.userID).select('-password');

            if (!user) {
                return res.status(401).json({ message: "Unauthorized - user not found" });
            }

            req.user = user; // Attach user info to request object
            next(); // Continue to the next middleware or route handler

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Unauthorized - token expired" });
            }
        }

    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




 export const adminRoute = (req, res, next) => {
   // Middleware logic to restrict access to admin users
   if (req.user && req.user.role === 'admin') {
       next();
   } else {
       return res.status(403).json({ message: "Access denied - admin only" });
   }
};
