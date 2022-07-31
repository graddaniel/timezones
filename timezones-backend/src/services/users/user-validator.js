const yup = require('yup');
const config = require('config');

const InvalidUsernameError = require('./errors/invalid-username-error');
const InvalidPasswordError = require('./errors/invalid-password-error');
const InvalidRoleError = require('./errors/invalid-role-error');

const ROLES = config.get('roles');
const ROLES_VALUES = Object.values(ROLES);

const usernameSchema = yup.object().shape({
    username: yup.string().min(4).max(32).required().matches(/^\w+$/),
});

const newUserSchema = yup.object().shape({
    username: yup.string().min(4).max(32).required().matches(/^\w+$/),
    password: yup.string().min(8).max(32).required().matches(/^\w+$/),
    role: yup.mixed().oneOf(ROLES_VALUES).required(),
});

const editedUserDataSchema = yup.object().shape({
    password: yup.string().min(8).max(32).notRequired().matches(/^\w+$/),
    role: yup.mixed().oneOf(ROLES_VALUES).notRequired(),
});

class UserValidator {
    static async validateEditedUser(user) {
        await UserValidator.validateUsername(user.username);
        await UserValidator.validateEditedUserdata(user);
    }

    static async validateUsername(username) {
        try {
            await usernameSchema.validate({ username });
        } catch (error) {
            if (error.path === 'username') {
                throw new InvalidUsernameError(username);
            } else {
                throw error;
            }
        }
    }

    static async validateNewUser(user) {
        try {
            await newUserSchema.validate(user);
        } catch (error) {
            if (error.path === 'username') {
                throw new InvalidUsernameError(user.username);
            }
            else if (error.path === 'role') {
                throw new InvalidRoleError(user.role);
            }
            else if (error.path === 'password') {
                throw new InvalidPasswordError(user.password);
            } else {
                throw error;
            }
        }
    }

    static async validateEditedUserdata(user) {
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

module.exports = UserValidator;