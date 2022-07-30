class InvalidTimezoneTimeDifferenceError extends Error {
    constructor(timeDifference) {
        super(`Time difference ${timeDifference} is invalid.`);
    }
}

module.exports = InvalidTimezoneTimeDifferenceError;