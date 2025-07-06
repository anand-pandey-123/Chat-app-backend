const jwt = require('jsonwebtoken');
require('dotenv').config();

const authUser = async(req, res, next) => {
    try {
        // console.log(req.cooki
        console.log(req.headers.authorization);
        const authHeader = req.headers.authorization;
        const token = (authHeader && authHeader.split(" ")[1]);
        if (!token) {
            return res.
            status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded)
        req.user = decoded; // Attach user info to request object
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authUser;