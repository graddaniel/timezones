const { StatusCodes } = require('http-status-codes');

const AccountCredentialsNotValid = require('../services/accounts/errors/account-credentials-not-valid-error');

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

    let httpCode = null;
    let message = "";

    switch(err.constructor) {
        case UserAlreadyExistsError:
            httpCode = StatusCodes.CONFLICT;
            message = err.message;
            break;
        case AccountCredentialsNotValid:
        case TimezoneNotFoundError:
        case UserNotFoundError:
            httpCode = StatusCodes.NOT_FOUND;
            message = err.message;
            break;
        case InvalidUsernameError:
        case InvalidPasswordError:
        case InvalidRoleError:
        case InvalidTimezoneNameError:
        case InvalidTimezoneCityNameError:
        case InvalidTimezoneTimeDifferenceError:
            httpCode = StatusCodes.BAD_REQUEST;
            message = err.message;
            break;
        case InsufficientPrivilegesError:
            httpCode = StatusCodes.FORBIDDEN;
            message = 'Insufficient privileges';
            break;
        default:
            httpCode = StatusCodes.INTERNAL_SERVER_ERROR;
            message = 'Unexpected error';
            break;
    }

    return res.status(httpCode).json({
        message
    });
}