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

    createUser({
        username,
        password,
        role,
    }) {
        const User = mongoose.model('user', UserSchema);

        return User.create({
            username,
            password,
            role,
        });
    }

    findUserByUsername(username) {
        const User = mongoose.model('user', UserSchema);

        return User.findOne({
            username,
        });
    }

    findUserByCredentials({
        username,
        password
    }) {
        const User = mongoose.model('user', UserSchema);

        return User.findOne({
            username,
            password,
        });
    }

    async updateUserByUsername(username, newUserData) {
        const {
            password,
            role,
        } = newUserData;

        const User = mongoose.model('user', UserSchema);

        return User.findOneAndUpdate({
            username,
        }, {
            password,
            role,
        });
    }

    findAllUsers() {
        const User = mongoose.model('user', UserSchema);

        return User.find();
    }

    deleteUserByUsername(username) {
        const User = mongoose.model('user', UserSchema);

        return User.deleteOne({ username });
    }

    createTimezone({
        name,
        cityName,
        timeDifference,
        username,
    }) {
        const Timezone = mongoose.model('timezone', TimezoneSchema);

        return Timezone.create({
            name,
            cityName,
            timeDifference,
            username,
        });
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