import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    let token = null;
    
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`[AUTH ERROR] JWT Verification Failed: ${error.message}`);
        console.error(`[AUTH ERROR] Header: ${authHeader}`);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export const optionalVerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === 'undefined' || token === 'null') {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        // Token present but invalid/expired - treat as guest
        req.user = null;
    }
    next();
};
