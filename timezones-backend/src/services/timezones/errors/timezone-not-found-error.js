class TimezoneNotFoundError extends Error {
    constructor(id) {
        super(`Timezone of id ${id} not found.`);
    }
}

module.exports = TimezoneNotFoundError;