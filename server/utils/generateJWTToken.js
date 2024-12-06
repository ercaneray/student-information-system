require('dotenv').config();
const jwt = require('jsonwebtoken');
const generateJWTToken = (res, user) => {
    console.log(user);
    const token = jwt.sign({ UserID: user.UserID }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    return token;
}

module.exports = generateJWTToken;