class UserNotFoundError extends Error {
    constructor(username) {
        super(`User ${username} not found.`);
    }
}

module.exports = UserNotFoundError;