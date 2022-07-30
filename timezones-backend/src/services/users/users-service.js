const md5 = require('md5');
const yup = require('yup');
const config = require('config');

const isValidMD5 = require('../../utils/is-valid-md5');

const InvalidUsernameError = require('./errors/invalid-username-error');
const InvalidPasswordError = require('./errors/invalid-password-error');
const InvalidAccessLevelError = require('./errors/invalid-access-level-error');

const UserAlreadyExistsError = require('./errors/user-already-exists-error');
const UserNotFoundError = require('./errors/user-not-found-error');

const InsufficientPrivilegesError = require('../../generic-errors/insufficient-privileges-error');

const ACCESS_LEVELS = config.get('accessLevels');
const ACCESS_LEVELS_VALUES = Object.values(ACCESS_LEVELS);

const usernameSchema = yup.object().shape({
    username: yup.string().min(4).max(32).required().matches(/^\w+$/),
});

const userDataSchema = yup.object().shape({
    password: yup.string().min(8).max(32).required().matches(/^\w+$/),
    accessLevel: yup.mixed().oneOf(ACCESS_LEVELS_VALUES).notRequired(),
});

const editedUserDataSchema = yup.object().shape({
    password: yup.string().min(8).max(32).notRequired().matches(/^\w+$/),
    accessLevel: yup.mixed().oneOf(ACCESS_LEVELS_VALUES).notRequired(),
});

class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    async createUser({
        username,
        password,
        accessLevel,
    }) {
        await this.validateUser({
            username,
            password,
            accessLevel,
        })

        const userExists = await this.userExists(username);

        if (userExists) {
            throw new UserAlreadyExistsError(username);
        }

        const passwordHash = md5(password);

        return this.databaseService.createUser({
            username,
            password: passwordHash,
            accessLevel,
        });
    }

    async findUser({
        username,
        password,
    }) {
        await this.validateUser({
            username,
            password,
        });

        const passwordHash = md5(password);

        return this.databaseService.findUserByCredentials({
            username,
            password: passwordHash,
        });
    }

    async editUser(user, editor) {
        await this.validateUserEdit(user);

        const {
            username,
            password,
            accessLevel,
        } = user;

        if (
            editor.accessLevel !== ACCESS_LEVELS.admin &&
            accessLevel === ACCESS_LEVELS.admin
        ) {
            throw new InsufficientPrivilegesError();
        }

        const userExists = await this.userExists(username);

        if (!userExists) {
            throw new UserNotFoundError(username);
        }

        return this.databaseService.updateUserByUsername(
            username, 
            {
                password: isValidMD5(password) ? password : md5(password),
                accessLevel,
            }
        );
    }

    async getAll() {
        //TODO Pagination
        return this.databaseService.findAllUsers();
    }

    async userExists(username) {
        await this.validateUsername({ username });

        const foundUser = await this.databaseService.findUserByUsername(username);

        return !!foundUser;
    }

    async validateUser(user) {
        await this.validateUsername(user);
        await this.validateUserdata(user);
    }

    async validateUserEdit(user) {
        await this.validateUsername(user);
        await this.validateEditedUserdata(user);
    }

    async validateUsername(user) {
        try {
            await usernameSchema.validate(user);
        } catch (error) {
            if (error.path === 'username') {
                throw new InvalidUsernameError(user.username);
            } else {
                throw error;
            }
        }
    }

    async validateUserdata(user) {
        try {
            await userDataSchema.validate(user);
        } catch (error) {
            if (error.path === 'accessLevel') {
                throw new InvalidAccessLevelError(user.accessLevel);
            }
            else if (error.path === 'password') {
                throw new InvalidPasswordError(user.password);
            } else {
                throw error;
            }
        }
    }

    async validateEditedUserdata(user) {
        try {
            await editedUserDataSchema.validate(user);
        } catch (error) {
            if (error.path === 'accessLevel') {
                throw new InvalidAccessLevelError(user.accessLevel);
            }
            else if (error.path === 'password') {
                throw new InvalidPasswordError(user.password);
            } else {
                throw error;
            }
        }
    }
}

module.exports = UsersService;