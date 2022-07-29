class InvalidUsernameError extends Error {
    constructor(username) {
        super(`Invalid username: ${username}.`);
    }
}

module.exports = InvalidUsernameError;