const mongoose = require('mongoose');

const UserSchema = require('../../schemas/user-schema');

class UsersRepository {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    mapUserDocumentToUser(userDocument) {
        if (!userDocument) {
            return userDocument;
        }

        return {
            id: userDocument._id,
            username: userDocument.username,
            password: userDocument.password,
            role: userDocument.role,
        };
    }

    async createUser(user) {
        const User = mongoose.model('user', UserSchema);

        const userDocument = await this.databaseService.create(User, user);

        return this.mapUserDocumentToUser(userDocument);
    }

    async findUser(user) {
        const User = mongoose.model('user', UserSchema);

        const foundUserDocument = await this.databaseService.findOne(User, user);

        return this.mapUserDocumentToUser(foundUserDocument);
    }

    async updateUser(conditions, newUserData) {
        const User = mongoose.model('user', UserSchema);

        const updatedUserDocument = await this.databaseService.findOneAndUpdate(User, conditions, newUserData);

        return this.mapUserDocumentToUser(updatedUserDocument);
    }

    async findUsers(conditions, projection) {
        const User = mongoose.model('user', UserSchema);

        const userDocuments = await this.databaseService.find(User, conditions, projection);

        return userDocuments.map(this.mapUserDocumentToUser);
    }

    deleteUser(conditions) {
        const User = mongoose.model('user', UserSchema);

        return this.databaseService.deleteOne(User, conditions);
    }
}

module.exports = UsersRepository;