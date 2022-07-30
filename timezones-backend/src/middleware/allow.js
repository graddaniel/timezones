const InsufficientPrivilegesError = require('../generic-errors/insufficient-privileges-error');

module.exports = function allow(roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new InsufficientPrivilegesError();
        }
    
        next();
    }
}