const config = require('config');

const UserNotFoundError = require('../users/errors/user-not-found-error');
const TimezoneNotFoundError = require('./errors/timezone-not-found-error');

const InsufficientPrivilegesError = require('../../generic-errors/insufficient-privileges-error');

const ROLES = config.get('roles');

class TimezonesService {
    constructor(
        timezonesRepository,
        usersService,
    ) {
        this.timezonesRepository = timezonesRepository;
        this.usersService = usersService;
    }
    
    async addTimezone(
        timezone,
        currentUser
    ) {
        if (
            currentUser.role !== ROLES.admin &&
            timezone.username !== currentUser.username
        ) {
            throw new InsufficientPrivilegesError();
        }

        const foundUser = await this.usersService.findUserByUsername(timezone.username);
        if (!foundUser) {
            throw new UserNotFoundError(timezone.username);
        }

        return this.timezonesRepository.createTimezone(timezone);
    }

    async editTimezoneById(
        id, 
        timezone,
        currentUser,
    ) {
        const {
            username,
        } = timezone;

        const foundTimezone = await this.timezonesRepository.findTimezone({ _id: id });
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

        const foundUser = await this.usersService.findUserByUsername(username);
        if (!foundUser) {
            throw new UserNotFoundError(username);
        }

        return this.timezonesRepository.updateTimezone(
            { _id:id },
            timezone,
        );
    }

    async deleteTimezoneById(id, currentUser) {
        const timezone = await this.timezonesRepository.findTimezone({ _id: id });

        if (!timezone) {
            throw new TimezoneNotFoundError(id);
        }

        if (
            timezone.username !== currentUser.username &&
            currentUser.role !== ROLES.admin
        ) {
            throw new InsufficientPrivilegesError();
        }

        return this.timezonesRepository.deleteTimezone({ _id: id });
    }

    async getTimezonesByUser(user) {
        //TODO pagination
        const {
            username,
            role,
        } = user;

        return this.timezonesRepository.findTimezones(
            role === ROLES.admin ? {} : { username }
        );
    }
}

module.exports = TimezonesService;