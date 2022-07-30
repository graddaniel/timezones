const { StatusCodes } = require('http-status-codes');

const AccountCredentialsNotFound = require('../services/accounts/errors/account-credentials-not-valid-error');

const TimezoneNotFoundError = require('../services/timezones/errors/timezone-not-found-error');

const UserNotFoundError = require('../services/users/errors/user-not-found-error');
const UserAlreadyExistsError = require('../services/users/errors/user-already-exists-error');
const InvalidUsernameError = require('../services/users/errors/invalid-username-error');
const InvalidPasswordError = require('../services/users/errors/invalid-password-error');
const InvalidRoleError = require('../services/users/errors/invalid-role-error');
const InvalidTimezoneNameError = require('../services/timezones/errors/invalid-timezone-name-error');
const InvalidTimezoneCityNameError = require('../services/timezones/errors/invalid-timezone-city-name-error');
const InvalidTimezoneTimeDifferenceError = require('../services/timezones/errors/invalid-timezone-time-difference-error');


const InsufficientPrivilegesError = require('../generic-errors/insufficient-privileges-error');


module.exports = function handleErrors(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    console.log("handleErrors", JSON.stringify(err), err.message, err.constructor);

    switch(err.constructor) {
        case UserAlreadyExistsError:
            return res.status(StatusCodes.CONFLICT).send(err.message);
        case AccountCredentialsNotFound:
        case TimezoneNotFoundError:
        case UserNotFoundError:
            return res.status(StatusCodes.NOT_FOUND).send(err.message);;
        case InvalidUsernameError:
        case InvalidPasswordError:
        case InvalidRoleError:
        case InvalidTimezoneNameError:
        case InvalidTimezoneCityNameError:
        case InvalidTimezoneTimeDifferenceError:
            return res.status(StatusCodes.BAD_REQUEST).send(err.message);;
        case InsufficientPrivilegesError:
            return res.status(StatusCodes.FORBIDDEN).send('Insufficient privileges');
        default:
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Unexpected error.");
    }
}