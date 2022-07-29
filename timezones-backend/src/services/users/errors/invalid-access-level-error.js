const config = require('config');

const ACCESS_LEVELS = Object.values(config.get('accessLevels'));


class InvalidAccessLevelError extends Error {
    constructor(accessLevel) {
        super(`Invalid accessLevel: ${accessLevel}. Allowed: [${ACCESS_LEVELS.join(', ')}]`);
    }
}

module.exports = InvalidAccessLevelError;