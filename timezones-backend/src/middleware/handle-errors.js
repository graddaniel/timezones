const { StatusCodes } = require('http-status-codes');

const UserAlreadyExistsError = require('../services/accounts/errors/user-already-exists-error');
const UserCredentialsNotFoundError = require('../services/accounts/errors/user-credentials-not-found-error');
const InvalidUsernameError = require('../services/users/errors/invalid-username-error');
const InvalidPasswordError = require('../services/users/errors/invalid-password-error');
const InvalidAccessLevelError = require('../services/users/errors/invalid-access-level-error');


module.exports = function handleErrors(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    console.log("handleErrors", JSON.stringify(err), err.message, err.constructor)

    switch(err.constructor) {
        case UserAlreadyExistsError:
            res.status(StatusCodes.CONFLICT).send(err.message);
            return;
        case UserCredentialsNotFoundError:
            res.status(StatusCodes.NOT_FOUND).send(err.message);
            return;
        case InvalidUsernameError:
        case InvalidPasswordError:
        case InvalidAccessLevelError:
            res.status(StatusCodes.BAD_REQUEST).send(err.message);
            return;
        default:
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Unexpected error.");
    }
}