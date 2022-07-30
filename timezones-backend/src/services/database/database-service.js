const mongoose = require('mongoose');

const UserSchema = require('../../schemas/user-schema');
const TimezoneSchema = require('../../schemas/timezone-schema');


class DatabaseService {
    constructor({
        host,
        port,
        databaseName
    }) {
        this.host = host;
        this.port = port;
        this.databaseName = databaseName;
    }

    async init() {
        this.mongooseInstance = await mongoose.connect(
            `mongodb://${this.host}:${this.port}/${this.databaseName}`
        );
    }

    async terminate() {
        return await this.mongooseInstance.disconnect();
    }

    createUser(user) {
        const User = mongoose.model('user', UserSchema);

        return User.create(user);
    }

    findUser(user) {
        const User = mongoose.model('user', UserSchema);

        return User.findOne(user);
    }

    async updateUserByUsername(username, newUserData) {
        const User = mongoose.model('user', UserSchema);

        return User.findOneAndUpdate({ username }, newUserData);
    }

    findAllUsers() {
        const User = mongoose.model('user', UserSchema);

        return User.find();
    }

    deleteUserByUsername(username) {
        const User = mongoose.model('user', UserSchema);

        return User.deleteOne({ username });
    }

    createTimezone(timezone) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return Timezone.create(timezone);
    }

    async findTimezoneById(id) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return Timezone.findOne({ _id: id });
    }

    deleteTimezoneById(id) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return Timezone.deleteOne({ _id: id });
    }

    findTimezonesByUsername(username) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return Timezone.find({ username });
    }

    findAllTimezones() {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return Timezone.find();
    }
}

module.exports = DatabaseService;