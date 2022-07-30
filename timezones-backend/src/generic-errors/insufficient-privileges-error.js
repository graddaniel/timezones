class InsufficientPrivilegesError extends Error {
    constructor() {
        super('Insufficient privileges');
    }
}

module.exports = InsufficientPrivilegesError;