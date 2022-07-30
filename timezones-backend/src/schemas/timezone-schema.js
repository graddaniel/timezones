const mongoose = require('mongoose');
const config = require('config');


const TIMEZONES = config.get('timezones');

const TimezoneSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cityName: {
        type: String,
        required: true,
    },
    timeDifference: {
        type: String,
        required: true,
        enum: TIMEZONES,
    },
    username: {
        type: String,
        required: true,
    }
}, {
    versionKey: false,
});

module.exports = TimezoneSchema;