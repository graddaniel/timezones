class AccountCredentialsNotValidError extends Error {
    constructor() {
        super(`Account credentials not valid.`);
    }
}

module.exports = AccountCredentialsNotValidError;