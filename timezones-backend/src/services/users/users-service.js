const md5 = require('md5');
const config = require('config');

const isValidMD5 = require('../../utils/is-valid-md5');

const UserAlreadyExistsError = require('./errors/user-already-exists-error');
const UserNotFoundError = require('./errors/user-not-found-error');

const InsufficientPrivilegesError = require('../../generic-errors/insufficient-privileges-error');

const ROLES = config.get('roles');

class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    async createUserFromCredentials({
        username,
        password,
    }) {
        const foundUser = await this.findUserByUsername(username);
        if (foundUser) {
            throw new UserAlreadyExistsError(username);
        }

        const passwordHash = md5(password);

        return this.databaseService.createUser({
            username,
            password: passwordHash,
            role,
        });
    }

    async findUserByCredentials({
        username,
        password,
    }) {
        const passwordHash = md5(password);

        return this.databaseService.findUserByCredentials({
            username,
            password: passwordHash,
        });
    }

    async editUser(user, currentUserRole) {
        const {
            username,
            password,
            role,
        } = user;

        const foundUser = await this.databaseService.findUserByUsername(username);
        if (!foundUser) {
            throw new UserNotFoundError(username);
        }

        if (
            currentUserRole !== ROLES.admin && (
                role === ROLES.admin ||
                foundUser.role === ROLES.admin
            )
        ) {
            throw new InsufficientPrivilegesError();
        }

        return this.databaseService.updateUserByUsername(
            username, 
            {
                password: isValidMD5(password) ? password : md5(password),
                role,
            }
        );
    }

    async getAll() {
        //TODO Pagination
        return this.databaseService.findAllUsers();
    }

    async deleteUserByUsername(username, curentUserRole) {
        const foundUser = await this.databaseService.findUserByUsername(username);
        if (!foundUser) {
            throw new UserNotFoundError(username);
        }

        if (
            curentUserRole !== ROLES.admin &&
            foundUser.role === ROLES.admin
        ) {
            throw new InsufficientPrivilegesError();
        }

        return this.databaseService.deleteUserByUsername(username);
    }

    async findUserByUsername(username) {
        return this.databaseService.findUserByUsername(username);
    }
}

module.exports = UsersService;