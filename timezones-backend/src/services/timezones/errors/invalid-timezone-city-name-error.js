class InvalidTimezoneCityNameError extends Error {
    constructor(cityName) {
        super(`City name ${cityName} is invalid.`);
    }
}

module.exports = InvalidTimezoneCityNameError;