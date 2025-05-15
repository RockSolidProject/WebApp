const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "some_secret_key"

module.exports = function(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.split(' ')[1]) {
        return res.status(401).json({message: "No token provided."})
    }

    const token = authHeader.split(' ')[1];
    
    try {
        req.user = jwt.verify(token, JWT_SECRET_KEY)
        next()
    }
    catch (err) {
        return res.status(403).json({
            message: "Invalid JWT token."
        })
    }
}