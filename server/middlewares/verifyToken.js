const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = ( req, res, next ) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).send('Access denied');
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded)
            return res.status(401).send('Access denied');
        req.UserID = decoded.UserID;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send('Access denied');
    }
}

module.exports = verifyToken;