const mongoose = require('mongoose');

const TimezoneSchema = require('../../schemas/timezone-schema');

class TimezonesRepository {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    createTimezone(timezone) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return this.databaseService.create(Timezone, timezone);
    }

    async findTimezone(conditions) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return this.databaseService.findOne(Timezone, conditions);
    }

    async updateTimezone(conditions, newTimezoneData) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return this.databaseService.findOneAndUpdate(Timezone, conditions, newTimezoneData);
    }

    findTimezones(conditions) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return this.databaseService.find(Timezone, conditions);
    }

    deleteTimezone(conditions) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return this.databaseService.deleteOne(Timezone, conditions);
    }
}

module.exports = TimezonesRepository;