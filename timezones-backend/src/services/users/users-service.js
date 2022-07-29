const md5 = require('md5');
const yup = require('yup');
const config = require('config');

const InvalidUsernameError = require('./errors/invalid-username-error');
const InvalidPasswordError = require('./errors/invalid-password-error');
const InvalidAccessLevelError = require('./errors/invalid-access-level-error');


const ACCESS_LEVELS = Object.values(config.get('accessLevels'));

const usernameSchema = yup.object().shape({
    username: yup.string().min(4).max(32).required().matches(/^\w+$/),
});

const userDataSchema = yup.object().shape({
    password: yup.string().min(8).max(32).required().matches(/^\w+$/),
    accessLevel: yup.mixed().oneOf(ACCESS_LEVELS),
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

    async userExists({
        username,
    }) {
        await this.validateUsername({ username });

        const foundUser = await this.databaseService.findUserByUsername({
            username
        });

        return !!foundUser;
    }

    async validateUser(user) {
        await this.validateUsername(user);
        await this.validateUserdata(user);
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
}

module.exports = UsersService;