const mongoose = require('mongoose');

const UserSchema = require('../../schemas/user-schema');

class UsersRepository {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    createUser(user) {
        const User = mongoose.model('user', UserSchema);

        return this.databaseService.create(User, user);
    }

    findUser(user) {
        const User = mongoose.model('user', UserSchema);

        return this.databaseService.findOne(User, user);
    }

    async updateUser(conditions, newUserData) {
        const User = mongoose.model('user', UserSchema);

        return this.databaseService.findOneAndUpdate(User, conditions, newUserData);
    }

    findUsers(conditions) {
        const User = mongoose.model('user', UserSchema);

        return this.databaseService.find(User, conditions);
    }

    deleteUser(conditions) {
        const User = mongoose.model('user', UserSchema);

        return this.databaseService.deleteOne(User, conditions);
    }
}

module.exports = UsersRepository;