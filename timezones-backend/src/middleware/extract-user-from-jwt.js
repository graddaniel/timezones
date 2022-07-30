const jwt = require('jsonwebtoken');
const {
    StatusCodes,
} = require('http-status-codes');

module.exports = function extractUserFromJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).send('You need to login first.');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
            res.status(StatusCodes.UNAUTHORIZED).send(error);
            return;
        }

        req.user = user;

        next();
    });
}