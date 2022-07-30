const md5 = require('md5');
const config = require('config');

const isValidMD5 = require('../../utils/is-valid-md5');

const UserAlreadyExistsError = require('./errors/user-already-exists-error');
const UserNotFoundError = require('./errors/user-not-found-error');

const InsufficientPrivilegesError = require('../../generic-errors/insufficient-privileges-error');

const ROLES = config.get('roles');

class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }

    async createUserFromCredentials(credentials) {
        const {
            username,
            password,
        } = credentials;

        const foundUser = await this.findUser({
            username,
            password,
        });
        if (foundUser) {
            throw new UserAlreadyExistsError(username);
        }

        const passwordHash = md5(password);

        return this.usersRepository.createUser({
            username,
            password: passwordHash,
        });
    }

    async findUserByCredentials({
        username,
        password,
    }) {
        const passwordHash = md5(password);

        return this.usersRepository.findUser({
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

        const foundUser = await this.usersRepository.findUser({ username });
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

        return this.usersRepository.updateUser(
            { 
                username,
            }, 
            {
                password: isValidMD5(password) ? password : md5(password),
                role,
            }
        );
    }

    async getAll() {
        //TODO Pagination
        return this.usersRepository.findUsers({});
    }

    async deleteUserByUsername(username, curentUserRole) {
        const foundUser = await this.usersRepository.findUser({ username });
        if (!foundUser) {
            throw new UserNotFoundError(username);
        }

        if (
            curentUserRole !== ROLES.admin &&
            foundUser.role === ROLES.admin
        ) {
            throw new InsufficientPrivilegesError();
        }

        return this.usersRepository.deleteUser({ username });
    }

    async findUserByUsername(username) {
        return this.usersRepository.findUser({ username });
    }
}

module.exports = UsersService;