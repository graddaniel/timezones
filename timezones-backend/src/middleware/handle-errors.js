const { StatusCodes } = require('http-status-codes');

const AccountCredentialsNotValidError = require('../services/accounts/errors/account-credentials-not-valid-error');

const UserAlreadyExistsError = require('../services/users/errors/user-already-exists-error');
const InvalidUsernameError = require('../services/users/errors/invalid-username-error');
const InvalidPasswordError = require('../services/users/errors/invalid-password-error');
const InvalidAccessLevelError = require('../services/users/errors/invalid-access-level-error');
const InsufficientPrivilegesError = require('../generic-errors/insufficient-privileges-error');


module.exports = function handleErrors(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    console.log("handleErrors", JSON.stringify(err), err.message, err.constructor);

    switch(err.constructor) {
        case UserAlreadyExistsError:
            return res.status(StatusCodes.CONFLICT).send(err.message);
        case AccountCredentialsNotValidError:
            return res.status(StatusCodes.NOT_FOUND).send(err.message);;
        case InvalidUsernameError:
        case InvalidPasswordError:
        case InvalidAccessLevelError:
            return res.status(StatusCodes.BAD_REQUEST).send(err.message);;
        case InsufficientPrivilegesError:
            return res.status(StatusCodes.FORBIDDEN).send('Insufficient privileges');
        default:
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Unexpected error.");
    }
}