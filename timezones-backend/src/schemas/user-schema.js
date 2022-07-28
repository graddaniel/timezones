const mongoose = require('mongoose');
const config = require('config');

const accessLevels = config.get('accessLevels')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
    },
    password: {
        type: String,
        required: true,
    },
    accessLevel: {
        type: String,
        required: true,
        enum: [accessLevels.user, accessLevels.manager, accessLevels.admin],
        default: accessLevels.user,
    }
}, {
    versionKey: false,
});

module.exports = UserSchema;