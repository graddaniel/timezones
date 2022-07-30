const {
    StatusCodes,
} = require('http-status-codes');
const InsufficientPrivilegesError = require('../generic-errors/insufficient-privileges-error');

module.exports = function allow(accessLevels) {
    return (req, res, next) => {
        if (!accessLevels.includes(req.user.accessLevel)) {
            throw new InsufficientPrivilegesError();
        }
    
        next();
    }
}