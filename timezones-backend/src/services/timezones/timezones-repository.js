const mongoose = require('mongoose');

const TimezoneSchema = require('../../schemas/timezone-schema');

class TimezonesRepository {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    mapTimezoneDocumentToTimezone(timezone) {
        if (!timezone) {
            return timezone;
        }

        return {
            id: timezone._id,
            name: timezone.name,
            cityName: timezone.cityName,
            timeDifference: timezone.timeDifference,
            username: timezone.username,
        };
    }

    async createTimezone(timezone) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        const timezoneDocument = await this.databaseService.create(Timezone, timezone);

        return this.mapTimezoneDocumentToTimezone(timezoneDocument);
    }

    async findTimezone(conditions) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        const foundTimezoneDocument = await this.databaseService.findOne(Timezone, conditions);

        return this.mapTimezoneDocumentToTimezone(foundTimezoneDocument);
    }

    async updateTimezone(conditions, newTimezoneData) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        const updatedTimezoneDocument = await this.databaseService.findOneAndUpdate(Timezone, conditions, newTimezoneData);

        return this.mapTimezoneDocumentToTimezone(updatedTimezoneDocument);
    }

    async findTimezones(conditions) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        const timezones = await this.databaseService.find(Timezone, conditions);

        return timezones.map(this.mapTimezoneDocumentToTimezone);
    }

    deleteTimezone(conditions) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return this.databaseService.deleteOne(Timezone, conditions);
    }
}

module.exports = TimezonesRepository;