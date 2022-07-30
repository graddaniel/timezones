const mongoose = require('mongoose');

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

    create(model, docs) {
        return model.create(docs);
    }

    find(model, conditions = {}) {
        return model.find(conditions);
    }

    findOne(model, conditions = {}) {
        return model.findOne(conditions);
    }

    findOneAndUpdate(model, conditions = {}, update = {}) {
        return model.findOneAndUpdate(conditions, update);
    }

    deleteOne(model, conditions = {}) {
        return model.deleteOne(conditions);
    }
}

module.exports = DatabaseService;