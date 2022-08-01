class AccountCredentialsNotValid extends Error {
    constructor() {
        super(`Account credentials not valid.`);
    }
}

module.exports = AccountCredentialsNotValid;