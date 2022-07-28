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

        //TODO make sure theres no wrapper around that
        return User.create({
            username,
            password,
            accessLevel,
        });
    }

    findUser({
        username,
        password
    }) {
        const User = mongoose.model('user', UserSchema);

        //TODO make sure theres no wrapper around that
        return User.findOne({
            username,
            password,
        });
    }
}

module.exports = DatabaseService;