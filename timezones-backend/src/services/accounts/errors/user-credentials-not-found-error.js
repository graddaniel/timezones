class UserCredentialsNotFoundError extends Error {
    constructor() {
        super(`User credentials not found.`);
    }
}

module.exports = UserCredentialsNotFoundError;