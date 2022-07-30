const yup = require('yup');

const InvalidUsernameError = require('../users/errors/invalid-username-error');
const InvalidPasswordError = require('../users/errors/invalid-password-error');

const accountSchema = yup.object().shape({
    username: yup.string().min(4).max(32).required().matches(/^\w+$/),
    password: yup.string().min(8).max(32).required().matches(/^\w+$/),
});

class AccountValidator {
    static async validateAccountCredentials(credentials) {
        try {
            await accountSchema.validate(credentials);
        } catch (error) {
            if (error.path === 'username') {
                throw new InvalidUsernameError(credentials.username);
            }
            else if (error.path === 'password') {
                throw new InvalidPasswordError(credentials.password);
            } else {
                throw error;
            }
        }
    }
}

module.exports = AccountValidator;