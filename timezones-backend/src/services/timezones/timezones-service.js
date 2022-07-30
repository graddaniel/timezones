const config = require('config');

const UserNotFoundError = require('../users/errors/user-not-found-error');
const TimezoneNotFoundError = require('./errors/timezone-not-found-error');

const InsufficientPrivilegesError = require('../../generic-errors/insufficient-privileges-error');

const ROLES = config.get('roles');

class TimezonesService {
    constructor(
        databaseService,
        usersService,
    ) {
        this.databaseService = databaseService;
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

        const foundUser = await this.usersService.findUser(timezone.username);
        if (!foundUser) {
            throw new UserNotFoundError(timezone.username);
        }

        return this.databaseService.createTimezone(timezone);
    }

    async editTimezoneById(
        id, 
        timezone,
        currentUser,
    ) {
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

        const foundUser = await this.usersService.findUserByUsername(username);
        if (!foundUser) {
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
}

module.exports = TimezonesService;