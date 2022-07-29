class UserAlreadyExistsError extends Error {
    constructor(username) {
        super(`User ${username} already exists`);
    }
}

module.exports = UserAlreadyExistsError;