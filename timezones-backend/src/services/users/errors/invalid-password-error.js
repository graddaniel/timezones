class InvalidPasswordError extends Error {
    constructor(password) {
        super(`Invalid password: ${password}.`);
    }
}

module.exports = InvalidPasswordError;