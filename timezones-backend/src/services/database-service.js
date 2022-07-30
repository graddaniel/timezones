const mongoose = require('mongoose');

const UserSchema = require('../schemas/user-schema');


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

    isInitialized() {
        return this.mongooseInstance !== undefined;
    }

    createUser({
        username,
        password,
        accessLevel,
    }) {
        const User = mongoose.model('user', UserSchema);

        return User.create({
            username,
            password,
            accessLevel,
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

    findAllUsers() {
        const User = mongoose.model('user', UserSchema);

        return User.find();
    }

    async updateUserByUsername(username, newUserData) {
        const {
            password,
            accessLevel,
        } = newUserData;

        const User = mongoose.model('user', UserSchema);

        return User.findOneAndUpdate({
            username,
        }, {
            password,
            accessLevel,
        });
    }
}

module.exports = DatabaseService;