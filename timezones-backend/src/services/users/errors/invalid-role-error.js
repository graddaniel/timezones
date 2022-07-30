const config = require('config');

const ROLES = Object.values(config.get('roles'));


class InvalidRoleError extends Error {
    constructor(role) {
        super(`Invalid role: ${role}. Allowed: [${ROLES.join(', ')}]`);
    }
}

module.exports = InvalidRoleError;