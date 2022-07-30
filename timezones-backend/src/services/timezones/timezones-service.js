const yup = require('yup');
const config = require('config');

const UserNotFoundError = require('../users/errors/user-not-found-error');
const TimezoneNotFoundError = require('./errors/timezone-not-found-error');
const InvalidTimezoneNameError = require('./errors/invalid-timezone-name-error');
const InvalidTimezoneCityNameError = require('./errors/invalid-timezone-city-name-error');
const InvalidTimezoneTimeDifferenceError = require('./errors/invalid-timezone-time-difference-error');

const InsufficientPrivilegesError = require('../../generic-errors/insufficient-privileges-error');

const ROLES = config.get('roles');
const TIMEZONES = config.get('timezones');

const timezoneSchema = yup.object().shape({
    name: yup.string().min(1).max(32).required().matches(/^[A-Za-z0-9 ]+$/),
    cityName: yup.string().min(1).max(32).required().matches(/^[A-Za-z ]+$/),
    timeDifference: yup.mixed().oneOf(TIMEZONES).required(),
});

const editedTimezoneSchema = yup.object().shape({
    name: yup.string().min(1).max(32).notRequired().matches(/^[A-Za-z0-9 ]+$/),
    cityName: yup.string().min(1).max(32).notRequired().matches(/^[A-Za-z ]+$/),
    timeDifference: yup.mixed().oneOf(TIMEZONES).notRequired(),
});

class TimezonesService {
    constructor(
        databaseService,
        usersService,
    ) {
        this.databaseService = databaseService;
        this.usersService = usersService;
    }
    
    async addTimezone(
        {
            name,
            cityName,
            timeDifference,
            username,
        },
        currentUser
    ) {
        await this.validateTimezone({
            name,
            cityName,
            timeDifference,
        });

        if (
            currentUser.role !== ROLES.admin &&
            username !== currentUser.username
        ) {
            throw new InsufficientPrivilegesError();
        }

        const userExists = await this.usersService.userExists(username);
        if (!userExists) {
            throw new UserNotFoundError(username);
        }

        return this.databaseService.createTimezone({
            name,
            cityName,
            timeDifference,
            username,
        });
    }

    async editTimezoneById(
        id, 
        timezone,
        currentUser,
    ) {
        await this.validateEditedTimezone(timezone);

        const {
            username,
        } = timezone;

        const foundTimezone = await this.databaseService.findTimezoneById(id);
        if (!foundTimezone) {
            throw new TimezoneNotFoundError(id);
        }

        if (
            currentUser.role !== ROLES.admin && (
                timezone.username !== currentUser.username ||
                foundTimezone.username !== currentUser.username
            )
        ) {
            throw new InsufficientPrivilegesError();
        }

        const userExists = await this.usersService.userExists(username);
        if (!userExists) {
            throw new UserNotFoundError(username);
        }

        return this.databaseService.updateTimezoneById(
            id,
            timezone,
        );
    }

    async deleteTimezoneById(id, currentUser) {
        const timezone = await this.databaseService.findTimezoneById(id);

        if (!timezone) {
            throw new TimezoneNotFoundError(id);
        }

        if (
            timezone.username !== currentUser.username &&
            currentUser.role !== ROLES.admin
        ) {
            throw new InsufficientPrivilegesError();
        }

        return this.databaseService.deleteTimezoneById(id);
    }

    async getTimezonesByUser(user) {
        //TODO pagination
        const {
            username,
            role,
        } = user;

        if (role === ROLES.admin) {
            return this.databaseService.findAllTimezones();
        }

        return this.databaseService.findTimezonesByUsername(username);
    }

    async validateTimezone(timezone) {
        try {
            await timezoneSchema.validate(timezone);
        } catch (error) {
            if (error.path === 'name') {
                throw new InvalidTimezoneNameError(timezone.name);
            }
            else if (error.path === 'cityName') {
                throw new InvalidTimezoneCityNameError(timezone.cityName);
            }
            else if(error.path === 'timeDifference') {
                throw new InvalidTimezoneTimeDifferenceError(timezone.timeDifference);
            }
            else {
                throw error;
            }
        }
    }

    async validateEditedTimezone(timezone) {
        try {
            await editedTimezoneSchema.validate(timezone);
        } catch (error) {
            if (error.path === 'name') {
                throw new InvalidTimezoneNameError(user.role);
            }
            else if (error.path === 'cityName') {
                throw new InvalidTimezoneCityNameError(user.password);
            }
            else if(error.path === 'timezone') {
                throw new InvalidTimezoneTimeDifferenceError(user.password);
            }
            else {
                throw error;
            }
        }
    }
}

module.exports = TimezonesService;