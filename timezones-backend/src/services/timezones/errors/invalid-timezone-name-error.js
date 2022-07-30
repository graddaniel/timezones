class InvalidTimezoneNameError extends Error {
    constructor(name) {
        super(`Name ${name} is invalid.`);
    }
}

module.exports = InvalidTimezoneNameError;