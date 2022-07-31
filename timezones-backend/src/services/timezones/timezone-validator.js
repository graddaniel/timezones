const yup = require('yup');
const config = require('config');

const InvalidTimezoneNameError = require('./errors/invalid-timezone-name-error');
const InvalidTimezoneCityNameError = require('./errors/invalid-timezone-city-name-error');
const InvalidTimezoneTimeDifferenceError = require('./errors/invalid-timezone-time-difference-error');

const TIMEZONES = config.get('timezones');

const timezoneSchema = yup.object().shape({
    name: yup.string().min(1).max(32).required().matches(/^[A-Za-z0-9 ]+$/),
    cityName: yup.string().min(1).max(32).required().matches(/^[A-Za-z ]+$/),
    timeDifference: yup.mixed().oneOf(TIMEZONES).required(),
});

const editedTimezoneSchema = yup.object().shape({
    name: yup.string().min(1).max(32).notRequired().matches(/^[A-Za-z0-9 ]+$/),
    cityName: yup.string().min(1).max(32).notRequired().matches(/^[A-Za-z ]+$/),
    timeDifference: yup.mixed().oneOf(TIMEZONES).notRequired(),
});

class TimezoneValidator {
    static async validateTimezone(timezone) {
        try {
            await timezoneSchema.validate(timezone);
        } catch (error) {
            if (error.path === 'name') {
                throw new InvalidTimezoneNameError(timezone.name);
            }
            else if (error.path === 'cityName') {
                throw new InvalidTimezoneCityNameError(timezone.cityName);
            }
            else if(error.path === 'timeDifference') {
                throw new InvalidTimezoneTimeDifferenceError(timezone.timeDifference);
            }
            else {
                throw error;
            }
        }
    }

    static async validateEditedTimezone(timezone) {
        try {
            await editedTimezoneSchema.validate(timezone);
        } catch (error) {
            if (error.path === 'name') {
                throw new InvalidTimezoneNameError(timezone.name);
            }
            else if (error.path === 'cityName') {
                throw new InvalidTimezoneCityNameError(timezone.cityName);
            }
            else if(error.path === 'timeDifference') {
                throw new InvalidTimezoneTimeDifferenceError(timezone.timeDifference);
            }
            else {
                throw error;
            }
        }
    }
}

module.exports = TimezoneValidator;