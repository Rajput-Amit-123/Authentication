const jwt = require('jsonwebtoken');
const config = process.env;

const verifyToken = (req,res,next)=>{
    const {token} = req.body || req.query || req.headers["x-access-token"];
    console.log(token);
    if (!token) {
        return res.status(403).send("Token is required | please login or register first for token");
    }

    try {
        const decoded = jwt.verify(token,config.TOKEN_KEY);
        console.log(decoded);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send("Invalid token | please login or register again for valid token");
    }
    return next();
};

module.exports = verifyToken;