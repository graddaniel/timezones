const md5 = require('md5');
const yup = require('yup');
const config = require('config');

const isValidMD5 = require('../../utils/is-valid-md5');

const InvalidUsernameError = require('./errors/invalid-username-error');
const InvalidPasswordError = require('./errors/invalid-password-error');
const InvalidRoleError = require('./errors/invalid-role-error');

const UserAlreadyExistsError = require('./errors/user-already-exists-error');
const UserNotFoundError = require('./errors/user-not-found-error');

const InsufficientPrivilegesError = require('../../generic-errors/insufficient-privileges-error');

const ROLES = config.get('roles');
const ROLES_VALUES = Object.values(ROLES);

const usernameSchema = yup.object().shape({
    username: yup.string().min(4).max(32).required().matches(/^\w+$/),
});

const userDataSchema = yup.object().shape({
    password: yup.string().min(8).max(32).required().matches(/^\w+$/),
    role: yup.mixed().oneOf(ROLES_VALUES).notRequired(),
});

const editedUserDataSchema = yup.object().shape({
    password: yup.string().min(8).max(32).notRequired().matches(/^\w+$/),
    role: yup.mixed().oneOf(ROLES_VALUES).notRequired(),
});

class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    async createUser({
        username,
        password,
        role,
    }) {
        await this.validateUser({
            username,
            password,
            role,
        })

        const userExists = await this.userExists(username);

        if (userExists) {
            throw new UserAlreadyExistsError(username);
        }

        const passwordHash = md5(password);

        return this.databaseService.createUser({
            username,
            password: passwordHash,
            role,
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

    async editUser(user, currentUserRole) {
        await this.validateUserEdit(user);

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
        await this.validateUsername({ username });

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
            if (error.path === 'role') {
                throw new InvalidRoleError(user.role);
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
            if (error.path === 'role') {
                throw new InvalidRoleError(user.role);
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